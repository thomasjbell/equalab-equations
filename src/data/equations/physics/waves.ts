import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const wavesEquations: Equation[] = [
  {
    id: 'wave-velocity',
    name: 'Wave Velocity',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'v = f\\lambda',
    description: 'Find any variable in the wave equation relating velocity, frequency, and wavelength',
    solverType: 'linear',
    variables: [
      { name: 'Wave Speed', symbol: 'v', unit: 'm/s' },
      { name: 'Frequency', symbol: 'f', unit: 'Hz', constraints: { positive: true } },
      { name: 'Wavelength', symbol: 'lambda', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ v: 'f * lambda', f: 'v / lambda', lambda: 'v / f' }, inputs, settings)
    ),
    examples: [{ input: { f: 440, lambda: 0.77 }, description: 'Sound wave at 440 Hz' }],
    tags: ['wave', 'frequency', 'wavelength', 'speed'],
    level: 'gcse',
  },
  {
    id: 'snells-law',
    name: "Snell's Law",
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)',
    description: 'Refraction of light between two media — also finds total internal reflection conditions',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Refractive Index 1', symbol: 'n_1', unit: '' },
      { name: 'Angle 1', symbol: 'theta_1', unit: '°' },
      { name: 'Refractive Index 2', symbol: 'n_2', unit: '' },
      { name: 'Angle 2', symbol: 'theta_2', unit: '°' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { n_1, theta_1, n_2, theta_2 } = inputs;
      const results: EquationSolverResult = {};
      const useRad = settings?.angle_mode === 'radians';
      const toRad = (x: number) => useRad ? x : (x * Math.PI) / 180;
      const fromRad = (x: number) => useRad ? x : (x * 180) / Math.PI;

      if (n_1 !== undefined && theta_1 !== undefined && n_2 !== undefined && theta_2 === undefined) {
        const sin2 = (n_1 * Math.sin(toRad(theta_1))) / n_2;
        if (Math.abs(sin2) <= 1) {
          results.theta_2 = { value: SymbolicConverter.convertToExact(fromRad(Math.asin(sin2)), settings), validity: 'valid' };
        } else {
          results.theta_2 = {
            value: SymbolicConverter.convertToExact(90, settings),
            validity: 'invalid',
            validityReason: 'Total internal reflection — no refracted ray',
          };
        }
      }
      if (n_2 !== undefined && theta_2 !== undefined && n_1 !== undefined && theta_1 === undefined) {
        const sin1 = (n_2 * Math.sin(toRad(theta_2))) / n_1;
        if (Math.abs(sin1) <= 1) {
          results.theta_1 = { value: SymbolicConverter.convertToExact(fromRad(Math.asin(sin1)), settings), validity: 'valid' };
        }
      }
      if (n_1 !== undefined && theta_1 !== undefined && theta_2 !== undefined && n_2 === undefined && Math.sin(toRad(theta_2)) !== 0) {
        const n2 = (n_1 * Math.sin(toRad(theta_1))) / Math.sin(toRad(theta_2));
        results.n_2 = { value: SymbolicConverter.convertToExact(n2, settings), validity: n2 > 0 ? 'valid' : 'invalid' };
      }
      return results;
    },
    examples: [{ input: { n_1: 1, theta_1: 30, n_2: 1.5 }, description: 'θ₂ ≈ 19.47°' }],
    tags: ["Snell's law", 'refraction', 'optics', 'light'],
    level: 'gcse',
  },
  {
    id: 'doppler-effect',
    name: 'Doppler Effect',
    category: 'Physics',
    subcategory: 'Waves',
    latex: "f' = f \\frac{v + v_o}{v - v_s}",
    description: 'Observed frequency due to relative motion of source and observer',
    solverType: 'physics',
    variables: [
      { name: 'Observed Frequency', symbol: 'f_obs', unit: 'Hz' },
      { name: 'Source Frequency', symbol: 'f', unit: 'Hz' },
      { name: 'Wave Speed', symbol: 'v', unit: 'm/s' },
      { name: 'Observer Speed (+ toward source)', symbol: 'v_o', unit: 'm/s' },
      { name: 'Source Speed (+ toward observer)', symbol: 'v_s', unit: 'm/s' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { f_obs, f, v, v_o, v_s } = inputs;
      const results: EquationSolverResult = {};
      if (f !== undefined && v !== undefined && v_o !== undefined && v_s !== undefined && f_obs === undefined) {
        const denom = v - v_s;
        if (denom !== 0) results.f_obs = { value: SymbolicConverter.convertToExact(f * (v + v_o) / denom, settings), validity: 'valid' };
      }
      if (f_obs !== undefined && v !== undefined && v_o !== undefined && v_s !== undefined && f === undefined) {
        const num = v + v_o;
        if (num !== 0) results.f = { value: SymbolicConverter.convertToExact(f_obs * (v - v_s) / num, settings), validity: 'valid' };
      }
      return results;
    },
    examples: [{ input: { f: 1000, v: 343, v_o: 0, v_s: 34.3 }, description: 'Source approaching at 34.3 m/s' }],
    tags: ['Doppler', 'frequency', 'motion', 'sound'],
    level: 'alevel',
  },
  {
    id: 'diffraction-grating',
    name: 'Diffraction Grating',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'd\\sin\\theta = n\\lambda',
    description: 'Condition for constructive interference from a diffraction grating',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Slit Spacing', symbol: 'd', unit: 'm', constraints: { positive: true } },
      { name: 'Diffraction Angle', symbol: 'theta', unit: '°' },
      { name: 'Order', symbol: 'n', unit: '' },
      { name: 'Wavelength', symbol: 'lambda', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { d, theta, n, lambda } = inputs;
      const results: EquationSolverResult = {};
      const useRad = settings?.angle_mode === 'radians';
      const toRad = (x: number) => useRad ? x : (x * Math.PI) / 180;
      const fromRad = (x: number) => useRad ? x : (x * 180) / Math.PI;

      if (d !== undefined && n !== undefined && lambda !== undefined && theta === undefined) {
        const sinTheta = (n * lambda) / d;
        if (Math.abs(sinTheta) <= 1) {
          results.theta = { value: SymbolicConverter.convertToExact(fromRad(Math.asin(sinTheta)), settings), validity: 'valid' };
        } else {
          results.theta = { value: SymbolicConverter.convertToExact(0, settings), validity: 'invalid', validityReason: `Order ${n} does not exist for this grating and wavelength` };
        }
      }
      if (d !== undefined && theta !== undefined && n !== undefined && lambda === undefined)
        results.lambda = { value: SymbolicConverter.convertToExact((d * Math.sin(toRad(theta))) / n, settings), validity: 'valid' };
      if (theta !== undefined && n !== undefined && lambda !== undefined && d === undefined)
        results.d = { value: SymbolicConverter.convertToExact((n * lambda) / Math.sin(toRad(theta)), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { d: 1e-6, n: 1, lambda: 633e-9 }, description: 'Red laser (633 nm), 1st order' }],
    tags: ['diffraction', 'grating', 'interference', 'wavelength'],
    level: 'alevel',
  },
  {
    id: 'photoelectric-effect',
    name: 'Photoelectric Effect',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'hf = \\Phi + KE_{max}',
    description: 'Find variables in the photoelectric equation',
    solverType: 'linear',
    variables: [
      { name: 'Photon Energy', symbol: 'hf', unit: 'J' },
      { name: 'Work Function', symbol: 'Phi', unit: 'J' },
      { name: 'Max Kinetic Energy', symbol: 'KE_max', unit: 'J' },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ hf: 'Phi + KE_max', Phi: 'hf - KE_max', KE_max: 'hf - Phi' }, inputs, settings)
    ),
    examples: [{ input: { hf: 3.2e-19, Phi: 2.1e-19 }, description: 'KE_max = 1.1×10⁻¹⁹ J' }],
    tags: ['photoelectric', 'photon', 'work function', 'quantum'],
    level: 'alevel',
  },
  {
    id: 'period-frequency',
    name: 'Period and Frequency',
    category: 'Physics',
    subcategory: 'Waves',
    latex: 'T = \\frac{1}{f}',
    description: 'Relationship between period and frequency',
    solverType: 'linear',
    variables: [
      { name: 'Period', symbol: 'T', unit: 's', constraints: { positive: true } },
      { name: 'Frequency', symbol: 'f', unit: 'Hz', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ T: '1 / f', f: '1 / T' }, inputs, settings)
    ),
    examples: [{ input: { f: 50 }, description: 'Mains frequency: T = 0.02 s' }],
    tags: ['period', 'frequency', 'oscillation'],
    level: 'gcse',
  },
];
