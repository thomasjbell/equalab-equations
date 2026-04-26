import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const thermodynamicsEquations: Equation[] = [
  {
    id: 'ideal-gas-law',
    name: 'Ideal Gas Law',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: 'PV = nRT',
    description: 'Relate pressure, volume, amount, and temperature of an ideal gas',
    solverType: 'linear',
    variables: [
      { name: 'Pressure', symbol: 'P', unit: { symbol: 'Pa', allowAlternatives: ['kPa', 'atm', 'bar', 'psi'] } },
      { name: 'Volume', symbol: 'V', unit: 'm³' },
      { name: 'Amount', symbol: 'n', unit: 'mol' },
      { name: 'Gas Constant', symbol: 'R', unit: 'J/(mol·K)' },
      { name: 'Temperature', symbol: 'T', unit: 'K' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear(
        { P: '(n * R * T) / V', V: '(n * R * T) / P', n: '(P * V) / (R * T)', T: '(P * V) / (n * R)' },
        inputs,
        settings
      )
    ),
    examples: [{ input: { P: 101325, V: 0.0224, n: 1, R: 8.314 }, description: 'Find temperature at STP' }],
    tags: ['ideal gas', 'pressure', 'volume', 'temperature', 'chemistry'],
    level: 'alevel',
  },
  {
    id: 'specific-heat-capacity',
    name: 'Specific Heat Capacity',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: 'Q = mc\\Delta\\theta',
    description: 'Energy transferred by heating a substance',
    solverType: 'linear',
    variables: [
      { name: 'Thermal Energy', symbol: 'Q', unit: 'J' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Specific Heat Capacity', symbol: 'c', unit: 'J/(kg·°C)' },
      { name: 'Temperature Change', symbol: 'theta', unit: '°C' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear(
        { Q: 'm * c * theta', m: 'Q / (c * theta)', c: 'Q / (m * theta)', theta: 'Q / (m * c)' },
        inputs,
        settings
      )
    ),
    examples: [{ input: { m: 1, c: 4200, theta: 20 }, description: 'Q = 84,000 J for water' }],
    tags: ['specific heat', 'thermal energy', 'temperature'],
    level: 'gcse',
  },
  {
    id: 'boyles-law',
    name: "Boyle's Law",
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: 'P_1 V_1 = P_2 V_2',
    description: 'Pressure-volume relationship at constant temperature',
    solverType: 'linear',
    variables: [
      { name: 'Initial Pressure', symbol: 'P1', unit: 'Pa' },
      { name: 'Initial Volume', symbol: 'V1', unit: 'm³' },
      { name: 'Final Pressure', symbol: 'P2', unit: 'Pa' },
      { name: 'Final Volume', symbol: 'V2', unit: 'm³' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear(
        { P2: '(P1 * V1) / V2', V2: '(P1 * V1) / P2', P1: '(P2 * V2) / V1', V1: '(P2 * V2) / P1' },
        inputs,
        settings
      )
    ),
    examples: [{ input: { P1: 100000, V1: 2, P2: 200000 }, description: 'V2 = 1 m³' }],
    tags: ["Boyle's law", 'pressure', 'volume', 'isothermal'],
    level: 'alevel',
  },
  {
    id: 'charles-law',
    name: "Charles's Law",
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    description: 'Volume-temperature relationship at constant pressure',
    solverType: 'linear',
    variables: [
      { name: 'Initial Volume', symbol: 'V1', unit: 'm³' },
      { name: 'Initial Temperature', symbol: 'T1', unit: 'K' },
      { name: 'Final Volume', symbol: 'V2', unit: 'm³' },
      { name: 'Final Temperature', symbol: 'T2', unit: 'K' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear(
        { V2: '(V1 * T2) / T1', T2: '(T1 * V2) / V1', V1: '(V2 * T1) / T2', T1: '(T2 * V1) / V2' },
        inputs,
        settings
      )
    ),
    examples: [{ input: { V1: 1, T1: 273, T2: 546 }, description: 'V2 = 2 m³' }],
    tags: ["Charles's law", 'volume', 'temperature', 'isobaric'],
    level: 'alevel',
  },
  {
    id: 'first-law-thermodynamics',
    name: 'First Law of Thermodynamics',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: '\\Delta U = Q - W',
    description: 'Change in internal energy equals heat added minus work done by system',
    solverType: 'linear',
    variables: [
      { name: 'Change in Internal Energy', symbol: 'dU', unit: 'J' },
      { name: 'Heat Added to System', symbol: 'Q', unit: 'J' },
      { name: 'Work Done by System', symbol: 'W', unit: 'J' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ dU: 'Q - W', Q: 'dU + W', W: 'Q - dU' }, inputs, settings)
    ),
    examples: [{ input: { Q: 500, W: 200 }, description: 'ΔU = 300 J' }],
    tags: ['thermodynamics', 'internal energy', 'heat', 'work'],
    level: 'alevel',
  },
  {
    id: 'stefan-boltzmann',
    name: 'Stefan-Boltzmann Law',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: 'P = \\sigma A T^4',
    description: 'Radiated power from a blackbody',
    solverType: 'physics',
    variables: [
      { name: 'Power Radiated', symbol: 'P', unit: 'W' },
      { name: 'Stefan-Boltzmann Constant', symbol: 'sigma', unit: 'W/(m²·K⁴)' },
      { name: 'Surface Area', symbol: 'A', unit: 'm²', constraints: { positive: true } },
      { name: 'Temperature', symbol: 'T', unit: 'K', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { P, sigma, A, T } = inputs;
      const results: EquationSolverResult = {};
      if (sigma !== undefined && A !== undefined && T !== undefined && P === undefined)
        results.P = { value: SymbolicConverter.convertToExact(sigma * A * Math.pow(T, 4), settings), validity: 'valid' };
      if (P !== undefined && sigma !== undefined && A !== undefined && T === undefined)
        results.T = { value: SymbolicConverter.convertToExact(Math.pow(P / (sigma * A), 0.25), settings), validity: 'valid' };
      if (P !== undefined && sigma !== undefined && T !== undefined && A === undefined)
        results.A = { value: SymbolicConverter.convertToExact(P / (sigma * Math.pow(T, 4)), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { sigma: 5.67e-8, A: 1, T: 300 }, description: 'P ≈ 459 W/m²' }],
    tags: ['blackbody', 'radiation', 'temperature', 'Stefan-Boltzmann'],
    level: 'degree',
  },
  {
    id: 'latent-heat',
    name: 'Latent Heat',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    latex: 'Q = mL',
    description: 'Energy for a phase change (melting or boiling)',
    solverType: 'linear',
    variables: [
      { name: 'Thermal Energy', symbol: 'Q', unit: 'J' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Specific Latent Heat', symbol: 'L', unit: 'J/kg' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ Q: 'm * L', m: 'Q / L', L: 'Q / m' }, inputs, settings)
    ),
    examples: [{ input: { m: 0.5, L: 334000 }, description: 'Melting 0.5 kg of ice: Q = 167,000 J' }],
    tags: ['latent heat', 'phase change', 'melting', 'boiling'],
    level: 'alevel',
  },
];
