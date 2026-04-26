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

export const electromagnetismExtraEquations: Equation[] = [
  {
    id: 'charge-flow',
    name: 'Charge Flow',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'Q = It',
    description: 'Charge flow equals current multiplied by time',
    solverType: 'physics',
    variables: [
      { name: 'Charge Q', symbol: 'Q', unit: 'C' },
      { name: 'Current I', symbol: 'I', unit: 'A' },
      { name: 'Time t', symbol: 't', unit: 's', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => {
      const { Q, I, t } = inputs;
      const results: EquationSolverResult = {};
      if (I !== undefined && t !== undefined) results.Q = ex(I * t, settings);
      if (Q !== undefined && t !== undefined && t !== 0) results.I = ex(Q / t, settings);
      if (Q !== undefined && I !== undefined && I !== 0) results.t = exPos(Q / I, 'Time', settings);
      return results;
    },
    examples: [{ input: { I: 2.5, t: 4 }, description: 'Q = 2.5 × 4 = 10 C' }],
    tags: ['charge', 'current', 'time', 'coulombs'],
    level: 'gcse',
  },
  {
    id: 'electrical-energy',
    name: 'Electrical Energy (Charge × Voltage)',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'E = QV',
    description: 'Energy transferred when charge Q moves through potential difference V',
    solverType: 'physics',
    variables: [
      { name: 'Energy E', symbol: 'E', unit: 'J' },
      { name: 'Charge Q', symbol: 'Q', unit: 'C' },
      { name: 'Voltage V', symbol: 'V', unit: 'V' },
    ],
    solve: (inputs, settings) => {
      const { E, Q, V } = inputs;
      const results: EquationSolverResult = {};
      if (Q !== undefined && V !== undefined) results.E = ex(Q * V, settings);
      if (E !== undefined && V !== undefined && V !== 0) results.Q = ex(E / V, settings);
      if (E !== undefined && Q !== undefined && Q !== 0) results.V = ex(E / Q, settings);
      return results;
    },
    examples: [{ input: { Q: 5, V: 12 }, description: 'E = 5 × 12 = 60 J' }],
    tags: ['energy', 'charge', 'voltage', 'electrical work'],
    level: 'gcse',
  },
  {
    id: 'resistivity',
    name: 'Resistivity',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'R = \\frac{\\rho L}{A}',
    description: 'Resistance of a conductor of length L and cross-sectional area A with resistivity ρ',
    solverType: 'physics',
    variables: [
      { name: 'Resistance R', symbol: 'R', unit: 'Ω', constraints: { positive: true } },
      { name: 'Resistivity ρ', symbol: 'rho', unit: 'Ω·m', constraints: { positive: true } },
      { name: 'Length L', symbol: 'L', unit: 'm', constraints: { positive: true } },
      { name: 'Cross-sectional area A', symbol: 'A', unit: 'm²', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { R, rho, L, A } = inputs;
      const results: EquationSolverResult = {};
      if (rho !== undefined && L !== undefined && A !== undefined && A !== 0) results.R = exPos(rho * L / A, 'Resistance', settings);
      if (R !== undefined && L !== undefined && A !== undefined && L !== 0) results.rho = exPos(R * A / L, 'Resistivity', settings);
      if (R !== undefined && rho !== undefined && A !== undefined && rho !== 0 && A !== 0) results.L = exPos(R * A / rho, 'Length', settings);
      if (R !== undefined && rho !== undefined && L !== undefined && rho !== 0 && L !== 0) results.A = exPos(rho * L / R, 'Area', settings);
      return results;
    },
    examples: [{ input: { rho: 1.7e-8, L: 10, A: 1e-6 }, description: 'Copper wire 10 m, 1 mm² → R = 0.17 Ω' }],
    tags: ['resistivity', 'resistance', 'conductor', 'wire'],
    level: 'alevel',
  },
  {
    id: 'emf-internal-resistance',
    name: 'EMF and Internal Resistance',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: '\\varepsilon = V + Ir',
    description: 'EMF equals terminal voltage plus voltage drop across internal resistance',
    solverType: 'physics',
    variables: [
      { name: 'EMF ε', symbol: 'emf', unit: 'V' },
      { name: 'Terminal voltage V', symbol: 'V', unit: 'V' },
      { name: 'Current I', symbol: 'I', unit: 'A' },
      { name: 'Internal resistance r', symbol: 'r_int', unit: 'Ω', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => {
      const { emf, V, I, r_int } = inputs;
      const results: EquationSolverResult = {};
      if (V !== undefined && I !== undefined && r_int !== undefined) results.emf = ex(V + I * r_int, settings);
      if (emf !== undefined && I !== undefined && r_int !== undefined) results.V = ex(emf - I * r_int, settings);
      if (emf !== undefined && V !== undefined && r_int !== undefined && r_int !== 0) results.I = ex((emf - V) / r_int, settings);
      if (emf !== undefined && V !== undefined && I !== undefined && I !== 0) results.r_int = exPos((emf - V) / I, 'Internal resistance', settings);
      return results;
    },
    examples: [{ input: { emf: 12, I: 2, r_int: 0.5 }, description: 'V = 12 - 2×0.5 = 11 V terminal voltage' }],
    tags: ['emf', 'internal resistance', 'battery', 'terminal voltage'],
    level: 'alevel',
  },
  {
    id: 'capacitor-discharge',
    name: 'Capacitor Discharge',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'Q = Q_0 e^{-t/RC}',
    description: 'Charge remaining on a capacitor discharging through resistance R at time t',
    solverType: 'physics',
    variables: [
      { name: 'Charge Q', symbol: 'Q', unit: 'C', constraints: { nonNegative: true } },
      { name: 'Initial charge Q₀', symbol: 'Q_0', unit: 'C', constraints: { positive: true } },
      { name: 'Time t', symbol: 't', unit: 's', constraints: { nonNegative: true } },
      { name: 'Resistance R', symbol: 'R', unit: 'Ω', constraints: { positive: true } },
      { name: 'Capacitance C', symbol: 'C_cap', unit: 'F', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { Q, Q_0, t, R, C_cap } = inputs;
      const results: EquationSolverResult = {};
      if (Q_0 !== undefined && t !== undefined && R !== undefined && C_cap !== undefined) {
        results.Q = exPos(Q_0 * Math.exp(-t / (R * C_cap)), 'Charge', settings);
      }
      if (Q !== undefined && Q_0 !== undefined && R !== undefined && C_cap !== undefined && Q > 0 && Q_0 > 0) {
        results.t = exPos(-R * C_cap * Math.log(Q / Q_0), 'Time', settings);
      }
      if (Q !== undefined && Q_0 !== undefined && t !== undefined && t !== 0 && Q > 0 && Q_0 > 0) {
        results.R = exPos(-t / (Math.log(Q / Q_0) * (C_cap ?? 1)), 'Resistance', settings);
      }
      return results;
    },
    examples: [{ input: { Q_0: 100e-6, t: 0.01, R: 1000, C_cap: 10e-6 }, description: 'RC = 10 ms, t = 10 ms → Q = Q₀/e ≈ 36.8 μC' }],
    tags: ['capacitor', 'discharge', 'exponential', 'RC circuit'],
    level: 'alevel',
  },
  {
    id: 'time-constant-rc',
    name: 'RC Time Constant',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: '\\tau = RC',
    description: 'Time constant of an RC circuit — time for charge to decay to 1/e of initial value',
    solverType: 'physics',
    variables: [
      { name: 'Time constant τ', symbol: 'tau', unit: 's', constraints: { positive: true } },
      { name: 'Resistance R', symbol: 'R', unit: 'Ω', constraints: { positive: true } },
      { name: 'Capacitance C', symbol: 'C_cap', unit: 'F', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { tau, R, C_cap } = inputs;
      const results: EquationSolverResult = {};
      if (R !== undefined && C_cap !== undefined) results.tau = exPos(R * C_cap, 'Time constant', settings);
      if (tau !== undefined && C_cap !== undefined && C_cap !== 0) results.R = exPos(tau / C_cap, 'Resistance', settings);
      if (tau !== undefined && R !== undefined && R !== 0) results.C_cap = exPos(tau / R, 'Capacitance', settings);
      return results;
    },
    examples: [{ input: { R: 10000, C_cap: 100e-6 }, description: 'τ = 10 000 × 100×10⁻⁶ = 1 s' }],
    tags: ['RC', 'time constant', 'capacitor', 'exponential decay'],
    level: 'alevel',
  },
  {
    id: 'electric-field-uniform',
    name: 'Uniform Electric Field',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'E = \\frac{V}{d}',
    description: 'Electric field strength between two parallel plates separated by distance d',
    solverType: 'physics',
    variables: [
      { name: 'Electric field E', symbol: 'E_field', unit: 'V/m', constraints: { nonNegative: true } },
      { name: 'Voltage V', symbol: 'V', unit: 'V' },
      { name: 'Plate separation d', symbol: 'd', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { E_field, V, d } = inputs;
      const results: EquationSolverResult = {};
      if (V !== undefined && d !== undefined && d !== 0) results.E_field = ex(V / d, settings);
      if (E_field !== undefined && d !== undefined) results.V = ex(E_field * d, settings);
      if (E_field !== undefined && V !== undefined && E_field !== 0) results.d = exPos(V / E_field, 'Separation', settings);
      return results;
    },
    examples: [{ input: { V: 500, d: 0.01 }, description: 'E = 500 / 0.01 = 50 000 V/m' }],
    tags: ['electric field', 'uniform', 'plates', 'voltage'],
    level: 'alevel',
  },
  {
    id: 'magnetic-flux',
    name: 'Magnetic Flux',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: '\\Phi = BA\\cos\\theta',
    description: 'Magnetic flux through an area A in a uniform field B at angle θ to the normal',
    solverType: 'physics',
    angleMode: 'both',
    variables: [
      { name: 'Flux Φ', symbol: 'Phi', unit: 'Wb' },
      { name: 'Magnetic field B', symbol: 'B', unit: 'T', constraints: { nonNegative: true } },
      { name: 'Area A', symbol: 'A', unit: 'm²', constraints: { positive: true } },
      { name: 'Angle θ', symbol: 'theta', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { Phi, B, A, theta } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (B !== undefined && A !== undefined && theta !== undefined) results.Phi = ex(B * A * Math.cos(theta * toRad), settings);
      if (Phi !== undefined && A !== undefined && theta !== undefined && A !== 0 && Math.cos(theta * toRad) !== 0) results.B = exPos(Phi / (A * Math.cos(theta * toRad)), 'Field', settings);
      if (Phi !== undefined && B !== undefined && theta !== undefined && B !== 0 && Math.cos(theta * toRad) !== 0) results.A = exPos(Phi / (B * Math.cos(theta * toRad)), 'Area', settings);
      return results;
    },
    examples: [{ input: { B: 0.5, A: 0.04, theta: 0 }, description: 'Φ = 0.5 × 0.04 × cos0° = 0.02 Wb' }],
    tags: ['magnetic flux', 'flux', 'field', 'faraday'],
    level: 'alevel',
  },
  {
    id: 'electric-potential-point',
    name: 'Electric Potential (Point Charge)',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    latex: 'V = \\frac{kQ}{r} = \\frac{Q}{4\\pi\\varepsilon_0 r}',
    description: 'Electric potential at distance r from a point charge Q',
    solverType: 'physics',
    variables: [
      { name: 'Electric potential V', symbol: 'V', unit: 'V' },
      { name: 'Charge Q', symbol: 'Q', unit: 'C' },
      { name: 'Distance r', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { V, Q, r } = inputs;
      const k = 8.99e9; // 1/(4πε₀)
      const results: EquationSolverResult = {};
      if (Q !== undefined && r !== undefined && r > 0) results.V = ex(k * Q / r, settings);
      if (V !== undefined && r !== undefined && r > 0) results.Q = ex(V * r / k, settings);
      if (V !== undefined && Q !== undefined && V !== 0) results.r = exPos(k * Q / V, 'Distance', settings);
      return results;
    },
    examples: [{ input: { Q: 1e-9, r: 0.1 }, description: 'V = 8.99×10⁹ × 10⁻⁹ / 0.1 = 89.9 V' }],
    tags: ['electric potential', 'point charge', 'coulomb'],
    level: 'alevel',
  },
];
