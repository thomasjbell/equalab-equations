import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const mechanicsEquations: Equation[] = [
  {
    id: 'suvat-equations',
    name: 'SUVAT Equations',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'v = u + at \\quad s = ut + \\frac{1}{2}at^2 \\quad v^2 = u^2 + 2as',
    description: 'Uniformly accelerated motion — enter any 3 values to find the other 2',
    solverType: 'suvat',
    variables: [
      { name: 'Displacement', symbol: 's', unit: 'm', constraints: {} },
      { name: 'Initial Velocity', symbol: 'u', unit: 'm/s' },
      { name: 'Final Velocity', symbol: 'v', unit: 'm/s' },
      { name: 'Acceleration', symbol: 'a', unit: 'm/s²' },
      { name: 'Time', symbol: 't', unit: 's', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { s, u, v, a, t } = inputs;
      const known = Object.keys(inputs).filter(k => inputs[k] !== undefined);
      const missing = ['s', 'u', 'v', 'a', 't'].filter(k => inputs[k] === undefined);
      if (known.length !== 3 || missing.length !== 2) return {};

      const ex = (n: number) => ({ value: SymbolicConverter.convertToExact(n, settings), validity: 'valid' as const });
      const exT = (n: number) => ({
        value: SymbolicConverter.convertToExact(n, settings),
        validity: n < 0 ? 'invalid' as const : 'valid' as const,
        validityReason: n < 0 ? 'Time cannot be negative' : undefined,
      });

      const results: EquationSolverResult = {};
      const missingSet = missing.sort().join('');

      switch (missingSet) {
        case 'as': // Given u, v, t
          results.a = ex((v! - u!) / t!);
          results.s = ex(0.5 * (u! + v!) * t!);
          break;
        case 'at': { // Given s, u, v — avoid division by zero
          const dv = u! + v!;
          results.a = ex((v! * v! - u! * u!) / (2 * s!));
          results.t = exT(dv !== 0 ? (2 * s!) / dv : 0);
          break;
        }
        case 'av': { // Given s, u, t
          const calcA = (2 * (s! - u! * t!)) / (t! * t!);
          results.a = ex(calcA);
          results.v = ex(u! + calcA * t!);
          break;
        }
        case 'au': { // Given s, v, t
          const calcU = (2 * s!) / t! - v!;
          results.u = ex(calcU);
          results.a = ex((v! - calcU) / t!);
          break;
        }
        case 'st': { // Given u, v, a
          if (a! !== 0) {
            const calcT = (v! - u!) / a!;
            results.t = exT(calcT);
            results.s = ex(u! * calcT + 0.5 * a! * calcT * calcT);
          }
          break;
        }
        case 'su': { // Given v, a, t
          const calcU = v! - a! * t!;
          results.u = ex(calcU);
          results.s = ex(calcU * t! + 0.5 * a! * t! * t!);
          break;
        }
        case 'sv': { // Given u, a, t
          const calcV = u! + a! * t!;
          results.v = ex(calcV);
          results.s = ex(u! * t! + 0.5 * a! * t! * t!);
          break;
        }
        case 'tv': { // Given s, u, a  →  ½at² + ut - s = 0
          if (a! !== 0) {
            const disc = u! * u! + 2 * a! * s!;
            if (disc >= 0) {
              const t1 = (-u! + Math.sqrt(disc)) / a!;
              const t2 = (-u! - Math.sqrt(disc)) / a!;
              if (Math.abs(t1 - t2) < 1e-9) {
                results.t = exT(t1);
                results.v = ex(u! + a! * t1);
              } else {
                results.t = [exT(t1), exT(t2)];
                results.v = [ex(u! + a! * t1), ex(u! + a! * t2)];
              }
            }
          } else {
            results.v = ex(u!);
            results.t = exT(s! !== 0 ? 0 : NaN);
          }
          break;
        }
        case 'tu': { // Given s, v, a  →  ½at² - vt + s = 0
          if (a! !== 0) {
            const disc = v! * v! - 2 * a! * s!;
            if (disc >= 0) {
              const t1 = (v! + Math.sqrt(disc)) / a!;
              const t2 = (v! - Math.sqrt(disc)) / a!;
              if (Math.abs(t1 - t2) < 1e-9) {
                results.t = exT(t1);
                results.u = ex(v! - a! * t1);
              } else {
                results.t = [exT(t1), exT(t2)];
                results.u = [ex(v! - a! * t1), ex(v! - a! * t2)];
              }
            }
          }
          break;
        }
        case 'uv': { // Given s, a, t
          const calcU = (s! - 0.5 * a! * t! * t!) / t!;
          results.u = ex(calcU);
          results.v = ex(calcU + a! * t!);
          break;
        }
      }
      return results;
    },
    examples: [
      { input: { u: 0, a: 9.8, t: 2 }, description: 'Free fall for 2 seconds' },
      { input: { s: 100, u: 0, v: 20 }, description: 'Accelerating from rest' },
    ],
    tags: ['suvat', 'kinematics', 'motion', 'acceleration', 'velocity'],
    level: 'gcse',
  },
  {
    id: 'newtons-second-law',
    name: "Newton's Second Law",
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'F = ma',
    description: 'Calculate force, mass, or acceleration',
    solverType: 'physics',
    variables: [
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Acceleration', symbol: 'a', unit: 'm/s²' },
    ],
    solve: (inputs, settings) => {
      const raw = EnhancedSolver.solvePhysics('force', inputs, settings);
      const results: EquationSolverResult = {};
      for (const [k, v] of Object.entries(raw)) {
        const validity = k === 'm' && v.decimal < 0 ? 'invalid' : 'valid';
        results[k] = { value: v, validity, validityReason: validity === 'invalid' ? 'Mass cannot be negative' : undefined };
      }
      return results;
    },
    examples: [{ input: { m: 5, a: 2 }, description: 'F = 10 N' }],
    tags: ['force', 'mass', 'acceleration', 'newton'],
    level: 'gcse',
  },
  {
    id: 'kinetic-energy',
    name: 'Kinetic Energy',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'KE = \\frac{1}{2}mv^2',
    description: 'Calculate kinetic energy from mass and velocity',
    solverType: 'physics',
    variables: [
      { name: 'Kinetic Energy', symbol: 'KE', unit: 'J' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Velocity', symbol: 'v', unit: 'm/s' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solvePhysics('kinetic_energy', inputs, settings)),
    examples: [{ input: { m: 2, v: 10 }, description: 'KE = 100 J' }],
    tags: ['kinetic energy', 'mass', 'velocity', 'energy'],
    level: 'gcse',
  },
  {
    id: 'potential-energy',
    name: 'Gravitational Potential Energy',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'PE = mgh',
    description: 'Calculate gravitational potential energy',
    solverType: 'physics',
    variables: [
      { name: 'Potential Energy', symbol: 'PE', unit: 'J' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Gravity', symbol: 'g', unit: 'm/s²' },
      { name: 'Height', symbol: 'h', unit: 'm' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solvePhysics('potential_energy', inputs, settings)),
    examples: [{ input: { m: 10, g: 9.8, h: 5 }, description: 'PE = 490 J' }],
    tags: ['potential energy', 'gravity', 'height', 'energy'],
    level: 'gcse',
  },
  {
    id: 'momentum',
    name: 'Momentum',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'p = mv',
    description: 'Calculate momentum, mass, or velocity',
    solverType: 'linear',
    variables: [
      { name: 'Momentum', symbol: 'p', unit: 'kg·m/s' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Velocity', symbol: 'v', unit: 'm/s' },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveLinear({ p: 'm * v', m: 'p / v', v: 'p / m' }, inputs, settings)),
    examples: [{ input: { m: 70, v: 2 }, description: 'p = 140 kg·m/s' }],
    tags: ['momentum', 'mass', 'velocity'],
    level: 'gcse',
  },
  {
    id: 'impulse',
    name: 'Impulse',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'J = F \\Delta t = \\Delta p',
    description: 'Calculate impulse from force and time, or change in momentum',
    solverType: 'linear',
    variables: [
      { name: 'Impulse', symbol: 'J', unit: 'N·s' },
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Time Interval', symbol: 'dt', unit: 's', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveLinear({ J: 'F * dt', F: 'J / dt', dt: 'J / F' }, inputs, settings)),
    examples: [{ input: { F: 50, dt: 0.1 }, description: 'J = 5 N·s' }],
    tags: ['impulse', 'force', 'time', 'momentum'],
    level: 'alevel',
  },
  {
    id: 'circular-velocity',
    name: 'Circular Motion — Velocity',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'v = \\omega r',
    description: 'Tangential velocity from angular velocity and radius',
    solverType: 'linear',
    variables: [
      { name: 'Velocity', symbol: 'v', unit: 'm/s' },
      { name: 'Angular Velocity', symbol: 'omega', unit: 'rad/s' },
      { name: 'Radius', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveLinear({ v: 'omega * r', omega: 'v / r', r: 'v / omega' }, inputs, settings)),
    examples: [{ input: { omega: 2, r: 5 }, description: 'v = 10 m/s' }],
    tags: ['circular motion', 'angular velocity', 'radius'],
    level: 'alevel',
  },
  {
    id: 'centripetal-acceleration',
    name: 'Centripetal Acceleration',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'a = \\frac{v^2}{r}',
    description: 'Centripetal acceleration for circular motion',
    solverType: 'physics',
    variables: [
      { name: 'Centripetal Acceleration', symbol: 'a', unit: 'm/s²' },
      { name: 'Velocity', symbol: 'v', unit: 'm/s' },
      { name: 'Radius', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { a, v, r } = inputs;
      const results: EquationSolverResult = {};
      if (v !== undefined && r !== undefined && a === undefined)
        results.a = { value: SymbolicConverter.convertToExact((v * v) / r, settings), validity: 'valid' };
      if (a !== undefined && r !== undefined && v === undefined)
        results.v = { value: SymbolicConverter.convertToExact(Math.sqrt(a * r), settings), validity: 'valid' };
      if (a !== undefined && v !== undefined && r === undefined && a !== 0)
        results.r = { value: SymbolicConverter.convertToExact((v * v) / a, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { v: 10, r: 5 }, description: 'a = 20 m/s²' }],
    tags: ['centripetal', 'circular motion', 'acceleration'],
    level: 'alevel',
  },
  {
    id: 'centripetal-force',
    name: 'Centripetal Force',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'F = \\frac{mv^2}{r}',
    description: 'Centripetal force for circular motion',
    solverType: 'physics',
    variables: [
      { name: 'Centripetal Force', symbol: 'F', unit: 'N' },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Velocity', symbol: 'v', unit: 'm/s' },
      { name: 'Radius', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { F, m, v, r } = inputs;
      const results: EquationSolverResult = {};
      if (m !== undefined && v !== undefined && r !== undefined && F === undefined)
        results.F = { value: SymbolicConverter.convertToExact((m * v * v) / r, settings), validity: 'valid' };
      if (F !== undefined && v !== undefined && r !== undefined && m === undefined)
        results.m = { value: SymbolicConverter.convertToExact((F * r) / (v * v), settings), validity: 'valid' };
      if (F !== undefined && m !== undefined && r !== undefined && v === undefined)
        results.v = { value: SymbolicConverter.convertToExact(Math.sqrt((F * r) / m), settings), validity: 'valid' };
      if (F !== undefined && m !== undefined && v !== undefined && r === undefined)
        results.r = { value: SymbolicConverter.convertToExact((m * v * v) / F, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { m: 2, v: 10, r: 5 }, description: 'F = 40 N' }],
    tags: ['centripetal', 'circular motion', 'force'],
    level: 'alevel',
  },
  {
    id: 'shm-period-spring',
    name: 'SHM Period — Spring',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'T = 2\\pi\\sqrt{\\frac{m}{k}}',
    description: 'Period of a mass on a spring in simple harmonic motion',
    solverType: 'physics',
    variables: [
      { name: 'Period', symbol: 'T', unit: 's', constraints: { positive: true } },
      { name: 'Mass', symbol: 'm', unit: 'kg', constraints: { positive: true } },
      { name: 'Spring Constant', symbol: 'k', unit: 'N/m', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { T, m, k } = inputs;
      const results: EquationSolverResult = {};
      if (m !== undefined && k !== undefined && T === undefined)
        results.T = { value: SymbolicConverter.convertToExact(2 * Math.PI * Math.sqrt(m / k), settings), validity: 'valid' };
      if (T !== undefined && k !== undefined && m === undefined)
        results.m = { value: SymbolicConverter.convertToExact(k * (T / (2 * Math.PI)) ** 2, settings), validity: 'valid' };
      if (T !== undefined && m !== undefined && k === undefined)
        results.k = { value: SymbolicConverter.convertToExact(m * (2 * Math.PI / T) ** 2, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { m: 1, k: 9.87 }, description: 'T ≈ 2 s' }],
    tags: ['SHM', 'spring', 'period', 'oscillation'],
    level: 'alevel',
  },
  {
    id: 'shm-period-pendulum',
    name: 'SHM Period — Pendulum',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'T = 2\\pi\\sqrt{\\frac{l}{g}}',
    description: 'Period of a simple pendulum in small oscillations',
    solverType: 'physics',
    variables: [
      { name: 'Period', symbol: 'T', unit: 's', constraints: { positive: true } },
      { name: 'Length', symbol: 'l', unit: 'm', constraints: { positive: true } },
      { name: 'Gravitational Acceleration', symbol: 'g', unit: 'm/s²' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { T, l, g } = inputs;
      const results: EquationSolverResult = {};
      if (l !== undefined && g !== undefined && T === undefined)
        results.T = { value: SymbolicConverter.convertToExact(2 * Math.PI * Math.sqrt(l / g), settings), validity: 'valid' };
      if (T !== undefined && g !== undefined && l === undefined)
        results.l = { value: SymbolicConverter.convertToExact(g * (T / (2 * Math.PI)) ** 2, settings), validity: 'valid' };
      if (T !== undefined && l !== undefined && g === undefined)
        results.g = { value: SymbolicConverter.convertToExact(l * (2 * Math.PI / T) ** 2, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { l: 1, g: 9.81 }, description: 'T ≈ 2.006 s' }],
    tags: ['SHM', 'pendulum', 'period', 'oscillation'],
    level: 'alevel',
  },
  {
    id: 'universal-gravitation',
    name: 'Universal Gravitation',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'F = \\frac{Gm_1 m_2}{r^2}',
    description: "Newton's law of universal gravitation between two masses",
    solverType: 'physics',
    variables: [
      { name: 'Gravitational Force', symbol: 'F', unit: 'N' },
      { name: 'Gravitational Constant', symbol: 'G', unit: 'N·m²/kg²' },
      { name: 'Mass 1', symbol: 'm1', unit: 'kg', constraints: { positive: true } },
      { name: 'Mass 2', symbol: 'm2', unit: 'kg', constraints: { positive: true } },
      { name: 'Separation', symbol: 'r', unit: 'm', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { F, G, m1, m2, r } = inputs;
      const results: EquationSolverResult = {};
      if (G !== undefined && m1 !== undefined && m2 !== undefined && r !== undefined && F === undefined)
        results.F = { value: SymbolicConverter.convertToExact((G * m1 * m2) / (r * r), settings), validity: 'valid' };
      if (F !== undefined && G !== undefined && m1 !== undefined && r !== undefined && m2 === undefined)
        results.m2 = { value: SymbolicConverter.convertToExact((F * r * r) / (G * m1), settings), validity: 'valid' };
      if (F !== undefined && G !== undefined && m2 !== undefined && r !== undefined && m1 === undefined)
        results.m1 = { value: SymbolicConverter.convertToExact((F * r * r) / (G * m2), settings), validity: 'valid' };
      if (F !== undefined && G !== undefined && m1 !== undefined && m2 !== undefined && r === undefined)
        results.r = { value: SymbolicConverter.convertToExact(Math.sqrt((G * m1 * m2) / F), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { G: 6.674e-11, m1: 5.972e24, m2: 7.342e22, r: 3.844e8 }, description: 'Earth-Moon gravitational force' }],
    tags: ['gravity', 'gravitation', 'Newton', 'force'],
    level: 'alevel',
  },
  {
    id: 'work-done',
    name: 'Work Done',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'W = Fd\\cos\\theta',
    description: 'Work done by a force at an angle to displacement',
    solverType: 'physics',
    angleMode: 'both',
    variables: [
      { name: 'Work Done', symbol: 'W', unit: 'J' },
      { name: 'Force', symbol: 'F', unit: 'N' },
      { name: 'Distance', symbol: 'd', unit: 'm', constraints: { nonNegative: true } },
      { name: 'Angle', symbol: 'theta', unit: '°' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { W, F, d, theta } = inputs;
      const results: EquationSolverResult = {};
      const useRad = settings?.angle_mode === 'radians';
      const toRad = (x: number) => useRad ? x : (x * Math.PI) / 180;
      if (F !== undefined && d !== undefined && theta !== undefined && W === undefined)
        results.W = { value: SymbolicConverter.convertToExact(F * d * Math.cos(toRad(theta)), settings), validity: 'valid' };
      if (W !== undefined && d !== undefined && theta !== undefined && F === undefined && d !== 0)
        results.F = { value: SymbolicConverter.convertToExact(W / (d * Math.cos(toRad(theta))), settings), validity: 'valid' };
      if (W !== undefined && F !== undefined && theta !== undefined && d === undefined && F !== 0)
        results.d = { value: SymbolicConverter.convertToExact(W / (F * Math.cos(toRad(theta))), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { F: 100, d: 10, theta: 0 }, description: 'W = 1000 J (force parallel to motion)' }],
    tags: ['work', 'energy', 'force', 'displacement'],
    level: 'gcse',
  },
  {
    id: 'power',
    name: 'Mechanical Power',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: 'P = \\frac{W}{t} = Fv',
    description: 'Rate of doing work, or force times velocity',
    solverType: 'linear',
    variables: [
      { name: 'Power', symbol: 'P', unit: 'W' },
      { name: 'Work Done', symbol: 'W', unit: 'J' },
      { name: 'Time', symbol: 't', unit: 's', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(EnhancedSolver.solveLinear({ P: 'W / t', W: 'P * t', t: 'W / P' }, inputs, settings)),
    examples: [{ input: { W: 1000, t: 5 }, description: 'P = 200 W' }],
    tags: ['power', 'work', 'time'],
    level: 'gcse',
  },
  {
    id: 'efficiency',
    name: 'Efficiency',
    category: 'Physics',
    subcategory: 'Mechanics',
    latex: '\\eta = \\frac{P_{out}}{P_{in}} \\times 100\\%',
    description: 'Efficiency as a percentage of useful output to total input power',
    solverType: 'linear',
    variables: [
      { name: 'Efficiency (%)', symbol: 'eta', unit: '%' },
      { name: 'Useful Output Power', symbol: 'P_out', unit: 'W' },
      { name: 'Total Input Power', symbol: 'P_in', unit: 'W' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { eta, P_out, P_in } = inputs;
      const results: EquationSolverResult = {};
      if (P_out !== undefined && P_in !== undefined && eta === undefined)
        results.eta = { value: SymbolicConverter.convertToExact((P_out / P_in) * 100, settings), validity: 'valid' };
      if (eta !== undefined && P_in !== undefined && P_out === undefined)
        results.P_out = { value: SymbolicConverter.convertToExact((eta / 100) * P_in, settings), validity: 'valid' };
      if (eta !== undefined && P_out !== undefined && P_in === undefined && eta !== 0)
        results.P_in = { value: SymbolicConverter.convertToExact((P_out / eta) * 100, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { P_out: 800, P_in: 1000 }, description: '80% efficient' }],
    tags: ['efficiency', 'power', 'energy'],
    level: 'gcse',
  },
];
