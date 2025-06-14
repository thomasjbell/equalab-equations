import { evaluate, parse, simplify } from 'mathjs';
import { SymbolicEquation } from '@/types/enhancedEquation';

export class EquationSolver {
  static createSolveFunction(equation: SymbolicEquation) {
    return (values: Record<string, number>): Record<string, number> => {
      const result: Record<string, number> = {};
      
      // Get all variables and find which ones are missing
      const allVars = equation.variables.map(v => v.symbol);
      const providedVars = Object.keys(values).filter(k => values[k] !== undefined);
      const missingVars = allVars.filter(v => !providedVars.includes(v));
      
      // For simple equations, try algebraic manipulation
      if (missingVars.length === 1) {
        const targetVar = missingVars[0];
        try {
          const solution = this.solveForVariable(equation.equation, targetVar, values);
          if (solution !== null) {
            result[targetVar] = solution;
          }
        } catch (error) {
          console.warn(`Could not solve for ${targetVar}:`, error);
        }
      }
      
      return result;
    };
  }
  
  private static solveForVariable(
    equation: string, 
    targetVar: string, 
    values: Record<string, number>
  ): number | null {
    try {
      // Split equation by equals sign
      const [leftSide, rightSide] = equation.split('=').map(s => s.trim());
      
      // Substitute known values
      let left = leftSide;
      let right = rightSide;
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          left = left.replace(regex, value.toString());
          right = right.replace(regex, value.toString());
        }
      });
      
      // Simple algebraic manipulation for common patterns
      if (left === targetVar) {
        return evaluate(right);
      } else if (right === targetVar) {
        return evaluate(left);
      }
      
      // Handle simple multiplication/division patterns
      return this.handleSimpleAlgebra(left, right, targetVar);
      
    } catch (error) {
      console.warn('Error in symbolic solving:', error);
      return null;
    }
  }
  
  private static handleSimpleAlgebra(left: string, right: string, targetVar: string): number | null {
    try {
      // Pattern: a * x = b -> x = b / a
      if (left.includes('*') && left.includes(targetVar)) {
        const parts = left.split('*').map(p => p.trim());
        const otherPart = parts.find(p => p !== targetVar);
        if (otherPart) {
          return evaluate(right) / evaluate(otherPart);
        }
      }
      
      // Pattern: a / x = b -> x = a / b
      if (left.includes('/') && left.includes(targetVar)) {
        const parts = left.split('/').map(p => p.trim());
        if (parts[1] === targetVar) {
          return evaluate(parts[0]) / evaluate(right);
        }
      }
      
      // Pattern: x + a = b -> x = b - a
      if (left.includes('+') && left.includes(targetVar)) {
        const parts = left.split('+').map(p => p.trim());
        const otherPart = parts.find(p => p !== targetVar);
        if (otherPart) {
          return evaluate(right) - evaluate(otherPart);
        }
      }
      
      // Pattern: x - a = b -> x = b + a
      if (left.includes('-') && left.includes(targetVar)) {
        const parts = left.split('-').map(p => p.trim());
        const otherPart = parts.find(p => p !== targetVar);
        if (otherPart && parts[0] === targetVar) {
          return evaluate(right) + evaluate(otherPart);
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }
}