// src/components/math/LaTeXRenderer.tsx
"use client";

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LaTeXRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export default function LaTeXRenderer({ 
  latex, 
  displayMode = false, 
  className = ""
}: LaTeXRendererProps) {
  // Clean and prepare LaTeX string
  const cleanLatex = React.useMemo(() => {
    if (!latex) return '';
    
    return latex
      .replace(/\\quad/g, '\\quad ')
      .replace(/\\qquad/g, '\\qquad ')
      .replace(/\\\\/g, '\\\\')
      .trim();
  }, [latex]);

  // Error boundary for LaTeX rendering
  const renderLatex = () => {
    try {
      if (displayMode) {
        return <BlockMath math={cleanLatex} />;
      } else {
        return <InlineMath math={cleanLatex} />;
      }
    } catch (error) {
      console.error('LaTeX rendering error for:', latex, error);
      return (
        <div className="latex-error text-red-500 text-sm">
          <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
            {latex}
          </code>
          <div className="text-xs mt-1">LaTeX rendering error</div>
        </div>
      );
    }
  };

  if (displayMode) {
    return (
      <div className={`latex-renderer ${className}`}>
        {renderLatex()}
      </div>
    );
  } else {
    return (
      <span className={`latex-renderer ${className}`}>
        {renderLatex()}
      </span>
    );
  }
}