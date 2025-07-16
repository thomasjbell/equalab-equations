// src/lib/enhancedSolver.ts (COMPLETE REWRITE)
import { SymbolicConverter } from "./symbolicConverter";
import { SolverResult, ExactNumber } from "@/types/exactNumber";
import { ExactMath } from "./exactMath";
import { evaluate, create, all } from "mathjs";
import { UserSettings } from "./contexts/SettingsContext";

const math = create(all);

export class EnhancedSolver {
  
  // Enhanced linear solver - solves for ALL variables
  static solveLinear(
    relationships: Record<string, string>,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};
    const knownVars = new Set(Object.keys(inputs));
    const allVars = new Set(Object.keys(relationships));
    
    // Keep iterating until all variables are solved
    let iterations = 0;
    const maxIterations = allVars.size * 2;
    
    while (knownVars.size < allVars.size && iterations < maxIterations) {
      iterations++;
      let foundNew = false;
      
      for (const [variable, formula] of Object.entries(relationships)) {
        if (!knownVars.has(variable)) {
          try {
            const value = this.evaluateFormula(formula, inputs);
            if (isFinite(value)) {
              inputs[variable] = value;
              results[variable] = SymbolicConverter.convertToExact(value, userSettings);
              knownVars.add(variable);
              foundNew = true;
            }
          } catch (error) {
            // Can't solve this variable yet
          }
        }
      }
      
      if (!foundNew) break;
    }

