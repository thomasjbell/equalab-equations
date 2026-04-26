import { SymbolicEquation } from "@/types/symbolicEquation";
import { EnhancedSolver } from "./enhancedSolver";
import { SymbolicConverter } from "./symbolicConverter";

export const symbolicEquations: SymbolicEquation[] = [
  {
    id: "ohms-law",
    name: "Ohm's Law",
    category: "Electronics",
    latex: "V = I R",
    description: "Relationship between voltage, current, and resistance",
    variables: [
      { name: "Voltage", symbol: "V", unit: "V" },
      { name: "Current", symbol: "I", unit: "A" },
      { name: "Resistance", symbol: "R", unit: "Ω" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          V: "I * R",
          I: "V / R",
          R: "V / I",
        },
        inputs
      ),
    examples: [
      {
        input: { V: 12, R: 4 },
        expectedOutput: {
          I: {
            type: "integer",
            decimal: 3,
            exact: 3,
            latex: "3",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "quadratic-formula",
    name: "Quadratic Formula",
    category: "Algebra",
    latex:
      "ax^2 + bx + c = 0 \\Rightarrow x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    description:
      "Solves quadratic equations with exact symbolic results including combined surds and fractions",
    variables: [
      { name: "Coefficient a", symbol: "a", unit: "" },
      { name: "Coefficient b", symbol: "b", unit: "" },
      { name: "Coefficient c", symbol: "c", unit: "" },
      { name: "Discriminant", symbol: "discriminant", unit: "" },
      { name: "Solution x₁", symbol: "x_1", unit: "" },
      { name: "Solution x₂", symbol: "x_2", unit: "" },
    ],
    solve: (inputs) => EnhancedSolver.solveQuadratic(inputs),
    examples: [
      {
        input: { a: 1, b: 0, c: -2 },
        expectedOutput: {
          discriminant: {
            type: "integer",
            decimal: 8,
            exact: 8,
            latex: "8",
            simplified: true,
          },
          x_1: {
            type: "surd",
            decimal: 1.414,
            exact: { coefficient: 1, radicand: 2 },
            latex: "\\sqrt{2}",
            simplified: true,
          },
          x_2: {
            type: "surd",
            decimal: -1.414,
            exact: { coefficient: -1, radicand: 2 },
            latex: "-\\sqrt{2}",
            simplified: true,
          },
        },
      },
      {
        input: { a: 2, b: 3, c: 1 },
        expectedOutput: {
          discriminant: {
            type: "integer",
            decimal: 1,
            exact: 1,
            latex: "1",
            simplified: true,
          },
          x_1: {
            type: "fraction",
            decimal: -0.5,
            exact: { numerator: -1, denominator: 2 },
            latex: "-\\frac{1}{2}",
            simplified: true,
          },
          x_2: {
            type: "integer",
            decimal: -1,
            exact: -1,
            latex: "-1",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "circle-area",
    name: "Area of Circle",
    category: "Geometry",
    latex: "A = \\pi r^2",
    description: "Calculate circle area with exact π expressions",
    variables: [
      { name: "Area", symbol: "A", unit: "units²" },
      { name: "Radius", symbol: "r", unit: "units" },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric("circle_area", inputs),
    examples: [
      {
        input: { r: 3 },
        expectedOutput: {
          A: {
            type: "expression",
            decimal: 28.274,
            exact: { numerator: 9, denominator: 1 },
            latex: "9\\pi",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "pythagoras",
    name: "Pythagorean Theorem",
    category: "Geometry",
    latex: "c^2 = a^2 + b^2",
    description: "Calculate triangle sides with exact surd results",
    variables: [
      { name: "Side a", symbol: "a", unit: "units" },
      { name: "Side b", symbol: "b", unit: "units" },
      { name: "Hypotenuse c", symbol: "c", unit: "units" },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric("pythagoras", inputs),
    examples: [
      {
        input: { a: 3, b: 4 },
        expectedOutput: {
          c: {
            type: "integer",
            decimal: 5,
            exact: 5,
            latex: "5",
            simplified: true,
          },
        },
      },
      {
        input: { a: 1, b: 1 },
        expectedOutput: {
          c: {
            type: "surd",
            decimal: 1.414,
            exact: { coefficient: 1, radicand: 2 },
            latex: "\\sqrt{2}",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "unit-circle",
    name: "Unit Circle Values",
    category: "Trigonometry",
    latex: "\\sin^2(\\theta) + \\cos^2(\\theta) = 1",
    description: "Calculate exact trigonometric values for common angles",
    variables: [
      { name: "Angle (degrees)", symbol: "degrees", unit: "°" },
      { name: "sin(θ)", symbol: "sin_theta", unit: "" },
      { name: "cos(θ)", symbol: "cos_theta", unit: "" },
      { name: "tan(θ)", symbol: "tan_theta", unit: "" },
    ],
    solve: (inputs) => {
      const { degrees } = inputs;
      if (degrees === undefined) return {};

      const results: any = {};

      // Define exact values for common angles
      const exactValues: Record<
        number,
        { sin: string; cos: string; tan: string }
      > = {
        0: { sin: "0", cos: "1", tan: "0" },
        30: {
          sin: "\\frac{1}{2}",
          cos: "\\frac{\\sqrt{3}}{2}",
          tan: "\\frac{1}{\\sqrt{3}}",
        },
        45: {
          sin: "\\frac{\\sqrt{2}}{2}",
          cos: "\\frac{\\sqrt{2}}{2}",
          tan: "1",
        },
        60: {
          sin: "\\frac{\\sqrt{3}}{2}",
          cos: "\\frac{1}{2}",
          tan: "\\sqrt{3}",
        },
        90: { sin: "1", cos: "0", tan: "\\text{undefined}" },
      };

      if (exactValues[degrees]) {
        const exact = exactValues[degrees];
        results.sin_theta = {
          type: "expression",
          decimal: Math.sin((degrees * Math.PI) / 180),
          latex: exact.sin,
          simplified: true,
        };
        results.cos_theta = {
          type: "expression",
          decimal: Math.cos((degrees * Math.PI) / 180),
          latex: exact.cos,
          simplified: true,
        };
        results.tan_theta = {
          type: "expression",
          decimal: Math.tan((degrees * Math.PI) / 180),
          latex: exact.tan,
          simplified: true,
        };
      }

      return results;
    },
  },
  // Add these new equations to your symbolicEquations array in src/lib/symbolicEquationsData.ts

  {
    id: "capacitance",
    name: "Capacitance",
    category: "Electronics",
    latex: "C = \\frac{Q}{V}",
    description:
      "Find any of the variables in the standard equation for capacitance",
    variables: [
      { name: "Capacitance", symbol: "C", unit: "F" },
      { name: "Charge", symbol: "Q", unit: "C" },
      { name: "Voltage", symbol: "V", unit: "V" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          C: "Q / V",
          Q: "C * V",
          V: "Q / C",
        },
        inputs
      ),
    examples: [
      {
        input: { Q: 0.001, V: 12 },
        expectedOutput: {
          C: {
            type: "fraction",
            decimal: 0.0000833,
            exact: { numerator: 1, denominator: 12000 },
            latex: "\\frac{1}{12000}",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "compound-interest",
    name: "Compound Interest",
    category: "Finance",
    latex: "A = P\\left(1 + \\frac{r}{n}\\right)^{nt}",
    description:
      "Calculate compound interest with principal, rate, compounding frequency and time",
    variables: [
      { name: "Final Amount", symbol: "A", unit: "$" },
      { name: "Principal", symbol: "P", unit: "$" },
      { name: "Annual Rate", symbol: "r", unit: "" },
      { name: "Compounds per Year", symbol: "n", unit: "" },
      { name: "Time in Years", symbol: "t", unit: "years" },
    ],
    solve: (inputs) => {
      const { P, r, n, t, A } = inputs;
      const results: any = {};

      if (
        P !== undefined &&
        r !== undefined &&
        n !== undefined &&
        t !== undefined
      ) {
        const amount = P * Math.pow(1 + r / n, n * t);
        results.A = SymbolicConverter.convertToExact(amount);
      }

      return results;
    },
    examples: [
      {
        input: { P: 1000, r: 0.05, n: 12, t: 1 },
        expectedOutput: {
          A: {
            type: "decimal",
            decimal: 1051.16,
            latex: "1051.16",
            simplified: false,
          },
        },
      },
    ],
  },

  {
    id: "suvat-equations",
    name: "SUVAT Equations (Kinematics)",
    category: "Physics",
    latex: "v = u + at \\quad s = ut + \\frac{1}{2}at^2 \\quad v^2 = u^2 + 2as",
    description:
      "Uniformly accelerated motion equations - finds any 2 missing variables when 3 are provided",
    variables: [
      { name: "Displacement", symbol: "s", unit: "m" },
      { name: "Initial Velocity", symbol: "u", unit: "m/s" },
      { name: "Final Velocity", symbol: "v", unit: "m/s" },
      { name: "Acceleration", symbol: "a", unit: "m/s²" },
      { name: "Time", symbol: "t", unit: "s" },
    ],
    solve: (inputs) => EnhancedSolver.solveSUVAT(inputs),
    examples: [
      {
        input: { u: 0, a: 9.8, t: 2 },
        expectedOutput: {
          v: {
            type: "decimal",
            decimal: 19.6,
            latex: "19.6",
            simplified: false,
          },
          s: {
            type: "decimal",
            decimal: 19.6,
            latex: "19.6",
            simplified: false,
          },
        },
      },
      {
        input: { s: 100, u: 0, v: 20 },
        expectedOutput: {
          a: {
            type: "integer",
            decimal: 2,
            exact: 2,
            latex: "2",
            simplified: true,
          },
          t: {
            type: "integer",
            decimal: 10,
            exact: 10,
            latex: "10",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "photoelectric-effect",
    name: "Photoelectric Effect",
    category: "Physics",
    latex: "hf = \\Phi + KE_{max}",
    description:
      "Find variables in the photoelectric equation relating photon energy to work function and kinetic energy",
    variables: [
      { name: "Photon Energy", symbol: "hf", unit: "J" },
      { name: "Work Function", symbol: "Phi", unit: "J" },
      { name: "Max Kinetic Energy", symbol: "KE_max", unit: "J" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          hf: "Phi + KE_max",
          Phi: "hf - KE_max",
          KE_max: "hf - Phi",
        },
        inputs
      ),
    examples: [
      {
        input: { hf: 3.2e-19, Phi: 2.1e-19 },
        expectedOutput: {
          KE_max: {
            type: "decimal",
            decimal: 1.1e-19,
            latex: "1.1e-19",
            simplified: false,
          },
        },
      },
    ],
  },

  {
    id: "potential-divider",
    name: "Potential Divider",
    category: "Electronics",
    latex: "V_{out} = \\frac{R_2}{R_1 + R_2} \\times V_{in}",
    description:
      "Calculate output voltage in a two-resistor potential divider circuit",
    variables: [
      { name: "Input Voltage", symbol: "V_in", unit: "V" },
      { name: "Output Voltage", symbol: "V_out", unit: "V" },
      { name: "Resistor 1", symbol: "R_1", unit: "Ω" },
      { name: "Resistor 2", symbol: "R_2", unit: "Ω" },
    ],
    solve: (inputs) => {
      const { V_in, V_out, R_1, R_2 } = inputs;
      const results: any = {};

      if (V_in !== undefined && R_1 !== undefined && R_2 !== undefined) {
        const output = (V_in * R_2) / (R_1 + R_2);
        results.V_out = SymbolicConverter.convertToExact(output);
      }

      return results;
    },
    examples: [
      {
        input: { V_in: 12, R_1: 1000, R_2: 2000 },
        expectedOutput: {
          V_out: {
            type: "integer",
            decimal: 8,
            exact: 8,
            latex: "8",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "wave-velocity",
    name: "Wave Velocity",
    category: "Physics",
    latex: "v = f \\lambda",
    description:
      "Find any variable in the wave equation relating velocity, frequency, and wavelength",
    variables: [
      { name: "Wave Speed", symbol: "v", unit: "m/s" },
      { name: "Frequency", symbol: "f", unit: "Hz" },
      { name: "Wavelength", symbol: "lambda", unit: "m" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          v: "f * lambda",
          f: "v / lambda",
          lambda: "v / f",
        },
        inputs
      ),
    examples: [
      {
        input: { f: 440, lambda: 0.77 },
        expectedOutput: {
          v: {
            type: "decimal",
            decimal: 338.8,
            latex: "338.8",
            simplified: false,
          },
        },
      },
    ],
  },

  {
    id: "sphere-volume",
    name: "Volume of Sphere",
    category: "Geometry",
    latex: "V = \\frac{4}{3}\\pi r^3",
    description: "Calculate sphere volume with exact π expressions",
    variables: [
      { name: "Volume", symbol: "V", unit: "units³" },
      { name: "Radius", symbol: "r", unit: "units" },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric("sphere_volume", inputs),
    examples: [
      {
        input: { r: 3 },
        expectedOutput: {
          V: {
            type: "expression",
            decimal: 113.097,
            exact: { numerator: 36, denominator: 1 },
            latex: "36\\pi",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "resistors-parallel",
    name: "Resistors in Parallel",
    category: "Electronics",
    latex: "\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2}",
    description: "Calculate total resistance of two resistors in parallel",
    variables: [
      { name: "Total Resistance", symbol: "R_total", unit: "Ω" },
      { name: "Resistor 1", symbol: "R_1", unit: "Ω" },
      { name: "Resistor 2", symbol: "R_2", unit: "Ω" },
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
        expectedOutput: {
          R_total: {
            type: "integer",
            decimal: 2,
            exact: 2,
            latex: "2",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "snells-law",
    name: "Snell's Law",
    category: "Physics",
    latex: "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)",
    description:
      "Find any variable in Snells Law relating refractive indices and angles",
    variables: [
      { name: "Refractive Index 1", symbol: "n_1", unit: "" },
      { name: "Angle 1 (degrees)", symbol: "theta_1", unit: "°" },
      { name: "Refractive Index 2", symbol: "n_2", unit: "" },
      { name: "Angle 2 (degrees)", symbol: "theta_2", unit: "°" },
    ],
    solve: (inputs) => {
      const { n_1, theta_1, n_2, theta_2 } = inputs;
      const results: any = {};

      const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
      const toDegrees = (radians: number) => (radians * 180) / Math.PI;

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
        expectedOutput: {
          theta_2: {
            type: "decimal",
            decimal: 19.47,
            latex: "19.47",
            simplified: false,
          },
        },
      },
    ],
  },

  {
    id: "cosine-rule",
    name: "Cosine Rule",
    category: "Geometry",
    latex: "c^2 = a^2 + b^2 - 2ab\\cos(C)",
    description: "Find any side or angle in a triangle using the cosine rule",
    variables: [
      { name: "Side a", symbol: "a", unit: "units" },
      { name: "Side b", symbol: "b", unit: "units" },
      { name: "Side c", symbol: "c", unit: "units" },
      { name: "Angle C (degrees)", symbol: "C", unit: "°" },
    ],
    solve: (inputs) => {
      const { a, b, c, C } = inputs;
      const results: any = {};

      const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
      const toDegrees = (radians: number) => (radians * 180) / Math.PI;

      if (a !== undefined && b !== undefined && C !== undefined) {
        const c_squared = a * a + b * b - 2 * a * b * Math.cos(toRadians(C));
        if (c_squared >= 0) {
          const side_c = Math.sqrt(c_squared);
          results.c = SymbolicConverter.convertToExact(side_c);
        }
      }

      if (a !== undefined && b !== undefined && c !== undefined) {
        const cos_C = (a * a + b * b - c * c) / (2 * a * b);
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
        expectedOutput: {
          c: {
            type: "integer",
            decimal: 5,
            exact: 5,
            latex: "5",
            simplified: true,
          },
        },
      },
    ],
  },

  // Additional equations to add to symbolicEquationsData.ts

  {
    id: "cubic-general",
    name: "General Cubic Equation",
    category: "Algebra",
    latex: "ax^3 + bx^2 + cx + d = 0",
    description:
      "Solve cubic equations with exact symbolic results using Cardano's formula",
    variables: [
      { name: "Coefficient a", symbol: "a", unit: "" },
      { name: "Coefficient b", symbol: "b", unit: "" },
      { name: "Coefficient c", symbol: "c", unit: "" },
      { name: "Coefficient d", symbol: "d", unit: "" },
      { name: "Discriminant", symbol: "discriminant", unit: "" },
      { name: "Solution x₁", symbol: "x_1", unit: "" },
      { name: "Solution x₂", symbol: "x_2", unit: "" },
      { name: "Solution x₃", symbol: "x_3", unit: "" },
    ],
    solve: (inputs) => EnhancedSolver.solveCubic(inputs),
    examples: [
      {
        input: { a: 1, b: 0, c: 0, d: -8 },
        expectedOutput: {
          discriminant: {
            type: "integer",
            decimal: 0,
            exact: 0,
            latex: "0",
            simplified: true,
          },
          x_1: {
            type: "integer",
            decimal: 2,
            exact: 2,
            latex: "2",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "circle-circumference",
    name: "Circle Circumference",
    category: "Geometry",
    latex: "C = 2\\pi r",
    description: "Calculate circle circumference with exact π expressions",
    variables: [
      { name: "Circumference", symbol: "C", unit: "units" },
      { name: "Radius", symbol: "r", unit: "units" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveGeometric("circle_circumference", inputs),
    examples: [
      {
        input: { r: 5 },
        expectedOutput: {
          C: {
            type: "expression",
            decimal: 31.416,
            exact: { numerator: 10, denominator: 1 },
            latex: "10\\pi",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "cylinder-volume",
    name: "Cylinder Volume",
    category: "Geometry",
    latex: "V = \\pi r^2 h",
    description: "Calculate cylinder volume with exact π expressions",
    variables: [
      { name: "Volume", symbol: "V", unit: "units³" },
      { name: "Radius", symbol: "r", unit: "units" },
      { name: "Height", symbol: "h", unit: "units" },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric("cylinder_volume", inputs),
    examples: [
      {
        input: { r: 3, h: 4 },
        expectedOutput: {
          V: {
            type: "expression",
            decimal: 113.097,
            exact: { numerator: 36, denominator: 1 },
            latex: "36\\pi",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "cone-volume",
    name: "Cone Volume",
    category: "Geometry",
    latex: "V = \\frac{1}{3}\\pi r^2 h",
    description: "Calculate cone volume with exact π expressions",
    variables: [
      { name: "Volume", symbol: "V", unit: "units³" },
      { name: "Radius", symbol: "r", unit: "units" },
      { name: "Height", symbol: "h", unit: "units" },
    ],
    solve: (inputs) => EnhancedSolver.solveGeometric("cone_volume", inputs),
    examples: [
      {
        input: { r: 3, h: 4 },
        expectedOutput: {
          V: {
            type: "expression",
            decimal: 37.699,
            exact: { numerator: 12, denominator: 1 },
            latex: "12\\pi",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "kinetic-energy",
    name: "Kinetic Energy",
    category: "Physics",
    latex: "KE = \\frac{1}{2}mv^2",
    description: "Calculate kinetic energy from mass and velocity",
    variables: [
      { name: "Kinetic Energy", symbol: "KE", unit: "J" },
      { name: "Mass", symbol: "m", unit: "kg" },
      { name: "Velocity", symbol: "v", unit: "m/s" },
    ],
    solve: (inputs) => EnhancedSolver.solvePhysics("kinetic_energy", inputs),
    examples: [
      {
        input: { m: 2, v: 10 },
        expectedOutput: {
          KE: {
            type: "integer",
            decimal: 100,
            exact: 100,
            latex: "100",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "potential-energy",
    name: "Gravitational Potential Energy",
    category: "Physics",
    latex: "PE = mgh",
    description: "Calculate gravitational potential energy",
    variables: [
      { name: "Potential Energy", symbol: "PE", unit: "J" },
      { name: "Mass", symbol: "m", unit: "kg" },
      { name: "Gravity", symbol: "g", unit: "m/s²" },
      { name: "Height", symbol: "h", unit: "m" },
    ],
    solve: (inputs) => EnhancedSolver.solvePhysics("potential_energy", inputs),
    examples: [
      {
        input: { m: 10, g: 9.8, h: 5 },
        expectedOutput: {
          PE: {
            type: "integer",
            decimal: 490,
            exact: 490,
            latex: "490",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "newtons-second-law",
    name: "Newton's Second Law",
    category: "Physics",
    latex: "F = ma",
    description: "Calculate force, mass, or acceleration",
    variables: [
      { name: "Force", symbol: "F", unit: "N" },
      { name: "Mass", symbol: "m", unit: "kg" },
      { name: "Acceleration", symbol: "a", unit: "m/s²" },
    ],
    solve: (inputs) => EnhancedSolver.solvePhysics("force", inputs),
    examples: [
      {
        input: { m: 5, a: 2 },
        expectedOutput: {
          F: {
            type: "integer",
            decimal: 10,
            exact: 10,
            latex: "10",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "power-formula",
    name: "Electrical Power",
    category: "Electronics",
    latex: "P = VI = I^2R = \\frac{V^2}{R}",
    description:
      "Calculate electrical power using voltage, current, or resistance",
    variables: [
      { name: "Power", symbol: "P", unit: "W" },
      { name: "Voltage", symbol: "V", unit: "V" },
      { name: "Current", symbol: "I", unit: "A" },
      { name: "Resistance", symbol: "R", unit: "Ω" },
    ],
    solve: (inputs) => {
      const { P, V, I, R } = inputs;
      const results: any = {};

      if (V !== undefined && I !== undefined && P === undefined) {
        results.P = SymbolicConverter.convertToExact(V * I);
      }
      if (I !== undefined && R !== undefined && P === undefined) {
        results.P = SymbolicConverter.convertToExact(I * I * R);
      }
      if (V !== undefined && R !== undefined && P === undefined) {
        results.P = SymbolicConverter.convertToExact((V * V) / R);
      }

      return results;
    },
    examples: [
      {
        input: { V: 12, I: 2 },
        expectedOutput: {
          P: {
            type: "integer",
            decimal: 24,
            exact: 24,
            latex: "24",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "resistors-series",
    name: "Resistors in Series",
    category: "Electronics",
    latex: "R_{total} = R_1 + R_2 + R_3 + ...",
    description: "Calculate total resistance of resistors in series",
    variables: [
      { name: "Total Resistance", symbol: "R_total", unit: "Ω" },
      { name: "Resistor 1", symbol: "R_1", unit: "Ω" },
      { name: "Resistor 2", symbol: "R_2", unit: "Ω" },
      { name: "Resistor 3", symbol: "R_3", unit: "Ω" },
    ],
    solve: (inputs) => {
      const { R_1, R_2, R_3, R_total } = inputs;
      const results: any = {};

      const resistors = [R_1, R_2, R_3].filter((r) => r !== undefined);
      if (resistors.length >= 2 && R_total === undefined) {
        const total = resistors.reduce((sum, r) => sum + r, 0);
        results.R_total = SymbolicConverter.convertToExact(total);
      }

      return results;
    },
    examples: [
      {
        input: { R_1: 100, R_2: 220, R_3: 330 },
        expectedOutput: {
          R_total: {
            type: "integer",
            decimal: 650,
            exact: 650,
            latex: "650",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "simple-interest",
    name: "Simple Interest",
    category: "Finance",
    latex: "I = PRT",
    description: "Calculate simple interest",
    variables: [
      { name: "Interest", symbol: "I", unit: "$" },
      { name: "Principal", symbol: "P", unit: "$" },
      { name: "Rate", symbol: "R", unit: "%" },
      { name: "Time", symbol: "T", unit: "years" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          I: "P * R * T",
          P: "I / (R * T)",
          R: "I / (P * T)",
          T: "I / (P * R)",
        },
        inputs
      ),
    examples: [
      {
        input: { P: 1000, R: 0.05, T: 2 },
        expectedOutput: {
          I: {
            type: "integer",
            decimal: 100,
            exact: 100,
            latex: "100",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "ideal-gas-law",
    name: "Ideal Gas Law",
    category: "Chemistry",
    latex: "PV = nRT",
    description:
      "Relate pressure, volume, amount, and temperature of an ideal gas",
    variables: [
      { name: "Pressure", symbol: "P", unit: "Pa" },
      { name: "Volume", symbol: "V", unit: "m³" },
      { name: "Amount", symbol: "n", unit: "mol" },
      { name: "Gas Constant", symbol: "R", unit: "J/(mol·K)" },
      { name: "Temperature", symbol: "T", unit: "K" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          P: "(n * R * T) / V",
          V: "(n * R * T) / P",
          n: "(P * V) / (R * T)",
          T: "(P * V) / (n * R)",
        },
        inputs
      ),
    examples: [
      {
        input: { P: 101325, V: 0.0224, n: 1, R: 8.314 },
        expectedOutput: {
          T: {
            type: "decimal",
            decimal: 273.15,
            latex: "273.15",
            simplified: false,
          },
        },
      },
    ],
  },

  {
    id: "sine-rule",
    name: "Sine Rule",
    category: "Trigonometry",
    latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
    description: "Find any side or angle in a triangle using the sine rule",
    variables: [
      { name: "Side a", symbol: "a", unit: "units" },
      { name: "Side b", symbol: "b", unit: "units" },
      { name: "Side c", symbol: "c", unit: "units" },
      { name: "Angle A (degrees)", symbol: "A", unit: "°" },
      { name: "Angle B (degrees)", symbol: "B", unit: "°" },
      { name: "Angle C (degrees)", symbol: "C", unit: "°" },
    ],
    solve: (inputs) => {
      const { a, b, c, A, B, C } = inputs;
      const results: any = {};

      const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
      const toDegrees = (radians: number) => (radians * 180) / Math.PI;

      // Find missing sides using sine rule
      if (
        a !== undefined &&
        A !== undefined &&
        b !== undefined &&
        B === undefined
      ) {
        const sinB = (b * Math.sin(toRadians(A))) / a;
        if (Math.abs(sinB) <= 1) {
          results.B = SymbolicConverter.convertToExact(
            toDegrees(Math.asin(sinB))
          );
        }
      }

      if (
        a !== undefined &&
        A !== undefined &&
        B !== undefined &&
        b === undefined
      ) {
        const calc_b = (a * Math.sin(toRadians(B))) / Math.sin(toRadians(A));
        results.b = SymbolicConverter.convertToExact(calc_b);
      }

      return results;
    },
    examples: [
      {
        input: { a: 10, A: 30, B: 60 },
        expectedOutput: {
          b: {
            type: "surd",
            decimal: 17.32,
            exact: { coefficient: 10, radicand: 3 },
            latex: "10\\sqrt{3}",
            simplified: true,
          },
        },
      },
    ],
  },

  {
    id: "specific-heat-capacity",
    name: "Specific Heat Capacity",
    category: "Physics",
    latex: "E=mc \\Delta \\theta",
    description:
      "Find any of the variables in the standard specific heat capacity formula",
    variables: [
      { name: "Thermal Energy", symbol: "E", unit: "J" },
      { name: "Mass", symbol: "m", unit: "kg" },
      { name: "Specific Heat Capacity", symbol: "c", unit: "J kg⁻¹ °C" },
      { name: "Temperature Change", symbol: "theta", unit: "°C" },
    ],
    solve: (inputs) =>
      EnhancedSolver.solveLinear(
        {
          E: "m * c * theta",
          m: "E / (c * theta)",
          c: "E / (m * theta)",
          theta: "E / (m * c)",
        },
        inputs
      ),
    examples: [
      {
        input: {m: 1, c: 4200, theta: 20 },
        expectedOutput: {
          E: {
            type: "decimal",
            decimal: 84000,
            latex: "84000",
            simplified: false,
          },
        },
      },
    ],
  },

  
];
