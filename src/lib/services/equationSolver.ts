// src/lib/services/equationSolver.ts
import { EnhancedSolver } from "../enhancedSolver";
import { ExactNumber } from "@/types/exactNumber";
import { UserSettings } from "@/lib/contexts/SettingsContext";

export interface DatabaseEquation {
  id: string;
  name: string;
  category: string;
  latex: string;
  description: string;
  variables: Array<{
    name: string;
    symbol: string;
    unit: string;
  }>;
  solver_type: string;
  solver_config: any;
  examples: any[];
}

export class EquationSolverService {
  static solveEquation(
    equation: DatabaseEquation,
    inputs: Record<string, number | number[]>,
    userSettings?: UserSettings
  ): Record<string, ExactNumber> {
    try {
      switch (equation.solver_type) {
        case "linear":
          // For linear equations, we need only numbers
          const numericInputs = this.filterNumericInputs(inputs);
          return EnhancedSolver.solveLinear(
            equation.solver_config?.relationships || {},
            numericInputs,
            userSettings
          );

        case "quadratic":
          return EnhancedSolver.solveQuadratic(
            this.filterNumericInputs(inputs),
            userSettings
          );

        case "cubic":
          return EnhancedSolver.solveCubic(
            this.filterNumericInputs(inputs),
            userSettings
          );

        case "geometric":
          return EnhancedSolver.solveGeometric(
            equation.solver_config?.formula || "generic",
            this.filterNumericInputs(inputs),
            userSettings
          );

        case "physics":
          return EnhancedSolver.solvePhysics(
            equation.solver_config?.formula || "generic",
            this.filterNumericInputs(inputs),
            userSettings
          );

        case "suvat":
          return EnhancedSolver.solveSUVAT(
            this.filterNumericInputs(inputs),
            userSettings
          );

        case "trigonometry":
          return EnhancedSolver.solveTrigonometry(
            equation.solver_config?.formula || "generic",
            this.filterNumericInputs(inputs),
            userSettings
          );

        case "statistics":
          // Statistics can handle both numbers and arrays
          return EnhancedSolver.solveStatistics(
            equation.solver_config?.formula || "generic",
            inputs,
            userSettings
          );

        default:
          console.warn(`Unknown solver type: ${equation.solver_type}`);
          return {};
      }
    } catch (error) {
      console.error("Error solving equation:", error);
      return {};
    }
  }
  // Helper method to filter out non-numeric inputs
  private static filterNumericInputs(
    inputs: Record<string, number | number[]>
  ): Record<string, number> {
    const numericInputs: Record<string, number> = {};

    for (const [key, value] of Object.entries(inputs)) {
      if (typeof value === "number") {
        numericInputs[key] = value;
      }
    }

    return numericInputs;
  }
}
