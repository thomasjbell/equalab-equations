// src/components/display/ToggleableResult.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { ExactNumber } from '@/types/exactNumber';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { NumberFormatter } from '@/lib/utils/numberFormatter';
import LaTeXRenderer from '../math/LaTeXRenderer';

interface ToggleableResultProps {
  result: ExactNumber;
  defaultMode?: 'symbolic' | 'decimal';
  allowToggle?: boolean;
  showBothModes?: boolean;
  className?: string;
}

export default function ToggleableResult({
  result,
  defaultMode,
  allowToggle = true,
  showBothModes = false,
  className = ""
}: ToggleableResultProps) {
  const { settings } = useSettings();
  const [currentMode, setCurrentMode] = useState<'symbolic' | 'decimal'>(
    defaultMode || settings.default_result_mode === 'both' ? 'symbolic' : settings.default_result_mode
  );

  // Update mode when settings change
  useEffect(() => {
    if (!defaultMode && settings.default_result_mode !== 'both') {
      setCurrentMode(settings.default_result_mode);
    }
  }, [settings.default_result_mode, defaultMode]);

  const toggleMode = () => {
    if (allowToggle) {
      setCurrentMode(currentMode === 'symbolic' ? 'decimal' : 'symbolic');
    }
  };

  const getSymbolicDisplay = () => {
    return result.latex || result.decimal.toString();
  };

  const getDecimalDisplay = () => {
    // Always format decimal values according to user settings
    return NumberFormatter.formatForLatex(result.decimal, settings);
  };

  // Use settings to determine default behavior
  const shouldShowBoth = showBothModes || settings.default_result_mode === 'both';

  if (shouldShowBoth) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-cyan-50 font-medium">Exact:</span>
          <div className="text-lg">
            <LaTeXRenderer latex={getSymbolicDisplay()} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-cyan-50 font-medium">Decimal:</span>
          <div className="text-lg">
            <LaTeXRenderer latex={getDecimalDisplay()} />
          </div>
        </div>
      </div>
    );
  }

  // Get the display value based on current mode
  const displayValue = currentMode === 'symbolic' ? getSymbolicDisplay() : getDecimalDisplay();
  const canToggle = allowToggle && result.type !== 'decimal';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 text-lg">
        <LaTeXRenderer latex={displayValue} />
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