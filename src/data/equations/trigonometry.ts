import { Equation, EquationSolverResult } from '@/types/equation';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const trigonometryEquations: Equation[] = [
  {
    id: 'unit-circle',
    name: 'Unit Circle Values',
    category: 'Trigonometry',
    latex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1',
    description: 'Calculate exact trigonometric values for common angles (0°, 30°, 45°, 60°, 90°)',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Angle', symbol: 'degrees', unit: '°' },
      { name: 'sin(θ)', symbol: 'sin_theta', unit: '' },
      { name: 'cos(θ)', symbol: 'cos_theta', unit: '' },
      { name: 'tan(θ)', symbol: 'tan_theta', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { degrees } = inputs;
      if (degrees === undefined) return {};
      const results: EquationSolverResult = {};

      const exactValues: Record<number, { sin: string; cos: string; tan: string }> = {
        0:  { sin: '0', cos: '1', tan: '0' },
        30: { sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}' },
        45: { sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1' },
        60: { sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}' },
        90: { sin: '1', cos: '0', tan: '\\text{undefined}' },
      };

      const rad = (degrees * Math.PI) / 180;
      if (exactValues[degrees]) {
        const exact = exactValues[degrees];
        results.sin_theta = { value: { type: 'expression', decimal: Math.sin(rad), latex: exact.sin, simplified: true }, validity: 'valid' };
        results.cos_theta = { value: { type: 'expression', decimal: Math.cos(rad), latex: exact.cos, simplified: true }, validity: 'valid' };
        results.tan_theta = { value: { type: 'expression', decimal: Math.tan(rad), latex: exact.tan, simplified: true }, validity: 'valid' };
      } else {
        results.sin_theta = { value: SymbolicConverter.convertToExact(Math.sin(rad), settings), validity: 'valid' };
        results.cos_theta = { value: SymbolicConverter.convertToExact(Math.cos(rad), settings), validity: 'valid' };
        const tanVal = Math.tan(rad);
        results.tan_theta = {
          value: SymbolicConverter.convertToExact(tanVal, settings),
          validity: isFinite(tanVal) ? 'valid' : 'invalid',
          validityReason: !isFinite(tanVal) ? 'tan is undefined at this angle' : undefined,
        };
      }
      return results;
    },
    examples: [
      { input: { degrees: 45 }, description: 'sin(45°) = cos(45°) = √2/2' },
      { input: { degrees: 30 }, description: 'sin(30°) = 1/2, cos(30°) = √3/2' },
    ],
    tags: ['sin', 'cos', 'tan', 'trigonometry', 'unit circle'],
    level: 'gcse',
  },
  {
    id: 'sine-rule',
    name: 'Sine Rule',
    category: 'Trigonometry',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
    description: 'Find any side or angle in a triangle using the sine rule',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'units' },
      { name: 'Side b', symbol: 'b', unit: 'units' },
      { name: 'Side c', symbol: 'c', unit: 'units' },
      { name: 'Angle A', symbol: 'A', unit: '°' },
      { name: 'Angle B', symbol: 'B', unit: '°' },
      { name: 'Angle C', symbol: 'C', unit: '°' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { a, b, c, A, B, C } = inputs;
      const results: EquationSolverResult = {};
      const useRad = settings?.angle_mode === 'radians';
      const toRad = (x: number) => useRad ? x : (x * Math.PI) / 180;
      const fromRad = (x: number) => useRad ? x : (x * 180) / Math.PI;

      if (a !== undefined && A !== undefined && b !== undefined && B === undefined) {
        const sinB = (b * Math.sin(toRad(A))) / a;
        if (Math.abs(sinB) <= 1) {
          results.B = { value: SymbolicConverter.convertToExact(fromRad(Math.asin(sinB)), settings), validity: 'valid' };
        } else {
          results.B = { value: SymbolicConverter.convertToExact(0, settings), validity: 'invalid', validityReason: 'No valid angle — triangle impossible' };
        }
      }
      if (a !== undefined && A !== undefined && B !== undefined && b === undefined) {
        const calcB = (a * Math.sin(toRad(B))) / Math.sin(toRad(A));
        results.b = { value: SymbolicConverter.convertToExact(calcB, settings), validity: calcB > 0 ? 'valid' : 'invalid' };
      }
      if (a !== undefined && A !== undefined && C !== undefined && c === undefined) {
        const calcC = (a * Math.sin(toRad(C))) / Math.sin(toRad(A));
        results.c = { value: SymbolicConverter.convertToExact(calcC, settings), validity: calcC > 0 ? 'valid' : 'invalid' };
      }
      return results;
    },
    examples: [
      { input: { a: 10, A: 30, B: 60 }, description: 'Find side b' },
    ],
    tags: ['sine rule', 'triangle', 'trigonometry'],
    level: 'gcse',
  },
];
