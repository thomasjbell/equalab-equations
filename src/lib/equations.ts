import { Equation } from "@/types/equation";

export const equations: Equation[] = [
  {
    id: "quadratic-formula",
    name: "Quadratic Formula",
    category: "Algebra",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    description: "Solves quadratic equations of the form ax² + bx + c = 0",
    variables: [
      { name: "a", symbol: "a", unit: "" },
      { name: "b", symbol: "b", unit: "" },
      { name: "c", symbol: "c", unit: "" },
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

      const discriminant = b * b - 4 * a * c;

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
    category: "Physics",
    latex: "V = I \\cdot R",
    description: "Relationship between voltage, current, and resistance",
    variables: [
      { name: "V", symbol: "V", unit: "V" },
      { name: "I", symbol: "I", unit: "A" },
      { name: "R", symbol: "R", unit: "Ω" },
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
    description: "All SUVAT equations",
    variables: [
      { name: "s", symbol: "s", unit: "m" },
      { name: "u", symbol: "u", unit: "m s⁻¹" },
      { name: "v", symbol: "v", unit: "m s⁻¹" },
      { name: "a", symbol: "a", unit: "m s⁻²" },
      { name: "t", symbol: "t", unit: "s" },
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
        result.s = 0.5 * (u + v) * (v - u) / a;
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
        result.a = ((2 * v * t) - 2 * s) / (t * t);
      }
      if (
        s !== undefined &&
        v !== undefined &&
        t !== undefined &&
        a === undefined &&
        u === undefined
      ) {
        result.u = ( (0 - (t * v)) + 2 * s) / t;
    
      }
      // UT
      if (
        s !== undefined &&
        v !== undefined &&
        a !== undefined &&
        u === undefined &&
        t === undefined
      ) {
        result.u = Math.sqrt((-(2 * a * s))+ v * v);
      }
      if (
        s !== undefined &&
        v !== undefined &&
        a !== undefined &&
        u === undefined &&
        t === undefined
      ) {
        result.t = ((- - v) + Math.sqrt((v * v) - (2 * a * s))) / a;
      }
      // VA
      if (
        s !== undefined &&
        u !== undefined &&
        t !== undefined &&
        v === undefined &&
        a === undefined
      ) {
        result.a = (((-2) * t * u) + (2 * s)) / (t * t);
      }
      if (
        s !== undefined &&
        u !== undefined &&
        t !== undefined &&
        v === undefined &&
        a === undefined
      ) {
        result.v = (((-t) * u) + (2 * s)) / t;
      }
      // VT
      if (
        s !== undefined &&
        u !== undefined &&
        a !== undefined &&
        v === undefined &&
        t === undefined
      ) {
        result.v = Math.sqrt((u * u) + (2 * a * s));
      }
      if (
        s !== undefined &&
        u !== undefined &&
        a !== undefined &&
        v === undefined &&
        t === undefined
      ) {
        result.t = ((- u) + Math.sqrt((u * u) + (2 * a * s))) / a;
      }
      // AT
      if (
        s !== undefined &&
        u !== undefined &&
        v !== undefined &&
        t === undefined &&
        a === undefined
      ) {
        result.a = ((v * v) - (u * u)) / (2 * s);
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
    description: "Area of a circle given radius",
    variables: [
      { name: "A", symbol: "A", unit: "units²" },
      { name: "r", symbol: "r", unit: "units" },
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
      { name: "A", symbol: "A", unit: "$" },
      { name: "P", symbol: "P", unit: "$" },
      { name: "r", symbol: "r", unit: "" },
      { name: "n", symbol: "n", unit: "" },
      { name: "t", symbol: "t", unit: "years" },
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
];
