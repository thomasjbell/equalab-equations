import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const physicalChemistryEquations: Equation[] = [
  {
    id: 'molar-concentration',
    name: 'Molar Concentration',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'c = \\frac{n}{V}',
    description: 'Concentration of a solution in mol/dm³',
    solverType: 'linear',
    variables: [
      { name: 'Concentration', symbol: 'c', unit: 'mol/dm³' },
      { name: 'Moles', symbol: 'n', unit: 'mol', constraints: { nonNegative: true } },
      { name: 'Volume', symbol: 'V', unit: 'dm³', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ c: 'n / V', n: 'c * V', V: 'n / c' }, inputs, settings)
    ),
    examples: [{ input: { n: 0.1, V: 0.5 }, description: 'c = 0.2 mol/dm³' }],
    tags: ['concentration', 'moles', 'solution', 'molarity'],
    level: 'gcse',
  },
  {
    id: 'moles-mass',
    name: 'Moles from Mass',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'n = \\frac{m}{M_r}',
    description: 'Number of moles from mass and molar mass',
    solverType: 'linear',
    variables: [
      { name: 'Moles', symbol: 'n', unit: 'mol' },
      { name: 'Mass', symbol: 'm', unit: 'g', constraints: { positive: true } },
      { name: 'Molar Mass', symbol: 'Mr', unit: 'g/mol', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ n: 'm / Mr', m: 'n * Mr', Mr: 'm / n' }, inputs, settings)
    ),
    examples: [{ input: { m: 18, Mr: 18 }, description: 'n = 1 mol of water' }],
    tags: ['moles', 'mass', 'molar mass'],
    level: 'gcse',
  },
  {
    id: 'ideal-gas-moles',
    name: 'Ideal Gas Law (Chemistry)',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'PV = nRT',
    description: 'Ideal gas equation in chemistry context',
    solverType: 'linear',
    variables: [
      { name: 'Pressure', symbol: 'P', unit: { symbol: 'Pa', allowAlternatives: ['kPa', 'atm'] } },
      { name: 'Volume', symbol: 'V', unit: 'm³' },
      { name: 'Moles', symbol: 'n', unit: 'mol', constraints: { positive: true } },
      { name: 'Gas Constant', symbol: 'R', unit: 'J/(mol·K)' },
      { name: 'Temperature', symbol: 'T', unit: 'K', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear(
        { P: '(n * R * T) / V', V: '(n * R * T) / P', n: '(P * V) / (R * T)', T: '(P * V) / (n * R)' },
        inputs,
        settings
      )
    ),
    examples: [{ input: { P: 101325, V: 0.0224, n: 1, R: 8.314 }, description: 'T ≈ 273.15 K at STP' }],
    tags: ['ideal gas', 'moles', 'pressure', 'temperature'],
    level: 'alevel',
  },
  {
    id: 'henderson-hasselbalch',
    name: 'Henderson-Hasselbalch',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'pH = pK_a + \\log\\left(\\frac{[A^-]}{[HA]}\\right)',
    description: 'pH of a buffer solution',
    solverType: 'physics',
    variables: [
      { name: 'pH', symbol: 'pH', unit: '' },
      { name: 'pKₐ', symbol: 'pKa', unit: '' },
      { name: 'Concentration of A⁻ (base)', symbol: 'cA', unit: 'mol/dm³', constraints: { positive: true } },
      { name: 'Concentration of HA (acid)', symbol: 'cHA', unit: 'mol/dm³', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { pH, pKa, cA, cHA } = inputs;
      const results: EquationSolverResult = {};
      if (pKa !== undefined && cA !== undefined && cHA !== undefined && pH === undefined)
        results.pH = { value: SymbolicConverter.convertToExact(pKa + Math.log10(cA / cHA), settings), validity: 'valid' };
      if (pH !== undefined && cA !== undefined && cHA !== undefined && pKa === undefined)
        results.pKa = { value: SymbolicConverter.convertToExact(pH - Math.log10(cA / cHA), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { pKa: 4.74, cA: 0.1, cHA: 0.1 }, description: 'Acetic acid buffer: pH = 4.74' }],
    tags: ['pH', 'buffer', 'Henderson-Hasselbalch', 'acid-base'],
    level: 'alevel',
  },
  {
    id: 'enthalpy-change',
    name: 'Enthalpy Change',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'q = mc\\Delta T',
    description: 'Heat energy change in a reaction (calorimetry)',
    solverType: 'linear',
    variables: [
      { name: 'Heat Energy', symbol: 'q', unit: 'J' },
      { name: 'Mass', symbol: 'm', unit: 'g', constraints: { positive: true } },
      { name: 'Specific Heat Capacity', symbol: 'c', unit: 'J/(g·°C)' },
      { name: 'Temperature Change', symbol: 'dT', unit: '°C' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ q: 'm * c * dT', m: 'q / (c * dT)', c: 'q / (m * dT)', dT: 'q / (m * c)' }, inputs, settings)
    ),
    examples: [{ input: { m: 100, c: 4.18, dT: 5 }, description: 'q = 2090 J' }],
    tags: ['enthalpy', 'calorimetry', 'heat', 'temperature'],
    level: 'alevel',
  },
  {
    id: 'rate-law-first-order',
    name: 'First Order Rate Law',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: '\\text{rate} = k[A]',
    description: 'Rate of a first-order reaction',
    solverType: 'linear',
    variables: [
      { name: 'Rate', symbol: 'rate', unit: 'mol/(dm³·s)' },
      { name: 'Rate Constant', symbol: 'k', unit: 's⁻¹' },
      { name: 'Concentration of A', symbol: 'A', unit: 'mol/dm³', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ rate: 'k * A', k: 'rate / A', A: 'rate / k' }, inputs, settings)
    ),
    examples: [{ input: { k: 0.05, A: 0.2 }, description: 'rate = 0.01 mol/(dm³·s)' }],
    tags: ['rate law', 'kinetics', 'first order', 'chemistry'],
    level: 'alevel',
  },
  {
    id: 'ph-definition',
    name: 'pH Definition',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'pH = -\\log_{10}[H^+]',
    description: 'pH from hydrogen ion concentration or vice versa',
    solverType: 'physics',
    variables: [
      { name: 'pH', symbol: 'pH', unit: '' },
      { name: '[H⁺] Concentration', symbol: 'H', unit: 'mol/dm³', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { pH, H } = inputs;
      const results: EquationSolverResult = {};
      if (H !== undefined && pH === undefined)
        results.pH = { value: SymbolicConverter.convertToExact(-Math.log10(H), settings), validity: H > 0 ? 'valid' : 'invalid' };
      if (pH !== undefined && H === undefined)
        results.H = { value: SymbolicConverter.convertToExact(Math.pow(10, -pH), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { H: 1e-7 }, description: 'Pure water: pH = 7' }],
    tags: ['pH', 'hydrogen ion', 'acid', 'base'],
    level: 'gcse',
  },
];
