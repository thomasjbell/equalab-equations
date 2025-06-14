"use client";

import React from 'react';
import { Fraction } from '@/types/exactNumber';

interface FractionDisplayProps {
  fraction: Fraction;
  className?: string;
}

export default function FractionDisplay({ fraction, className = "" }: FractionDisplayProps) {
  if (fraction.denominator === 1) {
    return <span className={className}>{fraction.numerator}</span>;
  }

  return (
    <span className={`inline-flex flex-col items-center text-center ${className}`}>
      <span className="border-b border-current leading-tight">{Math.abs(fraction.numerator)}</span>
      <span className="leading-tight">{fraction.denominator}</span>
      {fraction.numerator < 0 && (
        <span className="absolute -left-2 top-1/2 transform -translate-y-1/2">−</span>
      )}
    </span>
  );
}