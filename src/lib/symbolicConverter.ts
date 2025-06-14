import { ExactNumber, Fraction, Surd } from '@/types/exactNumber';
import { ExactMath } from './exactMath';

export class SymbolicConverter {
  
  static convertToExact(decimal: number): ExactNumber {
    // Handle special cases
    if (!isFinite(decimal)) {
      return {
        type: 'decimal',
        decimal: decimal,
        latex: decimal.toString(),
        simplified: true
      };
    }

    if (decimal === 0) {
      return {
        type: 'integer',
        decimal: 0,
        exact: 0,
        latex: '0',
        simplified: true
      };
    }

    // Check if it's an integer
    if (Math.abs(decimal - Math.round(decimal)) < 1e-10) {
      const rounded = Math.round(decimal);
      return {
        type: 'integer',
        decimal: rounded,
        exact: rounded,
        latex: rounded.toString(),
        simplified: true
      };
    }

    // Try to convert to fraction
    const fraction = ExactMath.decimalToFraction(decimal);
    if (fraction && fraction.denominator !== 1) {
      return {
        type: 'fraction',
        decimal: decimal,
        exact: fraction,
        latex: this.fractionToLatex(fraction),
        simplified: true
      };
    }

    // Try to convert to surd
    const surd = ExactMath.decimalToSurd(decimal);
    if (surd) {
      const simplified = ExactMath.simplifySurd(surd);
      return {
        type: 'surd',
        decimal: decimal,
        exact: simplified,
        latex: this.surdToLatex(simplified),
        simplified: true
      };
    }

    // Fall back to decimal with appropriate precision
    const precision = this.determinePrecision(decimal);
    return {
      type: 'decimal',
      decimal: decimal,
      latex: decimal.toFixed(precision),
      simplified: false
    };
  }

  private static fractionToLatex(fraction: Fraction): string {
    if (fraction.denominator === 1) {
      return fraction.numerator.toString();
    }
    
    if (fraction.numerator < 0) {
      return `-\\frac{${Math.abs(fraction.numerator)}}{${fraction.denominator}}`;
    }
    
    return `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
  }

  private static surdToLatex(surd: Surd): string {
    const { coefficient, radicand } = surd;
    
    if (radicand === 1) {
      return coefficient.toString();
    }
    
    let result = '';
    
    if (coefficient === 1) {
      result = `\\sqrt{${radicand}}`;
    } else if (coefficient === -1) {
      result = `-\\sqrt{${radicand}}`;
    } else if (coefficient % 1 === 0) {
      // Integer coefficient
      if (coefficient < 0) {
        result = `-${Math.abs(coefficient)}\\sqrt{${radicand}}`;
      } else {
        result = `${coefficient}\\sqrt{${radicand}}`;
      }
    } else {
      // Fractional coefficient
      const coeffFraction = ExactMath.decimalToFraction(Math.abs(coefficient));
      if (coeffFraction) {
        const fractionLatex = this.fractionToLatex(coeffFraction);
        result = coefficient < 0 ? `-${fractionLatex}\\sqrt{${radicand}}` : `${fractionLatex}\\sqrt{${radicand}}`;
      } else {
        result = `${coefficient}\\sqrt{${radicand}}`;
      }
    }
    
    return result;
  }

  private static determinePrecision(decimal: number): number {
    const absDecimal = Math.abs(decimal);
    if (absDecimal >= 100) return 1;
    if (absDecimal >= 10) return 2;
    if (absDecimal >= 1) return 3;
    if (absDecimal >= 0.1) return 4;
    return 5;
  }

  // Convert results from common operations
  static convertQuadraticResults(a: number, b: number, c: number): {
    discriminant: ExactNumber;
    x1?: ExactNumber;
    x2?: ExactNumber;
  } {
    const discriminant = b * b - 4 * a * c;
    const discriminantExact = this.convertToExact(discriminant);
    
    if (discriminant < 0) {
      return { discriminant: discriminantExact };
    }
    
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const x1 = (-b + sqrtDiscriminant) / (2 * a);
    const x2 = (-b - sqrtDiscriminant) / (2 * a);
    
    return {
      discriminant: discriminantExact,
      x1: this.convertToExact(x1),
      x2: this.convertToExact(x2)
    };
  }

  // Convert results involving π
  static convertWithPi(decimal: number): ExactNumber {
    const piRatio = decimal / Math.PI;
    const fraction = ExactMath.decimalToFraction(piRatio);
    
    if (fraction) {
      let latex: string;
      if (fraction.numerator === 1 && fraction.denominator === 1) {
        latex = '\\pi';
      } else if (fraction.numerator === 1) {
        latex = `\\frac{\\pi}{${fraction.denominator}}`;
      } else if (fraction.denominator === 1) {
        latex = `${fraction.numerator}\\pi`;
      } else {
        latex = `\\frac{${fraction.numerator}\\pi}{${fraction.denominator}}`;
      }
      
      return {
        type: 'expression',
        decimal: decimal,
        exact: fraction,
        latex: latex,
        simplified: true
      };
    }
    
    return this.convertToExact(decimal);
  }
}