// src/components/input/SmartMathInput.tsx - Add array input support

"use client";

import { useState, useEffect, useRef } from "react";
import { InputParser } from "@/lib/inputParser";
import { ExactNumber } from "@/types/exactNumber";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { NumberFormatter } from "@/lib/utils/numberFormatter";
import LaTeXRenderer from "../math/LaTeXRenderer";

interface SmartMathInputProps {
  value: string;
  onChange: (value: string, parsed?: ExactNumber | number[]) => void;
  label?: string;
  unit?: string;
  placeholder?: string;
  showPreview?: boolean;
  showSuggestions?: boolean;
  className?: string;
  allowArrayInput?: boolean; // New prop for statistics
}

export default function SmartMathInput({
  value,
  onChange,
  label,
  unit,
  placeholder = "Enter a number, fraction, or expression...",
  showPreview = true,
  showSuggestions = true,
  className = "",
  allowArrayInput = false
}: SmartMathInputProps) {
  const [focused, setFocused] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const [arrayResult, setArrayResult] = useState<number[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { settings } = useSettings();

  // Parse array input for statistics
  const parseArrayInput = (input: string): number[] | null => {
    if (!allowArrayInput) return null;
    
    try {
      // Try to parse as array: [1,2,3] or 1,2,3
      const cleaned = input.replace(/[\[\]]/g, '').trim();
      if (cleaned.includes(',')) {
        const numbers = cleaned.split(',').map(s => parseFloat(s.trim()));
        if (numbers.every(n => !isNaN(n))) {
          return numbers;
        }
      }
    } catch (error) {
      // Not an array
    }
    return null;
  };

  // Update parse result when value changes
  useEffect(() => {
    if (value.trim()) {
      // First try array parsing if allowed
      if (allowArrayInput) {
        const arrayRes = parseArrayInput(value);
        if (arrayRes) {
          setArrayResult(arrayRes);
          setParseResult(null);
          return;
        }
      }
      
      // Then try regular number parsing
      const result = InputParser.parseInput(value);
      setParseResult(result);
      setArrayResult(null);
    } else {
      setParseResult(null);
      setArrayResult(null);
    }
  }, [value, allowArrayInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Parse and call onChange
    if (newValue.trim()) {
      // First try array parsing if allowed
      if (allowArrayInput) {
        const arrayRes = parseArrayInput(newValue);
        if (arrayRes) {
          onChange(newValue, arrayRes);
          return;
        }
      }
      
      // Then try regular number parsing
      const result = InputParser.parseInput(newValue);
      if (result.isValid) {
        onChange(newValue, result.value);
      } else {
        onChange(newValue);
      }
    } else {
      onChange(newValue);
    }
  };

  const getInputStatusClass = () => {
    if (!value.trim()) return "border-gray-300 dark:border-gray-600";
    if (arrayResult || parseResult?.isValid) return "border-green-500 dark:border-green-400";
    return "border-red-500 dark:border-red-400";
  };

  const getPreviewClass = () => {
    if (!value.trim()) return "text-gray-400 dark:text-gray-500";
    if (arrayResult || parseResult?.isValid) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  const getFormattedDecimal = () => {
    if (parseResult?.isValid && parseResult.value.type !== 'integer') {
      return NumberFormatter.formatForDisplay(parseResult.value.decimal, settings);
    }
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {unit && (
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              ({unit})
            </span>
          )}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={allowArrayInput ? "Enter numbers or array: [1,2,3,4,5]" : placeholder}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${getInputStatusClass()}`}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {showPreview && value.trim() && (
        <div className="space-y-1">
          {arrayResult ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Array:
                </span>
                <div className={`text-sm ${getPreviewClass()}`}>
                  [{arrayResult.join(', ')}] ({arrayResult.length} values)
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Sum:
                </span>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {arrayResult.reduce((sum, val) => sum + val, 0)}
                </div>
              </div>
            </div>
          ) : parseResult?.isValid ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Symbolic:
                </span>
                <div className={`text-sm ${getPreviewClass()}`}>
                  <LaTeXRenderer latex={parseResult.value.latex} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({parseResult.detectedFormat})
                </span>
              </div>
              {getFormattedDecimal() && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Decimal:
                  </span>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {getFormattedDecimal()}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ({settings.number_format === 'decimal_places' ? `${settings.decimal_places} dp` : `${settings.significant_figures} sf`})
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Error:
              </span>
              <span className={`text-xs ${getPreviewClass()}`}>
                {parseResult?.errorMessage || 'Invalid input'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}