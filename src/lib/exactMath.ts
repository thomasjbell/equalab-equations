import { Fraction, Surd, Expression, ExactNumber } from '@/types/exactNumber';

export class ExactMath {
  private static readonly TOLERANCE = 1e-10;
  private static readonly MAX_DENOMINATOR = 10000;

  // Convert decimal to fraction using continued fractions algorithm
  static decimalToFraction(decimal: number): Fraction | null {
    if (!isFinite(decimal)) return null;
    
    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    
    // Check if it's already an integer
    if (Math.abs(decimal - Math.round(decimal)) < this.TOLERANCE) {
      return { numerator: sign * Math.round(decimal), denominator: 1 };
    }

    // Continued fractions algorithm
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    
    do {
      const a = Math.floor(b);
      const aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      const aux2 = k1;
      k1 = a * k1 + k2;
      k2 = aux2;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > this.TOLERANCE && k1 <= this.MAX_DENOMINATOR);

    if (k1 > this.MAX_DENOMINATOR) return null;
    
    return this.simplifyFraction({ numerator: sign * h1, denominator: k1 });
  }

  // Check if number is a perfect square and return its root
  static perfectSquareRoot(n: number): number | null {
    if (n < 0) return null;
    const root = Math.sqrt(n);
    if (Math.abs(root - Math.round(root)) < this.TOLERANCE) {
      return Math.round(root);
    }
    return null;
  }

  // Convert decimal to surd form if possible
  static decimalToSurd(decimal: number): Surd | null {
    const sign = decimal < 0 ? -1 : 1;
    const absDecimal = Math.abs(decimal);
    
    // Try to express as coefficient * √radicand
    for (let radicand = 2; radicand <= 1000; radicand++) {
      const sqrt = Math.sqrt(radicand);
      const coefficient = absDecimal / sqrt;
      
      // Check if coefficient is a simple fraction
      const coeffFraction = this.decimalToFraction(coefficient);
      if (coeffFraction && Math.abs(coeffFraction.denominator) <= 20) {
        // Verify the result
        const reconstructed = (coeffFraction.numerator / coeffFraction.denominator) * sqrt;
        if (Math.abs(reconstructed - absDecimal) < this.TOLERANCE) {
          return {
            coefficient: sign * coeffFraction.numerator / coeffFraction.denominator,
            radicand: radicand
          };
        }
      }
    }
    return null;
  }

  // Simplify a fraction
  static simplifyFraction(fraction: Fraction): Fraction {
    const gcd = this.gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator));
    return {
      numerator: fraction.numerator / gcd,
      denominator: fraction.denominator / gcd
    };
  }

  // Greatest common divisor
  static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  // Simplify a surd
  static simplifySurd(surd: Surd): Surd {
    if (surd.radicand <= 0) return surd;
    
    let coefficient = surd.coefficient;
    let radicand = surd.radicand;
    
    // Extract perfect squares from radicand
    for (let i = 2; i * i <= radicand; i++) {
      while (radicand % (i * i) === 0) {
        coefficient *= i;
        radicand /= (i * i);
      }
    }
    
    return { coefficient, radicand };
  }

  // Add two fractions
  static addFractions(a: Fraction, b: Fraction): Fraction {
    const numerator = a.numerator * b.denominator + b.numerator * a.denominator;
    const denominator = a.denominator * b.denominator;
    return this.simplifyFraction({ numerator, denominator });
  }

  // Multiply two fractions
  static multiplyFractions(a: Fraction, b: Fraction): Fraction {
    return this.simplifyFraction({
      numerator: a.numerator * b.numerator,
      denominator: a.denominator * b.denominator
    });
  }

  // Check if two numbers are equivalent within tolerance
  static areEqual(a: number, b: number): boolean {
    return Math.abs(a - b) < this.TOLERANCE;
  }
}