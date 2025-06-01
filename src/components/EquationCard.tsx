// components/EquationCard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { InlineMath } from "react-katex";
import { Equation } from "../types/equation";
import { formatNumber, parseNumberSafely } from "../lib/mathUtils";

interface EquationCardProps {
  equation: Equation;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function EquationCard({
  equation,
  isExpanded,
  onToggle,
}: EquationCardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, number>>({});

  useEffect(() => {
    // Automatically calculate when values change
    const numericValues: Record<string, number> = {};

    Object.entries(values).forEach(([key, value]) => {
      const num = parseNumberSafely(value);
      if (num !== undefined) {
        numericValues[key] = num;
      }
    });

    try {
      const calculatedResults = equation.solve(numericValues);
      setResults(calculatedResults);
    } catch (error) {
      console.error("Calculation error:", error);
      setResults({});
    }
  }, [values, equation]);

  const handleInputChange = (variableSymbol: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [variableSymbol]: value,
    }));
  };

  const getDisplayValue = (variableSymbol: string): string => {
    if (results[variableSymbol] !== undefined) {
      return formatNumber(results[variableSymbol]);
    }
    return values[variableSymbol] || "";
  };

  const isCalculatedResult = (variableSymbol: string): boolean => {
    return results[variableSymbol] !== undefined && !values[variableSymbol];
  };

  const handleReset = useCallback(() => {
    setValues({});
    setResults({});
  }, [setValues, setResults]);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-sm transition-all duration-200 hover:border-cyan-400 p-6 ${
        isExpanded ? "shadow-lg border-blue-400" : ""
      }`}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {equation.name}
            </h3>
            <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-sm rounded-full">
              {equation.category}
            </span>
          </div>
          <div className="mb-2">
            <InlineMath math={equation.latex} />
          </div>
          {equation.description && (
            <p className="text-sm text-gray-600">{equation.description}</p>
          )}
        </div>
        <div className="ml-4 flex items-center">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">Variables</h4>
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-sm transition-colors duration-150"
            >
              <RefreshCw className="w-4 h-4 inline-block mr-1" />
              Reset
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equation.variables.map((variable) => (
              <div key={variable.symbol} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {variable.name} {variable.unit && `(${variable.unit})`}
                </label>
                <input
                  type="number"
                  step="any"
                  value={getDisplayValue(variable.symbol)}
                  onChange={(e) =>
                    handleInputChange(variable.symbol, e.target.value)
                  }
                  disabled={isCalculatedResult(variable.symbol)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-cyan-600 focus:border-transparent outline-none transition-all ${
                    isCalculatedResult(variable.symbol)
                      ? "bg-green-50 border-green-300 text-green-800 font-medium"
                      : ""
                  }`}
                  placeholder={`Enter ${variable.name.toLowerCase()}`}
                />
                {isCalculatedResult(variable.symbol) && (
                  <p className="text-xs text-green-600 font-medium">
                    Calculated result
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
