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
    validity: n < 0 ? 'invalid' as const : isFinite(n) && !isNaN(n) ? 'valid' as const : 'invalid' as const,
    validityReason: n < 0 ? `${label} cannot be negative` : undefined,
  };
}

export const materialsEquations: Equation[] = [
  {
    id: 'speed-distance-time',
    name: 'Speed, Distance & Time',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'v = \\frac{d}{t}',
    description: 'Relate average speed, distance travelled, and time taken',
    solverType: 'physics',
    variables: [
      { name: 'Speed', symbol: 'v', unit: 'm/s', constraints: { nonNegative: true } },
      { name: 'Distance', symbol: 'd', unit: 'm', constraints: { nonNegative: true } },
      { name: 'Time', symbol: 't', unit: 's', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { v, d, t } = inputs;
      const results: EquationSolverResult = {};
      if (d !== undefined && t !== undefined && t !== 0) results.v = exPos(d / t, 'Speed', settings);
      if (v !== undefined && t !== undefined) results.d = exPos(v * t, 'Distance', settings);
      if (v !== undefined && d !== undefined && v !== 0) results.t = exPos(d / v, 'Time', settings);
      return results;
    },
    examples: [
      { input: { d: 300, t: 60 }, description: 'v = 300/60 = 5 m/s' },
      { input: { v: 30, t: 10 }, description: 'd = 30 × 10 = 300 m' },
    ],
    tags: ['speed', 'distance', 'time', 'velocity', 'motion'],
    level: 'gcse',
  },
  {
    id: 'weight',
    name: 'Weight',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'W = mg',
    description: 'Weight force due to gravity acting on a mass (g ≈ 9.81 m/s² on Earth)',
    solverType: 'physics',
    variables: [
      { name: 'Weight', symbol: 'W', unit: 'N' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { nonNegative: true } },
      { name: 'Gravitational field strength', symbol: 'g', unit: 'm/s²' },
    ],
    solve: (inputs, settings) => {
      const { W, m, g } = inputs;
      const results: EquationSolverResult = {};
      if (m !== undefined && g !== undefined) results.W = ex(m * g, settings);
      if (W !== undefined && g !== undefined && g !== 0) results.m = exPos(W / g, 'Mass', settings);
      if (W !== undefined && m !== undefined && m !== 0) results.g = ex(W / m, settings);
      return results;
    },
    examples: [{ input: { m: 70, g: 9.81 }, description: 'W = 70 × 9.81 = 686.7 N' }],
    tags: ['weight', 'gravity', 'mass', 'force', 'newton'],
    level: 'gcse',
  },
  {
    id: 'density',
    name: 'Density',
    category: 'Physics',
    subcategory: 'Materials',
    latex: '\\rho = \\frac{m}{V}',
    description: 'Density of a substance — mass per unit volume',
    solverType: 'physics',
    variables: [
      { name: 'Density', symbol: 'rho', unit: 'kg/m³', constraints: { positive: true } },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Volume', symbol: 'V', unit: 'm³', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { rho, m, V } = inputs;
      const results: EquationSolverResult = {};
      if (m !== undefined && V !== undefined && V !== 0) results.rho = exPos(m / V, 'Density', settings);
      if (rho !== undefined && V !== undefined) results.m = exPos(rho * V, 'Mass', settings);
      if (rho !== undefined && m !== undefined && rho !== 0) results.V = exPos(m / rho, 'Volume', settings);
      return results;
    },
    examples: [
      { input: { m: 2700, V: 1 }, description: 'Aluminium: ρ = 2700 kg/m³' },
      { input: { rho: 1000, V: 0.5 }, description: 'Water: m = 1000 × 0.5 = 500 kg' },
    ],
    tags: ['density', 'mass', 'volume', 'material'],
    level: 'gcse',
  },
  {
    id: 'pressure-surface',
    name: 'Pressure (Surface)',
    category: 'Physics',
    subcategory: 'Materials',
    latex: 'P = \\frac{F}{A}',
    description: 'Pressure exerted by a force on a surface area',
    solverType: 'physics',
    variables: [
      { name: 'Pressure', symbol: 'P', unit: 'Pa', constraints: { nonNegative: true } },
      { name: 'Force', symbol: 'F', unit: 'N', constraints: { nonNegative: true } },
      { name: 'Area', symbol: 'A', unit: 'm²', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { P, F, A } = inputs;
      const results: EquationSolverResult = {};
      if (F !== undefined && A !== undefined && A !== 0) results.P = exPos(F / A, 'Pressure', settings);
      if (P !== undefined && A !== undefined) results.F = exPos(P * A, 'Force', settings);
      if (P !== undefined && F !== undefined && P !== 0) results.A = exPos(F / P, 'Area', settings);
      return results;
    },
    examples: [{ input: { F: 500, A: 0.02 }, description: 'P = 500 / 0.02 = 25 000 Pa' }],
    tags: ['pressure', 'force', 'area', 'pascal'],
    level: 'gcse',
  },
  {
    id: 'pressure-fluid',
    name: 'Pressure in a Fluid',
    category: 'Physics',
    subcategory: 'Materials',
    latex: 'P = \\rho g h',
    description: 'Gauge pressure at depth h in a fluid of density ρ',
    solverType: 'physics',
    variables: [
      { name: 'Pressure', symbol: 'P', unit: 'Pa', constraints: { nonNegative: true } },
      { name: 'Fluid density', symbol: 'rho', unit: 'kg/m³', constraints: { positive: true } },
      { name: 'Gravitational field g', symbol: 'g', unit: 'm/s²' },
      { name: 'Depth', symbol: 'h', unit: 'm', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => {
      const { P, rho, g, h } = inputs;
      const results: EquationSolverResult = {};
      if (rho !== undefined && g !== undefined && h !== undefined) results.P = exPos(rho * g * h, 'Pressure', settings);
      if (P !== undefined && g !== undefined && h !== undefined && g !== 0 && h !== 0) results.rho = exPos(P / (g * h), 'Density', settings);
      if (P !== undefined && rho !== undefined && h !== undefined && rho !== 0 && h !== 0) results.g = ex(P / (rho * h), settings);
      if (P !== undefined && rho !== undefined && g !== undefined && rho !== 0 && g !== 0) results.h = exPos(P / (rho * g), 'Depth', settings);
      return results;
    },
    examples: [{ input: { rho: 1000, g: 9.81, h: 10 }, description: 'P = 1000 × 9.81 × 10 = 98 100 Pa' }],
    tags: ['pressure', 'fluid', 'depth', 'hydrostatic'],
    level: 'gcse',
  },
  {
    id: 'hookes-law',
    name: "Hooke's Law",
    category: 'Physics',
    subcategory: 'Materials',
    latex: 'F = kx',
    description: 'Extension of a spring is proportional to the applied force, within the elastic limit',
    solverType: 'physics',
    variables: [
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Spring constant', symbol: 'k', unit: 'N/m', constraints: { positive: true } },
      { name: 'Extension', symbol: 'x', unit: 'm' },
    ],
    solve: (inputs, settings) => {
      const { F, k, x } = inputs;
      const results: EquationSolverResult = {};
      if (k !== undefined && x !== undefined) results.F = ex(k * x, settings);
      if (F !== undefined && x !== undefined && x !== 0) results.k = exPos(F / x, 'Spring constant', settings);
      if (F !== undefined && k !== undefined && k !== 0) results.x = ex(F / k, settings);
      return results;
    },
    examples: [
      { input: { k: 200, x: 0.05 }, description: 'F = 200 × 0.05 = 10 N' },
      { input: { F: 15, k: 300 }, description: 'x = 15/300 = 0.05 m' },
    ],
    tags: ["hooke's law", 'spring', 'extension', 'elastic'],
    level: 'gcse',
  },
  {
    id: 'elastic-potential-energy',
    name: 'Elastic Potential Energy',
    category: 'Physics',
    subcategory: 'Materials',
    latex: 'E = \\frac{1}{2} k x^2',
    description: 'Energy stored in a stretched or compressed spring',
    solverType: 'physics',
    variables: [
      { name: 'Elastic PE', symbol: 'E', unit: 'J', constraints: { nonNegative: true } },
      { name: 'Spring constant', symbol: 'k', unit: 'N/m', constraints: { positive: true } },
      { name: 'Extension / compression', symbol: 'x', unit: 'm' },
    ],
    solve: (inputs, settings) => {
      const { E, k, x } = inputs;
      const results: EquationSolverResult = {};
      if (k !== undefined && x !== undefined) results.E = exPos(0.5 * k * x * x, 'Elastic PE', settings);
      if (E !== undefined && x !== undefined && x !== 0) results.k = exPos(2 * E / (x * x), 'Spring constant', settings);
      if (E !== undefined && k !== undefined && k > 0) results.x = exPos(Math.sqrt(2 * E / k), 'Extension', settings);
      return results;
    },
    examples: [{ input: { k: 500, x: 0.04 }, description: 'E = ½ × 500 × 0.0016 = 0.4 J' }],
    tags: ['elastic', 'potential energy', 'spring', 'stored energy'],
    level: 'alevel',
  },
  {
    id: 'stress',
    name: 'Stress',
    category: 'Physics',
    subcategory: 'Materials',
    latex: '\\sigma = \\frac{F}{A}',
    description: 'Tensile or compressive stress in a material — force per unit cross-sectional area',
    solverType: 'physics',
    variables: [
      { name: 'Stress σ', symbol: 'sigma', unit: 'Pa' },
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Cross-sectional area', symbol: 'A', unit: 'm²', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { sigma, F, A } = inputs;
      const results: EquationSolverResult = {};
      if (F !== undefined && A !== undefined && A !== 0) results.sigma = ex(F / A, settings);
      if (sigma !== undefined && A !== undefined) results.F = ex(sigma * A, settings);
      if (sigma !== undefined && F !== undefined && sigma !== 0) results.A = exPos(F / sigma, 'Area', settings);
      return results;
    },
    examples: [{ input: { F: 2000, A: 0.0001 }, description: 'σ = 2000 / 0.0001 = 20 MPa' }],
    tags: ['stress', 'force', 'area', 'materials', 'tensile'],
    level: 'alevel',
  },
  {
    id: 'strain',
    name: 'Strain',
    category: 'Physics',
    subcategory: 'Materials',
    latex: '\\varepsilon = \\frac{\\Delta L}{L_0}',
    description: 'Engineering strain — extension divided by original length (dimensionless)',
    solverType: 'physics',
    variables: [
      { name: 'Strain ε', symbol: 'epsilon', unit: '' },
      { name: 'Extension ΔL', symbol: 'dL', unit: 'm' },
      { name: 'Original length L₀', symbol: 'L_0', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { epsilon, dL, L_0 } = inputs;
      const results: EquationSolverResult = {};
      if (dL !== undefined && L_0 !== undefined && L_0 !== 0) results.epsilon = ex(dL / L_0, settings);
      if (epsilon !== undefined && L_0 !== undefined) results.dL = ex(epsilon * L_0, settings);
      if (epsilon !== undefined && dL !== undefined && epsilon !== 0) results.L_0 = exPos(dL / epsilon, 'Length', settings);
      return results;
    },
    examples: [{ input: { dL: 0.002, L_0: 0.5 }, description: 'ε = 0.002/0.5 = 0.004' }],
    tags: ['strain', 'extension', 'length', 'deformation', 'materials'],
    level: 'alevel',
  },
  {
    id: 'youngs-modulus',
    name: "Young's Modulus",
    category: 'Physics',
    subcategory: 'Materials',
    latex: 'E = \\frac{\\sigma}{\\varepsilon} = \\frac{FL_0}{A\\,\\Delta L}',
    description: "Ratio of tensile stress to tensile strain — measure of a material's stiffness",
    solverType: 'physics',
    variables: [
      { name: "Young's Modulus E", symbol: 'E', unit: 'Pa', constraints: { positive: true } },
      { name: 'Stress σ', symbol: 'sigma', unit: 'Pa' },
      { name: 'Strain ε', symbol: 'epsilon', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { E, sigma, epsilon } = inputs;
      const results: EquationSolverResult = {};
      if (sigma !== undefined && epsilon !== undefined && epsilon !== 0) results.E = exPos(sigma / epsilon, "Young's Modulus", settings);
      if (E !== undefined && epsilon !== undefined) results.sigma = ex(E * epsilon, settings);
      if (E !== undefined && sigma !== undefined && E !== 0) results.epsilon = ex(sigma / E, settings);
      return results;
    },
    examples: [{ input: { sigma: 200e6, epsilon: 0.001 }, description: 'E = 200 MPa / 0.001 = 200 GPa (steel)' }],
    tags: ["young's modulus", 'stress', 'strain', 'stiffness', 'materials'],
    level: 'alevel',
  },
  {
    id: 'upthrust',
    name: 'Upthrust (Archimedes)',
    category: 'Physics',
    subcategory: 'Materials',
    latex: 'F = \\rho V g',
    description: "Upward buoyancy force on an object submerged in a fluid (Archimedes' principle)",
    solverType: 'physics',
    variables: [
      { name: 'Upthrust', symbol: 'F', unit: 'N', constraints: { nonNegative: true } },
      { name: 'Fluid density', symbol: 'rho', unit: 'kg/m³', constraints: { positive: true } },
      { name: 'Volume displaced', symbol: 'V', unit: 'm³', constraints: { positive: true } },
      { name: 'Gravitational field g', symbol: 'g', unit: 'm/s²' },
    ],
    solve: (inputs, settings) => {
      const { F, rho, V, g } = inputs;
      const results: EquationSolverResult = {};
      if (rho !== undefined && V !== undefined && g !== undefined) results.F = exPos(rho * V * g, 'Upthrust', settings);
      if (F !== undefined && V !== undefined && g !== undefined && V !== 0 && g !== 0) results.rho = exPos(F / (V * g), 'Density', settings);
      if (F !== undefined && rho !== undefined && g !== undefined && rho !== 0 && g !== 0) results.V = exPos(F / (rho * g), 'Volume', settings);
      return results;
    },
    examples: [{ input: { rho: 1000, V: 0.01, g: 9.81 }, description: 'F = 1000 × 0.01 × 9.81 = 98.1 N' }],
    tags: ['upthrust', 'buoyancy', 'archimedes', 'fluid'],
    level: 'gcse',
  },
  {
    id: 'moment-of-force',
    name: 'Moment of a Force',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'M = F d',
    description: 'Turning effect (torque) of a force about a pivot — force times perpendicular distance',
    solverType: 'physics',
    variables: [
      { name: 'Moment', symbol: 'M', unit: 'N·m' },
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Perpendicular distance', symbol: 'd', unit: 'm', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => {
      const { M, F, d } = inputs;
      const results: EquationSolverResult = {};
      if (F !== undefined && d !== undefined) results.M = ex(F * d, settings);
      if (M !== undefined && d !== undefined && d !== 0) results.F = ex(M / d, settings);
      if (M !== undefined && F !== undefined && F !== 0) results.d = exPos(M / F, 'Distance', settings);
      return results;
    },
    examples: [{ input: { F: 50, d: 0.3 }, description: 'M = 50 × 0.3 = 15 N·m' }],
    tags: ['moment', 'torque', 'force', 'pivot', 'turning'],
    level: 'gcse',
  },
  {
    id: 'angular-velocity',
    name: 'Angular Velocity',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: '\\omega = \\frac{v}{r} = \\frac{2\\pi}{T}',
    description: 'Angular velocity from linear speed and radius, or from period',
    solverType: 'physics',
    variables: [
      { name: 'Angular velocity ω', symbol: 'omega', unit: 'rad/s', constraints: { nonNegative: true } },
      { name: 'Linear speed', symbol: 'v', unit: 'm/s', constraints: { nonNegative: true } },
      { name: 'Radius', symbol: 'r', unit: 'm', constraints: { positive: true } },
      { name: 'Period', symbol: 'T', unit: 's', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { omega, v, r, T } = inputs;
      const results: EquationSolverResult = {};
      if (v !== undefined && r !== undefined && r !== 0) results.omega = exPos(v / r, 'ω', settings);
      if (T !== undefined) {
        const omegaFromT = 2 * Math.PI / T;
        if (omega === undefined) results.omega = exPos(omegaFromT, 'ω', settings);
      }
      if (omega !== undefined && r !== undefined) results.v = exPos(omega * r, 'Speed', settings);
      if (omega !== undefined && omega !== 0) results.T = exPos(2 * Math.PI / omega, 'Period', settings);
      if (omega !== undefined && v !== undefined && omega !== 0) results.r = exPos(v / omega, 'Radius', settings);
      return results;
    },
    examples: [
      { input: { v: 10, r: 2 }, description: 'ω = 10/2 = 5 rad/s' },
      { input: { T: 2 }, description: 'ω = 2π/2 = π rad/s' },
    ],
    tags: ['angular velocity', 'circular', 'omega', 'rotation'],
    level: 'alevel',
  },
];
