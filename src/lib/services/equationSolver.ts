import { EnhancedSolver } from '../enhancedSolver';
import { ExactNumber } from '@/types/exactNumber';
import { UserSettings } from '@/lib/contexts/SettingsContext';

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
    inputs: Record<string, number>,
    userSettings?: UserSettings
  ): Record<string, ExactNumber> {
    switch (equation.solver_type) {
      case 'linear':
        return EnhancedSolver.solveLinear(equation.solver_config || {}, inputs, userSettings);
      
      case 'quadratic':
        return EnhancedSolver.solveQuadratic(inputs, userSettings);
      
      case 'cubic':
        return EnhancedSolver.solveCubic(inputs, userSettings);
      
      case 'geometric':
        return EnhancedSolver.solveGeometric(equation.solver_config || 'generic', inputs, userSettings);
      
      case 'physics':
        return EnhancedSolver.solvePhysics(equation.solver_config || 'generic', inputs, userSettings);
      
      case 'suvat':
        return EnhancedSolver.solveSUVAT(inputs, userSettings);
      
      default:
        console.warn(`Unknown solver type: ${equation.solver_type}`);
        return {};
    }
  }
}