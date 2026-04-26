import { Equation, EquationSolverResult } from '@/types/equation';
import { SymbolicConverter } from '@/lib/symbolicConverter';

function ex(n: number, settings?: Parameters<typeof SymbolicConverter.convertToExact>[1]) {
  return {
    value: SymbolicConverter.convertToExact(n, settings),
    validity: (isFinite(n) && !isNaN(n)) ? 'valid' as const : 'invalid' as const,
  };
}

export const trigonometryExtraEquations: Equation[] = [
  {
    id: 'double-angle-sin',
    name: 'Double Angle — sin(2A)',
    category: 'Trigonometry',
    latex: '\\sin(2A) = 2\\sin A \\cos A',
    description: 'Evaluate sin(2A) or find A given sin(2A), using the double angle identity',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'sin(2A)', symbol: 's2A', unit: '' },
      { name: 'Angle A', symbol: 'A', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { A } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (A !== undefined) {
        const rad = A * toRad;
        results.s2A = ex(Math.sin(2 * rad), settings);
      }
      return results;
    },
    examples: [
      { input: { A: 30 }, description: 'sin(60°) = √3/2 ≈ 0.866' },
      { input: { A: 45 }, description: 'sin(90°) = 1' },
    ],
    tags: ['double angle', 'sin', 'identity', 'trig'],
    level: 'alevel',
  },
  {
    id: 'double-angle-cos',
    name: 'Double Angle — cos(2A)',
    category: 'Trigonometry',
    latex: '\\cos(2A) = \\cos^2 A - \\sin^2 A = 1 - 2\\sin^2 A',
    description: 'Evaluate cos(2A) using the double angle identity',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'cos(2A)', symbol: 'c2A', unit: '' },
      { name: 'Angle A', symbol: 'A', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { A } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (A !== undefined) {
        results.c2A = ex(Math.cos(2 * A * toRad), settings);
      }
      return results;
    },
    examples: [
      { input: { A: 30 }, description: 'cos(60°) = 0.5' },
      { input: { A: 45 }, description: 'cos(90°) = 0' },
    ],
    tags: ['double angle', 'cos', 'identity', 'trig'],
    level: 'alevel',
  },
  {
    id: 'double-angle-tan',
    name: 'Double Angle — tan(2A)',
    category: 'Trigonometry',
    latex: '\\tan(2A) = \\frac{2\\tan A}{1 - \\tan^2 A}',
    description: 'Evaluate tan(2A) using the double angle identity',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'tan(2A)', symbol: 't2A', unit: '' },
      { name: 'Angle A', symbol: 'A', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { A } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (A !== undefined) {
        const tanA = Math.tan(A * toRad);
        const denom = 1 - tanA * tanA;
        if (Math.abs(denom) < 1e-10) {
          results.t2A = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'tan(2A) is undefined at this angle' };
        } else {
          results.t2A = ex(2 * tanA / denom, settings);
        }
      }
      return results;
    },
    examples: [
      { input: { A: 30 }, description: 'tan(60°) = √3 ≈ 1.732' },
      { input: { A: 22.5 }, description: 'tan(45°) = 1' },
    ],
    tags: ['double angle', 'tan', 'identity', 'trig'],
    level: 'alevel',
  },
  {
    id: 'pythagorean-identity',
    name: 'Pythagorean Identity',
    category: 'Trigonometry',
    latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
    description: 'Find sinθ from cosθ or vice versa using the fundamental Pythagorean identity',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'sin θ', symbol: 'sin_t', unit: '' },
      { name: 'cos θ', symbol: 'cos_t', unit: '' },
      { name: 'Angle θ', symbol: 'theta', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { sin_t, cos_t, theta } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (theta !== undefined) {
        results.sin_t = ex(Math.sin(theta * toRad), settings);
        results.cos_t = ex(Math.cos(theta * toRad), settings);
      }
      if (sin_t !== undefined && cos_t === undefined) {
        if (Math.abs(sin_t) > 1) {
          results.cos_t = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: '|sinθ| cannot exceed 1' };
        } else {
          results.cos_t = ex(Math.sqrt(1 - sin_t * sin_t), settings);
        }
      }
      if (cos_t !== undefined && sin_t === undefined) {
        if (Math.abs(cos_t) > 1) {
          results.sin_t = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: '|cosθ| cannot exceed 1' };
        } else {
          results.sin_t = ex(Math.sqrt(1 - cos_t * cos_t), settings);
        }
      }
      return results;
    },
    examples: [
      { input: { theta: 30 }, description: 'sin30° = 0.5, cos30° = √3/2' },
      { input: { sin_t: 0.6 }, description: 'sinθ = 0.6 → cosθ = 0.8' },
    ],
    tags: ['pythagorean', 'identity', 'sin', 'cos', 'trig'],
    level: 'gcse',
  },
  {
    id: 'exact-trig-values',
    name: 'Exact Trigonometric Values',
    category: 'Trigonometry',
    latex: '\\sin\\theta,\\; \\cos\\theta,\\; \\tan\\theta',
    description: 'Calculate exact decimal values of sin, cos and tan for any angle',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Angle θ', symbol: 'theta', unit: '°' },
      { name: 'sin θ', symbol: 'sin_t', unit: '' },
      { name: 'cos θ', symbol: 'cos_t', unit: '' },
      { name: 'tan θ', symbol: 'tan_t', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { theta } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (theta !== undefined) {
        const rad = theta * toRad;
        results.sin_t = ex(Math.sin(rad), settings);
        results.cos_t = ex(Math.cos(rad), settings);
        const cosVal = Math.cos(rad);
        if (Math.abs(cosVal) < 1e-10) {
          results.tan_t = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'tan θ is undefined at this angle' };
        } else {
          results.tan_t = ex(Math.tan(rad), settings);
        }
      }
      return results;
    },
    examples: [
      { input: { theta: 45 }, description: 'sin45°=cos45°=√2/2, tan45°=1' },
      { input: { theta: 60 }, description: 'sin60°=√3/2, cos60°=0.5, tan60°=√3' },
    ],
    tags: ['sin', 'cos', 'tan', 'exact', 'trig values'],
    level: 'gcse',
  },
  {
    id: 'inverse-trig',
    name: 'Inverse Trigonometry',
    category: 'Trigonometry',
    latex: '\\theta = \\arcsin(x),\\; \\arccos(x),\\; \\arctan(x)',
    description: 'Find an angle given a trigonometric ratio using inverse functions',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Trig ratio x', symbol: 'x', unit: '' },
      { name: 'arcsin(x) → θ', symbol: 'theta_sin', unit: '°' },
      { name: 'arccos(x) → θ', symbol: 'theta_cos', unit: '°' },
      { name: 'arctan(x) → θ', symbol: 'theta_tan', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { x } = inputs;
      const results: EquationSolverResult = {};
      const toDeg = settings?.angle_mode === 'radians' ? 1 : 180 / Math.PI;
      if (x !== undefined) {
        if (Math.abs(x) <= 1) {
          results.theta_sin = ex(Math.asin(x) * toDeg, settings);
          results.theta_cos = ex(Math.acos(x) * toDeg, settings);
        } else {
          results.theta_sin = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'arcsin undefined for |x| > 1' };
          results.theta_cos = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'arccos undefined for |x| > 1' };
        }
        results.theta_tan = ex(Math.atan(x) * toDeg, settings);
      }
      return results;
    },
    examples: [
      { input: { x: 0.5 }, description: 'arcsin(0.5) = 30°' },
      { input: { x: 1 }, description: 'arccos(1) = 0°, arctan(1) = 45°' },
    ],
    tags: ['arcsin', 'arccos', 'arctan', 'inverse', 'trig'],
    level: 'gcse',
  },
];
