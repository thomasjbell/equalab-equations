import { Equation, EquationSolverResult } from '@/types/equation';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const calculusEquations: Equation[] = [
  {
    id: 'free-form-calculus',
    name: 'Differentiate / Integrate',
    category: 'Mathematics',
    subcategory: 'Calculus',
    latex: '\\frac{d}{dx}f(x) \\quad \\text{or} \\quad \\int_a^b f(x)\\,dx',
    description: 'Type any expression to differentiate or integrate — supports polynomials, trig, exponentials and more',
    solverType: 'calculus',
    freeForm: true,
    variables: [],
    solve: () => ({}),
    tags: ['differentiation', 'integration', 'calculus', 'freeform'],
    level: 'alevel',
  },
  {
    id: 'power-rule-derivative',
    name: 'Power Rule (Differentiation)',
    category: 'Mathematics',
    subcategory: 'Calculus',
    latex: '\\frac{d}{dx}(x^n) = nx^{n-1}',
    description: 'Derivative of a power function — enter n and optionally x to evaluate at a point',
    solverType: 'calculus',
    variables: [
      { name: 'Exponent n', symbol: 'n', unit: '' },
      { name: 'Point x', symbol: 'x', unit: '' },
      { name: "Derivative f'(x)", symbol: 'deriv', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { n, x } = inputs;
      const results: EquationSolverResult = {};
      if (n !== undefined && x !== undefined) {
        const val = n * Math.pow(x, n - 1);
        results.deriv = { value: SymbolicConverter.convertToExact(val, settings), validity: 'valid' };
      } else if (n !== undefined) {
        results.deriv = { value: { type: 'expression', decimal: NaN, latex: `${n}x^{${n - 1}}`, simplified: true }, validity: 'valid' };
      }
      return results;
    },
    examples: [
      { input: { n: 3, x: 2 }, description: 'd/dx(x³) at x=2 = 12' },
      { input: { n: 2 }, description: 'd/dx(x²) = 2x' },
    ],
    tags: ['power rule', 'differentiation', 'calculus', 'derivative'],
    level: 'alevel',
  },
  {
    id: 'power-rule-integral',
    name: 'Power Rule (Integration)',
    category: 'Mathematics',
    subcategory: 'Calculus',
    latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
    description: 'Indefinite integral of a power function — also evaluates definite integrals',
    solverType: 'calculus',
    variables: [
      { name: 'Exponent n', symbol: 'n', unit: '' },
      { name: 'Lower Bound a', symbol: 'a', unit: '' },
      { name: 'Upper Bound b', symbol: 'b', unit: '' },
      { name: 'Definite Integral', symbol: 'integral', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { n, a, b } = inputs;
      const results: EquationSolverResult = {};
      if (n !== undefined && n === -1) {
        results.integral = { value: { type: 'expression', decimal: NaN, latex: '\\ln|x| + C', simplified: true }, validity: 'warning', validityReason: 'Use ln|x| + C for n = -1' };
        return results;
      }
      if (n !== undefined && a !== undefined && b !== undefined) {
        const val = (Math.pow(b, n + 1) - Math.pow(a, n + 1)) / (n + 1);
        results.integral = { value: SymbolicConverter.convertToExact(val, settings), validity: 'valid' };
      } else if (n !== undefined) {
        const exp = n + 1;
        results.integral = { value: { type: 'expression', decimal: NaN, latex: `\\frac{x^{${exp}}}{${exp}} + C`, simplified: true }, validity: 'valid' };
      }
      return results;
    },
    examples: [
      { input: { n: 2, a: 0, b: 3 }, description: '∫₀³ x² dx = 9' },
      { input: { n: 3 }, description: '∫x³ dx = x⁴/4 + C' },
    ],
    tags: ['power rule', 'integration', 'calculus', 'integral'],
    level: 'alevel',
  },
  {
    id: 'chain-rule',
    name: 'Chain Rule',
    category: 'Mathematics',
    subcategory: 'Calculus',
    latex: '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}',
    description: 'Reference formula: derivative of a composite function',
    solverType: 'calculus',
    variables: [
      { name: 'dy/dx', symbol: 'dydx', unit: '' },
      { name: 'dy/du', symbol: 'dydu', unit: '' },
      { name: 'du/dx', symbol: 'dudx', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { dydx, dydu, dudx } = inputs;
      const results: EquationSolverResult = {};
      if (dydu !== undefined && dudx !== undefined && dydx === undefined)
        results.dydx = { value: SymbolicConverter.convertToExact(dydu * dudx, settings), validity: 'valid' };
      if (dydx !== undefined && dudx !== undefined && dydu === undefined && dudx !== 0)
        results.dydu = { value: SymbolicConverter.convertToExact(dydx / dudx, settings), validity: 'valid' };
      if (dydx !== undefined && dydu !== undefined && dudx === undefined && dydu !== 0)
        results.dudx = { value: SymbolicConverter.convertToExact(dydx / dydu, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { dydu: 3, dudx: 4 }, description: 'dy/dx = 12' }],
    tags: ['chain rule', 'differentiation', 'calculus'],
    level: 'alevel',
  },
  {
    id: 'product-rule',
    name: 'Product Rule',
    category: 'Mathematics',
    subcategory: 'Calculus',
    latex: '\\frac{d}{dx}[uv] = u\\frac{dv}{dx} + v\\frac{du}{dx}',
    description: 'Reference formula: derivative of a product of two functions',
    solverType: 'calculus',
    variables: [
      { name: 'u (value)', symbol: 'u', unit: '' },
      { name: "u' (derivative of u)", symbol: 'du', unit: '' },
      { name: 'v (value)', symbol: 'v', unit: '' },
      { name: "v' (derivative of v)", symbol: 'dv', unit: '' },
      { name: "d(uv)/dx", symbol: 'd_uv', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { u, du, v, dv } = inputs;
      const results: EquationSolverResult = {};
      if (u !== undefined && dv !== undefined && v !== undefined && du !== undefined)
        results.d_uv = { value: SymbolicConverter.convertToExact(u * dv + v * du, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { u: 2, du: 3, v: 5, dv: 4 }, description: 'At point x: d(uv)/dx = 2×4 + 5×3 = 23' }],
    tags: ['product rule', 'differentiation', 'calculus'],
    level: 'alevel',
  },
  {
    id: 'quotient-rule',
    name: 'Quotient Rule',
    category: 'Mathematics',
    subcategory: 'Calculus',
    latex: "\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}",
    description: 'Reference formula: derivative of a quotient of two functions',
    solverType: 'calculus',
    variables: [
      { name: 'u (value)', symbol: 'u', unit: '' },
      { name: "u' (derivative of u)", symbol: 'du', unit: '' },
      { name: 'v (value)', symbol: 'v', unit: '' },
      { name: "v' (derivative of v)", symbol: 'dv', unit: '' },
      { name: 'd(u/v)/dx', symbol: 'd_quot', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { u, du, v, dv } = inputs;
      const results: EquationSolverResult = {};
      if (u !== undefined && du !== undefined && v !== undefined && dv !== undefined && v !== 0)
        results.d_quot = { value: SymbolicConverter.convertToExact((v * du - u * dv) / (v * v), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { u: 2, du: 1, v: 3, dv: 2 }, description: 'At point x: d(u/v)/dx = (3×1 - 2×2)/9 = -1/9' }],
    tags: ['quotient rule', 'differentiation', 'calculus'],
    level: 'alevel',
  },
];
