"use client";

import React from 'react';
import { ExactNumber } from '@/types/exactNumber';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface MathResultProps {
  result: ExactNumber;
  showDecimal?: boolean;
  className?: string;
}

export default function MathResult({ result, showDecimal = false, className = "" }: MathResultProps) {
  const getDisplayValue = () => {
    if (result.type === 'decimal' && !result.simplified) {
      // For non-simplified decimals, show limited precision
      return result.decimal.toPrecision(6);
    }
    return result.latex;
  };

  const shouldShowDecimalApproximation = () => {
    return showDecimal && 
           result.type !== 'decimal' && 
           result.type !== 'integer' && 
           isFinite(result.decimal);
  };

  return (
    <div className={`math-result ${className}`}>
      <div className="exact-value dark:text-cyan-50">
        <InlineMath math={getDisplayValue()} />
      </div>
      {shouldShowDecimalApproximation() && (
        <div className="decimal-approximation text-sm text-cyan-50 mt-1">
          ≈ {result.decimal.toFixed(4)}
        </div>
      )}
    </div>
  );
}