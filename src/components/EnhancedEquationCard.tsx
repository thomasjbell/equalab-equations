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
import UnitSelector from "./input/UnitSelector";
import ShareModal from "./ShareModal";
import { ExactNumber } from "@/types/exactNumber";
import { Equation, AnnotatedResult, EquationSolverResult } from "@/types/equation";
import { InputParser } from "@/lib/inputParser";
import { convertUnit, UNITS } from "@/data/units";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useRouter } from "next/navigation";
import LaTeXRenderer from "./math/LaTeXRenderer";
import { Badge } from "@/components/ui/badge";
import CalculusCard from "./equations/CalculusCard";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedEquationCardProps {
  equation: Equation;
  isExpanded: boolean;
  onToggle: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  displayMode?: "list" | "grid";
  disableInitialAnimation?: boolean;
}

interface EquationInputState {
  inputs: Record<string, string>;
  parsedInputs: Record<string, ExactNumber>;
  timestamp: number;
}

const INPUT_STORAGE_PREFIX = 'equalab:eq_inputs_';
const INPUT_EXPIRY_TIME = 2 * 60 * 60 * 1000;

function getWorstValidity(result: AnnotatedResult | AnnotatedResult[]): 'valid' | 'warning' | 'invalid' {
  if (!Array.isArray(result)) return result.validity;
  if (result.some(r => r.validity === 'invalid')) return 'invalid';
  if (result.some(r => r.validity === 'warning')) return 'warning';
  return 'valid';
}

