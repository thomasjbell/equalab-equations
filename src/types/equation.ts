// types/equation.ts
export interface Variable {
  name: string;
  symbol: string;
  unit: string;
}

export interface Equation {
  id: string;
  name: string;
  category: string;
  latex: string;
  description: string;
  variables: Variable[];
  solve: (values: Record<string, number>) => Record<string, number>;
}

export interface EquationCardProps {
  equation: Equation;
  isExpanded: boolean;
  onToggle: () => void;
}