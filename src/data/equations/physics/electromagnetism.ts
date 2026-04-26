import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const electromagnetismEquations: Equation[] = [
  {
    id: 'ohms-law',
    name: "Ohm's Law",
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'V = IR',
    description: 'Relationship between voltage, current, and resistance',
    solverType: 'linear',
    variables: [
      { name: 'Voltage', symbol: 'V', unit: 'V' },
      { name: 'Current', symbol: 'I', unit: 'A' },
      { name: 'Resistance', symbol: 'R', unit: 'Ω', constraints: { nonZero: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ V: 'I * R', I: 'V / R', R: 'V / I' }, inputs, settings)
    ),
    examples: [{ input: { V: 12, R: 4 }, description: 'I = 3 A' }],
    tags: ["Ohm's law", 'voltage', 'current', 'resistance'],
    level: 'gcse',
  },
  {
    id: 'electrical-power',
    name: 'Electrical Power',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'P = VI = I^2R = \\frac{V^2}{R}',
    description: 'Calculate electrical power using any combination of voltage, current, or resistance',
    solverType: 'physics',
    variables: [
      { name: 'Power', symbol: 'P', unit: 'W' },
      { name: 'Voltage', symbol: 'V', unit: 'V' },
      { name: 'Current', symbol: 'I', unit: 'A' },
      { name: 'Resistance', symbol: 'R', unit: 'Ω', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { P, V, I, R } = inputs;
      const results: EquationSolverResult = {};
      if (V !== undefined && I !== undefined && P === undefined)
        results.P = { value: SymbolicConverter.convertToExact(V * I, settings), validity: 'valid' };
      else if (I !== undefined && R !== undefined && P === undefined)
        results.P = { value: SymbolicConverter.convertToExact(I * I * R, settings), validity: 'valid' };
      else if (V !== undefined && R !== undefined && P === undefined)
        results.P = { value: SymbolicConverter.convertToExact((V * V) / R, settings), validity: 'valid' };
      if (P !== undefined && I !== undefined && V === undefined && I !== 0)
        results.V = { value: SymbolicConverter.convertToExact(P / I, settings), validity: 'valid' };
      if (P !== undefined && V !== undefined && I === undefined && V !== 0)
        results.I = { value: SymbolicConverter.convertToExact(P / V, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { V: 12, I: 2 }, description: 'P = 24 W' }],
    tags: ['power', 'voltage', 'current', 'resistance'],
    level: 'gcse',
  },
  {
    id: 'capacitance',
    name: 'Capacitance',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'C = \\frac{Q}{V}',
    description: 'Capacitance from charge and voltage',
    solverType: 'linear',
    variables: [
      { name: 'Capacitance', symbol: 'C', unit: 'F' },
      { name: 'Charge', symbol: 'Q', unit: 'C' },
      { name: 'Voltage', symbol: 'V', unit: 'V' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ C: 'Q / V', Q: 'C * V', V: 'Q / C' }, inputs, settings)
    ),
    examples: [{ input: { Q: 0.001, V: 12 }, description: 'C ≈ 83.3 μF' }],
    tags: ['capacitance', 'charge', 'voltage'],
    level: 'alevel',
  },
  {
    id: 'capacitor-energy',
    name: 'Capacitor Energy',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'E = \\frac{1}{2}CV^2',
    description: 'Energy stored in a capacitor',
    solverType: 'physics',
    variables: [
      { name: 'Energy', symbol: 'E', unit: 'J' },
      { name: 'Capacitance', symbol: 'C', unit: 'F', constraints: { positive: true } },
      { name: 'Voltage', symbol: 'V', unit: 'V' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { E, C, V } = inputs;
      const results: EquationSolverResult = {};
      if (C !== undefined && V !== undefined && E === undefined)
        results.E = { value: SymbolicConverter.convertToExact(0.5 * C * V * V, settings), validity: 'valid' };
      if (E !== undefined && C !== undefined && V === undefined)
        results.V = { value: SymbolicConverter.convertToExact(Math.sqrt((2 * E) / C), settings), validity: 'valid' };
      if (E !== undefined && V !== undefined && C === undefined && V !== 0)
        results.C = { value: SymbolicConverter.convertToExact((2 * E) / (V * V), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { C: 100e-6, V: 12 }, description: 'E = 7.2 mJ' }],
    tags: ['capacitor', 'energy', 'voltage'],
    level: 'alevel',
  },
  {
    id: 'resistors-series',
    name: 'Resistors in Series',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'R_{total} = R_1 + R_2 + R_3',
    description: 'Total resistance of resistors in series',
    solverType: 'linear',
    variables: [
      { name: 'Total Resistance', symbol: 'R_total', unit: 'Ω' },
      { name: 'Resistor 1', symbol: 'R_1', unit: 'Ω' },
      { name: 'Resistor 2', symbol: 'R_2', unit: 'Ω' },
      { name: 'Resistor 3', symbol: 'R_3', unit: 'Ω' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { R_1, R_2, R_3, R_total } = inputs;
      const results: EquationSolverResult = {};
      const given = [R_1, R_2, R_3].filter((r) => r !== undefined) as number[];
      if (given.length >= 2 && R_total === undefined)
        results.R_total = { value: SymbolicConverter.convertToExact(given.reduce((s, r) => s + r, 0), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { R_1: 100, R_2: 220, R_3: 330 }, description: 'R_total = 650 Ω' }],
    tags: ['resistors', 'series', 'resistance'],
    level: 'gcse',
  },
  {
    id: 'resistors-parallel',
    name: 'Resistors in Parallel',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: '\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2}',
    description: 'Total resistance of two resistors in parallel',
    solverType: 'physics',
    variables: [
      { name: 'Total Resistance', symbol: 'R_total', unit: 'Ω', constraints: { positive: true } },
      { name: 'Resistor 1', symbol: 'R_1', unit: 'Ω', constraints: { positive: true } },
      { name: 'Resistor 2', symbol: 'R_2', unit: 'Ω', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { R_1, R_2, R_total } = inputs;
      const results: EquationSolverResult = {};
      if (R_1 !== undefined && R_2 !== undefined && R_total === undefined)
        results.R_total = { value: SymbolicConverter.convertToExact((R_1 * R_2) / (R_1 + R_2), settings), validity: 'valid' };
      if (R_total !== undefined && R_1 !== undefined && R_2 === undefined) {
        const r2 = (R_total * R_1) / (R_1 - R_total);
        results.R_2 = { value: SymbolicConverter.convertToExact(r2, settings), validity: r2 > 0 ? 'valid' : 'invalid', validityReason: r2 <= 0 ? 'Resistance cannot be negative' : undefined };
      }
      if (R_total !== undefined && R_2 !== undefined && R_1 === undefined) {
        const r1 = (R_total * R_2) / (R_2 - R_total);
        results.R_1 = { value: SymbolicConverter.convertToExact(r1, settings), validity: r1 > 0 ? 'valid' : 'invalid', validityReason: r1 <= 0 ? 'Resistance cannot be negative' : undefined };
      }
      return results;
    },
    examples: [{ input: { R_1: 6, R_2: 3 }, description: 'R_total = 2 Ω' }],
    tags: ['resistors', 'parallel', 'resistance'],
    level: 'gcse',
  },
  {
    id: 'potential-divider',
    name: 'Potential Divider',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'V_{out} = \\frac{R_2}{R_1 + R_2} \\times V_{in}',
    description: 'Output voltage of a two-resistor potential divider circuit',
    solverType: 'physics',
    variables: [
      { name: 'Input Voltage', symbol: 'V_in', unit: 'V' },
      { name: 'Output Voltage', symbol: 'V_out', unit: 'V' },
      { name: 'Resistor 1', symbol: 'R_1', unit: 'Ω', constraints: { positive: true } },
      { name: 'Resistor 2', symbol: 'R_2', unit: 'Ω', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { V_in, V_out, R_1, R_2 } = inputs;
      const results: EquationSolverResult = {};
      if (V_in !== undefined && R_1 !== undefined && R_2 !== undefined && V_out === undefined)
        results.V_out = { value: SymbolicConverter.convertToExact((V_in * R_2) / (R_1 + R_2), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { V_in: 12, R_1: 1000, R_2: 2000 }, description: 'V_out = 8 V' }],
    tags: ['potential divider', 'voltage divider', 'circuit'],
    level: 'gcse',
  },
  {
    id: 'coulombs-law',
    name: "Coulomb's Law",
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'F = \\frac{kq_1 q_2}{r^2}',
    description: 'Electrostatic force between two point charges',
    solverType: 'physics',
    variables: [
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: "Coulomb's Constant", symbol: 'k', unit: 'N·m²/C²' },
      { name: 'Charge 1', symbol: 'q1', unit: 'C' },
      { name: 'Charge 2', symbol: 'q2', unit: 'C' },
      { name: 'Separation', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { F, k, q1, q2, r } = inputs;
      const results: EquationSolverResult = {};
      if (k !== undefined && q1 !== undefined && q2 !== undefined && r !== undefined && F === undefined)
        results.F = { value: SymbolicConverter.convertToExact((k * q1 * q2) / (r * r), settings), validity: 'valid' };
      if (F !== undefined && k !== undefined && q1 !== undefined && r !== undefined && q2 === undefined)
        results.q2 = { value: SymbolicConverter.convertToExact((F * r * r) / (k * q1), settings), validity: 'valid' };
      if (F !== undefined && k !== undefined && q1 !== undefined && q2 !== undefined && r === undefined)
        results.r = { value: SymbolicConverter.convertToExact(Math.sqrt(Math.abs((k * q1 * q2) / F)), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { k: 8.99e9, q1: 1e-6, q2: 1e-6, r: 0.1 }, description: 'F = 0.899 N' }],
    tags: ["Coulomb's law", 'electric force', 'charge'],
    level: 'alevel',
  },
  {
    id: 'magnetic-force-wire',
    name: 'Magnetic Force on Wire',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'F = BIl\\sin\\theta',
    description: 'Force on a current-carrying conductor in a magnetic field',
    solverType: 'physics',
    angleMode: 'both',
    variables: [
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Magnetic Flux Density', symbol: 'B', unit: 'T' },
      { name: 'Current', symbol: 'I', unit: 'A' },
      { name: 'Length', symbol: 'l', unit: 'm', constraints: { positive: true } },
      { name: 'Angle', symbol: 'theta', unit: '°' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { F, B, I, l, theta } = inputs;
      const results: EquationSolverResult = {};
      const useRad = settings?.angle_mode === 'radians';
      const toRad = (x: number) => useRad ? x : (x * Math.PI) / 180;
      if (B !== undefined && I !== undefined && l !== undefined && theta !== undefined && F === undefined)
        results.F = { value: SymbolicConverter.convertToExact(B * I * l * Math.sin(toRad(theta)), settings), validity: 'valid' };
      if (F !== undefined && I !== undefined && l !== undefined && theta !== undefined && B === undefined)
        results.B = { value: SymbolicConverter.convertToExact(F / (I * l * Math.sin(toRad(theta))), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { B: 0.5, I: 2, l: 1, theta: 90 }, description: 'F = 1 N' }],
    tags: ['magnetic force', 'current', 'magnetic field'],
    level: 'alevel',
  },
  {
    id: 'faradays-law',
    name: "Faraday's Law",
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: '\\varepsilon = -N\\frac{\\Delta\\Phi}{\\Delta t}',
    description: 'Induced EMF from change in magnetic flux',
    solverType: 'linear',
    variables: [
      { name: 'Induced EMF', symbol: 'emf', unit: 'V' },
      { name: 'Number of Turns', symbol: 'N', unit: '' },
      { name: 'Change in Flux', symbol: 'dPhi', unit: 'Wb' },
      { name: 'Time Interval', symbol: 'dt', unit: 's', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { emf, N, dPhi, dt } = inputs;
      const results: EquationSolverResult = {};
      if (N !== undefined && dPhi !== undefined && dt !== undefined && emf === undefined)
        results.emf = { value: SymbolicConverter.convertToExact(-N * dPhi / dt, settings), validity: 'valid' };
      if (emf !== undefined && N !== undefined && dt !== undefined && dPhi === undefined)
        results.dPhi = { value: SymbolicConverter.convertToExact(-emf * dt / N, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { N: 100, dPhi: 0.01, dt: 0.1 }, description: 'EMF = -10 V' }],
    tags: ["Faraday's law", 'induced EMF', 'magnetic flux'],
    level: 'alevel',
  },
  {
    id: 'transformer-equation',
    name: 'Transformer Equation',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: '\\frac{V_s}{V_p} = \\frac{N_s}{N_p}',
    description: 'Voltage ratio equals turns ratio for an ideal transformer',
    solverType: 'linear',
    variables: [
      { name: 'Primary Voltage', symbol: 'V_p', unit: 'V' },
      { name: 'Secondary Voltage', symbol: 'V_s', unit: 'V' },
      { name: 'Primary Turns', symbol: 'N_p', unit: '' },
      { name: 'Secondary Turns', symbol: 'N_s', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { V_p, V_s, N_p, N_s } = inputs;
      const results: EquationSolverResult = {};
      if (V_p !== undefined && N_s !== undefined && N_p !== undefined && V_s === undefined)
        results.V_s = { value: SymbolicConverter.convertToExact((V_p * N_s) / N_p, settings), validity: 'valid' };
      if (V_s !== undefined && N_p !== undefined && N_s !== undefined && V_p === undefined)
        results.V_p = { value: SymbolicConverter.convertToExact((V_s * N_p) / N_s, settings), validity: 'valid' };
      if (V_p !== undefined && V_s !== undefined && N_p !== undefined && N_s === undefined)
        results.N_s = { value: SymbolicConverter.convertToExact((V_s * N_p) / V_p, settings), validity: 'valid' };
      if (V_p !== undefined && V_s !== undefined && N_s !== undefined && N_p === undefined)
        results.N_p = { value: SymbolicConverter.convertToExact((V_p * N_s) / V_s, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { V_p: 230, N_p: 1000, N_s: 50 }, description: 'V_s = 11.5 V' }],
    tags: ['transformer', 'voltage', 'turns ratio'],
    level: 'gcse',
  },
];
