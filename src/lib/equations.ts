import { Equation } from '@/types/equation';

export const equations: Equation[] = [
  {
    id: 'quadratic-formula',
    name: 'Quadratic Formula',
    category: 'Algebra',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solves quadratic equations of the form ax² + bx + c = 0',
    variables: [
      { name: 'a', symbol: 'a', unit: '' },
      { name: 'b', symbol: 'b', unit: '' },
      { name: 'c', symbol: 'c', unit: '' },
      { name: 'x₁', symbol: 'x_1', unit: '' },
      { name: 'x₂', symbol: 'x_2', unit: '' },
    ],
    solve: (values) => {
      const { a, b, c } = values;
      if (a && b !== undefined && c !== undefined) {
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          return { x_1: x1, x_2: x2 };
        }
      }
      return {};
    },
  },
  {
    id: 'distance-formula',
    name: 'Distance Formula',
    category: 'Geometry',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    description: 'Calculates distance between two points',
    variables: [
      { name: 'x₁', symbol: 'x_1', unit: '' },
      { name: 'y₁', symbol: 'y_1', unit: '' },
      { name: 'x₂', symbol: 'x_2', unit: '' },
      { name: 'y₂', symbol: 'y_2', unit: '' },
      { name: 'd', symbol: 'd', unit: '' },
    ],
    solve: (values) => {
      const { x_1, y_1, x_2, y_2 } = values;
      if (x_1 !== undefined && y_1 !== undefined && x_2 !== undefined && y_2 !== undefined) {
        const d = Math.sqrt(Math.pow(x_2 - x_1, 2) + Math.pow(y_2 - y_1, 2));
        return { d };
      }
      return {};
    },
  },
  {
    id: 'ohms-law',
    name: "Ohm's Law",
    category: 'Physics',
    latex: 'V = I \\cdot R',
    description: 'Relationship between voltage, current, and resistance',
    variables: [
      { name: 'V', symbol: 'V', unit: 'V' },
      { name: 'I', symbol: 'I', unit: 'A' },
      { name: 'R', symbol: 'R', unit: 'Ω' },
    ],
    solve: (values) => {
      const { V, I, R } = values;
      const result: Record<string, number> = {};
      
      if (I && R && !V) result.V = I * R;
      if (V && R && !I) result.I = V / R;
      if (V && I && !R) result.R = V / I;
      
      return result;
    },
  },
  {
    id: 'kinematic-equation',
    name: 'Kinematic Equation',
    category: 'Physics',
    latex: 'v_f = v_i + at',
    description: 'Final velocity with constant acceleration',
    variables: [
      { name: 'vf', symbol: 'v_f', unit: 'm/s' },
      { name: 'vi', symbol: 'v_i', unit: 'm/s' },
      { name: 'a', symbol: 'a', unit: 'm/s²' },
      { name: 't', symbol: 't', unit: 's' },
    ],
    solve: (values) => {
      const { v_f, v_i, a, t } = values;
      const result: Record<string, number> = {};
      
      if (v_i !== undefined && a !== undefined && t !== undefined && v_f === undefined) {
        result.v_f = v_i + a * t;
      }
      if (v_f !== undefined && a !== undefined && t !== undefined && v_i === undefined) {
        result.v_i = v_f - a * t;
      }
      if (v_f !== undefined && v_i !== undefined && t !== undefined && a === undefined) {
        result.a = (v_f - v_i) / t;
      }
      if (v_f !== undefined && v_i !== undefined && a !== undefined && t === undefined) {
        result.t = (v_f - v_i) / a;
      }
      
      return result;
    },
  },
  {
    id: 'area-circle',
    name: 'Area of Circle',
    category: 'Geometry',
    latex: 'A = \\pi r^2',
    description: 'Area of a circle given radius',
    variables: [
      { name: 'A', symbol: 'A', unit: 'units²' },
      { name: 'r', symbol: 'r', unit: 'units' },
    ],
    solve: (values) => {
      const { A, r } = values;
      const result: Record<string, number> = {};
      
      if (r && !A) result.A = Math.PI * r * r;
      if (A && !r) result.r = Math.sqrt(A / Math.PI);
      
      return result;
    },
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    category: 'Finance',
    latex: 'A = P(1 + \\frac{r}{n})^{nt}',
    description: 'Compound interest calculation',
    variables: [
      { name: 'A', symbol: 'A', unit: '$' },
      { name: 'P', symbol: 'P', unit: '$' },
      { name: 'r', symbol: 'r', unit: '' },
      { name: 'n', symbol: 'n', unit: '' },
      { name: 't', symbol: 't', unit: 'years' },
    ],
    solve: (values) => {
      const { A, P, r, n, t } = values;
      const result: Record<string, number> = {};
      
      if (P && r && n && t && !A) {
        result.A = P * Math.pow(1 + r / n, n * t);
      }
      
      return result;
    },
  },
];