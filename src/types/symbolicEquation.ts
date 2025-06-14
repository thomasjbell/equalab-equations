import { Variable } from './equation';
import { SolverResult } from './exactNumber';

export interface SymbolicEquation {
  id: string;
  name: string;
  category: string;
  latex: string;
  description: string;
  variables: Variable[];
  solve: (inputs: Record<string, number>) => SolverResult;
  examples?: {
    input: Record<string, number>;
    expectedOutput: SolverResult;
  }[];
}