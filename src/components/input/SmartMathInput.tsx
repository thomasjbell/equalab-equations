"use client";

import { useState, useEffect, useRef } from "react";
import { InlineMath } from 'react-katex';
import { InputParser } from "@/lib/inputParser";
import { ExactNumber } from "@/types/exactNumber";

interface SmartMathInputProps {
  value: string;
  onChange: (value: string, parsed?: ExactNumber) => void;
  label?: string;
  unit?: string;
  placeholder?: string;
  showPreview?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export default function SmartMathInput({
  value,
  onChange,
  label,
  unit,
  placeholder = "Enter a number, fraction, or expression...",
  showPreview = true,
  showSuggestions = true,
  className = ""
}: SmartMathInputProps) {
  const [focused, setFocused] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only update parse result when value changes, don't call onChange here
  useEffect(() => {
    if (value.trim()) {
      const result = InputParser.parseInput(value);
      setParseResult(result);
    } else {
      setParseResult(null);
    }
  }, [value]); // Removed onChange from dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Parse and call onChange only here
    if (newValue.trim()) {
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
    if (parseResult?.isValid) return "border-green-500 dark:border-green-400";
    return "border-red-500 dark:border-red-400";
  };

  const getPreviewClass = () => {
    if (!value.trim()) return "text-gray-400 dark:text-gray-500";
    if (parseResult?.isValid) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
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
          placeholder={placeholder}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${getInputStatusClass()}`}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {showPreview && value.trim() && (
        <div className="space-y-1">
          {parseResult?.isValid ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Preview:
              </span>
              <div className={`text-sm ${getPreviewClass()}`}>
                <InlineMath math={parseResult.value.latex} />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ({parseResult.detectedFormat})
              </span>
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