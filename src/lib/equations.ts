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
    id: "kinematic-equation",
    name: "Kinematic Equation",
    category: "Physics",
    latex: "v = u + at",
    description: "Final velocity with constant acceleration",
    variables: [
      { name: "v", symbol: "v", unit: "m s⁻¹" },
      { name: "u", symbol: "u", unit: "m s⁻¹" },
      { name: "a", symbol: "a", unit: "m s⁻²" },
      { name: "t", symbol: "t", unit: "s" },
    ],
    solve: (values) => {
      const { v, u, a, t } = values;
      const result: Record<string, number> = {};

      if (
        u !== undefined &&
        a !== undefined &&
        t !== undefined &&
        v === undefined
      ) {
        result.v = u + a * t;
      }
      if (
        v !== undefined &&
        a !== undefined &&
        t !== undefined &&
        u === undefined
      ) {
        result.u = v - a * t;
      }
      if (
        v !== undefined &&
        u !== undefined &&
        t !== undefined &&
        a === undefined
      ) {
        result.a = (v - u) / t;
      }
      if (
        v !== undefined &&
        u !== undefined &&
        a !== undefined &&
        t === undefined
      ) {
        result.t = (v - u) / a;
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
