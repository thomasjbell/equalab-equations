import { SymbolicConverter } from "./symbolicConverter";
import { SolverResult, ExactNumber } from "@/types/exactNumber";
import { ExactMath } from "./exactMath";
import { evaluate } from "mathjs";

export class EnhancedSolver {
  // Solve linear relationships
  static solveLinear(
    relationships: Record<string, string>,
    inputs: Record<string, number>
  ): SolverResult {
    const results: SolverResult = {};

    for (const [variable, formula] of Object.entries(relationships)) {
      if (inputs[variable] === undefined) {
        try {
          const value = this.evaluateFormula(formula, inputs);
          if (isFinite(value)) {
            results[variable] = SymbolicConverter.convertToExact(value);
          }
        } catch (error) {
          console.warn(`Could not solve for ${variable}:`, error);
        }
      }
    }

    return results;
  }

  // Solve quadratic equations with Casio CG-50 logic
  static solveQuadratic(inputs: Record<string, number>): SolverResult {
    const { a, b, c } = inputs;
    const results: SolverResult = {};

    if (a !== undefined && b !== undefined && c !== undefined && a !== 0) {
      // Step 1: Calculate discriminant
      const discriminant = b * b - 4 * a * c;
      results.discriminant = SymbolicConverter.convertToExact(discriminant);

      if (discriminant < 0) {
        // No real solutions
        return results;
      }

      if (discriminant === 0) {
        // One solution: x = -b/(2a)
        const solution = -b / (2 * a);
        const exactSolution = SymbolicConverter.convertToExact(solution);
        results.x_1 = exactSolution;
        results.x_2 = exactSolution;
        return results;
      }

      // Two solutions: x = (-b ± √discriminant)/(2a)
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const twoA = 2 * a;

      // Check if discriminant is a perfect square
      const isPerferctSquare =
        Math.abs(sqrtDiscriminant - Math.round(sqrtDiscriminant)) < 1e-10;

      if (isPerferctSquare) {
        // Rational solutions
        const intSqrt = Math.round(sqrtDiscriminant);
        const x1 = (-b + intSqrt) / twoA;
        const x2 = (-b - intSqrt) / twoA;

        results.x_1 = SymbolicConverter.convertToExact(x1);
        results.x_2 = SymbolicConverter.convertToExact(x2);
      } else {
        // Irrational solutions - use Casio CG-50 logic
        results.x_1 = this.createCasioQuadraticSolution(
          -b,
          discriminant,
          twoA,
          true
        );
        results.x_2 = this.createCasioQuadraticSolution(
          -b,
          discriminant,
          twoA,
          false
        );
      }
    }

    return results;
  }

  // Create quadratic solutions in Casio CG-50 format
  private static createCasioQuadraticSolution(
    numeratorConstant: number,
    discriminant: number,
    denominator: number,
    isPositive: boolean
  ): ExactNumber {
    // Simplify the square root
    const simplifiedSurd = ExactMath.simplifySurd({
      coefficient: 1,
      radicand: discriminant,
    });
    const sign = isPositive ? "+" : "-";

    // Calculate decimal value
    const decimal =
      (numeratorConstant + (isPositive ? 1 : -1) * Math.sqrt(discriminant)) /
      denominator;

    // Create LaTeX based on Casio logic
    let latex = "";

    // Find GCD to simplify the fraction
    const gcd = ExactMath.gcd(
      Math.abs(numeratorConstant),
      Math.abs(denominator)
    );
    const simplifiedNum = numeratorConstant / gcd;
    const simplifiedDenom = denominator / gcd;
    const surdCoeff = simplifiedSurd.coefficient / gcd;

    if (simplifiedDenom === 1) {
      // No denominator needed
      if (simplifiedNum === 0) {
        // Just the surd part
        if (surdCoeff === 1) {
          latex = `${isPositive ? "" : "-"}\\sqrt{${simplifiedSurd.radicand}}`;
        } else {
          latex = `${isPositive ? "" : "-"}${Math.abs(surdCoeff)}\\sqrt{${
            simplifiedSurd.radicand
          }}`;
        }
      } else {
        // Constant + surd
        if (surdCoeff === 1) {
          latex = `${simplifiedNum} ${sign} \\sqrt{${simplifiedSurd.radicand}}`;
        } else {
          latex = `${simplifiedNum} ${sign} ${Math.abs(surdCoeff)}\\sqrt{${
            simplifiedSurd.radicand
          }}`;
        }
      }
    } else {
      // Need fraction form
      let numeratorPart = "";

      // Add constant part
      if (simplifiedNum !== 0) {
        numeratorPart = simplifiedNum.toString();
      }

      // Add surd part
      const surdPart =
        Math.abs(surdCoeff) === 1
          ? `\\sqrt{${simplifiedSurd.radicand}}`
          : `${Math.abs(surdCoeff)}\\sqrt{${simplifiedSurd.radicand}}`;

      if (numeratorPart) {
        numeratorPart += ` ${sign} ${surdPart}`;
      } else {
        numeratorPart = `${isPositive ? "" : "-"}${surdPart}`;
      }

      latex = `\\frac{${numeratorPart}}{${Math.abs(simplifiedDenom)}}`;
    }

    return {
      type: "expression",
      decimal: decimal,
      latex: latex,
      simplified: true,
    };
  }