export default function EnhancedEquationCard({
  equation,
  isExpanded,
  onToggle,
  isFavorited = false,
  onFavoriteToggle,
  displayMode = "list",
  disableInitialAnimation = false,
}: EnhancedEquationCardProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [parsedInputs, setParsedInputs] = useState<Record<string, ExactNumber>>({});
  const [results, setResults] = useState<EquationSolverResult>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inputsRestored, setInputsRestored] = useState(false);
  const [cardAngleMode, setCardAngleMode] = useState<'degrees' | 'radians' | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});

  const { settings } = useSettings();
  const effectiveSettings = cardAngleMode ? { ...settings, angle_mode: cardAngleMode } : settings;
  const router = useRouter();
  const equationRef = useRef<HTMLDivElement>(null);
  const storageKey = `${INPUT_STORAGE_PREFIX}${equation.id}`;

  useEffect(() => {
    if (equation.angleMode === 'both') {
      try {
        const saved = localStorage.getItem(`equalab:card_angle_${equation.id}`);
        if (saved === 'degrees' || saved === 'radians') setCardAngleMode(saved);
      } catch {}
    }
  }, [equation.id, equation.angleMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const state: EquationInputState = JSON.parse(saved);
        if (Date.now() - state.timestamp < INPUT_EXPIRY_TIME) {
          setInputs(state.inputs);
          setParsedInputs(state.parsedInputs);
          if (Object.keys(state.parsedInputs).length > 0) {
            try { setResults(equation.solve(toBaseDecimalInputs(state.parsedInputs), effectiveSettings)); } catch {}
          }
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch {}
    setInputsRestored(true);
  }, [equation.id]);

  useEffect(() => {
    if (!inputsRestored) return;
    if (Object.keys(inputs).length === 0) { localStorage.removeItem(storageKey); return; }
    const id = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify({ inputs, parsedInputs, timestamp: Date.now() })); } catch {}
    }, 1000);
    return () => clearTimeout(id);
  }, [inputs, parsedInputs, inputsRestored, storageKey]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden' && inputsRestored && Object.keys(inputs).length > 0) {
        try { localStorage.setItem(storageKey, JSON.stringify({ inputs, parsedInputs, timestamp: Date.now() })); } catch {}
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [inputs, parsedInputs, inputsRestored, storageKey]);

  useEffect(() => {
    const scale = () => {
      if (!equationRef.current) return;
      const el = equationRef.current.querySelector(".katex-display") as HTMLElement | null;
      if (!el) return;
      el.style.transform = "";
      el.style.transformOrigin = "";
      const cw = equationRef.current.clientWidth;
      const ew = el.scrollWidth;
      if (ew > cw) { el.style.transform = `scale(${cw / ew})`; el.style.transformOrigin = "center center"; }
    };
    const t = setTimeout(scale, 100);
    window.addEventListener("resize", scale);
    return () => { clearTimeout(t); window.removeEventListener("resize", scale); };
  }, [equation.latex]);

  const getActiveUnit = (symbol: string, unit: string | { symbol: string; allowAlternatives?: string[] } | undefined): string | undefined => {
    if (!unit) return undefined;
    if (typeof unit === 'string') return unit;
    return selectedUnits[symbol] ?? unit.symbol;
  };

  const getAlternatives = (unit: string | { symbol: string; allowAlternatives?: string[] } | undefined): string[] | null => {
    if (!unit || typeof unit === 'string') return null;
    return unit.allowAlternatives ?? null;
  };

  const toBaseDecimalInputs = (parsed: Record<string, ExactNumber>): Record<string, number> => {
    const out: Record<string, number> = {};
    Object.entries(parsed).forEach(([k, v]) => {
      const varDef = equation.variables.find(vr => vr.symbol === k);
      const activeUnit = varDef ? getActiveUnit(k, varDef.unit) : undefined;
      const baseUnit = varDef && typeof varDef.unit !== 'string' && varDef.unit?.symbol ? varDef.unit.symbol : undefined;
      if (activeUnit && baseUnit && activeUnit !== baseUnit && UNITS[activeUnit] && UNITS[baseUnit]) {
        try { out[k] = convertUnit(v.decimal, activeUnit, baseUnit); } catch { out[k] = v.decimal; }
      } else { out[k] = v.decimal; }
    });
    return out;
  };

  const handleInputChange = (variable: string, value: string, parsed?: ExactNumber | number[]) => {
    const newInputs = { ...inputs, [variable]: value };
    const newParsedInputs = { ...parsedInputs };
    if (value === "") { delete newInputs[variable]; delete newParsedInputs[variable]; }
    else if (parsed && !Array.isArray(parsed)) { newParsedInputs[variable] = parsed; }
    else { delete newParsedInputs[variable]; }
    setInputs(newInputs);
    setParsedInputs(newParsedInputs);
    if (settings.auto_solve && Object.keys(newParsedInputs).length > 0) {
      try { setResults(equation.solve(toBaseDecimalInputs(newParsedInputs), effectiveSettings)); }
      catch { setResults({}); }
    } else if (!settings.auto_solve) {
      setResults({});
    } else { setResults({}); }
  };

  const manualSolve = () => {
    if (Object.keys(parsedInputs).length > 0) {
      try { setResults(equation.solve(toBaseDecimalInputs(parsedInputs), effectiveSettings)); }
      catch { setResults({}); }
    }
  };

  const handleUnitChange = (symbol: string, newUnit: string, convertedValue: string) => {
    setSelectedUnits(prev => ({ ...prev, [symbol]: newUnit }));
    if (convertedValue !== inputs[symbol]) {
      const parsed = InputParser.parseInput(convertedValue);
      handleInputChange(symbol, convertedValue, parsed.isValid ? parsed.value : undefined);
    }
  };

  const isAngleVariable = (v: { symbol: string; unit: string | { symbol: string; allowAlternatives?: string[] } | undefined }) => {
    const unit = typeof v.unit === 'string' ? v.unit : (v.unit as { symbol?: string })?.symbol ?? '';
    const angleUnits = ['°', 'deg', 'rad', 'degrees', 'radians'];
    const angleSymbols = ['theta', 'phi', 'angle', 'alpha', 'beta', 'gamma', 'delta'];
    return angleUnits.includes(unit.toLowerCase()) || angleSymbols.includes(v.symbol.toLowerCase());
  };

  const handleAngleModeToggle = (mode: 'degrees' | 'radians') => {
    const prev = cardAngleMode ?? settings.angle_mode;
    setCardAngleMode(mode);
    try { localStorage.setItem(`equalab:card_angle_${equation.id}`, mode); } catch {}

    if (prev === mode || Object.keys(parsedInputs).length === 0) {
      if (Object.keys(parsedInputs).length > 0) {
        try { setResults(equation.solve(toBaseDecimalInputs(parsedInputs), { ...effectiveSettings, angle_mode: mode })); }
        catch { setResults({}); }
      }
      return;
    }

    // Convert angle-typed inputs when switching modes
    const newInputs = { ...inputs };
    const newParsedInputs = { ...parsedInputs };
    equation.variables.forEach(v => {
      if (isAngleVariable(v) && parsedInputs[v.symbol] !== undefined) {
        const current = parsedInputs[v.symbol].decimal;
        if (!isNaN(current)) {
          const converted = mode === 'radians'
            ? current * (Math.PI / 180)
            : current * (180 / Math.PI);
          const rounded = Math.round(converted * 1e8) / 1e8;
          const str = String(rounded);
          newInputs[v.symbol] = str;
          newParsedInputs[v.symbol] = { type: 'decimal', decimal: rounded, latex: str, simplified: false };
        }
      }
    });
    setInputs(newInputs);
    setParsedInputs(newParsedInputs);
    try {
      setResults(equation.solve(toBaseDecimalInputs(newParsedInputs), { ...effectiveSettings, angle_mode: mode }));
    } catch { setResults({}); }
  };

  const clearAll = () => {
    setInputs({}); setParsedInputs({}); setResults({});
    try { localStorage.removeItem(storageKey); } catch {}
  };

  const loadExample = () => {
    if (!equation.examples?.length) return;
    const example = equation.examples[0];
    const newInputs: Record<string, string> = {};
    const newParsedInputs: Record<string, ExactNumber> = {};
    const decimalInputs: Record<string, number> = {};
    Object.entries(example.input).forEach(([key, value]) => {
      const n = typeof value === "number" ? value : parseFloat(value as string);
      if (!isNaN(n)) {
        newInputs[key] = n.toString();
        newParsedInputs[key] = { type: "decimal", decimal: n, latex: n.toString(), simplified: false };
        decimalInputs[key] = n;
      }
    });
    setInputs(newInputs); setParsedInputs(newParsedInputs);
    try { setResults(equation.solve(decimalInputs, effectiveSettings)); } catch { setResults({}); }
  };

  const copyResults = () => {
    const lines = Object.entries(results).map(([variable, result]) =>
      Array.isArray(result)
        ? result.map((r, i) => `${variable}[${i + 1}] = ${r.value.latex}`).join("\n")
        : `${variable} = ${result.value.latex}`
    );
    navigator.clipboard.writeText(lines.join("\n"));
  };

  const handleCardClick = () => { if (displayMode === "grid") router.push(`/equation/${equation.id}`); else onToggle(); };

  const getVariableStatus = (symbol: string): 'result-valid' | 'result-warning' | 'result-invalid' | 'input' | 'empty' => {
    if (results[symbol] !== undefined) {
      const validity = getWorstValidity(results[symbol]);
      return `result-${validity}` as 'result-valid' | 'result-warning' | 'result-invalid';
    }
    if (parsedInputs[symbol] !== undefined) return 'input';
    return 'empty';
  };

  const getVariableStatusClass = (status: ReturnType<typeof getVariableStatus>) => {
    switch (status) {
      case "result-valid":   return "border-green-600/60 bg-green-950/40";
      case "result-warning": return "border-amber-600/60 bg-amber-950/40";
      case "result-invalid": return "border-red-600/60 bg-red-950/40";
      case "input":          return "border-primary/50 bg-primary/5";
      default:               return "border-border bg-card";
    }
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <>
      <motion.div
        className={`bg-card text-card-foreground rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_0_1px_oklch(0.72_0.155_200/0.12)] ${displayMode === "grid" ? "cursor-pointer" : ""}`}
        whileHover={{ y: -1 }}
        initial={disableInitialAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: disableInitialAnimation ? 0 : 0.15 }}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-6 ${displayMode === "list" ? "cursor-pointer" : ""}`}
          onClick={displayMode === "list" ? handleCardClick : undefined}
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex-1 min-w-0 ${displayMode === "grid" ? "cursor-pointer" : ""}`}
              onClick={displayMode === "grid" ? handleCardClick : undefined}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">{equation.name}</h3>
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 whitespace-nowrap">
                  {equation.category}
                </Badge>
                {equation.subcategory && (
                  <Badge variant="secondary" className="whitespace-nowrap text-xs">
                    {equation.subcategory}
                  </Badge>
                )}
                {equation.level && (
                  <Badge variant="outline" className="whitespace-nowrap text-xs capitalize">
                    {equation.level.toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="mb-2" ref={equationRef}>
                <div className="equation-container-auto-scale w-full text-center">
                  <div className="text-cyan-900 dark:text-cyan-100">
                    <LaTeXRenderer latex={equation.latex} displayMode={true} className="equation-display" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-blue-500 hover:bg-accent transition-colors"
                  onClick={(e) => { e.stopPropagation(); setIsShareModalOpen(true); }}
                >
                  <ShareIcon className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>

              {onFavoriteToggle && (
                <Tooltip>
                  <TooltipTrigger
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-accent transition-colors"
                    onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
                  >
                    {isFavorited
                      ? <HeartIconSolid className="h-4 w-4 text-red-500" />
                      : <HeartIcon className="h-4 w-4" />}
                  </TooltipTrigger>
                  <TooltipContent>{isFavorited ? "Remove from favourites" : "Add to favourites"}</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                >
                  {displayMode === "grid"
                    ? <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    : <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDownIcon className="h-4 w-4" />
                      </motion.div>}
                </TooltipTrigger>
                <TooltipContent>{displayMode === "grid" ? "Open" : isExpanded ? "Collapse" : "Expand"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && displayMode === "list" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-t border-border bg-muted/30">
                {/* Controls */}
                {!equation.freeForm && <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  {equation.angleMode === 'both' && (
                    <div className="flex items-center gap-0.5 bg-muted rounded-full p-1 text-xs font-medium">
                      {(['degrees', 'radians'] as const).map((mode) => {
                        const active = (cardAngleMode ?? settings.angle_mode) === mode;
                        return (
                          <button
                            key={mode}
                            onClick={(e) => { e.stopPropagation(); handleAngleModeToggle(mode); }}
                            className={`px-3 py-1 rounded-full transition-all ${active ? 'bg-background text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                          >
                            {mode === 'degrees' ? 'DEG' : 'RAD'}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {!settings.auto_solve && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90" onClick={manualSolve} disabled={Object.keys(parsedInputs).length === 0}>
                        Calculate
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={clearAll}>Clear All</Button>
                    {equation.examples && equation.examples.length > 0 && (
                      <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={loadExample}>
                        Load Example
                      </Button>
                    )}
                    {hasResults && (
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-1.5" onClick={copyResults}>
                        <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Copy Results</span>
                        <span className="sm:hidden">Copy</span>
                      </Button>
                    )}
                  </div>
                </div>}

                {/* Free-form Calculus */}
                {equation.freeForm ? (
                  <CalculusCard />
                ) : (
                  /* Variables Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {equation.variables.map((variable) => {
                      const status = getVariableStatus(variable.symbol);
                      const isResult = status.startsWith('result');
                      return (
                        <div
                          key={variable.symbol}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-colors ${getVariableStatusClass(status)}`}
                        >
                          {isResult ? (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-foreground">
                                {variable.name}
                                {variable.unit && (
                                  <span className="text-muted-foreground ml-1">
                                    ({getActiveUnit(variable.symbol, variable.unit)})
                                  </span>
                                )}
                              </label>
                              <ToggleableResult result={results[variable.symbol]} defaultMode="symbolic" allowToggle={true} showBothModes={false} />
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {(() => {
                                const alts = getAlternatives(variable.unit);
                                const activeUnit = getActiveUnit(variable.symbol, variable.unit);
                                return (
                                  <>
                                    <SmartMathInput
                                      value={inputs[variable.symbol] || ""}
                                      onChange={(value, parsed) => handleInputChange(variable.symbol, value, parsed)}
                                      label={variable.name}
                                      unit={activeUnit}
                                      showPreview={true}
                                      showSuggestions={false}
                                      allowArrayInput={false}
                                    />
                                    {alts && alts.length > 0 && (
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                                        <span>Unit:</span>
                                        <UnitSelector
                                          currentUnit={activeUnit ?? ''}
                                          alternatives={alts}
                                          currentValue={inputs[variable.symbol] || ''}
                                          onUnitChange={(newUnit, converted) => handleUnitChange(variable.symbol, newUnit, converted)}
                                        />
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!equation.freeForm && hasResults && (
                  <div className="mt-5 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {Object.keys(results).length} variable{Object.keys(results).length !== 1 ? "s" : ""} solved in exact symbolic form — toggle each result to switch between exact and decimal.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} equation={equation} />
    </>
  );
}
