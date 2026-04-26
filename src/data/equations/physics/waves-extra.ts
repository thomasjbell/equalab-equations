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

export const wavesExtraEquations: Equation[] = [
  {
    id: 'youngs-double-slit',
    name: "Young's Double Slit",
    category: 'Physics',
    subcategory: 'Waves',
    latex: '\\lambda = \\frac{ax}{D}',
    description: 'Wavelength from fringe spacing x, slit separation a, and slit-to-screen distance D',
    solverType: 'physics',
    variables: [
      { name: 'Wavelength λ', symbol: 'lambda', unit: 'm', constraints: { positive: true } },
      { name: 'Slit separation a', symbol: 'a', unit: 'm', constraints: { positive: true } },
      { name: 'Fringe spacing x', symbol: 'x', unit: 'm', constraints: { positive: true } },
      { name: 'Screen distance D', symbol: 'D', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { lambda, a, x, D } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && x !== undefined && D !== undefined && D !== 0) results.lambda = exPos(a * x / D, 'Wavelength', settings);
      if (lambda !== undefined && x !== undefined && D !== undefined && D !== 0) results.a = exPos(lambda * D / x, 'Slit separation', settings);
      if (lambda !== undefined && a !== undefined && D !== undefined && a !== 0) results.x = exPos(lambda * D / a, 'Fringe spacing', settings);
      if (lambda !== undefined && a !== undefined && x !== undefined && x !== 0) results.D = exPos(lambda * a / x, 'Screen distance', settings);
      // Hmm, λ = ax/D so D = ax/λ
      if (lambda !== undefined && a !== undefined && x !== undefined && lambda > 0) results.D = exPos(a * x / lambda, 'Screen distance', settings);
      return results;
    },
    examples: [
      { input: { a: 5e-4, x: 2.4e-3, D: 1.2 }, description: 'λ = (5×10⁻⁴ × 2.4×10⁻³) / 1.2 = 1×10⁻⁶ m' },
    ],
    tags: ["young's", 'double slit', 'interference', 'wavelength', 'light'],
    level: 'alevel',
  },
  {
    id: 'sound-intensity-level',
    name: 'Sound Intensity Level',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'L = 10 \\log_{10}\\!\\left(\\frac{I}{I_0}\\right)',
    description: 'Sound intensity level in decibels; I₀ = 1×10⁻¹² W/m² (threshold of hearing)',
    solverType: 'physics',
    variables: [
      { name: 'Sound level L', symbol: 'L', unit: 'dB' },
      { name: 'Intensity I', symbol: 'I', unit: 'W/m²', constraints: { positive: true } },
      { name: 'Reference I₀', symbol: 'I_0', unit: 'W/m²', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { L, I, I_0 } = inputs;
      const results: EquationSolverResult = {};
      const ref = I_0 ?? 1e-12;
      if (I !== undefined && ref > 0) results.L = ex(10 * Math.log10(I / ref), settings);
      if (L !== undefined && ref > 0) results.I = exPos(ref * Math.pow(10, L / 10), 'Intensity', settings);
      return results;
    },
    examples: [
      { input: { I: 1e-6, I_0: 1e-12 }, description: 'I = 10⁻⁶ W/m² → L = 60 dB' },
      { input: { I: 1e-12, I_0: 1e-12 }, description: 'Threshold of hearing → 0 dB' },
    ],
    tags: ['sound', 'decibel', 'intensity', 'level', 'acoustics'],
    level: 'alevel',
  },
  {
    id: 'intensity-point-source',
    name: 'Intensity — Point Source',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'I = \\frac{P}{4\\pi r^2}',
    description: 'Intensity from a point source radiating uniformly in all directions (inverse square law)',
    solverType: 'physics',
    variables: [
      { name: 'Intensity I', symbol: 'I', unit: 'W/m²', constraints: { positive: true } },
      { name: 'Power P', symbol: 'P', unit: 'W', constraints: { positive: true } },
      { name: 'Distance r', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { I, P, r } = inputs;
      const results: EquationSolverResult = {};
      if (P !== undefined && r !== undefined && r > 0) results.I = exPos(P / (4 * Math.PI * r * r), 'Intensity', settings);
      if (I !== undefined && r !== undefined && r > 0) results.P = exPos(I * 4 * Math.PI * r * r, 'Power', settings);
      if (I !== undefined && P !== undefined && I > 0) results.r = exPos(Math.sqrt(P / (4 * Math.PI * I)), 'Distance', settings);
      return results;
    },
    examples: [
      { input: { P: 100, r: 2 }, description: 'I = 100 / (4π×4) ≈ 1.99 W/m²' },
    ],
    tags: ['intensity', 'inverse square', 'power', 'waves', 'radiation'],
    level: 'alevel',
  },
  {
    id: 'refractive-index-speed',
    name: 'Refractive Index (Speed)',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'n = \\frac{c}{v}',
    description: 'Refractive index as ratio of speed of light in vacuum to speed in medium',
    solverType: 'physics',
    variables: [
      { name: 'Refractive index n', symbol: 'n', unit: '', constraints: { positive: true } },
      { name: 'Speed of light c', symbol: 'c_light', unit: 'm/s', constraints: { positive: true } },
      { name: 'Speed in medium v', symbol: 'v', unit: 'm/s', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { n, c_light, v } = inputs;
      const results: EquationSolverResult = {};
      const c0 = c_light ?? 3e8;
      if (v !== undefined && v > 0) results.n = exPos(c0 / v, 'Refractive index', settings);
      if (n !== undefined && n > 0) results.v = exPos(c0 / n, 'Speed', settings);
      if (n !== undefined && v !== undefined && n > 0) results.c_light = exPos(n * v, 'Speed of light', settings);
      return results;
    },
    examples: [
      { input: { c_light: 3e8, v: 2e8 }, description: 'n = 3×10⁸ / 2×10⁸ = 1.5 (glass)' },
    ],
    tags: ['refractive index', 'speed of light', 'optics', 'medium'],
    level: 'gcse',
  },
  {
    id: 'critical-angle',
    name: 'Critical Angle',
    category: 'Physics',
    subcategory: 'Waves',
    latex: '\\sin\\theta_c = \\frac{1}{n}',
    description: 'Critical angle for total internal reflection in a medium with refractive index n',
    solverType: 'physics',
    angleMode: 'both',
    variables: [
      { name: 'Critical angle θ_c', symbol: 'theta_c', unit: '°' },
      { name: 'Refractive index n', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { theta_c, n } = inputs;
      const results: EquationSolverResult = {};
      const toDeg = settings?.angle_mode === 'radians' ? 1 : 180 / Math.PI;
      if (n !== undefined && n >= 1) results.theta_c = exPos(Math.asin(1 / n) * toDeg, 'Critical angle', settings);
      if (theta_c !== undefined) {
        const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
        const sinC = Math.sin(theta_c * toRad);
        if (sinC > 0) results.n = exPos(1 / sinC, 'Refractive index', settings);
      }
      return results;
    },
    examples: [
      { input: { n: 1.5 }, description: 'Glass: θ_c = arcsin(2/3) ≈ 41.8°' },
    ],
    tags: ['critical angle', 'total internal reflection', 'refraction', 'optics'],
    level: 'gcse',
  },
];
