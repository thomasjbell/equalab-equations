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

const G = 6.674e-11; // gravitational constant

export const astrophysicsEquations: Equation[] = [
  {
    id: 'gravitational-potential',
    name: 'Gravitational Potential',
    category: 'Physics',
    subcategory: 'Gravitation & Astrophysics',
    latex: 'V = -\\frac{GM}{r}',
    description: 'Gravitational potential at distance r from a mass M (always negative)',
    solverType: 'physics',
    variables: [
      { name: 'Gravitational potential V', symbol: 'V', unit: 'J/kg' },
      { name: 'Mass of body M', symbol: 'M', unit: 'kg', constraints: { positive: true } },
      { name: 'Distance from centre r', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { V, M, r } = inputs;
      const results: EquationSolverResult = {};
      if (M !== undefined && r !== undefined && r !== 0) results.V = ex(-G * M / r, settings);
      if (V !== undefined && r !== undefined && V !== 0 && r > 0) results.M = exPos(-V * r / G, 'Mass', settings);
      if (V !== undefined && M !== undefined && V !== 0) results.r = exPos(-G * M / V, 'Distance', settings);
      return results;
    },
    examples: [
      { input: { M: 5.972e24, r: 6.371e6 }, description: 'Earth surface: V ≈ -62.5 MJ/kg' },
    ],
    tags: ['gravitational', 'potential', 'field', 'orbital', 'astrophysics'],
    level: 'alevel',
  },
  {
    id: 'escape-velocity',
    name: 'Escape Velocity',
    category: 'Physics',
    subcategory: 'Gravitation & Astrophysics',
    latex: 'v_{esc} = \\sqrt{\\frac{2GM}{r}}',
    description: 'Minimum speed needed to escape a gravitational field from distance r',
    solverType: 'physics',
    variables: [
      { name: 'Escape velocity', symbol: 'v_esc', unit: 'm/s', constraints: { positive: true } },
      { name: 'Mass of body M', symbol: 'M', unit: 'kg', constraints: { positive: true } },
      { name: 'Distance from centre r', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { v_esc, M, r } = inputs;
      const results: EquationSolverResult = {};
      if (M !== undefined && r !== undefined && r > 0) results.v_esc = exPos(Math.sqrt(2 * G * M / r), 'Escape velocity', settings);
      if (v_esc !== undefined && r !== undefined && r > 0) results.M = exPos(v_esc * v_esc * r / (2 * G), 'Mass', settings);
      if (v_esc !== undefined && M !== undefined) results.r = exPos(2 * G * M / (v_esc * v_esc), 'Distance', settings);
      return results;
    },
    examples: [
      { input: { M: 5.972e24, r: 6.371e6 }, description: 'Earth: v_esc ≈ 11 190 m/s ≈ 11.2 km/s' },
    ],
    tags: ['escape velocity', 'gravity', 'orbital', 'astrophysics'],
    level: 'alevel',
  },
  {
    id: 'orbital-speed',
    name: 'Orbital Speed',
    category: 'Physics',
    subcategory: 'Gravitation & Astrophysics',
    latex: 'v = \\sqrt{\\frac{GM}{r}}',
    description: 'Speed of a circular orbit at radius r around a body of mass M',
    solverType: 'physics',
    variables: [
      { name: 'Orbital speed', symbol: 'v', unit: 'm/s', constraints: { positive: true } },
      { name: 'Central mass M', symbol: 'M', unit: 'kg', constraints: { positive: true } },
      { name: 'Orbital radius r', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { v, M, r } = inputs;
      const results: EquationSolverResult = {};
      if (M !== undefined && r !== undefined && r > 0) results.v = exPos(Math.sqrt(G * M / r), 'Speed', settings);
      if (v !== undefined && r !== undefined && r > 0) results.M = exPos(v * v * r / G, 'Mass', settings);
      if (v !== undefined && M !== undefined && v > 0) results.r = exPos(G * M / (v * v), 'Radius', settings);
      return results;
    },
    examples: [
      { input: { M: 5.972e24, r: 6.771e6 }, description: 'ISS orbit: v ≈ 7 660 m/s' },
    ],
    tags: ['orbital', 'speed', 'satellite', 'circular orbit', 'gravity'],
    level: 'alevel',
  },
  {
    id: 'orbital-period-kepler',
    name: "Kepler's Third Law",
    category: 'Physics',
    subcategory: 'Gravitation & Astrophysics',
    latex: 'T^2 = \\frac{4\\pi^2 r^3}{GM}',
    description: "Kepler's third law: orbital period squared proportional to orbital radius cubed",
    solverType: 'physics',
    variables: [
      { name: 'Period T', symbol: 'T', unit: 's', constraints: { positive: true } },
      { name: 'Orbital radius r', symbol: 'r', unit: 'm', constraints: { positive: true } },
      { name: 'Central mass M', symbol: 'M', unit: 'kg', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { T, r, M } = inputs;
      const results: EquationSolverResult = {};
      if (r !== undefined && M !== undefined && r > 0 && M > 0) results.T = exPos(2 * Math.PI * Math.sqrt(r * r * r / (G * M)), 'Period', settings);
      if (T !== undefined && M !== undefined && T > 0 && M > 0) results.r = exPos(Math.cbrt(G * M * T * T / (4 * Math.PI * Math.PI)), 'Radius', settings);
      if (T !== undefined && r !== undefined && T > 0 && r > 0) results.M = exPos(4 * Math.PI * Math.PI * r * r * r / (G * T * T), 'Mass', settings);
      return results;
    },
    examples: [
      { input: { r: 1.496e11, M: 1.989e30 }, description: 'Earth-Sun: T ≈ 3.156×10⁷ s ≈ 1 year' },
    ],
    tags: ['kepler', 'orbital period', 'gravity', 'astrophysics'],
    level: 'alevel',
  },
  {
    id: 'hubble-law',
    name: "Hubble's Law",
    category: 'Physics',
    subcategory: 'Gravitation & Astrophysics',
    latex: 'v = H_0 d',
    description: "Recession speed of a galaxy proportional to its distance (Hubble's law)",
    solverType: 'physics',
    variables: [
      { name: 'Recession speed v', symbol: 'v', unit: 'm/s' },
      { name: "Hubble constant H₀", symbol: 'H_0', unit: 's⁻¹' },
      { name: 'Distance d', symbol: 'd', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { v, H_0, d } = inputs;
      const results: EquationSolverResult = {};
      if (H_0 !== undefined && d !== undefined) results.v = ex(H_0 * d, settings);
      if (v !== undefined && d !== undefined && d !== 0) results.H_0 = ex(v / d, settings);
      if (v !== undefined && H_0 !== undefined && H_0 !== 0) results.d = exPos(v / H_0, 'Distance', settings);
      return results;
    },
    examples: [
      { input: { H_0: 2.27e-18, d: 3.086e22 }, description: 'H₀ ≈ 70 km/s/Mpc, d = 1 Mpc → v ≈ 70 km/s' },
    ],
    tags: ["hubble's law", 'cosmology', 'expansion', 'recession', 'galaxy'],
    level: 'alevel',
  },
  {
    id: 'gravitational-field-strength',
    name: 'Gravitational Field Strength',
    category: 'Physics',
    subcategory: 'Gravitation & Astrophysics',
    latex: 'g = \\frac{GM}{r^2}',
    description: 'Gravitational field strength at distance r from a body of mass M',
    solverType: 'physics',
    variables: [
      { name: 'Field strength g', symbol: 'g', unit: 'N/kg', constraints: { nonNegative: true } },
      { name: 'Mass M', symbol: 'M', unit: 'kg', constraints: { positive: true } },
      { name: 'Distance r', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { g, M, r } = inputs;
      const results: EquationSolverResult = {};
      if (M !== undefined && r !== undefined && r > 0) results.g = exPos(G * M / (r * r), 'Field strength', settings);
      if (g !== undefined && r !== undefined && r > 0 && g > 0) results.M = exPos(g * r * r / G, 'Mass', settings);
      if (g !== undefined && M !== undefined && g > 0) results.r = exPos(Math.sqrt(G * M / g), 'Distance', settings);
      return results;
    },
    examples: [
      { input: { M: 5.972e24, r: 6.371e6 }, description: 'Earth surface: g ≈ 9.81 N/kg' },
    ],
    tags: ['gravitational', 'field', 'strength', 'gravity', 'astrophysics'],
    level: 'alevel',
  },
];