    return results;
  }

  // Complete quadratic solver - ax² + bx + c = 0
  static solveQuadratic(
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const { a, b, c } = inputs;
    const results: SolverResult = {};
    
    if (a === undefined || b === undefined || c === undefined) {
      return results;
    }
    
    if (a === 0) {
      // Linear equation: bx + c = 0
      if (b !== 0) {
        const x = -c / b;
        results.x_1 = SymbolicConverter.convertToExact(x, userSettings);
        results.discriminant = SymbolicConverter.convertToExact(0, userSettings);
      }
      return results;
    }
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    results.discriminant = SymbolicConverter.convertToExact(discriminant, userSettings);
    
    if (discriminant < 0) {
      // No real solutions
      return results;
    }
    
    if (discriminant === 0) {
      // One solution
      const x = -b / (2 * a);
      results.x_1 = SymbolicConverter.convertToExact(x, userSettings);
    } else {
      // Two solutions
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const x1 = (-b + sqrtDiscriminant) / (2 * a);
      const x2 = (-b - sqrtDiscriminant) / (2 * a);
      
      results.x_1 = SymbolicConverter.convertToExact(x1, userSettings);
      results.x_2 = SymbolicConverter.convertToExact(x2, userSettings);
    }
    
    return results;
  }

  // Complete cubic solver - ax³ + bx² + cx + d = 0
  static solveCubic(
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const { a, b, c, d } = inputs;
    const results: SolverResult = {};
    
    if (a === undefined || b === undefined || c === undefined || d === undefined) {
      return results;
    }
    
    if (a === 0) {
      // Quadratic equation
      return this.solveQuadratic({ a: b, b: c, c: d }, userSettings);
    }
    
    // Normalize to x³ + px + q = 0 form using substitution x = t - b/(3a)
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    
    // Calculate discriminant
    const discriminant = -(4 * p * p * p + 27 * q * q);
    results.discriminant = SymbolicConverter.convertToExact(discriminant, userSettings);
    
    const offset = -b / (3 * a);
    
    if (Math.abs(p) < 1e-10) {
      // p ≈ 0, so x³ + q = 0, thus x = ∛(-q)
      const x = Math.cbrt(-q) + offset;
      results.x_1 = SymbolicConverter.convertToExact(x, userSettings);
    } else if (discriminant > 0) {
      // Three real roots (trigonometric solution)
      const m = 2 * Math.sqrt(-p / 3);
      const theta = Math.acos((3 * q) / (p * m)) / 3;
      
      const x1 = m * Math.cos(theta) + offset;
      const x2 = m * Math.cos(theta - (2 * Math.PI) / 3) + offset;
      const x3 = m * Math.cos(theta - (4 * Math.PI) / 3) + offset;
      
      results.x_1 = SymbolicConverter.convertToExact(x1, userSettings);
      results.x_2 = SymbolicConverter.convertToExact(x2, userSettings);
      results.x_3 = SymbolicConverter.convertToExact(x3, userSettings);
    } else {
      // One real root (Cardano's formula)
      const discriminantSqrt = Math.sqrt(-discriminant / 108);
      const u = Math.cbrt(-q / 2 + discriminantSqrt);
      const v = Math.cbrt(-q / 2 - discriminantSqrt);
      
      const x1 = u + v + offset;
      results.x_1 = SymbolicConverter.convertToExact(x1, userSettings);
    }
    
    return results;
  }

  // Complete SUVAT solver - handles ALL 10 possible combinations
  static solveSUVAT(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { s, u, v, a, t } = inputs;
    const results: SolverResult = {};
    
    const known = Object.keys(inputs).filter(key => inputs[key] !== undefined);
    const missing = ['s', 'u', 'v', 'a', 't'].filter(key => inputs[key] === undefined);
    
    if (known.length !== 3 || missing.length !== 2) {
      return results;
    }
    
    try {
      const missingSet = missing.sort().join('');
      
      switch (missingSet) {
        case 'as': // Given: u, v, t
          if (u !== undefined && v !== undefined && t !== undefined) {
            const calc_a = (v - u) / t;
            const calc_s = u * t + 0.5 * calc_a * t * t;
            results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
            results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
          }
          break;
          
        case 'at': // Given: s, u, v
          if (s !== undefined && u !== undefined && v !== undefined) {
            const calc_a = (v * v - u * u) / (2 * s);
            const calc_t = (v - u) / calc_a;
            if (isFinite(calc_a) && isFinite(calc_t) && calc_t > 0) {
              results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
              results.t = SymbolicConverter.convertToExact(calc_t, userSettings);
            }
          }
          break;
          
        case 'av': // Given: s, u, t
          if (s !== undefined && u !== undefined && t !== undefined) {
            const calc_a = (2 * (s - u * t)) / (t * t);
            const calc_v = u + calc_a * t;
            results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
            results.v = SymbolicConverter.convertToExact(calc_v, userSettings);
          }
          break;
          
        case 'au': // Given: s, v, t
          if (s !== undefined && v !== undefined && t !== undefined) {
            const calc_u = (2 * s / t) - v;
            const calc_a = (v - calc_u) / t;
            results.u = SymbolicConverter.convertToExact(calc_u, userSettings);
            results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
          }
          break;
          
        case 'st': // Given: u, v, a
          if (u !== undefined && v !== undefined && a !== undefined) {
            const calc_t = (v - u) / a;
            const calc_s = u * calc_t + 0.5 * a * calc_t * calc_t;
            if (isFinite(calc_t) && calc_t > 0) {
              results.t = SymbolicConverter.convertToExact(calc_t, userSettings);
              results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
            }
          }
          break;
          
        case 'su': // Given: v, a, t
          if (v !== undefined && a !== undefined && t !== undefined) {
            const calc_u = v - a * t;
            const calc_s = calc_u * t + 0.5 * a * t * t;
            results.u = SymbolicConverter.convertToExact(calc_u, userSettings);
            results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
          }
          break;
          
        case 'sv': // Given: u, a, t
          if (u !== undefined && a !== undefined && t !== undefined) {
            const calc_v = u + a * t;
            const calc_s = u * t + 0.5 * a * t * t;
            results.v = SymbolicConverter.convertToExact(calc_v, userSettings);
            results.s = SymbolicConverter.convertToExact(calc_s, userSettings);
          }
          break;
          
        case 'tu': // Given: s, v, a
          if (s !== undefined && v !== undefined && a !== undefined) {
            const A = 0.5 * a;
            const B = v;
            const C = -s;
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
          
        case 'tv': // Given: s, u, a
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
          
        case 'uv': // Given: s, a, t
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

  // Complete geometric solver - ALL variables solvable
  static solveGeometric(
    formula: string,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};

    switch (formula) {
      case "circle_area":
        // A = π r²
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
        // C = 2π r
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
        // V = (4/3)π r³
        if (inputs.r !== undefined && inputs.V === undefined) {
          const volume = (4 * Math.PI * Math.pow(inputs.r, 3)) / 3;
          results.V = SymbolicConverter.convertWithPi(volume, userSettings);
        }
        if (inputs.V !== undefined && inputs.r === undefined) {
          const radius = Math.pow((3 * inputs.V) / (4 * Math.PI), 1 / 3);
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "cylinder_volume":
        // V = π r² h
        if (inputs.r !== undefined && inputs.h !== undefined && inputs.V === undefined) {
          const volume = Math.PI * inputs.r * inputs.r * inputs.h;
          results.V = SymbolicConverter.convertWithPi(volume, userSettings);
        }
        if (inputs.V !== undefined && inputs.r !== undefined && inputs.h === undefined) {
          const height = inputs.V / (Math.PI * inputs.r * inputs.r);
          results.h = SymbolicConverter.convertToExact(height, userSettings);
        }
        if (inputs.V !== undefined && inputs.h !== undefined && inputs.r === undefined) {
          const radius = Math.sqrt(inputs.V / (Math.PI * inputs.h));
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "cone_volume":
        // V = (1/3)π r² h
        if (inputs.r !== undefined && inputs.h !== undefined && inputs.V === undefined) {
          const volume = (Math.PI * inputs.r * inputs.r * inputs.h) / 3;
          results.V = SymbolicConverter.convertWithPi(volume, userSettings);
        }
        if (inputs.V !== undefined && inputs.r !== undefined && inputs.h === undefined) {
          const height = (3 * inputs.V) / (Math.PI * inputs.r * inputs.r);
          results.h = SymbolicConverter.convertToExact(height, userSettings);
        }
        if (inputs.V !== undefined && inputs.h !== undefined && inputs.r === undefined) {
          const radius = Math.sqrt((3 * inputs.V) / (Math.PI * inputs.h));
          results.r = SymbolicConverter.convertToExact(radius, userSettings);
        }
        break;

      case "pythagoras":
        // c² = a² + b²
        if (inputs.a !== undefined && inputs.b !== undefined && inputs.c === undefined) {
          const c = Math.sqrt(inputs.a * inputs.a + inputs.b * inputs.b);
          results.c = SymbolicConverter.convertToExact(c, userSettings);
        }
        if (inputs.a !== undefined && inputs.c !== undefined && inputs.b === undefined) {
          const b_squared = inputs.c * inputs.c - inputs.a * inputs.a;
          if (b_squared >= 0) {
            const b = Math.sqrt(b_squared);
            results.b = SymbolicConverter.convertToExact(b, userSettings);
          }
        }
        if (inputs.b !== undefined && inputs.c !== undefined && inputs.a === undefined) {
          const a_squared = inputs.c * inputs.c - inputs.b * inputs.b;
          if (a_squared >= 0) {
            const a = Math.sqrt(a_squared);
            results.a = SymbolicConverter.convertToExact(a, userSettings);
          }
        }
        break;
    }

    return results;
  }

  // Complete physics solver - ALL variables solvable
  static solvePhysics(
    formula: string,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};

    switch (formula) {
      case "kinetic_energy":
        // KE = ½mv²
        if (inputs.m !== undefined && inputs.v !== undefined && inputs.KE === undefined) {
          const ke = 0.5 * inputs.m * inputs.v * inputs.v;
          results.KE = SymbolicConverter.convertToExact(ke, userSettings);
        }
        if (inputs.KE !== undefined && inputs.m !== undefined && inputs.v === undefined) {
          const v = Math.sqrt((2 * inputs.KE) / inputs.m);
          results.v = SymbolicConverter.convertToExact(v, userSettings);
        }
        if (inputs.KE !== undefined && inputs.v !== undefined && inputs.m === undefined) {
          const m = (2 * inputs.KE) / (inputs.v * inputs.v);
          results.m = SymbolicConverter.convertToExact(m, userSettings);
        }
        break;

      case "potential_energy":
        // PE = mgh
        if (inputs.m !== undefined && inputs.g !== undefined && inputs.h !== undefined && inputs.PE === undefined) {
          const pe = inputs.m * inputs.g * inputs.h;
          results.PE = SymbolicConverter.convertToExact(pe, userSettings);
        }
        if (inputs.PE !== undefined && inputs.m !== undefined && inputs.g !== undefined && inputs.h === undefined) {
          const h = inputs.PE / (inputs.m * inputs.g);
          results.h = SymbolicConverter.convertToExact(h, userSettings);
        }
        if (inputs.PE !== undefined && inputs.h !== undefined && inputs.g !== undefined && inputs.m === undefined) {
          const m = inputs.PE / (inputs.g * inputs.h);
          results.m = SymbolicConverter.convertToExact(m, userSettings);
        }
        if (inputs.PE !== undefined && inputs.m !== undefined && inputs.h !== undefined && inputs.g === undefined) {
          const g = inputs.PE / (inputs.m * inputs.h);
          results.g = SymbolicConverter.convertToExact(g, userSettings);
        }
        break;

      case "force":
        // F = ma
        if (inputs.m !== undefined && inputs.a !== undefined && inputs.F === undefined) {
          const force = inputs.m * inputs.a;
          results.F = SymbolicConverter.convertToExact(force, userSettings);
        }
        if (inputs.F !== undefined && inputs.m !== undefined && inputs.a === undefined) {
          const a = inputs.F / inputs.m;
          results.a = SymbolicConverter.convertToExact(a, userSettings);
        }
        if (inputs.F !== undefined && inputs.a !== undefined && inputs.m === undefined) {
          const m = inputs.F / inputs.a;
          results.m = SymbolicConverter.convertToExact(m, userSettings);
        }
        break;

      case "gravitational_force":
        // F = Gm₁m₂/r², g = Gm₁/r²
        if (inputs.G !== undefined && inputs.m1 !== undefined && inputs.m2 !== undefined && inputs.r !== undefined && inputs.F === undefined) {
          const force = (inputs.G * inputs.m1 * inputs.m2) / (inputs.r * inputs.r);
          results.F = SymbolicConverter.convertToExact(force, userSettings);
        }
        if (inputs.G !== undefined && inputs.m1 !== undefined && inputs.r !== undefined && inputs.g === undefined) {
          const g = (inputs.G * inputs.m1) / (inputs.r * inputs.r);
          results.g = SymbolicConverter.convertToExact(g, userSettings);
        }
        if (inputs.F !== undefined && inputs.G !== undefined && inputs.m1 !== undefined && inputs.m2 !== undefined && inputs.r === undefined) {
          const r = Math.sqrt((inputs.G * inputs.m1 * inputs.m2) / inputs.F);
          results.r = SymbolicConverter.convertToExact(r, userSettings);
        }
        if (inputs.F !== undefined && inputs.G !== undefined && inputs.m2 !== undefined && inputs.r !== undefined && inputs.m1 === undefined) {
          const m1 = (inputs.F * inputs.r * inputs.r) / (inputs.G * inputs.m2);
          results.m1 = SymbolicConverter.convertToExact(m1, userSettings);
        }
        if (inputs.F !== undefined && inputs.G !== undefined && inputs.m1 !== undefined && inputs.r !== undefined && inputs.m2 === undefined) {
          const m2 = (inputs.F * inputs.r * inputs.r) / (inputs.G * inputs.m1);
          results.m2 = SymbolicConverter.convertToExact(m2, userSettings);
        }
        break;

      case "specific_heat_capacity":
        // E = mcΔθ
        if (inputs.m !== undefined && inputs.c !== undefined && inputs.theta !== undefined && inputs.E === undefined) {
          const energy = inputs.m * inputs.c * inputs.theta;
          results.E = SymbolicConverter.convertToExact(energy, userSettings);
        }
        if (inputs.E !== undefined && inputs.m !== undefined && inputs.c !== undefined && inputs.theta === undefined) {
          const theta = inputs.E / (inputs.m * inputs.c);
          results.theta = SymbolicConverter.convertToExact(theta, userSettings);
        }
        if (inputs.E !== undefined && inputs.m !== undefined && inputs.theta !== undefined && inputs.c === undefined) {
          const c = inputs.E / (inputs.m * inputs.theta);
          results.c = SymbolicConverter.convertToExact(c, userSettings);
        }
        if (inputs.E !== undefined && inputs.c !== undefined && inputs.theta !== undefined && inputs.m === undefined) {
          const m = inputs.E / (inputs.c * inputs.theta);
          results.m = SymbolicConverter.convertToExact(m, userSettings);
        }
        break;
    }

    return results;
  }

  // Complete trigonometry solver
  static solveTrigonometry(
    formula: string,
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};
    
    switch (formula) {
      case 'sine_rule':
        return this.solveSineRule(inputs, userSettings);
      case 'cosine_rule':
        return this.solveCosineRule(inputs, userSettings);
      case 'unit_circle':
        return this.solveUnitCircle(inputs, userSettings);
      default:
        return results;
    }
  }

  // Complete sine rule solver - ALL missing variables
  static solveSineRule(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { a, b, c, A, B, C } = inputs;
    const results: SolverResult = {};

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // Find all possible missing variables using sine rule: a/sin(A) = b/sin(B) = c/sin(C)
    
    // If we have a side and its opposite angle, we can find other sides/angles
    if (a !== undefined && A !== undefined) {
      const ratio = a / Math.sin(toRadians(A));
      
      if (B !== undefined && b === undefined) {
        const calc_b = ratio * Math.sin(toRadians(B));
        results.b = SymbolicConverter.convertToExact(calc_b, userSettings);
      }
      if (C !== undefined && c === undefined) {
        const calc_c = ratio * Math.sin(toRadians(C));
        results.c = SymbolicConverter.convertToExact(calc_c, userSettings);
      }
      if (b !== undefined && B === undefined) {
        const sinB = b / ratio;
        if (Math.abs(sinB) <= 1) {
          results.B = SymbolicConverter.convertToExact(toDegrees(Math.asin(sinB)), userSettings);
        }
      }
      if (c !== undefined && C === undefined) {
        const sinC = c / ratio;
        if (Math.abs(sinC) <= 1) {
          results.C = SymbolicConverter.convertToExact(toDegrees(Math.asin(sinC)), userSettings);
        }
      }
    }

    // Similar logic for other known side/angle pairs
    if (b !== undefined && B !== undefined) {
      const ratio = b / Math.sin(toRadians(B));
      
      if (A !== undefined && a === undefined) {
        const calc_a = ratio * Math.sin(toRadians(A));
        results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
      }
      if (C !== undefined && c === undefined) {
        const calc_c = ratio * Math.sin(toRadians(C));
        results.c = SymbolicConverter.convertToExact(calc_c, userSettings);
      }
      if (a !== undefined && A === undefined) {
        const sinA = a / ratio;
        if (Math.abs(sinA) <= 1) {
          results.A = SymbolicConverter.convertToExact(toDegrees(Math.asin(sinA)), userSettings);
        }
      }
      if (c !== undefined && C === undefined) {
        const sinC = c / ratio;
        if (Math.abs(sinC) <= 1) {
          results.C = SymbolicConverter.convertToExact(toDegrees(Math.asin(sinC)), userSettings);
        }
      }
    }

    if (c !== undefined && C !== undefined) {
      const ratio = c / Math.sin(toRadians(C));
      
      if (A !== undefined && a === undefined) {
        const calc_a = ratio * Math.sin(toRadians(A));
        results.a = SymbolicConverter.convertToExact(calc_a, userSettings);
      }
      if (B !== undefined && b === undefined) {
        const calc_b = ratio * Math.sin(toRadians(B));
        results.b = SymbolicConverter.convertToExact(calc_b, userSettings);
      }
      if (a !== undefined && A === undefined) {
        const sinA = a / ratio;
        if (Math.abs(sinA) <= 1) {
          results.A = SymbolicConverter.convertToExact(toDegrees(Math.asin(sinA)), userSettings);
        }
      }
      if (b !== undefined && B === undefined) {
        const sinB = b / ratio;
        if (Math.abs(sinB) <= 1) {
          results.B = SymbolicConverter.convertToExact(toDegrees(Math.asin(sinB)), userSettings);
        }
      }
    }

    return results;
  }

  // Complete cosine rule solver - ALL missing variables
  static solveCosineRule(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { a, b, c, A, B, C } = inputs;
    const results: SolverResult = {};

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // c² = a² + b² - 2ab*cos(C)
    if (a !== undefined && b !== undefined && C !== undefined && c === undefined) {
      const c_squared = a * a + b * b - 2 * a * b * Math.cos(toRadians(C));
      if (c_squared >= 0) {
        const side_c = Math.sqrt(c_squared);
        results.c = SymbolicConverter.convertToExact(side_c, userSettings);
      }
    }

    // a² = b² + c² - 2bc*cos(A)
    if (b !== undefined && c !== undefined && A !== undefined && a === undefined) {
      const a_squared = b * b + c * c - 2 * b * c * Math.cos(toRadians(A));
      if (a_squared >= 0) {
        const side_a = Math.sqrt(a_squared);
        results.a = SymbolicConverter.convertToExact(side_a, userSettings);
      }
    }

    // b² = a² + c² - 2ac*cos(B)
    if (a !== undefined && c !== undefined && B !== undefined && b === undefined) {
      const b_squared = a * a + c * c - 2 * a * c * Math.cos(toRadians(B));
      if (b_squared >= 0) {
        const side_b = Math.sqrt(b_squared);
        results.b = SymbolicConverter.convertToExact(side_b, userSettings);
      }
    }

    // Find angles using cosine rule
    if (a !== undefined && b !== undefined && c !== undefined && C === undefined) {
      const cos_C = (a * a + b * b - c * c) / (2 * a * b);
      if (Math.abs(cos_C) <= 1) {
        const angle_C = toDegrees(Math.acos(cos_C));
        results.C = SymbolicConverter.convertToExact(angle_C, userSettings);
      }
    }

    if (a !== undefined && b !== undefined && c !== undefined && A === undefined) {
      const cos_A = (b * b + c * c - a * a) / (2 * b * c);
      if (Math.abs(cos_A) <= 1) {
        const angle_A = toDegrees(Math.acos(cos_A));
        results.A = SymbolicConverter.convertToExact(angle_A, userSettings);
      }
    }

    if (a !== undefined && b !== undefined && c !== undefined && B === undefined) {
      const cos_B = (a * a + c * c - b * b) / (2 * a * c);
      if (Math.abs(cos_B) <= 1) {
        const angle_B = toDegrees(Math.acos(cos_B));
        results.B = SymbolicConverter.convertToExact(angle_B, userSettings);
      }
    }

    return results;
  }

  // Complete unit circle solver
  static solveUnitCircle(inputs: Record<string, number>, userSettings?: UserSettings): SolverResult {
    const { degrees, radians } = inputs;
    const results: SolverResult = {};

    let angle = degrees;
    if (angle === undefined && radians !== undefined) {
      angle = (radians * 180) / Math.PI;
    }
    
    if (angle === undefined) return results;

    // Convert to radians if needed
    if (radians === undefined && degrees !== undefined) {
      results.radians = SymbolicConverter.convertToExact((degrees * Math.PI) / 180, userSettings);
    }
    if (degrees === undefined && radians !== undefined) {
      results.degrees = SymbolicConverter.convertToExact((radians * 180) / Math.PI, userSettings);
    }

    // Exact values for common angles
    const exactValues: Record<number, { sin: string; cos: string; tan: string }> = {
      0: { sin: "0", cos: "1", tan: "0" },
      30: { sin: "\\frac{1}{2}", cos: "\\frac{\\sqrt{3}}{2}", tan: "\\frac{1}{\\sqrt{3}}" },
      45: { sin: "\\frac{\\sqrt{2}}{2}", cos: "\\frac{\\sqrt{2}}{2}", tan: "1" },
      60: { sin: "\\frac{\\sqrt{3}}{2}", cos: "\\frac{1}{2}", tan: "\\sqrt{3}" },
      90: { sin: "1", cos: "0", tan: "\\text{undefined}" },
      180: { sin: "0", cos: "-1", tan: "0" },
      270: { sin: "-1", cos: "0", tan: "\\text{undefined}" },
      360: { sin: "0", cos: "1", tan: "0" },
    };

    const normalizedAngle = ((angle % 360) + 360) % 360;
    
    if (exactValues[normalizedAngle]) {
      const exact = exactValues[normalizedAngle];
      results.sin_theta = {
        type: "expression",
        decimal: Math.sin((angle * Math.PI) / 180),
        latex: exact.sin,
        simplified: true,
      };
      results.cos_theta = {
        type: "expression",
        decimal: Math.cos((angle * Math.PI) / 180),
        latex: exact.cos,
        simplified: true,
      };
      results.tan_theta = {
        type: "expression",
        decimal: Math.tan((angle * Math.PI) / 180),
        latex: exact.tan,
        simplified: true,
      };
    } else {
      // Decimal approximations for non-standard angles
      results.sin_theta = SymbolicConverter.convertToExact(Math.sin((angle * Math.PI) / 180), userSettings);
      results.cos_theta = SymbolicConverter.convertToExact(Math.cos((angle * Math.PI) / 180), userSettings);
      results.tan_theta = SymbolicConverter.convertToExact(Math.tan((angle * Math.PI) / 180), userSettings);
    }

    return results;
  }

  // Complete statistics solver
  static solveStatistics(
    formula: string,
    inputs: Record<string, number | number[]>,
    userSettings?: UserSettings
  ): SolverResult {
    const results: SolverResult = {};
    
    switch (formula) {
      case 'standard_deviation':
        return this.solveStandardDeviation(inputs, userSettings);
      case 'mean':
        return this.solveMean(inputs, userSettings);
      case 'variance':
        return this.solveVariance(inputs, userSettings);
      default:
        return results;
    }
  }

  // Complete standard deviation solver with proper type checking
  static solveStandardDeviation(inputs: Record<string, number | number[]>, userSettings?: UserSettings): SolverResult {
    const results: SolverResult = {};

    // Extract and type-check inputs
    const data = inputs.data;
    const mean = typeof inputs.mean === 'number' ? inputs.mean : undefined;
    const variance = typeof inputs.variance === 'number' ? inputs.variance : undefined;
    const standard_deviation = typeof inputs.standard_deviation === 'number' ? inputs.standard_deviation : undefined;
    const n = typeof inputs.n === 'number' ? inputs.n : undefined;
    const sum = typeof inputs.sum === 'number' ? inputs.sum : undefined;
    const sum_x2 = typeof inputs.sum_x2 === 'number' ? inputs.sum_x2 : undefined;

    // If we have the raw data, calculate everything
    if (data && Array.isArray(data)) {
      const count = data.length;
      const sum_val = data.reduce((acc, val) => acc + val, 0);
      const calc_mean = sum_val / count;
      
      const sumSquares = data.reduce((acc, val) => acc + val * val, 0);
      const calc_variance = (sumSquares / count) - (calc_mean * calc_mean);
      const calc_std = Math.sqrt(calc_variance);
      
      results.mean = SymbolicConverter.convertToExact(calc_mean, userSettings);
      results.variance = SymbolicConverter.convertToExact(calc_variance, userSettings);
      results.standard_deviation = SymbolicConverter.convertToExact(calc_std, userSettings);
      results.n = SymbolicConverter.convertToExact(count, userSettings);
      results.sum = SymbolicConverter.convertToExact(sum_val, userSettings);
      results.sum_x2 = SymbolicConverter.convertToExact(sumSquares, userSettings);
    }
    
    // If we have variance, calculate standard deviation
    if (variance !== undefined && standard_deviation === undefined) {
      const calc_std = Math.sqrt(variance);
      results.standard_deviation = SymbolicConverter.convertToExact(calc_std, userSettings);
    }
    
    // If we have standard deviation, calculate variance
    if (standard_deviation !== undefined && variance === undefined) {
      const calc_variance = standard_deviation * standard_deviation;
      results.variance = SymbolicConverter.convertToExact(calc_variance, userSettings);
    }

    return results;
  }

  // Complete mean solver with proper type checking
  static solveMean(inputs: Record<string, number | number[]>, userSettings?: UserSettings): SolverResult {
    const results: SolverResult = {};

    // Extract and type-check inputs
    const data = inputs.data;
    const sum = typeof inputs.sum === 'number' ? inputs.sum : undefined;
    const n = typeof inputs.n === 'number' ? inputs.n : undefined;
    const mean = typeof inputs.mean === 'number' ? inputs.mean : undefined;

    if (data && Array.isArray(data)) {
      const calc_sum = data.reduce((acc, val) => acc + val, 0);
      const calc_mean = calc_sum / data.length;
      
      results.mean = SymbolicConverter.convertToExact(calc_mean, userSettings);
      results.sum = SymbolicConverter.convertToExact(calc_sum, userSettings);
      results.n = SymbolicConverter.convertToExact(data.length, userSettings);
    } else if (sum !== undefined && n !== undefined) {
      const calc_mean = sum / n;
      results.mean = SymbolicConverter.convertToExact(calc_mean, userSettings);
    } else if (mean !== undefined && n !== undefined && sum === undefined) {
      const calc_sum = mean * n;
      results.sum = SymbolicConverter.convertToExact(calc_sum, userSettings);
    } else if (mean !== undefined && sum !== undefined && n === undefined) {
      const calc_n = sum / mean;
      results.n = SymbolicConverter.convertToExact(calc_n, userSettings);
    }

    return results;
  }

  // Complete variance solver with proper type checking
  static solveVariance(inputs: Record<string, number | number[]>, userSettings?: UserSettings): SolverResult {
    const results: SolverResult = {};

    // Extract and type-check inputs
    const data = inputs.data;
    const mean = typeof inputs.mean === 'number' ? inputs.mean : undefined;
    const variance = typeof inputs.variance === 'number' ? inputs.variance : undefined;
    const standard_deviation = typeof inputs.standard_deviation === 'number' ? inputs.standard_deviation : undefined;

    if (data && Array.isArray(data)) {
      const n = data.length;
      const sum = data.reduce((acc, val) => acc + val, 0);
      const calc_mean = sum / n;
      
      const sumSquares = data.reduce((acc, val) => acc + val * val, 0);
      const calc_variance = (sumSquares / n) - (calc_mean * calc_mean);
      
      results.variance = SymbolicConverter.convertToExact(calc_variance, userSettings);
      results.mean = SymbolicConverter.convertToExact(calc_mean, userSettings);
      results.standard_deviation = SymbolicConverter.convertToExact(Math.sqrt(calc_variance), userSettings);
    } else if (standard_deviation !== undefined && variance === undefined) {
      const calc_variance = standard_deviation * standard_deviation;
      results.variance = SymbolicConverter.convertToExact(calc_variance, userSettings);
    } else if (variance !== undefined && standard_deviation === undefined) {
      const calc_std = Math.sqrt(variance);
      results.standard_deviation = SymbolicConverter.convertToExact(calc_std, userSettings);
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

  private static evaluateFormula(formula: string, values: Record<string, number>): number {
    let expr = formula;

    // Replace variables with their values
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, "g"), value.toString());
      }
    });

    // Replace mathematical functions
    expr = expr.replace(/pow\(/g, 'Math.pow(');

    // Check if any variables are still unresolved
    if (/[a-zA-Z]/.test(expr.replace(/sin|cos|tan|sqrt|log|pi|e|Math|pow/g, ""))) {
      throw new Error("Missing values for some variables");
    }

    return evaluate(expr);
  }
}