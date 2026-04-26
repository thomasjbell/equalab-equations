import { Equation, wrapResults, EquationSolverResult } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const geometryEquations: Equation[] = [
  {
    id: 'circle-area',
    name: 'Area of Circle',
    category: 'Geometry',
    latex: 'A = \\pi r^2',
    description: 'Calculate circle area or radius with exact π expressions',
    solverType: 'geometric',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²' },
      { name: 'Radius', symbol: 'r', unit: 'units' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveGeometric('circle_area', inputs, settings)),
    examples: [{ input: { r: 3 }, description: 'Circle with radius 3 → A = 9π' }],
    tags: ['circle', 'area', 'pi'],
    level: 'gcse',
  },
  {
    id: 'circle-circumference',
    name: 'Circle Circumference',
    category: 'Geometry',
    latex: 'C = 2\\pi r',
    description: 'Calculate circle circumference with exact π expressions',
    solverType: 'geometric',
    variables: [
      { name: 'Circumference', symbol: 'C', unit: 'units' },
      { name: 'Radius', symbol: 'r', unit: 'units' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveGeometric('circle_circumference', inputs, settings)),
    examples: [{ input: { r: 5 }, description: 'C = 10π' }],
    tags: ['circle', 'circumference', 'perimeter', 'pi'],
    level: 'gcse',
  },
  {
    id: 'pythagoras',
    name: 'Pythagorean Theorem',
    category: 'Geometry',
    latex: 'c^2 = a^2 + b^2',
    description: 'Calculate any side of a right-angled triangle with exact surd results',
    solverType: 'geometric',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'units' },
      { name: 'Side b', symbol: 'b', unit: 'units' },
      { name: 'Hypotenuse c', symbol: 'c', unit: 'units' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveGeometric('pythagoras', inputs, settings)),
    examples: [
      { input: { a: 3, b: 4 }, description: '3-4-5 triangle' },
      { input: { a: 1, b: 1 }, description: 'Isosceles right triangle → c = √2' },
    ],
    tags: ['pythagoras', 'right angle', 'triangle', 'hypotenuse'],
    level: 'gcse',
  },
  {
    id: 'sphere-volume',
    name: 'Volume of Sphere',
    category: 'Geometry',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    description: 'Calculate sphere volume with exact π expressions',
    solverType: 'geometric',
    variables: [
      { name: 'Volume', symbol: 'V', unit: 'units³' },
      { name: 'Radius', symbol: 'r', unit: 'units' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveGeometric('sphere_volume', inputs, settings)),
    examples: [{ input: { r: 3 }, description: 'V = 36π' }],
    tags: ['sphere', 'volume', '3D', 'pi'],
    level: 'gcse',
  },
  {
    id: 'cylinder-volume',
    name: 'Cylinder Volume',
    category: 'Geometry',
    latex: 'V = \\pi r^2 h',
    description: 'Calculate cylinder volume with exact π expressions',
    solverType: 'geometric',
    variables: [
      { name: 'Volume', symbol: 'V', unit: 'units³' },
      { name: 'Radius', symbol: 'r', unit: 'units' },
      { name: 'Height', symbol: 'h', unit: 'units' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveGeometric('cylinder_volume', inputs, settings)),
    examples: [{ input: { r: 3, h: 4 }, description: 'V = 36π' }],
    tags: ['cylinder', 'volume', '3D', 'pi'],
    level: 'gcse',
  },
  {
    id: 'cone-volume',
    name: 'Cone Volume',
    category: 'Geometry',
    latex: 'V = \\frac{1}{3}\\pi r^2 h',
    description: 'Calculate cone volume with exact π expressions',
    solverType: 'geometric',
    variables: [
      { name: 'Volume', symbol: 'V', unit: 'units³' },
      { name: 'Radius', symbol: 'r', unit: 'units' },
      { name: 'Height', symbol: 'h', unit: 'units' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveGeometric('cone_volume', inputs, settings)),
    examples: [{ input: { r: 3, h: 4 }, description: 'V = 12π' }],
    tags: ['cone', 'volume', '3D', 'pi'],
    level: 'gcse',
  },
  {
    id: 'cosine-rule',
    name: 'Cosine Rule',
    category: 'Geometry',
    latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)',
    description: 'Find any side or angle in a triangle using the cosine rule',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'units' },
      { name: 'Side b', symbol: 'b', unit: 'units' },
      { name: 'Side c', symbol: 'c', unit: 'units' },
      { name: 'Angle C', symbol: 'C', unit: '°' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { a, b, c, C } = inputs;
      const results: EquationSolverResult = {};
      const useRad = settings?.angle_mode === 'radians';
      const toRad = (x: number) => useRad ? x : (x * Math.PI) / 180;
      const fromRad = (x: number) => useRad ? x : (x * 180) / Math.PI;

      if (a !== undefined && b !== undefined && C !== undefined) {
        const cSq = a * a + b * b - 2 * a * b * Math.cos(toRad(C));
        if (cSq >= 0) results.c = { value: SymbolicConverter.convertToExact(Math.sqrt(cSq), settings), validity: 'valid' };
      }
      if (a !== undefined && b !== undefined && c !== undefined) {
        const cosC = (a * a + b * b - c * c) / (2 * a * b);
        if (Math.abs(cosC) <= 1) results.C = { value: SymbolicConverter.convertToExact(fromRad(Math.acos(cosC)), settings), validity: 'valid' };
      }
      return results;
    },
    examples: [{ input: { a: 3, b: 4, C: 90 }, description: 'Right triangle → c = 5' }],
    tags: ['cosine rule', 'triangle', 'trigonometry'],
    level: 'gcse',
  },
  {
    id: 'trapezium-area',
    name: 'Area of Trapezium',
    category: 'Geometry',
    latex: 'A = \\frac{1}{2}(a + b)h',
    description: 'Calculate the area of a trapezium from parallel sides and height',
    solverType: 'linear',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²' },
      { name: 'Parallel side a', symbol: 'a', unit: 'units' },
      { name: 'Parallel side b', symbol: 'b', unit: 'units' },
      { name: 'Height', symbol: 'h', unit: 'units' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { A, a, b, h } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && b !== undefined && h !== undefined && A === undefined)
        results.A = { value: SymbolicConverter.convertToExact(0.5 * (a + b) * h, settings), validity: 'valid' };
      if (A !== undefined && b !== undefined && h !== undefined && a === undefined)
        results.a = { value: SymbolicConverter.convertToExact((2 * A) / h - b, settings), validity: 'valid' };
      if (A !== undefined && a !== undefined && h !== undefined && b === undefined)
        results.b = { value: SymbolicConverter.convertToExact((2 * A) / h - a, settings), validity: 'valid' };
      if (A !== undefined && a !== undefined && b !== undefined && h === undefined)
        results.h = { value: SymbolicConverter.convertToExact((2 * A) / (a + b), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { a: 5, b: 9, h: 4 }, description: 'A = 28' }],
    tags: ['trapezium', 'area', '2D'],
    level: 'gcse',
  },
];
