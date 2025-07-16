"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ClipboardDocumentIcon,
  HeartIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import SmartMathInput from "./input/SmartMathInput";
import ToggleableResult from "./display/ToggleableResult";
import ShareModal from "./ShareModal";
import { ExactNumber } from "@/types/exactNumber";
import {
  EquationSolverService,
  DatabaseEquation,
} from "@/lib/services/equationSolver";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useRouter } from "next/navigation";
import LaTeXRenderer from "./math/LaTeXRenderer";

interface EnhancedEquationCardProps {
  equation: DatabaseEquation;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: (isFavorited: boolean) => void;
  author?: string;
  showFavoriteButton?: boolean;
  displayMode?: "list" | "grid";
}

interface EquationInputState {
  inputs: Record<string, string>;
  parsedInputs: Record<string, ExactNumber>;
  results: Record<string, ExactNumber>;
  timestamp: number;
}

const INPUT_STORAGE_PREFIX = 'equalab_equation_input_';
const INPUT_EXPIRY_TIME = 2 * 60 * 60 * 1000; // 2 hours

export default function EnhancedEquationCard({
  equation,
  isExpanded,
  onToggle,
  isFavorited = false,
  onFavoriteToggle,
  author,
  showFavoriteButton = false,
  displayMode = "list",
}: EnhancedEquationCardProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [parsedInputs, setParsedInputs] = useState<Record<string, ExactNumber>>(
    {}
  );
  const [results, setResults] = useState<Record<string, ExactNumber>>({});
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inputsRestored, setInputsRestored] = useState(false);

  const { settings } = useSettings();
  const router = useRouter();
  const equationRef = useRef<HTMLDivElement>(null);

  const storageKey = `${INPUT_STORAGE_PREFIX}${equation.id}`;

  // Load persisted inputs on mount
  useEffect(() => {
    const loadPersistedInputs = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsedState: EquationInputState = JSON.parse(saved);
          
          // Check if state is not expired
          if (Date.now() - parsedState.timestamp < INPUT_EXPIRY_TIME) {
            setInputs(parsedState.inputs);
            setParsedInputs(parsedState.parsedInputs);
            setResults(parsedState.results);
          } else {
            // Remove expired state
            localStorage.removeItem(storageKey);
          }
        }
      } catch (error) {
        console.error('Error loading persisted inputs:', error);
        localStorage.removeItem(storageKey);
      }
      setInputsRestored(true);
    };

    loadPersistedInputs();
  }, [equation.id]);

  // Save inputs to localStorage when they change
  useEffect(() => {
    if (inputsRestored && (Object.keys(inputs).length > 0 || Object.keys(results).length > 0)) {
      const saveInputs = () => {
        const state: EquationInputState = {
          inputs,
          parsedInputs,
          results,
          timestamp: Date.now()
        };
        
        try {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
          console.error('Error saving inputs:', error);
        }
      };

      // Debounce the save operation
      const timeoutId = setTimeout(saveInputs, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [inputs, parsedInputs, results, inputsRestored, storageKey]);

  // Clear inputs from localStorage when cleared
  useEffect(() => {
    if (inputsRestored && Object.keys(inputs).length === 0 && Object.keys(results).length === 0) {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error removing inputs from storage:', error);
      }
    }
  }, [inputs, results, inputsRestored, storageKey]);

  // Save inputs when page becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && inputsRestored) {
        const state: EquationInputState = {
          inputs,
          parsedInputs,
          results,
          timestamp: Date.now()
        };
        
        try {
          if (Object.keys(inputs).length > 0 || Object.keys(results).length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(state));
          }
        } catch (error) {
          console.error('Error saving inputs on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [inputs, parsedInputs, results, inputsRestored, storageKey]);

  // Scale equation to fit container and center it
  useEffect(() => {
    const scaleEquation = () => {
      if (!equationRef.current) return;

      const container = equationRef.current;
      const equationElement = container.querySelector(".katex-display");

      if (!equationElement) return;

      // Reset any previous scaling
      (equationElement as HTMLElement).style.transform = "";
      (equationElement as HTMLElement).style.transformOrigin = "";

      // Get dimensions
      const containerWidth = container.clientWidth;
      const equationWidth = equationElement.scrollWidth;

      if (equationWidth > containerWidth) {
        // Scale down to fit and center
        const scale = containerWidth / equationWidth;
        (equationElement as HTMLElement).style.transform = `scale(${scale})`;
        (equationElement as HTMLElement).style.transformOrigin =
          "center center";
      } else {
        // If it fits, just center it
        (equationElement as HTMLElement).style.transformOrigin =
          "center center";
      }
    };

    // Scale initially
    const timer = setTimeout(scaleEquation, 100);

    // Scale on window resize
    window.addEventListener("resize", scaleEquation);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", scaleEquation);
    };
  }, [equation.latex]);

  const handleInputChange = (
    variable: string,
    value: string,
    parsed?: ExactNumber | number[]
  ) => {
    const newInputs = { ...inputs, [variable]: value };
    const newParsedInputs = { ...parsedInputs };

    if (value === "") {
      delete newInputs[variable];
      delete newParsedInputs[variable];
    } else if (parsed && !Array.isArray(parsed)) {
      // Only handle ExactNumber, ignore arrays for individual equation cards
      newParsedInputs[variable] = parsed;
    } else {
      delete newParsedInputs[variable];
    }

    setInputs(newInputs);
    setParsedInputs(newParsedInputs);

    if (Object.keys(newParsedInputs).length > 0) {
      try {
        const decimalInputs: Record<string, number> = {};
        Object.entries(newParsedInputs).forEach(([key, exactNum]) => {
          decimalInputs[key] = exactNum.decimal;
        });

        const newResults = EquationSolverService.solveEquation(
          equation,
          decimalInputs,
          settings
        );
        setResults(newResults);
      } catch (error) {
        console.error("Solving error:", error);
        setResults({});
      }
    } else {
      setResults({});
    }
  };

  const clearAll = () => {
    setInputs({});
    setParsedInputs({});
    setResults({});
    // Remove from localStorage immediately
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing inputs from storage:', error);
    }
  };

  const loadExample = () => {
    if (equation.examples && equation.examples.length > 0) {
      const example = equation.examples[0];
      const newInputs: Record<string, string> = {};
      const newParsedInputs: Record<string, ExactNumber> = {};

      Object.entries(example.input).forEach(([key, value]) => {
        const numericValue =
          typeof value === "number" ? value : parseFloat(value as string);

        if (!isNaN(numericValue)) {
          newInputs[key] = numericValue.toString();
          newParsedInputs[key] = {
            type: "decimal",
            decimal: numericValue,
            latex: numericValue.toString(),
            simplified: false,
          };
        }
      });

      setInputs(newInputs);
      setParsedInputs(newParsedInputs);

      const numericInputs: Record<string, number> = {};
      Object.entries(example.input).forEach(([key, value]) => {
        const numericValue =
          typeof value === "number" ? value : parseFloat(value as string);
        if (!isNaN(numericValue)) {
          numericInputs[key] = numericValue;
        }
      });

      const newResults = EquationSolverService.solveEquation(
        equation,
        numericInputs,
        settings
      );
      setResults(newResults);
    }
  };

  const copyResults = () => {
    const resultStrings = Object.entries(results).map(([variable, result]) => {
      return `${variable} = ${result.latex}`;
    });
    navigator.clipboard.writeText(resultStrings.join("\n"));
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle && !favoriteLoading) {
      setFavoriteLoading(true);
      try {
        await onFavoriteToggle(isFavorited);
      } finally {
        setFavoriteLoading(false);
      }
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleCardClick = () => {
    if (displayMode === "grid") {
      // Navigate to equation page in grid mode
      router.push(`/equation/${equation.id}`);
    } else {
      // Toggle expansion in list mode
      onToggle();
    }
  };

  const handleActionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (displayMode === "grid") {
      // Navigate to equation page in grid mode
      router.push(`/equation/${equation.id}`);
    } else {
      // Toggle expansion in list mode
      onToggle();
    }
  };

  const getVariableStatus = (variable: string) => {
    const hasInput = parsedInputs[variable] !== undefined;
    const hasResult = results[variable] !== undefined;

    if (hasResult) return "result";
    if (hasInput) return "input";
    return "empty";
  };

  const getVariableStatusClass = (status: string) => {
    switch (status) {
      case "result":
        return "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
      case "input":
        return "border-cyan-300 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-900/20";
      default:
        return "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";
    }
  };

  // Get the appropriate icon based on display mode
  const getActionIcon = () => {
    if (displayMode === "grid") {
      return <ArrowTopRightOnSquareIcon className="h-6 w-6" />;
    } else {
      return (
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-6 w-6" />
        </motion.div>
      );
    }
  };

  const getActionTitle = () => {
    if (displayMode === "grid") {
      return "Open equation details";
    } else {
      return isExpanded ? "Collapse equation" : "Expand equation";
    }
  };

  return (
    <>
      <motion.div
        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-cyan-300/50 dark:hover:border-cyan-600/50 ${
          displayMode === "grid" ? "cursor-pointer" : ""
        }`}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-6 ${
            displayMode === "list" ? "cursor-pointer" : ""
          }`}
          onClick={displayMode === "list" ? handleCardClick : undefined}
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex-1 min-w-0 ${
                displayMode === "grid" ? "cursor-pointer" : ""
              }`}
              onClick={displayMode === "grid" ? handleCardClick : undefined}
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {equation.name}
                </h3>
                <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
                  {equation.category}
                </span>
                {author && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full whitespace-nowrap">
                    by {author}
                  </span>
                )}
              </div>

              {/* LaTeX equation - scales to fit container width and centered */}
              <div className="mb-3">
                <div className="equation-container-auto-scale w-full text-center">
                  <div className="text-cyan-900 dark:text-cyan-100">
                    <LaTeXRenderer
                      latex={equation.latex}
                      displayMode={true}
                      className="equation-display"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-2 sm:ml-4 flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Share Button */}
              <motion.button
                onClick={handleShareClick}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="Share this equation"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>

              {/* Favorite Button */}
              {showFavoriteButton && (
                <motion.button
                  onClick={handleFavoriteClick}
                  disabled={favoriteLoading}
                  className={`p-1.5 sm:p-2 transition-colors ${
                    favoriteLoading
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  title={
                    isFavorited ? "Remove from favorites" : "Add to favorites"
                  }
                  whileHover={!favoriteLoading ? { scale: 1.1 } : {}}
                  whileTap={!favoriteLoading ? { scale: 0.9 } : {}}
                >
                  {favoriteLoading ? (
                    <motion.div
                      className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-300 border-t-red-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : isFavorited ? (
                    <HeartIconSolid className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </motion.button>
              )}

              {/* Action Button - Expand/Collapse or Navigate */}
              <motion.button
                onClick={handleActionButtonClick}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={getActionTitle()}
              >
                <div className="h-5 w-5 sm:h-6 sm:w-6">{getActionIcon()}</div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expanded Content - Only show in list mode */}
        <AnimatePresence>
          {isExpanded && displayMode === "list" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <motion.button
                      onClick={clearAll}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-cyan-900 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear All
                    </motion.button>
                    {equation.examples && equation.examples.length > 0 && (
                      <motion.button
                        onClick={loadExample}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-cyan-500 dark:bg-cyan-600 text-white rounded-full hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Load Example
                      </motion.button>
                    )}
                    {Object.keys(results).length > 0 && (
                      <motion.button
                        onClick={copyResults}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-500 dark:bg-green-600 text-white rounded-full hover:bg-green-600 dark:hover:bg-green-500 transition-colors flex items-center gap-1 sm:gap-2 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ClipboardDocumentIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Copy Results</span>
                        <span className="sm:hidden">Copy</span>
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Show restore indicator if inputs were restored */}
                  {inputsRestored && (Object.keys(inputs).length > 0 || Object.keys(results).length > 0) && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Restored
                    </div>
                  )}
                </div>

                {/* Variables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equation.variables.map((variable) => {
                    const status = getVariableStatus(variable.symbol);

                    return (
                      <div
                        key={variable.symbol}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${getVariableStatusClass(
                          status
                        )}`}
                      >
                        {status === "result" ? (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              {variable.name}
                              {variable.unit && (
                                <span className="text-gray-500 dark:text-gray-400 ml-1">
                                  ({variable.unit})
                                </span>
                              )}
                            </label>
                            <ToggleableResult
                              result={results[variable.symbol]}
                              defaultMode="symbolic"
                              allowToggle={true}
                              showBothModes={false}
                            />
                          </div>
                        ) : (
                          <SmartMathInput
                            value={inputs[variable.symbol] || ""}
                            onChange={(value, parsed) =>
                              handleInputChange(variable.symbol, value, parsed)
                            }
                            label={variable.name}
                            unit={variable.unit}
                            showPreview={true}
                            showSuggestions={false}
                            allowArrayInput={false}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Results Summary */}
                {Object.keys(results).length > 0 && (
                  <div className="mt-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-600">
                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                      ✨ Results computed in exact symbolic form
                    </h4>
                    <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                      {Object.keys(results).length} variable
                      {Object.keys(results).length !== 1 ? "s" : ""} solved.
                      Click the toggle button next to each result to switch
                      between exact and decimal forms.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        equation={equation}
      />
    </>
  );
}