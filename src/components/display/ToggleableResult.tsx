"use client";

import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { ExactNumber } from '@/types/exactNumber';

interface ToggleableResultProps {
  result: ExactNumber;
  defaultMode?: 'symbolic' | 'decimal';
  allowToggle?: boolean;
  showBothModes?: boolean;
  className?: string;
}

export default function ToggleableResult({
  result,
  defaultMode = 'symbolic',
  allowToggle = true,
  showBothModes = false,
  className = ""
}: ToggleableResultProps) {
  const [currentMode, setCurrentMode] = useState<'symbolic' | 'decimal'>(defaultMode);

  const toggleMode = () => {
    if (allowToggle) {
      setCurrentMode(currentMode === 'symbolic' ? 'decimal' : 'symbolic');
    }
  };

  const formatDecimalForLatex = (decimal: number): string => {
    // Format decimal numbers for LaTeX display
    if (!isFinite(decimal)) return 'NaN';
    
    let precision = 8;
    if (Math.abs(decimal) >= 1000) precision = 6;
    else if (Math.abs(decimal) >= 100) precision = 7;
    else if (Math.abs(decimal) >= 10) precision = 8;
    else if (Math.abs(decimal) >= 1) precision = 9;
    
    const formatted = decimal.toPrecision(precision);
    // Remove trailing zeros after decimal point
    return parseFloat(formatted).toString();
  };

  const getSymbolicDisplay = () => {
    return result.latex || result.decimal.toString();
  };

  const getDecimalDisplay = () => {
    return formatDecimalForLatex(result.decimal);
  };

  if (showBothModes) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-cyan-50 font-medium">Exact:</span>
          <div className="text-lg">
            <InlineMath math={getSymbolicDisplay()} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-cyan-50 font-medium">Decimal:</span>
          <div className="text-lg">
            <InlineMath math={getDecimalDisplay()} />
          </div>
        </div>
      </div>
    );
  }

  const displayValue = currentMode === 'symbolic' ? getSymbolicDisplay() : getDecimalDisplay();
  const canToggle = allowToggle && result.type !== 'decimal' && Math.abs(result.decimal) !== Math.abs(parseFloat(result.latex || '0'));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 text-lg">
        <InlineMath math={displayValue} />
      </div>
      {canToggle && (
        <button
          onClick={toggleMode}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500"
          title={currentMode === 'symbolic' ? 'Show decimal form' : 'Show exact form'}
        >
          <ArrowsRightLeftIcon className="h-4 w-4" />
        </button>
      )}
      {!canToggle && result.type === 'decimal' && (
        <div className="p-1.5 text-gray-300 dark:text-gray-600">
          <ArrowsRightLeftIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}