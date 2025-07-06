// src/lib/enhancedSolver.ts
import { SymbolicConverter } from "./symbolicConverter";
import { SolverResult, ExactNumber } from "@/types/exactNumber";
import { ExactMath } from "./exactMath";
import { evaluate } from "mathjs";
import { UserSettings } from "./contexts/SettingsContext";

export class EnhancedSolver {
  // Solve linear relationships
  static solveLinear(
    relationships: Record<string, string>,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};

    for (const [variable, formula] of Object.entries(relationships)) {
      if (inputs[variable] === undefined) {
        try {
          const value = this.evaluateFormula(formula, inputs);
          if (isFinite(value)) {
            results[variable] = SymbolicConverter.convertToExact(value, userSettings);
          }
        } catch (error) {
          console.warn(`Could not solve for ${variable}:`, error);
        }
      }
    }

    return results;
  }

  // Solve quadratic equations with exact symbolic results
  static solveQuadratic(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { a, b, c } = inputs;
    const results: SolverResult = {};

    if (a !== undefined && b !== undefined && c !== undefined && a !== 0) {
      const discriminant = b * b - 4 * a * c;
      results.discriminant = SymbolicConverter.convertToExact(discriminant, userSettings);

      if (discriminant < 0) {
        return results;
      }

      if (discriminant === 0) {
        const solution = -b / (2 * a);
        const exactSolution = SymbolicConverter.convertToExact(solution, userSettings);
        results.x_1 = exactSolution;
        results.x_2 = exactSolution;
        return results;
      }

      const sqrtDiscriminant = Math.sqrt(discriminant);
      const twoA = 2 * a;
      const isPerferctSquare = Math.abs(sqrtDiscriminant - Math.round(sqrtDiscriminant)) < 1e-10;

      if (isPerferctSquare) {
        const intSqrt = Math.round(sqrtDiscriminant);
        const x1 = (-b + intSqrt) / twoA;
        const x2 = (-b - intSqrt) / twoA;
        results.x_1 = SymbolicConverter.convertToExact(x1, userSettings);
        results.x_2 = SymbolicConverter.convertToExact(x2, userSettings);
      } else {
        results.x_1 = this.createQuadraticSolution(-b, discriminant, twoA, true, userSettings);
        results.x_2 = this.createQuadraticSolution(-b, discriminant, twoA, false, userSettings);
      }
    }

    return results;
  }

  // Solve cubic equations using Cardano's formula
  static solveCubic(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { a, b, c, d } = inputs;
    const results: SolverResult = {};

    if (a !== undefined && b !== undefined && c !== undefined && d !== undefined && a !== 0) {
      // Convert to depressed cubic: t³ + pt + q = 0
      const p = (3*a*c - b*b) / (3*a*a);
      const q = (2*b*b*b - 9*a*b*c + 27*a*a*d) / (27*a*a*a);
      
      // Calculate discriminant
      const discriminant = -(4*p*p*p + 27*q*q);
      results.discriminant = SymbolicConverter.convertToExact(discriminant, userSettings);

      if (discriminant > 0) {
        // Three real roots (trigonometric solution)
        const m = 2 * Math.sqrt(-p/3);
        const theta = Math.acos(3*q/(p*m)) / 3;
        
        const x1 = m * Math.cos(theta) - b/(3*a);
        const x2 = m * Math.cos(theta - 2*Math.PI/3) - b/(3*a);
        const x3 = m * Math.cos(theta - 4*Math.PI/3) - b/(3*a);
        
        results.x_1 = SymbolicConverter.convertToExact(x1, userSettings);
        results.x_2 = SymbolicConverter.convertToExact(x2, userSettings);
        results.x_3 = SymbolicConverter.convertToExact(x3, userSettings);
      } else {
        // One real root (Cardano's formula)
        const u = Math.cbrt(-q/2 + Math.sqrt(-discriminant/108));
        const v = Math.cbrt(-q/2 - Math.sqrt(-discriminant/108));
        const x1 = u + v - b/(3*a);
        
        results.x_1 = SymbolicConverter.convertToExact(x1, userSettings);
        
        if (discriminant === 0) {
          // Multiple roots
          const x2 = -u/2 - b/(3*a);
          results.x_2 = SymbolicConverter.convertToExact(x2, userSettings);
          results.x_3 = SymbolicConverter.convertToExact(x2, userSettings);
        }
      }
    }

    return results;
  }

  // Solve systems of linear equations
  static solveLinearSystem(
    equations: string[],
    variables: string[],
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};
    
    if (variables.length === 2 && equations.length === 2) {
      try {
        const solution = this.solve2x2System(equations, variables, inputs, userSettings);
        Object.assign(results, solution);
      } catch (error) {
        console.warn("Could not solve 2x2 system:", error);
      }
    }
    
    return results;
  }

  // Enhanced geometric solver
  static solveGeometric(
    formula: string,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};

    switch (formula) {
      case "circle_area":
        if (inputs.r !== undefined && inputs.A === undefined) {
          const area = Math.PI * inputs.r * inputs.r;
          results.A = SymbolicConverter.convertWithPi(area, userSettings);
        }
        if (inputs.A !== undefined && inputs.r === undefined) {
          const radius = Math.sqrt(inputs.A / Math.PI);
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "circle_circumference":
        if (inputs.r !== undefined && inputs.C === undefined) {
          const circumference = 2 * Math.PI * inputs.r;
          results.C = SymbolicConverter.convertWithPi(circumference, userSettings);
        }
        if (inputs.C !== undefined && inputs.r === undefined) {
          const radius = inputs.C / (2 * Math.PI);
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "sphere_volume":
        if (inputs.r !== undefined && inputs.V === undefined) {
          const volume = (4 * Math.PI * Math.pow(inputs.r, 3)) / 3;
          results.V = SymbolicConverter.convertWithPi(volume, userSettings);
        }
        if (inputs.V !== undefined && inputs.r === undefined) {
          const radius = Math.pow((3 * inputs.V) / (4 * Math.PI), 1 / 3);
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "sphere_surface_area":
        if (inputs.r !== undefined && inputs.A === undefined) {
          const area = 4 * Math.PI * inputs.r * inputs.r;
          results.A = SymbolicConverter.convertWithPi(area, userSettings);
        }
        if (inputs.A !== undefined && inputs.r === undefined) {
          const radius = Math.sqrt(inputs.A / (4 * Math.PI));
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "cylinder_volume":
        if (inputs.r !== undefined && inputs.h !== undefined && inputs.V === undefined) {
          const volume = Math.PI * inputs.r * inputs.r * inputs.h;
          results.V = SymbolicConverter.convertWithPi(volume, userSettings);
        }
        break;

      case "cone_volume":
        if (inputs.r !== undefined && inputs.h !== undefined && inputs.V === undefined) {
          const volume = (Math.PI * inputs.r * inputs.r * inputs.h) / 3;
          results.V = SymbolicConverter.convertWithPi(volume, userSettings);
        }
        break;

      case "pythagoras":
        if (inputs.a !== undefined && inputs.b !== undefined && inputs.c === undefined) {
          const c = Math.sqrt(inputs.a * inputs.a + inputs.b * inputs.b);
          results.c = SymbolicConverter.convertToExact(c, userSettings);
        }
        if (inputs.a !== undefined && inputs.c !== undefined && inputs.b === undefined) {
          const b = Math.sqrt(inputs.c * inputs.c - inputs.a * inputs.a);
          results.b = SymbolicConverter.convertToExact(b, userSettings);
        }
        if (inputs.b !== undefined && inputs.c !== undefined && inputs.a === undefined) {
          const a = Math.sqrt(inputs.c * inputs.c - inputs.b * inputs.b);
          results.a = SymbolicConverter.convertToExact(a, userSettings);
        }
        break;

      case "triangle_area":
        if (inputs.base !== undefined && inputs.height !== undefined && inputs.A === undefined) {
          const area = 0.5 * inputs.base * inputs.height;
          results.A = SymbolicConverter.convertToExact(area, userSettings);
        }
        break;

      case "rectangle_area":
        if (inputs.length !== undefined && inputs.width !== undefined && inputs.A === undefined) {
          const area = inputs.length * inputs.width;
          results.A = SymbolicConverter.convertToExact(area, userSettings);
        }
        break;
    }

    return results;
  }

  // Enhanced physics solver
  static solvePhysics(
    formula: string,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};

    switch (formula) {
      case "kinetic_energy":
        if (inputs.m !== undefined && inputs.v !== undefined && inputs.KE === undefined) {
          const ke = 0.5 * inputs.m * inputs.v * inputs.v;
          results.KE = SymbolicConverter.convertToExact(ke, userSettings);
        }
        break;

      case "potential_energy":
        if (inputs.m !== undefined && inputs.g !== undefined && inputs.h !== undefined && inputs.PE === undefined) {
          const pe = inputs.m * inputs.g * inputs.h;
          results.PE = SymbolicConverter.convertToExact(pe, userSettings);
        }
        break;

      case "force":
        if (inputs.m !== undefined && inputs.a !== undefined && inputs.F === undefined) {
          const force = inputs.m * inputs.a;
          results.F = SymbolicConverter.convertToExact(force, userSettings);
        }
        break;

      case "work":
        if (inputs.F !== undefined && inputs.d !== undefined && inputs.W === undefined) {
          const work = inputs.F * inputs.d;
          results.W = SymbolicConverter.convertToExact(work, userSettings);
        }
        break;

      case "power":
        if (inputs.W !== undefined && inputs.t !== undefined && inputs.P === undefined) {
          const power = inputs.W / inputs.t;
          results.P = SymbolicConverter.convertToExact(power, userSettings);
        }
        break;

      case "momentum":
        if (inputs.m !== undefined && inputs.v !== undefined && inputs.p === undefined) {
          const momentum = inputs.m * inputs.v;
          results.p = SymbolicConverter.convertToExact(momentum, userSettings);
        }
        break;
    }

    return results;
  }

  // SUVAT equations solver
  static solveSUVAT(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { s, u, v, a, t } = inputs;
    const results: SolverResult = {};
    
    const known = Object.keys(inputs).filter(key => inputs[key] !== undefined);
    const missing = ['s', 'u', 'v', 'a', 't'].filter(key => inputs[key] === undefined);
    
    if (known.length !== 3) {
      return results;
    }
    
    try {
      const missingSet = missing.sort().join('');
      
      switch (missingSet) {
        case 'as':
          if (u !== undefined && v !== undefined && t !== undefined) {
            const calc_a = (v - u) / t;
            const calc_s = u * t + 0.5 * calc_a * t * t;
            results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
            results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
          }
          break;
          
        case 'at':
          if (s !== undefined && u !== undefined && v !== undefined) {
            const calc_a = (v * v - u * u) / (2 * s);
            const calc_t = (v - u) / calc_a;
            if (isFinite(calc_a) && isFinite(calc_t) && calc_t > 0) {
              results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
              results.t = SymbolicConverter.convertToExact(calc_t, userSettings);
            }
          }
          break;
          
        case 'av':
          if (s !== undefined && u !== undefined && t !== undefined) {
            const calc_a = (2 * (s - u * t)) / (t * t);
            const calc_v = u + calc_a * t;
            results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
            results.v = SymbolicConverter.convertToExact(calc_v, userSettings);
          }
          break;
          
        case 'au':
          if (s !== undefined && v !== undefined && t !== undefined) {
            const calc_a = (2 * (s - v * t)) / (-t * t);
            const calc_u = v - calc_a * t;
            results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
            results.u = SymbolicConverter.convertToExact(calc_u, userSettings);
          }
          break;
          
        case 'st':
          if (u !== undefined && v !== undefined && a !== undefined) {
            const calc_t = (v - u) / a;
            const calc_s = u * calc_t + 0.5 * a * calc_t * calc_t;
            if (isFinite(calc_t) && calc_t > 0) {
              results.t = SymbolicConverter.convertToExact(calc_t, userSettings);
              results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
            }
          }
          break;
          
        case 'su':
          if (v !== undefined && a !== undefined && t !== undefined) {
            const calc_u = v - a * t;
            const calc_s = calc_u * t + 0.5 * a * t * t;
            results.u = SymbolicConverter.convertToExact(calc_u, userSettings);
            results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
          }
          break;
          
        case 'sv':
          if (u !== undefined && a !== undefined && t !== undefined) {
            const calc_v = u + a * t;
            const calc_s = u * t + 0.5 * a * t * t;
            results.v = SymbolicConverter.convertToExact(calc_v, userSettings);
            results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
          }
          break;
          
        case 'tu':
          if (s !== undefined && v !== undefined && a !== undefined) {
            const A = a;
            const B = -2 * v;
            const C = 2 * s;
            const discriminant = B * B - 4 * A * C;
            
            if (discriminant >= 0) {
              const calc_t = (-B + Math.sqrt(discriminant)) / (2 * A);
              if (calc_t > 0) {
                const calc_u = v - a * calc_t;
                results.t = SymbolicConverter.convertToExact(calc_t, userSettings);
                results.u = SymbolicConverter.convertToExact(calc_u, userSettings);
              }
            }
          }
          break;
          
        case 'tv':
          if (s !== undefined && u !== undefined && a !== undefined) {
            const A = 0.5 * a;
            const B = u;
            const C = -s;
            const discriminant = B * B - 4 * A * C;
            
            if (discriminant >= 0) {
              const calc_t = (-B + Math.sqrt(discriminant)) / (2 * A);
              if (calc_t > 0) {
                const calc_v = u + a * calc_t;
                results.t = SymbolicConverter.convertToExact(calc_t, userSettings);
                results.v = SymbolicConverter.convertToExact(calc_v, userSettings);
              }
            }
          }
          break;
          
        case 'uv':
          if (s !== undefined && a !== undefined && t !== undefined) {
            const calc_u = (s - 0.5 * a * t * t) / t;
            const calc_v = calc_u + a * t;
            results.u = SymbolicConverter.convertToExact(calc_u, userSettings);
            results.v = SymbolicConverter.convertToExact(calc_v, userSettings);
          }
          break;
      }
      
    } catch (error) {
      console.warn('Error solving SUVAT equations:', error);
    }
    
    return results;
  }

  // Helper methods
  private static createQuadraticSolution(
    numeratorConstant: number,
    discriminant: number,
    denominator: number,
    isPositive: boolean,
    userSettings?: UserSettings
  ): ExactNumber {
    const simplifiedSurd = ExactMath.simplifySurd({
      coefficient: 1,
      radicand: discriminant,
    });
    const sign = isPositive ? "+" : "-";
    const decimal = (numeratorConstant + (isPositive ? 1 : -1) * Math.sqrt(discriminant)) / denominator;

    let latex = "";
    const gcd = ExactMath.gcd(Math.abs(numeratorConstant), Math.abs(denominator));
    const simplifiedNum = numeratorConstant / gcd;
    const simplifiedDenom = denominator / gcd;
    const surdCoeff = simplifiedSurd.coefficient / gcd;

    if (simplifiedDenom === 1) {
      if (simplifiedNum === 0) {
        if (surdCoeff === 1) {
          latex = `${isPositive ? "" : "-"}\\sqrt{${simplifiedSurd.radicand}}`;
        } else {
          latex = `${isPositive ? "" : "-"}${Math.abs(surdCoeff)}\\sqrt{${simplifiedSurd.radicand}}`;
        }
      } else {
        if (surdCoeff === 1) {
          latex = `${simplifiedNum} ${sign} \\sqrt{${simplifiedSurd.radicand}}`;
        } else {
          latex = `${simplifiedNum} ${sign} ${Math.abs(surdCoeff)}\\sqrt{${simplifiedSurd.radicand}}`;
        }
      }
    } else {
      let numeratorPart = "";
      if (simplifiedNum !== 0) {
        numeratorPart = simplifiedNum.toString();
      }

      const surdPart = Math.abs(surdCoeff) === 1
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

  private static solve2x2System(
    equations: string[],
    variables: string[],
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};
    return results;
  }

  private static evaluateFormula(
    formula: string,
    values: Record<string, number>
  ): number {
    let expr = formula;

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, "g"), value.toString());
      }
    });

    if (/[a-zA-Z]/.test(expr.replace(/sin|cos|tan|sqrt|log|pi|e/g, ""))) {
      throw new Error("Missing values for some variables");
    }

    return evaluate(expr);
  }
}