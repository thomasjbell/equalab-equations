// src/components/math/MathResult.tsx
"use client";

import React from 'react';
import { ExactNumber } from '@/types/exactNumber';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { NumberFormatter } from '@/lib/utils/numberFormatter';
import LaTeXRenderer from './LaTeXRenderer';

interface MathResultProps {
  result: ExactNumber;
  showDecimal?: boolean;
  className?: string;
}

export default function MathResult({ result, showDecimal = false, className = "" }: MathResultProps) {
  const { settings } = useSettings();

  const getDisplayValue = () => {
    if (result.type === 'decimal' && !result.simplified) {
      // For non-simplified decimals, apply user's formatting preferences
      return NumberFormatter.formatForLatex(result.decimal, settings);
    }
    return result.latex;
  };

  const shouldShowDecimalApproximation = () => {
    return showDecimal && 
           result.type !== 'decimal' && 
           result.type !== 'integer' && 
           isFinite(result.decimal);
  };

  const getDecimalApproximation = () => {
    return NumberFormatter.formatForDisplay(result.decimal, settings);
  };

  return (
    <div className={`math-result ${className}`}>
      <div className="exact-value dark:text-cyan-50">
        <LaTeXRenderer latex={getDisplayValue()} />
      </div>
      {shouldShowDecimalApproximation() && (
        <div className="decimal-approximation text-sm text-cyan-50 mt-1">
          ≈ {getDecimalApproximation()}
        </div>
      )}
    </div>
  );
}