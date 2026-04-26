import { ExactNumber, Fraction, Surd, Expression } from '@/types/exactNumber';
import { ExactMath } from './exactMath';
import { evaluate } from 'mathjs';

export interface ParsedInput {
  value: ExactNumber;
  originalText: string;
  detectedFormat: 'decimal' | 'fraction' | 'surd' | 'expression' | 'integer';
  isValid: boolean;
  errorMessage?: string;
}

export class InputParser {
  static parseInput(input: string): ParsedInput {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return {
        value: { type: 'decimal', decimal: 0, latex: '0', simplified: true },
        originalText: input,
        detectedFormat: 'decimal',
        isValid: false,
        errorMessage: 'Input cannot be empty'
      };
    }

    try {
      // Try parsing as integer first (including multi-digit numbers)
      const integerRegex = /^-?\d+$/;
      const integerMatch = integerRegex.test(trimmed);
      
      if (integerMatch) {
        const value = parseInt(trimmed, 10);
        const isFiniteValue = isFinite(value);
        
        if (isFiniteValue) {
          return {
            value: {
              type: 'integer',
              decimal: value,
              exact: value,
              latex: value.toString(),
              simplified: true
            },
            originalText: input,
            detectedFormat: 'integer',
            isValid: true
          };
        }
      }

      // Try parsing as fraction
      const fractionMatch = trimmed.match(/^-?(\d+)\/(\d+)$/);
      if (fractionMatch) {
        const [, numeratorStr, denominatorStr] = fractionMatch;
        const numerator = parseInt(numeratorStr, 10);
        const denominator = parseInt(denominatorStr, 10);

        if (denominator === 0) {
          throw new Error('Division by zero');
        }

        const fraction = ExactMath.simplifyFraction({ numerator, denominator });
        const decimal = numerator / denominator;

        return {
          value: {
            type: fraction.denominator === 1 ? 'integer' : 'fraction',
            decimal: decimal,
            exact: fraction,
            latex: this.fractionToLatex(fraction),
            simplified: true
          },
          originalText: input,
          detectedFormat: 'fraction',
          isValid: true
        };
      }

      // Try parsing as mixed fraction
      const mixedMatch = trimmed.match(/^-?(\d+)\s+(\d+)\/(\d+)$/);
      if (mixedMatch) {
        const [, wholeStr, numeratorStr, denominatorStr] = mixedMatch;
        const whole = parseInt(wholeStr, 10);
        const numerator = parseInt(numeratorStr, 10);
        const denominator = parseInt(denominatorStr, 10);

        if (denominator === 0) {
          throw new Error('Division by zero');
        }

        const sign = trimmed.startsWith('-') ? -1 : 1;
        const totalNumerator = sign * (Math.abs(whole) * denominator + numerator);
        const fraction = ExactMath.simplifyFraction({ numerator: totalNumerator, denominator });
        const decimal = totalNumerator / denominator;

        return {
          value: {
            type: 'fraction',
            decimal: decimal,
            exact: fraction,
            latex: this.fractionToLatex(fraction),
            simplified: true
          },
          originalText: input,
          detectedFormat: 'fraction',
          isValid: true
        };
      }

      // Try parsing as surd
      let surdMatch = trimmed.match(/^-?\s*(sqrt|rt)\((\d+)\)$/i);
      if (surdMatch) {
        const [, funcName, radicandStr] = surdMatch;
        const radicand = parseInt(radicandStr, 10);
        
        if (radicand < 0) {
          throw new Error('Radicand must be non-negative');
        }
        
        const sign = trimmed.startsWith('-') ? -1 : 1;
        const surd = ExactMath.simplifySurd({ coefficient: sign, radicand });
        const decimal = sign * Math.sqrt(radicand);

        return {
          value: {
            type: 'surd',
            decimal: decimal,
            exact: surd,
            latex: this.surdToLatex(surd),
            simplified: true
          },
          originalText: input,
          detectedFormat: 'surd',
          isValid: true
        };
      }

      // Try coefficient * sqrt(n)
      surdMatch = trimmed.match(/^-?(\d*\.?\d*)\s*\*?\s*(sqrt|rt)\((\d+)\)$/i);
      if (surdMatch) {
        const [, coeffStr, funcName, radicandStr] = surdMatch;
        let coefficient = coeffStr ? parseFloat(coeffStr) : 1;
        const radicand = parseInt(radicandStr, 10);
        
        if (radicand < 0) {
          throw new Error('Radicand must be non-negative');
        }
        
        if (trimmed.startsWith('-') && !coeffStr) {
          coefficient = -1;
        }

        const surd = ExactMath.simplifySurd({ coefficient, radicand });
        const decimal = coefficient * Math.sqrt(radicand);

        return {
          value: {
            type: 'surd',
            decimal: decimal,
            exact: surd,
            latex: this.surdToLatex(surd),
            simplified: true
          },
          originalText: input,
          detectedFormat: 'surd',
          isValid: true
        };
      }

      // Try pi expressions
      if (/^-?\s*pi$/i.test(trimmed)) {
        const sign = trimmed.startsWith('-') ? -1 : 1;
        const decimal = sign * Math.PI;

        return {
          value: {
            type: 'expression',
            decimal: decimal,
            exact: { numerator: sign, denominator: 1 },
            latex: sign === 1 ? '\\pi' : '-\\pi',
            simplified: true
          },
          originalText: input,
          detectedFormat: 'expression',
          isValid: true
        };
      }

      const piMatch = trimmed.match(/^-?(\d*\.?\d*)\s*\*?\s*pi$/i);
      if (piMatch) {
        const [, coeffStr] = piMatch;
        let coefficient = coeffStr ? parseFloat(coeffStr) : 1;
        
        if (trimmed.startsWith('-') && !coeffStr) {
          coefficient = -1;
        }

        const decimal = coefficient * Math.PI;
        const coeffFraction = ExactMath.decimalToFraction(coefficient);

        let latex: string;
        if (coefficient === 1) {
          latex = '\\pi';
        } else if (coefficient === -1) {
          latex = '-\\pi';
        } else if (coeffFraction && coeffFraction.denominator !== 1) {
          latex = `${this.fractionToLatex(coeffFraction)}\\pi`;
        } else {
          latex = `${coefficient}\\pi`;
        }

        return {
          value: {
            type: 'expression',
            decimal: decimal,
            exact: coeffFraction || { numerator: coefficient, denominator: 1 },
            latex: latex,
            simplified: true
          },
          originalText: input,
          detectedFormat: 'expression',
          isValid: true
        };
      }

      // Try parsing as decimal
      const decimalRegex = /^-?\d*\.?\d+$/;
      const decimalMatch = decimalRegex.test(trimmed);
      
      if (decimalMatch) {
        const value = parseFloat(trimmed);
        if (!isFinite(value)) {
          throw new Error('Invalid decimal number');
        }

        const exactNumber = this.convertDecimalToExact(value);
        
        return {
          value: exactNumber,
          originalText: input,
          detectedFormat: exactNumber.type === 'integer' ? 'integer' : 'decimal',
          isValid: true
        };
      }

      // Try parsing as complex expression using mathjs
      let expr = trimmed
        .replace(/\b(sqrt|rt)\(([^)]+)\)/gi, 'sqrt($2)')
        .replace(/\bpi\b/gi, 'pi');

