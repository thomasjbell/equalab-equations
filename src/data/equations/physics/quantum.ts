import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const quantumEquations: Equation[] = [
  {
    id: 'de-broglie',
    name: 'de Broglie Wavelength',
    category: 'Physics',
    subcategory: 'Quantum',
    latex: '\\lambda = \\frac{h}{p} = \\frac{h}{mv}',
    description: 'Wave-particle duality — wavelength of a moving particle',
    solverType: 'physics',
    variables: [
      { name: 'Wavelength', symbol: 'lambda', unit: 'm', constraints: { positive: true } },
      { name: "Planck's Constant", symbol: 'h', unit: 'J·s' },
      { name: 'Momentum', symbol: 'p', unit: 'kg·m/s', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ lambda: 'h / p', p: 'h / lambda', h: 'lambda * p' }, inputs, settings)
    ),
    examples: [{ input: { h: 6.626e-34, p: 1e-24 }, description: 'Electron de Broglie wavelength' }],
    tags: ['de Broglie', 'wavelength', 'quantum', 'wave-particle duality'],
    level: 'alevel',
  },
  {
    id: 'mass-energy',
    name: 'Mass-Energy Equivalence',
    category: 'Physics',
    subcategory: 'Quantum',
    latex: 'E = mc^2',
    description: "Einstein's mass-energy equivalence",
    solverType: 'physics',
    variables: [
      { name: 'Energy', symbol: 'E', unit: 'J' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Speed of Light', symbol: 'c', unit: 'm/s' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ E: 'm * c * c', m: 'E / (c * c)', c: '(E / m) ^ 0.5' }, inputs, settings)
    ),
    examples: [{ input: { m: 1e-3, c: 3e8 }, description: '1 g of matter: E = 9×10¹³ J' }],
    tags: ['Einstein', 'mass-energy', 'relativity', 'E=mc²'],
    level: 'alevel',
  },
  {
    id: 'photon-energy',
    name: 'Photon Energy',
    category: 'Physics',
    subcategory: 'Quantum',
    latex: 'E = hf = \\frac{hc}{\\lambda}',
    description: 'Energy of a photon from frequency or wavelength',
    solverType: 'physics',
    variables: [
      { name: 'Photon Energy', symbol: 'E', unit: 'J' },
      { name: "Planck's Constant", symbol: 'h', unit: 'J·s' },
      { name: 'Frequency', symbol: 'f', unit: 'Hz', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ E: 'h * f', f: 'E / h', h: 'E / f' }, inputs, settings)
    ),
    examples: [{ input: { h: 6.626e-34, f: 6e14 }, description: 'Visible light photon energy' }],
    tags: ['photon', 'energy', 'Planck', 'quantum'],
    level: 'alevel',
  },
  {
    id: 'hydrogen-energy-levels',
    name: 'Hydrogen Energy Levels',
    category: 'Physics',
    subcategory: 'Quantum',
    latex: 'E_n = -\\frac{13.6}{n^2} \\text{ eV}',
    description: 'Energy of hydrogen electron in principal quantum number n',
    solverType: 'physics',
    variables: [
      { name: 'Energy Level', symbol: 'E_n', unit: 'eV' },
      { name: 'Principal Quantum Number', symbol: 'n', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { n, E_n } = inputs;
      const results: EquationSolverResult = {};
      if (n !== undefined && E_n === undefined) {
        const val = -13.6 / (n * n);
        results.E_n = { value: SymbolicConverter.convertToExact(val, settings), validity: n >= 1 ? 'valid' : 'invalid', validityReason: n < 1 ? 'Quantum number must be ≥ 1' : undefined };
      }
      if (E_n !== undefined && n === undefined && E_n < 0) {
        const nVal = Math.sqrt(-13.6 / E_n);
        results.n = { value: SymbolicConverter.convertToExact(nVal, settings), validity: Number.isInteger(Math.round(nVal)) ? 'valid' : 'warning', validityReason: !Number.isInteger(Math.round(nVal)) ? 'n must be a positive integer' : undefined };
      }
      return results;
    },
    examples: [{ input: { n: 1 }, description: 'Ground state: E₁ = -13.6 eV' }],
    tags: ['hydrogen', 'energy levels', 'quantum number', 'Bohr model'],
    level: 'degree',
  },
  {
    id: 'nuclear-decay',
    name: 'Radioactive Decay',
    category: 'Physics',
    subcategory: 'Quantum',
    latex: 'N = N_0 e^{-\\lambda t}',
    description: 'Number of remaining nuclei after radioactive decay',
    solverType: 'physics',
    variables: [
      { name: 'Remaining Nuclei', symbol: 'N', unit: '' },
      { name: 'Initial Nuclei', symbol: 'N_0', unit: '', constraints: { positive: true } },
      { name: 'Decay Constant', symbol: 'lambda', unit: 's⁻¹', constraints: { positive: true } },
      { name: 'Time', symbol: 't', unit: 's', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { N, N_0, lambda, t } = inputs;
      const results: EquationSolverResult = {};
      if (N_0 !== undefined && lambda !== undefined && t !== undefined && N === undefined)
        results.N = { value: SymbolicConverter.convertToExact(N_0 * Math.exp(-lambda * t), settings), validity: 'valid' };
      if (N !== undefined && N_0 !== undefined && lambda !== undefined && t === undefined)
        results.t = { value: SymbolicConverter.convertToExact(-Math.log(N / N_0) / lambda, settings), validity: 'valid' };
      if (N !== undefined && N_0 !== undefined && t !== undefined && lambda === undefined && t !== 0)
        results.lambda = { value: SymbolicConverter.convertToExact(-Math.log(N / N_0) / t, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { N_0: 1000, lambda: 0.1, t: 10 }, description: 'N ≈ 368' }],
    tags: ['radioactive decay', 'half-life', 'nuclear', 'exponential'],
    level: 'alevel',
  },
  {
    id: 'half-life',
    name: 'Half-Life',
    category: 'Physics',
    subcategory: 'Quantum',
    latex: 't_{1/2} = \\frac{\\ln 2}{\\lambda}',
    description: 'Half-life from decay constant',
    solverType: 'linear',
    variables: [
      { name: 'Half-Life', symbol: 't_half', unit: 's', constraints: { positive: true } },
      { name: 'Decay Constant', symbol: 'lambda', unit: 's⁻¹', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { t_half, lambda } = inputs;
      const results: EquationSolverResult = {};
      if (lambda !== undefined && t_half === undefined)
        results.t_half = { value: SymbolicConverter.convertToExact(Math.LN2 / lambda, settings), validity: 'valid' };
      if (t_half !== undefined && lambda === undefined)
        results.lambda = { value: SymbolicConverter.convertToExact(Math.LN2 / t_half, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { lambda: 0.693 }, description: 't½ ≈ 1 s' }],
    tags: ['half-life', 'decay constant', 'nuclear'],
    level: 'gcse',
  },
];
