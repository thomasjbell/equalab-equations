import { SymbolicEquation } from '@/types/symbolicEquation';
import { EnhancedSolver } from './enhancedSolver';
import { SymbolicConverter } from './symbolicConverter';

export const symbolicEquations: SymbolicEquation[] = [
  {
    id: 'ohms-law',
    name: "Ohm's Law",
    category: 'Electronics',
    latex: 'V = I \\cdot R',
    description: 'Relationship between voltage, current, and resistance',
    variables: [
      { name: 'Voltage', symbol: 'V', unit: 'V' },
      { name: 'Current', symbol: 'I', unit: 'A' },
      { name: 'Resistance', symbol: 'R', unit: 'Ω' },
    ],
    solve: (inputs) => EnhancedSolver.solveLinear({
      V: 'I * R',
      I: 'V / R',
      R: 'V / I',
    }, inputs),
    examples: [
      {
        input: { V: 12, R: 4 },
        expectedOutput: { I: { type: 'integer', decimal: 3, exact: 3, latex: '3', simplified: true } }
      }
    ]
  },

  {
    id: 'quadratic-formula',
    name: 'Quadratic Formula',
    category: 'Algebra',
    latex: 'ax^2 + bx + c = 0 \\Rightarrow x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solves quadratic equations with exact symbolic results including combined surds and fractions',
    variables: [
      { name: 'Coefficient a', symbol: 'a', unit: '' },
      { name: 'Coefficient b', symbol: 'b', unit: '' },
      { name: 'Coefficient c', symbol: 'c', unit: '' },
      { name: 'Discriminant', symbol: 'discriminant', unit: '' },
      { name: 'Solution x₁', symbol: 'x_1', unit: '' },
      { name: 'Solution x₂', symbol: 'x_2', unit: '' },
    ],
    solve: (inputs) => EnhancedSolver.solveQuadratic(inputs),
    examples: [
      {
        input: { a: 1, b: 0, c: -2 },
        expectedOutput: {
          discriminant: { type: 'integer', decimal: 8, exact: 8, latex: '8', simplified: true },
          x_1: { type: 'surd', decimal: 1.414, exact: { coefficient: 1, radicand: 2 }, latex: '\\sqrt{2}', simplified: true },
          x_2: { type: 'surd', decimal: -1.414, exact: { coefficient: -1, radicand: 2 }, latex: '-\\sqrt{2}', simplified: true }
        }
      },
      {
        input: { a: 2, b: 3, c: 1 },
        expectedOutput: {
          discriminant: { type: 'integer', decimal: 1, exact: 1, latex: '1', simplified: true },
          x_1: { type: 'fraction', decimal: -0.5, exact: { numerator: -1, denominator: 2 }, latex: '-\\frac{1}{2}', simplified: true },
          x_2: { type: 'integer', decimal: -1, exact: -1, latex: '-1', simplified: true }
        }
      }
    ]
  },

  {
    id: 'circle-area',
    name: 'Area of Circle',
    category: 'Geometry',
    latex: 'A = \\pi r^2',
    description: 'Calculate circle area with exact π expressions',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²' },
      { name: 'Radius', symbol: 'r', unit: 'units' },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric('circle_area', inputs),
    examples: [
      {
        input: { r: 3 },
        expectedOutput: {
          A: { type: 'expression', decimal: 28.274, exact: { numerator: 9, denominator: 1 }, latex: '9\\pi', simplified: true }
        }
      }
    ]
  },

  {
    id: 'pythagoras',
    name: 'Pythagorean Theorem',
    category: 'Geometry',
    latex: 'c^2 = a^2 + b^2',
    description: 'Calculate triangle sides with exact surd results',
    variables: [
      { name: 'Side a', symbol: 'a', unit: 'units' },
      { name: 'Side b', symbol: 'b', unit: 'units' },
      { name: 'Hypotenuse c', symbol: 'c', unit: 'units' },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric('pythagoras', inputs),
    examples: [
      {
        input: { a: 3, b: 4 },
        expectedOutput: {
          c: { type: 'integer', decimal: 5, exact: 5, latex: '5', simplified: true }
        }
      },
      {
        input: { a: 1, b: 1 },
        expectedOutput: {
          c: { type: 'surd', decimal: 1.414, exact: { coefficient: 1, radicand: 2 }, latex: '\\sqrt{2}', simplified: true }
        }
      }
    ]
  },

  {
    id: 'unit-circle',
    name: 'Unit Circle Values',
    category: 'Trigonometry',
    latex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1',
    description: 'Calculate exact trigonometric values for common angles',
    variables: [
      { name: 'Angle (degrees)', symbol: 'degrees', unit: '°' },
      { name: 'sin(θ)', symbol: 'sin_theta', unit: '' },
      { name: 'cos(θ)', symbol: 'cos_theta', unit: '' },
      { name: 'tan(θ)', symbol: 'tan_theta', unit: '' },
    ],
    solve: (inputs) => {
      const { degrees } = inputs;
      if (degrees === undefined) return {};
      
      const results: any = {};
      
      // Define exact values for common angles
      const exactValues: Record<number, { sin: string, cos: string, tan: string }> = {
        0: { sin: '0', cos: '1', tan: '0' },
        30: { sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}' },
        45: { sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1' },
        60: { sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}' },
        90: { sin: '1', cos: '0', tan: '\\text{undefined}' },
      };
      
      if (exactValues[degrees]) {
        const exact = exactValues[degrees];
        results.sin_theta = {
          type: 'expression',
          decimal: Math.sin(degrees * Math.PI / 180),
          latex: exact.sin,
          simplified: true
        };
        results.cos_theta = {
          type: 'expression',
          decimal: Math.cos(degrees * Math.PI / 180),
          latex: exact.cos,
          simplified: true
        };
        results.tan_theta = {
          type: 'expression',
          decimal: Math.tan(degrees * Math.PI / 180),
          latex: exact.tan,
          simplified: true
        };
      }
      
      return results;
    }
  },
  // Add these new equations to your symbolicEquations array in src/lib/symbolicEquationsData.ts

{
  id: 'capacitance',
  name: 'Capacitance',
  category: 'Electronics',
  latex: 'C = \\frac{Q}{V}',
  description: 'Find any of the variables in the standard equation for capacitance',
  variables: [
    { name: 'Capacitance', symbol: 'C', unit: 'F' },
    { name: 'Charge', symbol: 'Q', unit: 'C' },
    { name: 'Voltage', symbol: 'V', unit: 'V' },
  ],
  solve: (inputs) => EnhancedSolver.solveLinear({
    C: 'Q / V',
    Q: 'C * V',
    V: 'Q / C',
  }, inputs),
  examples: [
    {
      input: { Q: 0.001, V: 12 },
      expectedOutput: { C: { type: 'fraction', decimal: 0.0000833, exact: { numerator: 1, denominator: 12000 }, latex: '\\frac{1}{12000}', simplified: true } }
    }
  ]
},

{
  id: 'compound-interest',
  name: 'Compound Interest',
  category: 'Finance',
  latex: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
  description: 'Calculate compound interest with principal, rate, compounding frequency and time',
  variables: [
    { name: 'Final Amount', symbol: 'A', unit: '$' },
    { name: 'Principal', symbol: 'P', unit: '$' },
    { name: 'Annual Rate', symbol: 'r', unit: '' },
    { name: 'Compounds per Year', symbol: 'n', unit: '' },
    { name: 'Time in Years', symbol: 't', unit: 'years' },
  ],
  solve: (inputs) => {
    const { P, r, n, t, A } = inputs;
    const results: any = {};
    
    if (P !== undefined && r !== undefined && n !== undefined && t !== undefined) {
      const amount = P * Math.pow(1 + r/n, n * t);
      results.A = SymbolicConverter.convertToExact(amount);
    }
    
    return results;
  },
  examples: [
    {
      input: { P: 1000, r: 0.05, n: 12, t: 1 },
      expectedOutput: { A: { type: 'decimal', decimal: 1051.16, latex: '1051.16', simplified: false } }
    }
  ]
},

{
  id: 'suvat-equations',
  name: 'SUVAT Equations (Kinematics)',
  category: 'Physics',
  latex: 'v = u + at \\quad s = ut + \\frac{1}{2}at^2 \\quad v^2 = u^2 + 2as',
  description: 'Uniformly accelerated motion equations - finds any 2 missing variables when 3 are provided',
  variables: [
    { name: 'Displacement', symbol: 's', unit: 'm' },
    { name: 'Initial Velocity', symbol: 'u', unit: 'm/s' },
    { name: 'Final Velocity', symbol: 'v', unit: 'm/s' },
    { name: 'Acceleration', symbol: 'a', unit: 'm/s²' },
    { name: 'Time', symbol: 't', unit: 's' },
  ],
  solve: (inputs) => EnhancedSolver.solveSUVAT(inputs),
  examples: [
    {
      input: { u: 0, a: 9.8, t: 2 },
      expectedOutput: { 
        v: { type: 'decimal', decimal: 19.6, latex: '19.6', simplified: false },
        s: { type: 'decimal', decimal: 19.6, latex: '19.6', simplified: false }
      }
    },
    {
      input: { s: 100, u: 0, v: 20 },
      expectedOutput: {
        a: { type: 'integer', decimal: 2, exact: 2, latex: '2', simplified: true },
        t: { type: 'integer', decimal: 10, exact: 10, latex: '10', simplified: true }
      }
    }
  ]
},

{
  id: 'photoelectric-effect',
  name: 'Photoelectric Effect',
  category: 'Physics',
  latex: 'hf = \\Phi + KE_{max}',
  description: 'Find variables in the photoelectric equation relating photon energy to work function and kinetic energy',
  variables: [
    { name: 'Photon Energy', symbol: 'hf', unit: 'J' },
    { name: 'Work Function', symbol: 'Phi', unit: 'J' },
    { name: 'Max Kinetic Energy', symbol: 'KE_max', unit: 'J' },
  ],
  solve: (inputs) => EnhancedSolver.solveLinear({
    hf: 'Phi + KE_max',
    Phi: 'hf - KE_max',
    KE_max: 'hf - Phi',
  }, inputs),
  examples: [
    {
      input: { hf: 3.2e-19, Phi: 2.1e-19 },
      expectedOutput: { KE_max: { type: 'decimal', decimal: 1.1e-19, latex: '1.1e-19', simplified: false } }
    }
  ]
},

{
  id: 'potential-divider',
  name: 'Potential Divider',
  category: 'Electronics',
  latex: 'V_{out} = \\frac{R_2}{R_1 + R_2} \\times V_{in}',
  description: 'Calculate output voltage in a two-resistor potential divider circuit',
  variables: [
    { name: 'Input Voltage', symbol: 'V_in', unit: 'V' },
    { name: 'Output Voltage', symbol: 'V_out', unit: 'V' },
    { name: 'Resistor 1', symbol: 'R_1', unit: 'Ω' },
    { name: 'Resistor 2', symbol: 'R_2', unit: 'Ω' },
  ],
  solve: (inputs) => {
    const { V_in, V_out, R_1, R_2 } = inputs;
    const results: any = {};
    
    if (V_in !== undefined && R_1 !== undefined && R_2 !== undefined) {
      const output = V_in * R_2 / (R_1 + R_2);
      results.V_out = SymbolicConverter.convertToExact(output);
    }
    
    return results;
  },
  examples: [
    {
      input: { V_in: 12, R_1: 1000, R_2: 2000 },
      expectedOutput: { V_out: { type: 'integer', decimal: 8, exact: 8, latex: '8', simplified: true } }
    }
  ]
},

{
  id: 'wave-velocity',
  name: 'Wave Velocity',
  category: 'Physics',
  latex: 'v = f \\lambda',
  description: 'Find any variable in the wave equation relating velocity, frequency, and wavelength',
  variables: [
    { name: 'Wave Speed', symbol: 'v', unit: 'm/s' },
    { name: 'Frequency', symbol: 'f', unit: 'Hz' },
    { name: 'Wavelength', symbol: 'lambda', unit: 'm' },
  ],
  solve: (inputs) => EnhancedSolver.solveLinear({
    v: 'f * lambda',
    f: 'v / lambda',
    lambda: 'v / f',
  }, inputs),
  examples: [
    {
      input: { f: 440, lambda: 0.77 },
      expectedOutput: { v: { type: 'decimal', decimal: 338.8, latex: '338.8', simplified: false } }
    }
  ]
},

{
  id: 'sphere-volume',
  name: 'Volume of Sphere',
  category: 'Geometry',
  latex: 'V = \\frac{4}{3}\\pi r^3',
  description: 'Calculate sphere volume with exact π expressions',
  variables: [
    { name: 'Volume', symbol: 'V', unit: 'units³' },
    { name: 'Radius', symbol: 'r', unit: 'units' },
  ],
  solve: (inputs) => EnhancedSolver.solveGeometric('sphere_volume', inputs),
  examples: [
    {
      input: { r: 3 },
      expectedOutput: {
        V: { type: 'expression', decimal: 113.097, exact: { numerator: 36, denominator: 1 }, latex: '36\\pi', simplified: true }
      }
    }
  ]
},

{
  id: 'resistors-parallel',
  name: 'Resistors in Parallel',
  category: 'Electronics',
  latex: '\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2}',
  description: 'Calculate total resistance of two resistors in parallel',
  variables: [
    { name: 'Total Resistance', symbol: 'R_total', unit: 'Ω' },
    { name: 'Resistor 1', symbol: 'R_1', unit: 'Ω' },
    { name: 'Resistor 2', symbol: 'R_2', unit: 'Ω' },
  ],
  solve: (inputs) => {
    const { R_1, R_2, R_total } = inputs;
    const results: any = {};
    
    if (R_1 !== undefined && R_2 !== undefined) {
      const total = (R_1 * R_2) / (R_1 + R_2);
      results.R_total = SymbolicConverter.convertToExact(total);
    }
    
    if (R_total !== undefined && R_1 !== undefined) {
      const r2 = (R_total * R_1) / (R_1 - R_total);
      if (r2 > 0) results.R_2 = SymbolicConverter.convertToExact(r2);
    }
    
    if (R_total !== undefined && R_2 !== undefined) {
      const r1 = (R_total * R_2) / (R_2 - R_total);
      if (r1 > 0) results.R_1 = SymbolicConverter.convertToExact(r1);
    }
    
    return results;
  },
  examples: [
    {
      input: { R_1: 6, R_2: 3 },
      expectedOutput: { R_total: { type: 'integer', decimal: 2, exact: 2, latex: '2', simplified: true } }
    }
  ]
},

{
  id: 'snells-law',
  name: "Snell's Law",
  category: 'Physics',
  latex: 'n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)',
  description: 'Find any variable in Snells Law relating refractive indices and angles',
  variables: [
    { name: 'Refractive Index 1', symbol: 'n_1', unit: '' },
    { name: 'Angle 1 (degrees)', symbol: 'theta_1', unit: '°' },
    { name: 'Refractive Index 2', symbol: 'n_2', unit: '' },
    { name: 'Angle 2 (degrees)', symbol: 'theta_2', unit: '°' },
  ],
  solve: (inputs) => {
    const { n_1, theta_1, n_2, theta_2 } = inputs;
    const results: any = {};
    
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const toDegrees = (radians: number) => radians * 180 / Math.PI;
    
    if (n_1 !== undefined && theta_1 !== undefined && n_2 !== undefined) {
      const sin_theta_2 = (n_1 * Math.sin(toRadians(theta_1))) / n_2;
      if (Math.abs(sin_theta_2) <= 1) {
        const angle_2 = toDegrees(Math.asin(sin_theta_2));
        results.theta_2 = SymbolicConverter.convertToExact(angle_2);
      }
    }
    
    return results;
  },
  examples: [
    {
      input: { n_1: 1, theta_1: 30, n_2: 1.5 },
      expectedOutput: { theta_2: { type: 'decimal', decimal: 19.47, latex: '19.47', simplified: false } }
    }
  ]
},

{
  id: 'cosine-rule',
  name: 'Cosine Rule',
  category: 'Geometry',
  latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)',
  description: 'Find any side or angle in a triangle using the cosine rule',
  variables: [
    { name: 'Side a', symbol: 'a', unit: 'units' },
    { name: 'Side b', symbol: 'b', unit: 'units' },
    { name: 'Side c', symbol: 'c', unit: 'units' },
    { name: 'Angle C (degrees)', symbol: 'C', unit: '°' },
  ],
  solve: (inputs) => {
    const { a, b, c, C } = inputs;
    const results: any = {};
    
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const toDegrees = (radians: number) => radians * 180 / Math.PI;
    
    if (a !== undefined && b !== undefined && C !== undefined) {
      const c_squared = a*a + b*b - 2*a*b*Math.cos(toRadians(C));
      if (c_squared >= 0) {
        const side_c = Math.sqrt(c_squared);
        results.c = SymbolicConverter.convertToExact(side_c);
      }
    }
    
    if (a !== undefined && b !== undefined && c !== undefined) {
      const cos_C = (a*a + b*b - c*c) / (2*a*b);
      if (Math.abs(cos_C) <= 1) {
        const angle_C = toDegrees(Math.acos(cos_C));
        results.C = SymbolicConverter.convertToExact(angle_C);
      }
    }
    
    return results;
  },
  examples: [
    {
      input: { a: 3, b: 4, C: 90 },
      expectedOutput: { c: { type: 'integer', decimal: 5, exact: 5, latex: '5', simplified: true } }
    }
  ]
}
  
];