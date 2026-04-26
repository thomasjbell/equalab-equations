import { Equation, EquationSolverResult } from '@/types/equation';
import { SymbolicConverter } from '@/lib/symbolicConverter';

function ex(n: number, settings?: Parameters<typeof SymbolicConverter.convertToExact>[1]) {
  return {
    value: SymbolicConverter.convertToExact(n, settings),
    validity: (isFinite(n) && !isNaN(n)) ? 'valid' as const : 'invalid' as const,
  };
}
function exPos(n: number, label: string, settings?: Parameters<typeof SymbolicConverter.convertToExact>[1]) {
  return {
    value: SymbolicConverter.convertToExact(n, settings),
    validity: n <= 0 ? 'invalid' as const : isFinite(n) ? 'valid' as const : 'invalid' as const,
    validityReason: n <= 0 ? `${label} must be positive` : undefined,
  };
}

const R_GAS = 8.314; // J mol⁻¹ K⁻¹

export const chemistryExtraEquations: Equation[] = [
  {
    id: 'gibbs-free-energy',
    name: 'Gibbs Free Energy',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: '\\Delta G = \\Delta H - T\\Delta S',
    description: 'Change in Gibbs free energy; negative ΔG indicates a spontaneous process',
    solverType: 'physics',
    variables: [
      { name: 'ΔG (J/mol)', symbol: 'dG', unit: 'J/mol' },
      { name: 'ΔH (J/mol)', symbol: 'dH', unit: 'J/mol' },
      { name: 'Temperature T', symbol: 'T', unit: 'K', constraints: { positive: true } },
      { name: 'ΔS (J/mol·K)', symbol: 'dS', unit: 'J/mol·K' },
    ],
    solve: (inputs, settings) => {
      const { dG, dH, T, dS } = inputs;
      const results: EquationSolverResult = {};
      if (dH !== undefined && T !== undefined && dS !== undefined) {
        const val = dH - T * dS;
        results.dG = { ...ex(val, settings), validity: 'valid' as const };
        if (val < 0) results.dG.validityReason = 'Spontaneous (ΔG < 0)';
        else if (val === 0) results.dG.validityReason = 'Equilibrium (ΔG = 0)';
      }
      if (dG !== undefined && T !== undefined && dS !== undefined) results.dH = ex(dG + T * dS, settings);
      if (dG !== undefined && dH !== undefined && dS !== undefined && dS !== 0) results.T = exPos((dH - dG) / dS, 'Temperature', settings);
      if (dG !== undefined && dH !== undefined && T !== undefined && T !== 0) results.dS = ex((dH - dG) / T, settings);
      return results;
    },
    examples: [
      { input: { dH: -286000, T: 298, dS: -163 }, description: 'H₂O formation: ΔG = -286000 - 298×(-163) ≈ -237 kJ/mol' },
    ],
    tags: ['gibbs', 'free energy', 'spontaneous', 'thermodynamics', 'enthalpy', 'entropy'],
    level: 'alevel',
  },
  {
    id: 'arrhenius-equation',
    name: 'Arrhenius Equation',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'k = A e^{-E_a / RT}',
    description: 'Rate constant k as a function of activation energy Eₐ and temperature T',
    solverType: 'physics',
    variables: [
      { name: 'Rate constant k', symbol: 'k', unit: 's⁻¹', constraints: { positive: true } },
      { name: 'Pre-exponential factor A', symbol: 'A_factor', unit: 's⁻¹', constraints: { positive: true } },
      { name: 'Activation energy Eₐ', symbol: 'E_a', unit: 'J/mol', constraints: { positive: true } },
      { name: 'Temperature T', symbol: 'T', unit: 'K', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { k, A_factor, E_a, T } = inputs;
      const results: EquationSolverResult = {};
      if (A_factor !== undefined && E_a !== undefined && T !== undefined && T > 0) {
        results.k = exPos(A_factor * Math.exp(-E_a / (R_GAS * T)), 'Rate constant', settings);
      }
      if (k !== undefined && A_factor !== undefined && T !== undefined && T > 0 && k > 0 && A_factor > 0) {
        results.E_a = exPos(-R_GAS * T * Math.log(k / A_factor), 'Activation energy', settings);
      }
      if (k !== undefined && A_factor !== undefined && E_a !== undefined && k > 0 && A_factor > 0) {
        results.T = exPos(-E_a / (R_GAS * Math.log(k / A_factor)), 'Temperature', settings);
      }
      return results;
    },
    examples: [
      { input: { A_factor: 1e13, E_a: 50000, T: 298 }, description: 'k = 10¹³ × e^(-50000/(8.314×298)) ≈ 1.93×10⁴ s⁻¹' },
    ],
    tags: ['arrhenius', 'rate constant', 'activation energy', 'kinetics'],
    level: 'alevel',
  },
  {
    id: 'beer-lambert',
    name: 'Beer-Lambert Law',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'A = \\varepsilon c l',
    description: 'Absorbance equals molar absorptivity × concentration × path length',
    solverType: 'physics',
    variables: [
      { name: 'Absorbance A', symbol: 'Abs', unit: '', constraints: { nonNegative: true } },
      { name: 'Molar absorptivity ε', symbol: 'epsilon', unit: 'L/mol·cm', constraints: { positive: true } },
      { name: 'Concentration c', symbol: 'c', unit: 'mol/L', constraints: { positive: true } },
      { name: 'Path length l', symbol: 'l', unit: 'cm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { Abs, epsilon, c, l } = inputs;
      const results: EquationSolverResult = {};
      if (epsilon !== undefined && c !== undefined && l !== undefined) results.Abs = exPos(epsilon * c * l, 'Absorbance', settings);
      if (Abs !== undefined && c !== undefined && l !== undefined && c !== 0 && l !== 0) results.epsilon = exPos(Abs / (c * l), 'Absorptivity', settings);
      if (Abs !== undefined && epsilon !== undefined && l !== undefined && epsilon !== 0 && l !== 0) results.c = exPos(Abs / (epsilon * l), 'Concentration', settings);
      if (Abs !== undefined && epsilon !== undefined && c !== undefined && epsilon !== 0 && c !== 0) results.l = exPos(Abs / (epsilon * c), 'Path length', settings);
      return results;
    },
    examples: [{ input: { epsilon: 5000, c: 1e-4, l: 1 }, description: 'A = 5000 × 10⁻⁴ × 1 = 0.5' }],
    tags: ['beer-lambert', 'absorbance', 'spectroscopy', 'concentration'],
    level: 'alevel',
  },
  {
    id: 'percentage-yield',
    name: 'Percentage Yield',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: '\\% \\text{ yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100',
    description: 'Percentage of the theoretical yield actually obtained in a reaction',
    solverType: 'custom',
    variables: [
      { name: 'Percentage yield (%)', symbol: 'pct_yield', unit: '%' },
      { name: 'Actual yield', symbol: 'actual', unit: 'g', constraints: { nonNegative: true } },
      { name: 'Theoretical yield', symbol: 'theoretical', unit: 'g', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { pct_yield, actual, theoretical } = inputs;
      const results: EquationSolverResult = {};
      if (actual !== undefined && theoretical !== undefined && theoretical !== 0) {
        const yld = actual / theoretical * 100;
        results.pct_yield = {
          value: SymbolicConverter.convertToExact(yld, settings),
          validity: yld > 100 ? 'warning' as const : 'valid' as const,
          validityReason: yld > 100 ? 'Yield > 100% suggests error' : undefined,
        };
      }
      if (pct_yield !== undefined && theoretical !== undefined) results.actual = ex(pct_yield / 100 * theoretical, settings);
      if (pct_yield !== undefined && actual !== undefined && pct_yield !== 0) results.theoretical = exPos(actual / (pct_yield / 100), 'Theoretical yield', settings);
      return results;
    },
    examples: [{ input: { actual: 4.2, theoretical: 5.0 }, description: '% yield = 4.2/5.0 × 100 = 84%' }],
    tags: ['percentage yield', 'reaction', 'efficiency', 'chemistry'],
    level: 'gcse',
  },
  {
    id: 'atom-economy',
    name: 'Atom Economy',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: '\\text{atom economy} = \\frac{M_r(\\text{desired})}{M_r(\\text{all products})} \\times 100',
    description: 'Percentage of reactant mass that ends up in the desired product',
    solverType: 'custom',
    variables: [
      { name: 'Atom economy (%)', symbol: 'AE', unit: '%' },
      { name: 'Mr of desired product', symbol: 'M_desired', unit: 'g/mol', constraints: { positive: true } },
      { name: 'Mr of all products', symbol: 'M_total', unit: 'g/mol', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { AE, M_desired, M_total } = inputs;
      const results: EquationSolverResult = {};
      if (M_desired !== undefined && M_total !== undefined && M_total !== 0) {
        const ae = M_desired / M_total * 100;
        results.AE = {
          value: SymbolicConverter.convertToExact(ae, settings),
          validity: ae > 100 ? 'invalid' as const : 'valid' as const,
          validityReason: ae > 100 ? 'Desired product Mr cannot exceed total' : undefined,
        };
      }
      if (AE !== undefined && M_total !== undefined) results.M_desired = exPos(AE / 100 * M_total, 'Desired Mr', settings);
      if (AE !== undefined && M_desired !== undefined && AE !== 0) results.M_total = exPos(M_desired / (AE / 100), 'Total Mr', settings);
      return results;
    },
    examples: [{ input: { M_desired: 44, M_total: 80 }, description: 'Atom economy = 44/80 × 100 = 55%' }],
    tags: ['atom economy', 'green chemistry', 'efficiency', 'molar mass'],
    level: 'gcse',
  },
  {
    id: 'dilution-formula',
    name: 'Dilution Formula',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'c_1 V_1 = c_2 V_2',
    description: 'Concentration × volume is conserved during dilution',
    solverType: 'custom',
    variables: [
      { name: 'Initial concentration c₁', symbol: 'c_1', unit: 'mol/L', constraints: { positive: true } },
      { name: 'Initial volume V₁', symbol: 'V_1', unit: 'L', constraints: { positive: true } },
      { name: 'Final concentration c₂', symbol: 'c_2', unit: 'mol/L', constraints: { positive: true } },
      { name: 'Final volume V₂', symbol: 'V_2', unit: 'L', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { c_1, V_1, c_2, V_2 } = inputs;
      const results: EquationSolverResult = {};
      if (c_1 !== undefined && V_1 !== undefined && V_2 !== undefined && V_2 !== 0) results.c_2 = exPos(c_1 * V_1 / V_2, 'Final concentration', settings);
      if (c_1 !== undefined && V_1 !== undefined && c_2 !== undefined && c_2 !== 0) results.V_2 = exPos(c_1 * V_1 / c_2, 'Final volume', settings);
      if (c_2 !== undefined && V_2 !== undefined && V_1 !== undefined && V_1 !== 0) results.c_1 = exPos(c_2 * V_2 / V_1, 'Initial concentration', settings);
      if (c_2 !== undefined && V_2 !== undefined && c_1 !== undefined && c_1 !== 0) results.V_1 = exPos(c_2 * V_2 / c_1, 'Initial volume', settings);
      return results;
    },
    examples: [{ input: { c_1: 2.0, V_1: 0.05, V_2: 0.2 }, description: 'Dilute 50 mL of 2 M to 200 mL → c₂ = 0.5 M' }],
    tags: ['dilution', 'concentration', 'volume', 'solution'],
    level: 'gcse',
  },
  {
    id: 'molar-volume',
    name: 'Molar Volume (Ideal Gas)',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'V_m = \\frac{RT}{P} \\quad (\\text{at STP: } V_m = 22.4 \\text{ L/mol})',
    description: 'Molar volume of an ideal gas — volume occupied by one mole at given T and P',
    solverType: 'physics',
    variables: [
      { name: 'Molar volume Vₘ (L/mol)', symbol: 'V_m', unit: 'L/mol', constraints: { positive: true } },
      { name: 'Temperature T', symbol: 'T', unit: 'K', constraints: { positive: true } },
      { name: 'Pressure P', symbol: 'P', unit: 'Pa', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { V_m, T, P } = inputs;
      const R = 8.314;
      const results: EquationSolverResult = {};
      if (T !== undefined && P !== undefined && P !== 0) results.V_m = exPos(R * T / P * 1000, 'Molar volume', settings); // ×1000 for L
      if (V_m !== undefined && P !== undefined) results.T = exPos(V_m / 1000 * P / R, 'Temperature', settings);
      if (V_m !== undefined && T !== undefined) results.P = exPos(R * T / (V_m / 1000), 'Pressure', settings);
      return results;
    },
    examples: [{ input: { T: 273, P: 101325 }, description: 'STP: Vₘ ≈ 22.4 L/mol' }],
    tags: ['molar volume', 'ideal gas', 'STP', 'chemistry'],
    level: 'alevel',
  },
  {
    id: 'equilibrium-expression',
    name: 'Equilibrium Constant Kc',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: 'K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}',
    description: 'Calculate Kc for aA + bB ⇌ cC + dD given equilibrium concentrations',
    solverType: 'custom',
    variables: [
      { name: 'Kc', symbol: 'Kc', unit: '', constraints: { positive: true } },
      { name: '[C] (mol/L)', symbol: 'C_conc', unit: 'mol/L', constraints: { positive: true } },
      { name: '[D] (mol/L)', symbol: 'D_conc', unit: 'mol/L', constraints: { positive: true } },
      { name: 'Stoichiometry c', symbol: 'c_stoich', unit: '' },
      { name: 'Stoichiometry d', symbol: 'd_stoich', unit: '' },
      { name: '[A] (mol/L)', symbol: 'A_conc', unit: 'mol/L', constraints: { positive: true } },
      { name: '[B] (mol/L)', symbol: 'B_conc', unit: 'mol/L', constraints: { positive: true } },
      { name: 'Stoichiometry a', symbol: 'a_stoich', unit: '' },
      { name: 'Stoichiometry b', symbol: 'b_stoich', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { C_conc, D_conc, c_stoich, d_stoich, A_conc, B_conc, a_stoich, b_stoich } = inputs;
      const results: EquationSolverResult = {};
      if ([C_conc, D_conc, c_stoich, d_stoich, A_conc, B_conc, a_stoich, b_stoich].every(v => v !== undefined)) {
        const num = Math.pow(C_conc!, c_stoich!) * Math.pow(D_conc!, d_stoich!);
        const den = Math.pow(A_conc!, a_stoich!) * Math.pow(B_conc!, b_stoich!);
        results.Kc = den !== 0 ? exPos(num / den, 'Kc', settings) : { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'Denominator is zero' };
      }
      return results;
    },
    examples: [
      { input: { C_conc: 0.04, D_conc: 0.04, c_stoich: 1, d_stoich: 1, A_conc: 0.02, B_conc: 0.02, a_stoich: 1, b_stoich: 1 }, description: 'Kc = (0.04×0.04)/(0.02×0.02) = 4' },
    ],
    tags: ['equilibrium', 'Kc', 'concentration', 'chemistry'],
    level: 'alevel',
  },
  {
    id: 'entropy-change',
    name: 'Entropy Change',
    category: 'Chemistry',
    subcategory: 'Physical Chemistry',
    latex: '\\Delta S = \\frac{q_{rev}}{T}',
    description: 'Entropy change for a reversible heat transfer at constant temperature',
    solverType: 'physics',
    variables: [
      { name: 'Entropy change ΔS', symbol: 'dS', unit: 'J/K' },
      { name: 'Reversible heat q', symbol: 'q', unit: 'J' },
      { name: 'Temperature T', symbol: 'T', unit: 'K', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { dS, q, T } = inputs;
      const results: EquationSolverResult = {};
      if (q !== undefined && T !== undefined && T !== 0) results.dS = ex(q / T, settings);
      if (dS !== undefined && T !== undefined) results.q = ex(dS * T, settings);
      if (dS !== undefined && q !== undefined && dS !== 0) results.T = exPos(q / dS, 'Temperature', settings);
      return results;
    },
    examples: [{ input: { q: 6000, T: 273 }, description: 'Melting ice: ΔS = 6000/273 ≈ 22 J/K' }],
    tags: ['entropy', 'thermodynamics', 'heat', 'temperature'],
    level: 'alevel',
  },
];
