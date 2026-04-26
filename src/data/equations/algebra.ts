import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

function formatComplex(re: number, im: number, sign: 1 | -1): string {
  const imVal = sign * im;
  const reStr = re === 0 ? '' : `${re}`;
  const imAbs = Math.abs(imVal);
  const imStr = imAbs === 1 ? 'i' : `${imAbs}i`;
  if (re === 0) return `${imVal < 0 ? '-' : ''}${imStr}`;
  return `${reStr} ${imVal < 0 ? '-' : '+'} ${imStr}`;
}

export const algebraEquations: Equation[] = [
  {
    id: 'quadratic-formula',
    name: 'Quadratic Formula',
    category: 'Algebra',
    latex: 'ax^2 + bx + c = 0 \\Rightarrow x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solves quadratic equations with exact symbolic results including surds, fractions, and complex roots',
    solverType: 'quadratic',
    variables: [
      { name: 'Coefficient a', symbol: 'a', unit: '' },
      { name: 'Coefficient b', symbol: 'b', unit: '' },
      { name: 'Coefficient c', symbol: 'c', unit: '' },
      { name: 'Discriminant', symbol: 'discriminant', unit: '' },
      { name: 'Solution x₁', symbol: 'x_1', unit: '' },
      { name: 'Solution x₂', symbol: 'x_2', unit: '' },
    ],
    solve: (inputs, settings) => {
      const raw = EnhancedSolver.solveQuadratic(inputs, settings);
      const results: EquationSolverResult = {};
      for (const [k, v] of Object.entries(raw)) {
        if (k === 'discriminant') {
          results[k] = { value: v, validity: v.decimal < 0 ? 'invalid' : 'valid', validityReason: v.decimal < 0 ? 'No real solutions' : undefined };
        } else {
          results[k] = { value: v, validity: 'valid' };
        }
      }
      if (inputs.a !== undefined && inputs.b !== undefined && inputs.c !== undefined) {
        const disc = inputs.b * inputs.b - 4 * inputs.a * inputs.c;
        if (disc < 0) {
          const re = -inputs.b / (2 * inputs.a);
          const im = Math.sqrt(-disc) / (2 * inputs.a);
          if (settings?.number_mode === 'complex') {
            const makeComplex = (sign: 1 | -1) => ({
              value: { type: 'expression' as const, decimal: NaN, latex: formatComplex(re, im, sign), simplified: true },
              validity: 'valid' as const,
            });
            results.x_1 = makeComplex(1);
            results.x_2 = makeComplex(-1);
          } else {
            const makeInvalid = (sign: 1 | -1) => ({
              value: { type: 'expression' as const, decimal: NaN, latex: formatComplex(re, im, sign), simplified: true },
              validity: 'invalid' as const,
              validityReason: 'Complex root — enable complex mode in Settings',
            });
            results.x_1 = makeInvalid(1);
            results.x_2 = makeInvalid(-1);
          }
        }
      }
      return results;
    },
    examples: [
      { input: { a: 1, b: 0, c: -2 }, description: 'x² - 2 = 0 → x = ±√2' },
      { input: { a: 2, b: 3, c: 1 }, description: '2x² + 3x + 1 = 0 → x = -½, -1' },
      { input: { a: 1, b: 0, c: 1 }, description: 'x² + 1 = 0 → x = ±i (complex mode)' },
    ],
    tags: ['quadratic', 'algebra', 'polynomial', 'roots', 'complex'],
    level: 'gcse',
  },
  {
    id: 'cubic-general',
    name: 'General Cubic Equation',
    category: 'Algebra',
    latex: 'ax^3 + bx^2 + cx + d = 0',
    description: 'Solve cubic equations using Cardano\'s formula',
    solverType: 'cubic',
    variables: [
      { name: 'Coefficient a', symbol: 'a', unit: '' },
      { name: 'Coefficient b', symbol: 'b', unit: '' },
      { name: 'Coefficient c', symbol: 'c', unit: '' },
      { name: 'Coefficient d', symbol: 'd', unit: '' },
      { name: 'Discriminant', symbol: 'discriminant', unit: '' },
      { name: 'Solution x₁', symbol: 'x_1', unit: '' },
      { name: 'Solution x₂', symbol: 'x_2', unit: '' },
      { name: 'Solution x₃', symbol: 'x_3', unit: '' },
    ],
    solve: (inputs, settings) => {
      const raw = EnhancedSolver.solveCubic(inputs, settings);
      const results: EquationSolverResult = {};
      for (const [k, v] of Object.entries(raw)) {
        if (!isFinite(v.decimal) || isNaN(v.decimal)) {
          const isComplex = v.latex?.includes('i') || false;
          if (isComplex && settings?.number_mode === 'complex') {
            results[k] = { value: v, validity: 'valid' };
          } else if (isComplex) {
            results[k] = { value: v, validity: 'invalid', validityReason: 'Complex root — enable complex mode in Settings' };
          } else {
            results[k] = { value: v, validity: 'invalid', validityReason: 'No real solution' };
          }
        } else {
          results[k] = { value: v, validity: 'valid' };
        }
      }
      return results;
    },
    examples: [
      { input: { a: 1, b: 0, c: 0, d: -8 }, description: 'x³ - 8 = 0 → x = 2' },
      { input: { a: 1, b: -6, c: 11, d: -6 }, description: 'x³ - 6x² + 11x - 6 = 0 → x = 1, 2, 3' },
    ],
    tags: ['cubic', 'algebra', 'polynomial', 'cardano'],
    level: 'alevel',
  },
];
