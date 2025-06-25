"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { InlineMath, BlockMath } from 'react-katex';
import { SymbolicEquation } from "@/types/symbolicEquation";
import SmartMathInput from "./input/SmartMathInput";
import ToggleableResult from "./display/ToggleableResult";
import { ExactNumber } from "@/types/exactNumber";

interface EnhancedEquationCardProps {
  equation: SymbolicEquation;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function EnhancedEquationCard({
  equation,
  isExpanded,
  onToggle,
}: EnhancedEquationCardProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [parsedInputs, setParsedInputs] = useState<Record<string, ExactNumber>>({});
  const [results, setResults] = useState<Record<string, ExactNumber>>({});

  const handleInputChange = (variable: string, value: string, parsed?: ExactNumber) => {
    const newInputs = { ...inputs, [variable]: value };
    const newParsedInputs = { ...parsedInputs };
    
    if (value === "") {
      delete newInputs[variable];
      delete newParsedInputs[variable];
    } else if (parsed) {
      newParsedInputs[variable] = parsed;
    } else {
      delete newParsedInputs[variable];
    }
    
    setInputs(newInputs);
    setParsedInputs(newParsedInputs);
    
    // Auto-solve when we have valid inputs
    if (Object.keys(newParsedInputs).length > 0) {
      try {
        // Convert parsed inputs to decimals for solving
        const decimalInputs: Record<string, number> = {};
        Object.entries(newParsedInputs).forEach(([key, exactNum]) => {
          decimalInputs[key] = exactNum.decimal;
        });
        
        const newResults = equation.solve(decimalInputs);
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
  };

  const loadExample = () => {
    if (equation.examples && equation.examples.length > 0) {
      const example = equation.examples[0];
      const newInputs: Record<string, string> = {};
      const newParsedInputs: Record<string, ExactNumber> = {};
      
      Object.entries(example.input).forEach(([key, value]) => {
        newInputs[key] = value.toString();
        newParsedInputs[key] = {
          type: 'decimal',
          decimal: value,
          latex: value.toString(),
          simplified: false
        };
      });
      
      setInputs(newInputs);
      setParsedInputs(newParsedInputs);
      
      const newResults = equation.solve(example.input);
      setResults(newResults);
    }
  };

  const copyResults = () => {
    const resultStrings = Object.entries(results).map(([variable, result]) => {
      return `${variable} = ${result.latex}`;
    });
    navigator.clipboard.writeText(resultStrings.join('\n'));
  };

  const getVariableStatus = (variable: string) => {
    const hasInput = parsedInputs[variable] !== undefined;
    const hasResult = results[variable] !== undefined;
    
    if (hasResult) return 'result';
    if (hasInput) return 'input';
    return 'empty';
  };

  const getVariableStatusClass = (status: string) => {
    switch (status) {
      case 'result':
        return "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
      case 'input':
        return "border-cyan-300 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-900/20";
      default:
        return "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-50 dark:border-gray-800 overflow-hidden transition-all duration-200 hover:shadow-xl">
      {/* Header */}
      <div
        className="p-6 cursor-pointer bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {equation.name}
              </h3>
              <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-sm font-medium rounded-full">
                {equation.category}
              </span>
            </div>
            {/* Left-aligned LaTeX equation */}
            <div className="mb-1">
              <div className="text-xl md:text-2xl text-left overflow-x-auto text-cyan-900 dark:text-cyan-100">
                <BlockMath math={equation.latex} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {equation.description}
            </p>
          </div>
          <div className="ml-4 flex items-center">
            {isExpanded ? (
              <ChevronUpIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDownIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-cyan-900 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-150 font-medium"
                  >
                    Clear All
                  </button>
                  {equation.examples && equation.examples.length > 0 && (
                    <button
                      onClick={loadExample}
                      className="px-4 py-2 text-sm bg-cyan-500 dark:bg-cyan-600 text-white rounded-full hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-colors duration-150 font-medium"
                    >
                      Load Example
                    </button>
                  )}
                  {Object.keys(results).length > 0 && (
                    <button
                      onClick={copyResults}
                      className="px-4 py-2 text-sm bg-green-500 dark:bg-green-600 text-white rounded-full hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-150 flex items-center gap-2 font-medium"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      Copy Results
                    </button>
                  )}
                </div>
              </div>

              {/* Variables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equation.variables.map((variable) => {
                  const status = getVariableStatus(variable.symbol);
                  
                  return (
                    <div
                      key={variable.symbol}
                      className={`p-4 rounded-lg border-2 transition-colors ${getVariableStatusClass(status)}`}
                    >
                      {status === 'result' ? (
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
                          onChange={(value, parsed) => handleInputChange(variable.symbol, value, parsed)}
                          label={variable.name}
                          unit={variable.unit}
                          showPreview={true}
                          showSuggestions={false}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Results Summary */}
              {Object.keys(results).length > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-600">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✨ Results computed in exact symbolic form
                  </h4>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    {Object.keys(results).length} variable{Object.keys(results).length !== 1 ? 's' : ''} solved. 
                    Click the toggle button next to each result to switch between exact and decimal forms.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}