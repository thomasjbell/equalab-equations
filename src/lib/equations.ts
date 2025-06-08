// lib/equations.ts
import { Equation } from "@/types/equation";

export const equations: Equation[] = [
  {
    id: "quadratic-formula",
    name: "Quadratic Formula",
    category: "Algebra",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    description: "Solves quadratic equations of the form ax² + bx + c = 0",
    variables: [
      { name: "Coefficient a", symbol: "a", unit: "" },
      { name: "Coefficient b", symbol: "b", unit: "" },
      { name: "Coefficient c", symbol: "c", unit: "" },
      { name: "x₁", symbol: "x_1", unit: "" },
      { name: "x₂", symbol: "x_2", unit: "" },
    ],
    solve: (values): Record<string, number> => {
      const { a, b, c } = values;

      // Only proceed if we have valid numbers
      if (
        typeof a !== "number" ||
        a === 0 ||
        typeof b !== "number" ||
        typeof c !== "number"
      ) {
        return {}; // Return empty object instead of undefined values
      }

      const discriminant = b ** 2 - 4 * a * c;

      if (discriminant < 0) {
        return {}; // No real solutions - return empty object
      }

      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

      // Only return values that are actual numbers
      return {
        x_1: x1,
        x_2: x2,
      };
    },
  },

  {
    id: "ohms-law",
    name: "Ohm's Law",
    category: "Electronics",
    latex: "V = I \\cdot R",
    description: "Relationship between voltage, current, and resistance",
    variables: [
      { name: "Voltage", symbol: "V", unit: "V" },
      { name: "Current", symbol: "I", unit: "A" },
      { name: "Resistance", symbol: "R", unit: "Ω" },
    ],
    solve: (values) => {
      const { V, I, R } = values;
      const result: Record<string, number> = {};

      if (I && R && !V) result.V = I * R;
      if (V && R && !I) result.I = V / R;
      if (V && I && !R) result.R = V / I;

      return result;
    },
  },
  {
    id: "kinematics",
    name: "Kinematics (SUVAT)",
    category: "Physics",
    latex:
      "v = u + at \\: \\: | \\: \\: s = ut + \\frac{1}{2}at^2 \\: \\: | \\: \\: s = vt - \\frac{1}{2}at^2 \\: \\: | \\: \\: v^2 = u^2 + 2as \\: \\: | \\: \\: s = \\frac{1}{2}(u + v) t",
    description:
      "Find any variable in the uniformly accelerated motion equations (SUVAT)",
    variables: [
      { name: "Displacement", symbol: "s", unit: "m" },
      { name: "Initial Velocity", symbol: "u", unit: "m s⁻¹" },
      { name: "Final Velocity", symbol: "v", unit: "m s⁻¹" },
      { name: "Acceleration", symbol: "a", unit: "m s⁻²" },
      { name: "Time", symbol: "t", unit: "s" },
    ],
    solve: (values) => {
      const { s, u, v, a, t } = values;
      const result: Record<string, number> = {};
      // SV
      if (
        u !== undefined &&
        a !== undefined &&
        t !== undefined &&
        v === undefined &&
        s === undefined
      ) {
        result.v = u + a * t;
      }
      if (
        u !== undefined &&
        a !== undefined &&
        t !== undefined &&
        v === undefined &&
        s === undefined
      ) {
        result.s = u * t + 0.5 * a * (t * t);
      }
      // SU
      if (
        v !== undefined &&
        a !== undefined &&
        t !== undefined &&
        u === undefined &&
        s === undefined
      ) {
        result.u = v - a * t;
      }
      if (
        v !== undefined &&
        a !== undefined &&
        t !== undefined &&
        u === undefined &&
        s === undefined
      ) {
        result.s = v * t - 0.5 * a * (t * t);
      }
      // SA
      if (
        u !== undefined &&
        v !== undefined &&
        t !== undefined &&
        a === undefined &&
        s === undefined
      ) {
        result.a = (v - u) / t;
      }
      if (
        u !== undefined &&
        v !== undefined &&
        t !== undefined &&
        a === undefined &&
        s === undefined
      ) {
        result.s = 0.5 * (u + v) * t;
      }
      // ST
      if (
        u !== undefined &&
        v !== undefined &&
        a !== undefined &&
        t === undefined &&
        s === undefined
      ) {
        result.t = (v - u) / a;
      }
      if (
        u !== undefined &&
        v !== undefined &&
        a !== undefined &&
        t === undefined &&
        s === undefined
      ) {
        result.s = (0.5 * (u + v) * (v - u)) / a;
      }
      // UV
      if (
        s !== undefined &&
        a !== undefined &&
        t !== undefined &&
        u === undefined &&
        v === undefined
      ) {
        result.u = s - 0.5 * a * t;
      }
      if (
        s !== undefined &&
        a !== undefined &&
        t !== undefined &&
        u === undefined &&
        v === undefined
      ) {
        result.v = s + 0.5 * a * t;
      }
      // UA
      if (
        s !== undefined &&
        v !== undefined &&
        t !== undefined &&
        a === undefined &&
        u === undefined
      ) {
        result.a = (2 * v * t - 2 * s) / (t * t);
      }
      if (
        s !== undefined &&
        v !== undefined &&
        t !== undefined &&
        a === undefined &&
        u === undefined
      ) {
        result.u = (0 - t * v + 2 * s) / t;
      }
      // UT
      if (
        s !== undefined &&
        v !== undefined &&
        a !== undefined &&
        u === undefined &&
        t === undefined
      ) {
        result.u = Math.sqrt(-(2 * a * s) + v * v);
      }
      if (
        s !== undefined &&
        v !== undefined &&
        a !== undefined &&
        u === undefined &&
        t === undefined
      ) {
        result.t = (-(-v) + Math.sqrt(v * v - 2 * a * s)) / a;
      }
      // VA
      if (
        s !== undefined &&
        u !== undefined &&
        t !== undefined &&
        v === undefined &&
        a === undefined
      ) {
        result.a = (-2 * t * u + 2 * s) / (t * t);
      }
      if (
        s !== undefined &&
        u !== undefined &&
        t !== undefined &&
        v === undefined &&
        a === undefined
      ) {
        result.v = (-t * u + 2 * s) / t;
      }
      // VT
      if (
        s !== undefined &&
        u !== undefined &&
        a !== undefined &&
        v === undefined &&
        t === undefined
      ) {
        result.v = Math.sqrt(u * u + 2 * a * s);
      }
      if (
        s !== undefined &&
        u !== undefined &&
        a !== undefined &&
        v === undefined &&
        t === undefined
      ) {
        result.t = (-u + Math.sqrt(u * u + 2 * a * s)) / a;
      }
      // AT
      if (
        s !== undefined &&
        u !== undefined &&
        v !== undefined &&
        t === undefined &&
        a === undefined
      ) {
        result.a = (v * v - u * u) / (2 * s);
      }
      if (
        s !== undefined &&
        u !== undefined &&
        v !== undefined &&
        t === undefined &&
        a === undefined
      ) {
        result.t = (2 * s) / (v + u);
      }

      return result;
    },
  },
  {
    id: "area-circle",
    name: "Area of Circle",
    category: "Geometry",
    latex: "A = \\pi r^2",
    description: "Find either of the variables in the area of a circle equation",
    variables: [
      { name: "Area", symbol: "A", unit: "units²" },
      { name: "Radius", symbol: "r", unit: "units" },
    ],
    solve: (values) => {
      const { A, r } = values;
      const result: Record<string, number> = {};

      if (r && !A) result.A = Math.PI * r * r;
      if (A && !r) result.r = Math.sqrt(A / Math.PI);

      return result;
    },
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    category: "Finance",
    latex: "A = P(1 + \\frac{r}{n})^{nt}",
    description: "Compound interest calculation",
    variables: [
      { name: "Final Amount", symbol: "A", unit: "$" },
      { name: "Principle Balance", symbol: "P", unit: "$" },
      { name: "Interest Rate", symbol: "r", unit: "" },
      { name: "Number of Compounding Periods", symbol: "n", unit: "" },
      { name: "Number of Time Periods", symbol: "t", unit: "years" },
    ],
    solve: (values) => {
      const { A, P, r, n, t } = values;
      const result: Record<string, number> = {};

      if (P && r && n && t && !A) {
        result.A = P * Math.pow(1 + r / n, n * t);
      }

      return result;
    },
  },
  {
    id: "pythag",
    name: "Pythagorean Theorem",
    category: "Geometry",
    latex: "c^2 = a^2 + b^2", // Fixed the formula
    description: `Solves Pythagorean Theorem for right angle triangles`,
    variables: [
      { name: "Side a", symbol: "a", unit: "units" },
      { name: "Side b", symbol: "b", unit: "units" },
      { name: "Hypotenuse c", symbol: "c", unit: "units" }, // Fixed typo
    ],
    solve: (values) => {
      const { a, b, c } = values;
      const result: Record<string, number> = {};

      if (a !== undefined && b !== undefined && c === undefined) {
        result.c = Math.sqrt(a ** 2 + b ** 2); // Fixed: c² = a² + b²
      } else if (a !== undefined && b === undefined && c !== undefined) {
        result.b = Math.sqrt(c ** 2 - a ** 2); // Fixed: b² = c² - a²
      } else if (a === undefined && b !== undefined && c !== undefined) {
        result.a = Math.sqrt(c ** 2 - b ** 2); // Fixed: a² = c² - b²
      }

      return result;
    },
  },
  {
    id: "linear-inter",
    name: "Linear Interpolation",
    category: "Statistics",
    latex:
      "\\text{Median} =\\text{Lower Bound} + (\\frac{\\text{Distance into Class}}{\\text{Class Width}} \\times \\text{Class Width})", // Escape backslashes for LaTeX
    description:
      "Uses linear interpolation to find median value in grouped data (remember to use halves if non-inclusive)",
    variables: [
      { name: "Lower Bound", symbol: "lb", unit: "units" },
      { name: "Distance into Class", symbol: "dc", unit: "" },
      { name: "Class Width", symbol: "cw", unit: "units" },
      { name: "Median", symbol: "median", unit: "units" },
    ],
    solve: (values) => {
      const { lb, dc, cw } = values;
      const result: Record<string, number> = {};

      if (lb !== undefined && dc !== undefined && cw !== undefined) {
        result.median = lb + (dc / cw) * cw;
      }

      return result;
    },
  },
  {
    id: "sphere-vol",
    name: "Volume of a Sphere",
    category: "Geometry",
    latex: "V = \\frac{4}{3} \\pi r^3", // Escape backslashes for LaTeX
    description: "Find the volume of a uniform sphere",
    variables: [
      { name: "Volume", symbol: "V", unit: "units³" },
      { name: "Radius", symbol: "r", unit: "units" },
    ],
    solve: (values) => {
      const { V, r } = values;
      const result: Record<string, number> = {};

      if (V !== undefined && r === undefined) {
        result.r = Math.pow((3 * V) / (4 * Math.PI), 1 / 3);
      } else if (V === undefined && r !== undefined) {
        result.V = (4 * Math.PI * Math.pow(r, 3)) / 3;
      }

      return result;
    },
  },
  {
    id: "pot-divider",
    name: "Potential Divider",
    category: "Electronics",
    latex: "V_{out}=\\frac{R_{2}}{R_{1}+R_{2}}\\times V_{in}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the standard 2-Resistor, 2-Voltage potential divider equation",
    variables: [
      { name: "Vₒᵤₜ", symbol: "Vout", unit: "V" },
      { name: "Vᵢₙ", symbol: "Vin", unit: "V" },
      { name: "R₁", symbol: "R_1", unit: "Ω" },
      { name: "R₂", symbol: "R_2", unit: "Ω" },
    ],
    solve: (values) => {
      const { Vout, Vin, R_1, R_2 } = values;
      const result: Record<string, number> = {};

      if (
        Vout !== undefined &&
        Vin !== undefined &&
        R_1 !== undefined &&
        R_2 === undefined
      ) {
        result.R_2 = (Vout * R_1) / Vin;
      } else if (
        Vout !== undefined &&
        Vin !== undefined &&
        R_1 === undefined &&
        R_2 !== undefined
      ) {
        result.R_1 = (Vout * R_2) / Vin;
      } else if (
        Vout === undefined &&
        Vin !== undefined &&
        R_1 !== undefined &&
        R_2 !== undefined
      ) {
        result.Vout = (R_2 / (R_1 + R_2)) * Vin;
      } else if (
        Vout !== undefined &&
        Vin === undefined &&
        R_1 !== undefined &&
        R_2 !== undefined
      ) {
        result.Vin = (Vout * R_1) / R_2;
      }

      return result;
    },
  },
  {
    id: "wire-resistivity",
    name: "Resistvity of a Wire",
    category: "Electronics",
    latex: "R=\\frac{\\rho L}{A}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the resistivity of a uniform wire equation",
    variables: [
      { name: "Resistance", symbol: "R", unit: "Ω" },
      { name: "Resistivity", symbol: "rho", unit: "Ω m" },
      { name: "Length", symbol: "L", unit: "m" },
      { name: "Cross Sectional Area", symbol: "A", unit: "m²" },
    ],
    solve: (values) => {
      const { R, rho, L, A } = values;
      const result: Record<string, number> = {};

      if (
        R !== undefined &&
        rho === undefined &&
        L !== undefined &&
        A !== undefined
      ) {
        result.rho = (R * A) / L;
      } else if (
        R === undefined &&
        rho !== undefined &&
        L !== undefined &&
        A !== undefined
      ) {
        result.R = (rho * L) / A;
      } else if (
        R !== undefined &&
        rho !== undefined &&
        L === undefined &&
        A !== undefined
      ) {
        result.L = (R * A) / rho;
      } else if (
        R !== undefined &&
        rho !== undefined &&
        L !== undefined &&
        A === undefined
      ) {
        result.A = (R * L) / rho;
      }

      return result;
    },
  },
  {
    id: "capacitance",
    name: "Capacitance",
    category: "Electronics",
    latex: "C=\\frac{Q}{V}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the standard equation for capacitance",
    variables: [
      { name: "Capacitance", symbol: "C", unit: "F" },
      { name: "Charge", symbol: "Q", unit: "C" },
      { name: "Potential Difference", symbol: "Pd", unit: "V" },
    ],
    solve: (values) => {
      const { C, Q, Pd } = values;
      const result: Record<string, number> = {};

      if (C !== undefined && Q === undefined && Pd !== undefined) {
        result.Q = C * Pd;
      } else if (C === undefined && Q !== undefined && Pd !== undefined) {
        result.C = Q / Pd;
      } else if (C !== undefined && Q !== undefined && Pd === undefined) {
        result.Pd = Q / C;
      }

      return result;
    },
  },
  {
    id: "resistors-parallel",
    name: "Resistors in Parallel",
    category: "Electronics",
    latex: "\\frac{1}{R_T}=\\frac{1}{R_1}+\\frac{1}{R_2}+\\frac{1}{R_3}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables from combining resistors in parallel",
    variables: [
      { name: "Total Resistance", symbol: "Rt", unit: "Ω" },
      { name: "R₁", symbol: "R_1", unit: "Ω" },
      { name: "R₂", symbol: "R_2", unit: "Ω" },
      { name: "R₃", symbol: "R_3", unit: "Ω" },
    ],
    solve: (values) => {
      const { Rt, R_1, R_2, R_3 } = values;
      const result: Record<string, number> = {};

      if (
        Rt === undefined &&
        R_1 !== undefined &&
        R_2 !== undefined &&
        R_3 === undefined
      ) {
        result.Rt = 1 / (1 / R_1 + 1 / R_2);
      } else if (
        Rt === undefined &&
        R_1 !== undefined &&
        R_2 !== undefined &&
        R_3 !== undefined
      ) {
        result.Rt = 1 / (1 / R_1 + 1 / R_2 + 1 / R_3);
      }

      return result;
    },
  },
  {
    id: "photoelectric",
    name: "Photoelectric Effect",
    category: "Physics",
    latex: "hf=\\Phi+KE_{max}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the photoelectric equation; units are respective",
    variables: [
      { name: "Frequency", symbol: "f", unit: "Hz" },
      { name: "Work Function", symbol: "wf", unit: "eV / J" },
      { name: "Max Kinetic Energy", symbol: "ke", unit: "eV / J" },
    ],
    solve: (values) => {
      const { f, wf, ke } = values;
      const result: Record<string, number> = {};

      if (f !== undefined && wf === undefined && ke !== undefined) {
        result.wf = 6.62607015e-34 * f - ke;
      } else if (f === undefined && wf !== undefined && ke !== undefined) {
        result.f = (wf + ke) / 6.62607015 ** -34;
      } else if (f !== undefined && wf !== undefined && ke === undefined) {
        result.ke = f * 6.62607015 ** -34 - wf;
      }

      return result;
    },
  },
  {
    id: "internal-resistance",
    name: "Internal Resistance",
    category: "Electronics",
    latex: "\\epsilon = I(R+r)\\:\\:|\\:\\:\\epsilon=V+Ir", // Escape backslashes for LaTeX
    description:
      "Find any variable in the standard internal resistance equation for cells",
    variables: [
      { name: "Electromotive Force", symbol: "emf", unit: "V" },
      { name: "Current", symbol: "I", unit: "A" },
      { name: "Load Resistance", symbol: "R", unit: "Ω" },
      { name: "Internal Resistance", symbol: "r", unit: "Ω" },
    ],
    solve: (values) => {
      const { emf, I, R, r } = values;
      const result: Record<string, number> = {};

      if (
        emf !== undefined &&
        I === undefined &&
        R !== undefined &&
        r !== undefined
      ) {
        result.I = emf / (R + r);
      } else if (
        emf === undefined &&
        I !== undefined &&
        R !== undefined &&
        r !== undefined
      ) {
        result.emf = I * (R + r);
      } else if (
        emf !== undefined &&
        I !== undefined &&
        R === undefined &&
        r !== undefined
      ) {
        result.R = emf / (I - r);
      } else if (
        emf !== undefined &&
        I !== undefined &&
        R !== undefined &&
        r === undefined
      ) {
        result.r = emf / (I - R);
      }

      return result;
    },
  },
  {
    id: "standard-dev",
    name: "Standard Deviation",
    category: "Statistics",
    latex: "\\sigma=\\sqrt{ \\frac{\\Sigma x^2}{n} -\\bar{x}^2}", // Escape backslashes for LaTeX
    description:
      "Find the any of the variables from the standard deviation formula",
    variables: [
      { name: "Standard Deviation", symbol: "sd", unit: "units" },
      { name: "Sum of x²", symbol: "sx", unit: "" },
      { name: "Population Size (n)", symbol: "n", unit: "" },
      { name: "Mean", symbol: "xbar", unit: "units" },
    ],
    solve: (values) => {
      const { sd, sx, n, xbar } = values;
      const result: Record<string, number> = {};

      if (
        sd !== undefined &&
        sx === undefined &&
        n !== undefined &&
        xbar !== undefined
      ) {
        result.sx = (sd ** 2 + xbar ** 2) * n;
      } else if (
        sd === undefined &&
        sx !== undefined &&
        n !== undefined &&
        xbar !== undefined
      ) {
        result.sd = Math.sqrt(sx / n - xbar ** 2);
      } else if (
        sd !== undefined &&
        sx !== undefined &&
        n === undefined &&
        xbar !== undefined
      ) {
        result.n = sx / (sd ** 2 + xbar ** 2);
      } else if (
        sd !== undefined &&
        sx !== undefined &&
        n !== undefined &&
        xbar === undefined
      ) {
        result.xbar = Math.sqrt(sx / n - sd ** 2);
      }

      return result;
    },
  },
  {
    id: "snells-law",
    name: `Snell's Law (Refractive Index)`,
    category: "Physics",
    latex: "n_1 \\sin\\theta_1 = n_2\\sin\\theta_2", // Escape backslashes for LaTeX
    description: `Find the any of the variables from Snell's Law, comparing refractive indices; angle units are respective`,
    variables: [
      { name: "Refractive index 1", symbol: "n1", unit: "" },
      { name: "Refective index 2", symbol: "n2", unit: "" },
      { name: "Angle of Refraction 1", symbol: "r1", unit: "deg" },
      { name: "Angle of Refraction 2", symbol: "r2", unit: "deg" },
    ],
    solve: (values) => {
      const { n1, n2, r1, r2 } = values;
      const result: Record<string, number> = {};

      if (
        n1 !== undefined &&
        n2 === undefined &&
        r1 !== undefined &&
        r2 !== undefined
      ) {
        result.n2 =
          (n1 * Math.sin(r1 * (Math.PI / 180))) /
          Math.sin(r2 * (Math.PI / 180));
      } else if (
        n1 === undefined &&
        n2 !== undefined &&
        r1 !== undefined &&
        r2 !== undefined
      ) {
        result.n1 =
          (n2 * Math.sin(r2 * (Math.PI / 180))) /
          Math.sin(r1 * (Math.PI / 180));
      } else if (
        n1 !== undefined &&
        n2 !== undefined &&
        r1 === undefined &&
        r2 !== undefined
      ) {
        result.r1 =
          Math.asin((n1 * Math.sin(r2 * (Math.PI / 180))) / n2) *
          (180 / Math.PI);
      } else if (
        n1 !== undefined &&
        n2 !== undefined &&
        r1 !== undefined &&
        r2 === undefined
      ) {
        result.r2 =
          Math.asin((n2 * Math.sin(r1 * (Math.PI / 180))) / n1) *
          (180 / Math.PI);
      }

      return result;
    },
  },
  {
    id: "gravity-mass-force",
    name: "Force of Gravity",
    category: "Physics",
    latex: "F=-\\frac{Gm_{1}m_{2}}{r^2}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the equation linking mass, radius and force.",
    variables: [
      { name: "Force", symbol: "F", unit: "N" },
      { name: "Radius", symbol: "r", unit: "m" },
      { name: "Mass 1 - Greatest", symbol: "M", unit: "kg" },
      { name: "Mass 2 - Lowest", symbol: "m", unit: "kg" },
    ],
    solve: (values) => {
      const { F, r, M, m } = values;
      const result: Record<string, number> = {};

      if (
        F === undefined &&
        r !== undefined &&
        M !== undefined &&
        m !== undefined
      ) {
        result.F = -((6.67 * 10 ** -11 * M * m) / r ** 2);
      } else if (
        F !== undefined &&
        r === undefined &&
        M !== undefined &&
        m !== undefined
      ) {
        result.r = Math.sqrt((6.67 * 10 ** -11 * M * m) / F);
      } else if (
        F !== undefined &&
        r !== undefined &&
        M === undefined &&
        m !== undefined
      ) {
        result.M = (F * r ** 2) / (6.67 * 10 ** -11 * m);
      } else if (
        F !== undefined &&
        r !== undefined &&
        M !== undefined &&
        m === undefined
      ) {
        result.m = (F * r ** 2) / (6.67 * 10 ** -11 * M);
      }

      return result;
    },
  },
  {
    id: "gravity-mass-accel",
    name: "Acceleration due to Gravity",
    category: "Physics",
    latex: "g=-\\frac{Gm_{1}}{r^2}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the equation linking mass, radius and acceleration towards the centre of a sphere.",
    variables: [
      { name: "Acceleration due to Gravity", symbol: "g", unit: "ms⁻²" },
      { name: "Radius", symbol: "r", unit: "m" },
      { name: "Mass 1 - Greatest", symbol: "M", unit: "kg" },
    ],
    solve: (values) => {
      const { r, M, g } = values;
      const result: Record<string, number> = {};

      if (g === undefined && r !== undefined && M !== undefined) {
        result.g = -((6.67 * 10 ** -11 * M) / r ** 2);
      } else if (g !== undefined && r === undefined && M !== undefined) {
        result.r = Math.sqrt((6.67 * 10 ** -11 * M) / g);
      } else if (g !== undefined && r !== undefined && M === undefined) {
        result.M = (g * r ** 2) / (6.67 * 10 ** -11);
      }

      return result;
    },
  },
  {
    id: "wave-velocity",
    name: "Velocity of a Wave",
    category: "Physics",
    latex: "v=f\\lambda", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the standard wave velocity equation linking wavelength, frequency and speed.",
    variables: [
      { name: "Velocity", symbol: "v", unit: "ms⁻¹" },
      { name: "Wavelength", symbol: "lbd", unit: "m" },
      { name: "Frequency", symbol: "f", unit: "Hz" },
    ],
    solve: (values) => {
      const { v, lbd, f } = values;
      const result: Record<string, number> = {};

      if (v === undefined && lbd !== undefined && f !== undefined) {
        result.v = f * lbd;
      } else if (v !== undefined && lbd === undefined && f !== undefined) {
        result.lbd = v / f;
      } else if (v !== undefined && lbd !== undefined && f === undefined) {
        result.f = v / lbd;
      }

      return result;
    },
  },
  {
    id: "sine-rule",
    name: "Sine Rule",
    category: "Geometry",
    latex:
      "\\frac{a}{\\sin A}=\\frac{b}{\\sin B}\\:\\:|\\:\\: \\frac{\\sin A}{a}=\\frac{\\sin B}{b}", // Escape backslashes for LaTeX
    description:
      "Find any of the variables in the sine rule equation. If missing angle is obtuse, minus the angle shown from 180.",
    variables: [
      { name: "Side A", symbol: "a", unit: "units" },
      { name: "Side B", symbol: "b", unit: "units" },
      { name: "Angle A", symbol: "A", unit: "deg" },
      { name: "Angle B", symbol: "B", unit: "deg" },
    ],
    solve: (values) => {
      const { a, b, A, B } = values;
      const result: Record<string, number> = {};

      if (
        a === undefined &&
        b !== undefined &&
        A !== undefined &&
        B !== undefined
      ) {
        result.a =
          Math.sin((A * Math.PI) / 180) * (b / Math.sin((B * Math.PI) / 180));
      } else if (
        a !== undefined &&
        b === undefined &&
        A !== undefined &&
        B !== undefined
      ) {
        result.b =
          Math.sin((B * Math.PI) / 180) * (a / Math.sin((A * Math.PI) / 180));
      } else if (
        a !== undefined &&
        b !== undefined &&
        A === undefined &&
        B !== undefined
      ) {
        result.A =
          Math.asin((a * Math.sin((B * Math.PI) / 180)) / b) * (180 / Math.PI);
      } else if (
        a !== undefined &&
        b !== undefined &&
        A !== undefined &&
        B === undefined
      ) {
        result.B =
          Math.asin((b * Math.sin((A * Math.PI) / 180)) / a) * (180 / Math.PI);
      }

      return result;
    },
  },
  {
    id: "cosine-rule",
    name: "Cosine Rule",
    category: "Geometry",
    latex:
      "a^2=b^2+c^2-2bc\\cos A\\:\\:|\\:\\:\\ A=cos^{-1}(\\frac{b^2+c^2-a^2}{2bc})", // Escape backslashes for LaTeX
    description: "Find side or angle in the cosine rule equation",
    variables: [
      { name: "Side A", symbol: "a", unit: "units" },
      { name: "Side B", symbol: "b", unit: "units" },
      { name: "Side C", symbol: "c", unit: "units" },
      { name: "Angle A", symbol: "A", unit: "deg" },
    ],
    solve: (values) => {
      const { a, b, c, A } = values;
      const result: Record<string, number> = {};

      if (
        a === undefined &&
        b !== undefined &&
        c !== undefined &&
        A !== undefined
      ) {
        result.a = Math.sqrt(
          b ** 2 + c ** 2 - 2 * b * c * Math.cos((A * Math.PI) / 180)
        );
      } else if (
        a !== undefined &&
        b !== undefined &&
        c !== undefined &&
        A === undefined
      ) {
        result.A =
          Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)) * (180 / Math.PI);
      }

      return result;
    },
  },
];
