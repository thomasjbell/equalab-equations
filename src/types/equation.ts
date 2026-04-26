import { ExactNumber } from './exactNumber';
import { UserSettings } from '@/lib/contexts/SettingsContext';

export interface Variable {
  name: string;
  symbol: string;
  unit: string;
}

export interface UnitReference {
  symbol: string;
  allowAlternatives?: string[];
}

export interface EquationVariable {
  name: string;
  symbol: string;
  unit: UnitReference | string;
  description?: string;
  constraints?: {
    positive?: boolean;
    nonNegative?: boolean;
    nonZero?: boolean;
  };
}

export interface AnnotatedResult {
  value: ExactNumber;
  validity: 'valid' | 'warning' | 'invalid';
  validityReason?: string;
}

export type EquationSolverResult = Record<string, AnnotatedResult | AnnotatedResult[]>;

export type SolverType =
  | 'linear'
  | 'quadratic'
  | 'cubic'
  | 'geometric'
  | 'physics'
  | 'suvat'
  | 'trigonometry'
  | 'statistics'
  | 'chemistry'
  | 'calculus'
  | 'custom';

export interface Equation {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  latex: string;
  description: string;
  variables: EquationVariable[];
  solverType: SolverType;
  solve: (inputs: Record<string, number>, settings?: UserSettings) => EquationSolverResult;
  examples?: Array<{
    input: Record<string, number>;
    description?: string;
  }>;
  tags?: string[];
  level?: 'gcse' | 'alevel' | 'degree';
  angleMode?: 'degrees' | 'radians' | 'both';
  freeForm?: boolean;
}

export interface EquationCardProps {
  equation: Equation;
  isExpanded: boolean;
  onToggle: () => void;
}

export function wrapResult(value: ExactNumber): AnnotatedResult {
  return { value, validity: 'valid' };
}

export function wrapResults(results: Record<string, ExactNumber>): EquationSolverResult {
  const wrapped: EquationSolverResult = {};
  for (const [key, val] of Object.entries(results)) {
    if (!isFinite(val.decimal) || isNaN(val.decimal)) {
      wrapped[key] = { value: val, validity: 'invalid', validityReason: isNaN(val.decimal) ? 'No real solution' : 'Result is undefined' };
    } else if (val.decimal < 0 && (key === 'r' || key === 'A' || key === 'V' || key === 'h' || key === 'mass' || key === 'm')) {
      wrapped[key] = { value: val, validity: 'invalid', validityReason: 'Value cannot be negative' };
    } else {
      wrapped[key] = { value: val, validity: 'valid' };
    }
  }
  return wrapped;
}