  // Solve geometric formulas with exact results
  static solveGeometric(
    formula: string,
    inputs: Record<string, number>
  ): SolverResult {
    const results: SolverResult = {};

    switch (formula) {
      case "circle_area":
        if (inputs.r !== undefined && inputs.A === undefined) {
          const area = Math.PI * inputs.r * inputs.r;
          results.A = SymbolicConverter.convertWithPi(area);
        }
        if (inputs.A !== undefined && inputs.r === undefined) {
          const radius = Math.sqrt(inputs.A / Math.PI);
          results.r = SymbolicConverter.convertToExact(radius);
        }
        break;

      case "sphere_volume":
        if (inputs.r !== undefined && inputs.V === undefined) {
          const volume = (4 * Math.PI * Math.pow(inputs.r, 3)) / 3;
          results.V = SymbolicConverter.convertWithPi(volume);
        }
        if (inputs.V !== undefined && inputs.r === undefined) {
          const radius = Math.pow((3 * inputs.V) / (4 * Math.PI), 1 / 3);
          results.r = SymbolicConverter.convertToExact(radius);
        }
        break;

      case "pythagoras":
        if (
          inputs.a !== undefined &&
          inputs.b !== undefined &&
          inputs.c === undefined
        ) {
          const c = Math.sqrt(inputs.a * inputs.a + inputs.b * inputs.b);
          results.c = SymbolicConverter.convertToExact(c);
        }
        if (
          inputs.a !== undefined &&
          inputs.c !== undefined &&
          inputs.b === undefined
        ) {
          const b = Math.sqrt(inputs.c * inputs.c - inputs.a * inputs.a);
          results.b = SymbolicConverter.convertToExact(b);
        }
        if (
          inputs.b !== undefined &&
          inputs.c !== undefined &&
          inputs.a === undefined
        ) {
          const a = Math.sqrt(inputs.c * inputs.c - inputs.b * inputs.b);
          results.a = SymbolicConverter.convertToExact(a);
        }
        break;

      case "sphere_volume":
        if (inputs.r !== undefined && inputs.V === undefined) {
          const volume = (4 * Math.PI * Math.pow(inputs.r, 3)) / 3;
          results.V = SymbolicConverter.convertWithPi(volume);
        }
        if (inputs.V !== undefined && inputs.r === undefined) {
          const radius = Math.pow((3 * inputs.V) / (4 * Math.PI), 1 / 3);
          results.r = SymbolicConverter.convertToExact(radius);
        }
        break;
    }

    return results;
  }