      const result = evaluate(expr);
      
      if (!isFinite(result)) {
        throw new Error('Result is not finite');
      }

      const exactNumber = this.convertDecimalToExact(result);
      
      return {
        value: exactNumber,
        originalText: input,
        detectedFormat: 'expression',
        isValid: true
      };

    } catch (error) {
      return {
        value: { type: 'decimal', decimal: NaN, latex: 'NaN', simplified: false },
        originalText: input,
        detectedFormat: 'decimal',
        isValid: false,
        errorMessage: `Invalid input: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private static convertDecimalToExact(decimal: number): ExactNumber {
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
    if (fraction && fraction.denominator !== 1 && Math.abs(fraction.denominator) <= 1000) {
      return {
        type: 'fraction',
        decimal: decimal,
        exact: fraction,
        latex: this.fractionToLatex(fraction),
        simplified: true
      };
    }

    // Return as decimal with LaTeX formatting
    let precision = 6;
    if (Math.abs(decimal) >= 1000) precision = 4;
    else if (Math.abs(decimal) >= 100) precision = 5;
    else if (Math.abs(decimal) >= 10) precision = 6;
    else if (Math.abs(decimal) >= 1) precision = 7;

    const formatted = decimal.toPrecision(precision);
    return {
      type: 'decimal',
      decimal: decimal,
      latex: formatted,
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
    
    if (coefficient === 1) {
      return `\\sqrt{${radicand}}`;
    } else if (coefficient === -1) {
      return `-\\sqrt{${radicand}}`;
    } else {
      return `${coefficient}\\sqrt{${radicand}}`;
    }
  }
}