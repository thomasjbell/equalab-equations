"use client";

import React, { useState, useEffect } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { ExactNumber } from '@/types/exactNumber';
import { AnnotatedResult } from '@/types/equation';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { NumberFormatter } from '@/lib/utils/numberFormatter';
import LaTeXRenderer from '../math/LaTeXRenderer';

interface ToggleableResultProps {
  result: AnnotatedResult | AnnotatedResult[];
  defaultMode?: 'symbolic' | 'decimal';
  allowToggle?: boolean;
  showBothModes?: boolean;
  className?: string;
}

function SingleResult({
  result,
  defaultMode,
  allowToggle,
  showBothModes,
}: {
  result: AnnotatedResult;
  defaultMode: 'symbolic' | 'decimal';
  allowToggle: boolean;
  showBothModes: boolean;
}) {
  const { settings } = useSettings();
  const [currentMode, setCurrentMode] = useState<'symbolic' | 'decimal'>(defaultMode);

  useEffect(() => {
    if (settings.default_result_mode !== 'both') setCurrentMode(settings.default_result_mode);
  }, [settings.default_result_mode]);

  const exactNum: ExactNumber = result.value;
  const symbolicDisplay = exactNum.latex || exactNum.decimal.toString();
  const decimalDisplay = NumberFormatter.formatForLatex(exactNum.decimal, settings);
  const canToggle = allowToggle && exactNum.type !== 'decimal';

  const validityBadge = result.validity !== 'valid' ? (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        result.validity === 'invalid'
          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      }`}
      title={result.validityReason}
    >
      {result.validity === 'invalid' ? 'Invalid' : 'Warning'}
      {result.validityReason ? `: ${result.validityReason}` : ''}
    </span>
  ) : null;

  if (showBothModes || settings.default_result_mode === 'both') {
    return (
      <div className="space-y-2">
        {validityBadge}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-cyan-50 font-medium">Exact:</span>
          <div className="text-lg"><LaTeXRenderer latex={symbolicDisplay} /></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-cyan-50 font-medium">Decimal:</span>
          <div className="text-lg"><LaTeXRenderer latex={decimalDisplay} /></div>
        </div>
      </div>
    );
  }

  const displayValue = currentMode === 'symbolic' ? symbolicDisplay : decimalDisplay;

  return (
    <div className="space-y-1">
      {validityBadge}
      <div className="flex items-center gap-3">
        <div className="flex-1 text-lg"><LaTeXRenderer latex={displayValue} /></div>
        {canToggle ? (
          <button
            onClick={() => setCurrentMode(m => m === 'symbolic' ? 'decimal' : 'symbolic')}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500"
            title={currentMode === 'symbolic' ? 'Show decimal form' : 'Show exact form'}
          >
            <ArrowsRightLeftIcon className="h-4 w-4" />
          </button>
        ) : (
          <div className="p-1.5 text-gray-300 dark:text-gray-600">
            <ArrowsRightLeftIcon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToggleableResult({
  result,
  defaultMode,
  allowToggle = true,
  showBothModes = false,
  className = "",
}: ToggleableResultProps) {
  const { settings } = useSettings();
  const resolvedMode = defaultMode ?? (settings.default_result_mode === 'both' ? 'symbolic' : settings.default_result_mode);

  if (Array.isArray(result)) {
    return (
      <div className={`space-y-3 ${className}`}>
        {result.map((r, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg border-l-4 ${
              r.validity === 'invalid'
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                : r.validity === 'warning'
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                : 'border-green-400 bg-green-50 dark:bg-green-900/20'
            }`}
          >
            <SingleResult
              result={r}
              defaultMode={resolvedMode}
              allowToggle={allowToggle}
              showBothModes={showBothModes}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <SingleResult
        result={result}
        defaultMode={resolvedMode}
        allowToggle={allowToggle}
        showBothModes={showBothModes}
      />
    </div>
  );
}
