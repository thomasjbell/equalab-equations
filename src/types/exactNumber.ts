export type ExactNumberType = 'decimal' | 'fraction' | 'surd' | 'expression' | 'integer';

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface Surd {
  coefficient: number;
  radicand: number;
}

export interface Expression {
  rational: Fraction;
  irrational: Surd[];
}

export interface ExactNumber {
  type: ExactNumberType;
  decimal: number;
  exact?: Fraction | Surd | Expression | number;
  latex: string;
  simplified: boolean;
}

export interface SolverResult {
  [variable: string]: ExactNumber;
}