  private static evaluateFormula(
    formula: string,
    values: Record<string, number>
  ): number {
    let expr = formula;

    // Replace variables with values
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, "g"), value.toString());
      }
    });

    // Check if all variables have been replaced
    if (/[a-zA-Z]/.test(expr.replace(/sin|cos|tan|sqrt|log|pi|e/g, ""))) {
      throw new Error("Missing values for some variables");
    }

    // Use mathjs for safe evaluation
    return evaluate(expr);
  }

  static solveSUVAT(inputs: Record<string, number>): SolverResult {
  const { s, u, v, a, t } = inputs;
  const results: SolverResult = {};
  
  // Count how many variables we have
  const known = Object.keys(inputs).filter(key => inputs[key] !== undefined);
  const missing = ['s', 'u', 'v', 'a', 't'].filter(key => inputs[key] === undefined);
  
  if (known.length !== 3) {
    // Need exactly 3 known values to solve SUVAT
    return results;
  }
  
  try {
    // Case analysis based on which variables are missing
    const missingSet = missing.sort().join('');
    
    switch (missingSet) {
      case 'as': // Missing a and s, have u, v, t
        if (u !== undefined && v !== undefined && t !== undefined) {
          const calc_a = (v - u) / t;
          const calc_s = u * t + 0.5 * calc_a * t * t;
          results.a = SymbolicConverter.convertToExact(calc_a);
          results.s = SymbolicConverter.convertToExact(calc_s);
        }
        break;
        
      case 'at': // Missing a and t, have s, u, v
        if (s !== undefined && u !== undefined && v !== undefined) {
          const calc_a = (v * v - u * u) / (2 * s);
          const calc_t = (v - u) / calc_a;
          if (isFinite(calc_a) && isFinite(calc_t) && calc_t > 0) {
            results.a = SymbolicConverter.convertToExact(calc_a);
            results.t = SymbolicConverter.convertToExact(calc_t);
          }
        }
        break;
        
      case 'av': // Missing a and v, have s, u, t
        if (s !== undefined && u !== undefined && t !== undefined) {
          const calc_a = (2 * (s - u * t)) / (t * t);
          const calc_v = u + calc_a * t;
          results.a = SymbolicConverter.convertToExact(calc_a);
          results.v = SymbolicConverter.convertToExact(calc_v);
        }
        break;
        
      case 'au': // Missing a and u, have s, v, t
        if (s !== undefined && v !== undefined && t !== undefined) {
          const calc_a = (2 * (s - v * t)) / (-t * t);
          const calc_u = v - calc_a * t;
          results.a = SymbolicConverter.convertToExact(calc_a);
          results.u = SymbolicConverter.convertToExact(calc_u);
        }
        break;
        
      case 'st': // Missing s and t, have u, v, a
        if (u !== undefined && v !== undefined && a !== undefined) {
          const calc_t = (v - u) / a;
          const calc_s = u * calc_t + 0.5 * a * calc_t * calc_t;
          if (isFinite(calc_t) && calc_t > 0) {
            results.t = SymbolicConverter.convertToExact(calc_t);
            results.s = SymbolicConverter.convertToExact(calc_s);
          }
        }
        break;
        
      case 'su': // Missing s and u, have v, a, t
        if (v !== undefined && a !== undefined && t !== undefined) {
          const calc_u = v - a * t;
          const calc_s = calc_u * t + 0.5 * a * t * t;
          results.u = SymbolicConverter.convertToExact(calc_u);
          results.s = SymbolicConverter.convertToExact(calc_s);
        }
        break;
        
      case 'sv': // Missing s and v, have u, a, t
        if (u !== undefined && a !== undefined && t !== undefined) {
          const calc_v = u + a * t;
          const calc_s = u * t + 0.5 * a * t * t;
          results.v = SymbolicConverter.convertToExact(calc_v);
          results.s = SymbolicConverter.convertToExact(calc_s);
        }
        break;
        
      case 'tu': // Missing t and u, have s, v, a
        if (s !== undefined && v !== undefined && a !== undefined) {
          // Use v² = u² + 2as and v = u + at
          // From v² = u² + 2as: u² = v² - 2as
          // From v = u + at: u = v - at
          // Substitute: (v - at)² = v² - 2as
          // Expand: v² - 2vat + a²t² = v² - 2as
          // Simplify: -2vat + a²t² = -2as
          // Rearrange: a²t² - 2vat + 2as = 0
          // Divide by a: at² - 2vt + 2s = 0
          
          const A = a;
          const B = -2 * v;
          const C = 2 * s;
          const discriminant = B * B - 4 * A * C;
          
          if (discriminant >= 0) {
            const calc_t = (-B + Math.sqrt(discriminant)) / (2 * A);
            if (calc_t > 0) {
              const calc_u = v - a * calc_t;
              results.t = SymbolicConverter.convertToExact(calc_t);
              results.u = SymbolicConverter.convertToExact(calc_u);
            }
          }
        }
        break;
        
      case 'tv': // Missing t and v, have s, u, a
        if (s !== undefined && u !== undefined && a !== undefined) {
          // Use s = ut + 0.5at²
          // Rearrange: 0.5at² + ut - s = 0
          const A = 0.5 * a;
          const B = u;
          const C = -s;
          const discriminant = B * B - 4 * A * C;
          
          if (discriminant >= 0) {
            const calc_t = (-B + Math.sqrt(discriminant)) / (2 * A);
            if (calc_t > 0) {
              const calc_v = u + a * calc_t;
              results.t = SymbolicConverter.convertToExact(calc_t);
              results.v = SymbolicConverter.convertToExact(calc_v);
            }
          }
        }
        break;
        
      case 'uv': // Missing u and v, have s, a, t
        if (s !== undefined && a !== undefined && t !== undefined) {
          // Use s = ut + 0.5at² and s = 0.5(u+v)t
          // From first: u = (s - 0.5at²)/t
          const calc_u = (s - 0.5 * a * t * t) / t;
          const calc_v = calc_u + a * t;
          results.u = SymbolicConverter.convertToExact(calc_u);
          results.v = SymbolicConverter.convertToExact(calc_v);
        }
        break;
    }
    
  } catch (error) {
    console.warn('Error solving SUVAT equations:', error);
  }
  
  return results;
}
}
