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

export const geometryExtraEquations: Equation[] = [
  // ── Basic Area / Volume ──────────────────────────────────────────────
  {
    id: 'triangle-area',
    name: 'Area of Triangle (½bh)',
    category: 'Geometry',
    latex: 'A = \\frac{1}{2} b h',
    description: 'Area of a triangle given its base and perpendicular height',
    solverType: 'geometric',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Base', symbol: 'b', unit: 'units', constraints: { positive: true } },
      { name: 'Height', symbol: 'h', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { A, b, h } = inputs;
      const results: EquationSolverResult = {};
      if (b !== undefined && h !== undefined) results.A = exPos(0.5 * b * h, 'Area', settings);
      if (A !== undefined && h !== undefined && h !== 0) results.b = exPos(2 * A / h, 'Base', settings);
      if (A !== undefined && b !== undefined && b !== 0) results.h = exPos(2 * A / b, 'Height', settings);
      return results;
    },
    examples: [{ input: { b: 8, h: 5 }, description: 'A = ½ × 8 × 5 = 20 units²' }],
    tags: ['triangle', 'area', 'base', 'height'],
    level: 'gcse',
  },
  {
    id: 'rectangle-area',
    name: 'Area of Rectangle',
    category: 'Geometry',
    latex: 'A = lw',
    description: 'Area of a rectangle given length and width',
    solverType: 'geometric',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Length', symbol: 'l', unit: 'units', constraints: { positive: true } },
      { name: 'Width', symbol: 'w', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { A, l, w } = inputs;
      const results: EquationSolverResult = {};
      if (l !== undefined && w !== undefined) results.A = exPos(l * w, 'Area', settings);
      if (A !== undefined && w !== undefined && w !== 0) results.l = exPos(A / w, 'Length', settings);
      if (A !== undefined && l !== undefined && l !== 0) results.w = exPos(A / l, 'Width', settings);
      return results;
    },
    examples: [{ input: { l: 12, w: 5 }, description: 'A = 12 × 5 = 60 units²' }],
    tags: ['rectangle', 'area', 'length', 'width'],
    level: 'gcse',
  },
  {
    id: 'parallelogram-area',
    name: 'Area of Parallelogram',
    category: 'Geometry',
    latex: 'A = bh',
    description: 'Area of a parallelogram given base and perpendicular height',
    solverType: 'geometric',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Base', symbol: 'b', unit: 'units', constraints: { positive: true } },
      { name: 'Height', symbol: 'h', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { A, b, h } = inputs;
      const results: EquationSolverResult = {};
      if (b !== undefined && h !== undefined) results.A = exPos(b * h, 'Area', settings);
      if (A !== undefined && h !== undefined && h !== 0) results.b = exPos(A / h, 'Base', settings);
      if (A !== undefined && b !== undefined && b !== 0) results.h = exPos(A / b, 'Height', settings);
      return results;
    },
    examples: [{ input: { b: 9, h: 4 }, description: 'A = 9 × 4 = 36 units²' }],
    tags: ['parallelogram', 'area', 'base', 'height'],
    level: 'gcse',
  },
  {
    id: 'cuboid-volume',
    name: 'Volume of Cuboid',
    category: 'Geometry',
    latex: 'V = lwh',
    description: 'Volume of a rectangular cuboid (box)',
    solverType: 'geometric',
    variables: [
      { name: 'Volume', symbol: 'V', unit: 'units³', constraints: { positive: true } },
      { name: 'Length', symbol: 'l', unit: 'units', constraints: { positive: true } },
      { name: 'Width', symbol: 'w', unit: 'units', constraints: { positive: true } },
      { name: 'Height', symbol: 'h', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { V, l, w, h } = inputs;
      const results: EquationSolverResult = {};
      if (l !== undefined && w !== undefined && h !== undefined) results.V = exPos(l * w * h, 'Volume', settings);
      if (V !== undefined && w !== undefined && h !== undefined && w !== 0 && h !== 0) results.l = exPos(V / (w * h), 'Length', settings);
      if (V !== undefined && l !== undefined && h !== undefined && l !== 0 && h !== 0) results.w = exPos(V / (l * h), 'Width', settings);
      if (V !== undefined && l !== undefined && w !== undefined && l !== 0 && w !== 0) results.h = exPos(V / (l * w), 'Height', settings);
      return results;
    },
    examples: [{ input: { l: 5, w: 3, h: 4 }, description: 'V = 5 × 3 × 4 = 60 units³' }],
    tags: ['cuboid', 'box', 'volume', 'rectangular prism'],
    level: 'gcse',
  },
  {
    id: 'pyramid-volume',
    name: 'Volume of Pyramid',
    category: 'Geometry',
    latex: 'V = \\frac{1}{3} B h',
    description: 'Volume of any pyramid: one-third of base area times perpendicular height',
    solverType: 'geometric',
    variables: [
      { name: 'Volume', symbol: 'V', unit: 'units³', constraints: { positive: true } },
      { name: 'Base area', symbol: 'B', unit: 'units²', constraints: { positive: true } },
      { name: 'Height', symbol: 'h', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { V, B, h } = inputs;
      const results: EquationSolverResult = {};
      if (B !== undefined && h !== undefined) results.V = exPos(B * h / 3, 'Volume', settings);
      if (V !== undefined && h !== undefined && h !== 0) results.B = exPos(3 * V / h, 'Base area', settings);
      if (V !== undefined && B !== undefined && B !== 0) results.h = exPos(3 * V / B, 'Height', settings);
      return results;
    },
    examples: [{ input: { B: 36, h: 10 }, description: 'V = ⅓ × 36 × 10 = 120 units³' }],
    tags: ['pyramid', 'volume', 'cone', 'base'],
    level: 'gcse',
  },
  {
    id: 'sphere-surface-area',
    name: 'Surface Area of Sphere',
    category: 'Geometry',
    latex: 'A = 4\\pi r^2',
    description: 'Total surface area of a sphere',
    solverType: 'geometric',
    variables: [
      { name: 'Surface area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Radius', symbol: 'r', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { A, r } = inputs;
      const results: EquationSolverResult = {};
      if (r !== undefined) results.A = exPos(4 * Math.PI * r * r, 'Area', settings);
      if (A !== undefined && A > 0) results.r = exPos(Math.sqrt(A / (4 * Math.PI)), 'Radius', settings);
      return results;
    },
    examples: [{ input: { r: 3 }, description: 'A = 4π × 9 = 36π ≈ 113.1 units²' }],
    tags: ['sphere', 'surface area', 'pi'],
    level: 'gcse',
  },
  {
    id: 'cylinder-surface-area',
    name: 'Surface Area of Cylinder',
    category: 'Geometry',
    latex: 'A = 2\\pi r^2 + 2\\pi r h',
    description: 'Total surface area of a closed cylinder (two circular ends plus curved surface)',
    solverType: 'geometric',
    variables: [
      { name: 'Total surface area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Radius', symbol: 'r', unit: 'units', constraints: { positive: true } },
      { name: 'Height', symbol: 'h', unit: 'units', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { A, r, h } = inputs;
      const results: EquationSolverResult = {};
      if (r !== undefined && h !== undefined) results.A = exPos(2 * Math.PI * r * (r + h), 'Area', settings);
      if (A !== undefined && r !== undefined && r > 0) results.h = exPos(A / (2 * Math.PI * r) - r, 'Height', settings);
      return results;
    },
    examples: [{ input: { r: 5, h: 10 }, description: 'A = 2π×5×15 = 150π ≈ 471.2 units²' }],
    tags: ['cylinder', 'surface area', 'pi', 'curved'],
    level: 'gcse',
  },
  // ── Circle sector / arc ─────────────────────────────────────────────
  {
    id: 'sector-area',
    name: 'Sector Area',
    category: 'Geometry',
    latex: 'A = \\frac{1}{2} r^2 \\theta',
    description: 'Area of a circle sector; θ must be in radians',
    solverType: 'geometric',
    angleMode: 'radians',
    variables: [
      { name: 'Sector area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Radius', symbol: 'r', unit: 'units', constraints: { positive: true } },
      { name: 'Angle θ (radians)', symbol: 'theta', unit: 'rad', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { A, r, theta } = inputs;
      const results: EquationSolverResult = {};
      if (r !== undefined && theta !== undefined) results.A = exPos(0.5 * r * r * theta, 'Area', settings);
      if (A !== undefined && theta !== undefined && theta !== 0) results.r = exPos(Math.sqrt(2 * A / theta), 'Radius', settings);
      if (A !== undefined && r !== undefined && r !== 0) results.theta = exPos(2 * A / (r * r), 'Angle', settings);
      return results;
    },
    examples: [{ input: { r: 6, theta: Math.PI / 3 }, description: 'r=6, θ=π/3 → A = 18×π/3 = 6π ≈ 18.85' }],
    tags: ['sector', 'area', 'angle', 'radians', 'circle'],
    level: 'gcse',
  },
  {
    id: 'arc-length',
    name: 'Arc Length',
    category: 'Geometry',
    latex: 's = r\\theta',
    description: 'Length of a circular arc; θ must be in radians',
    solverType: 'geometric',
    angleMode: 'radians',
    variables: [
      { name: 'Arc length', symbol: 's', unit: 'units', constraints: { positive: true } },
      { name: 'Radius', symbol: 'r', unit: 'units', constraints: { positive: true } },
      { name: 'Angle θ (radians)', symbol: 'theta', unit: 'rad', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { s, r, theta } = inputs;
      const results: EquationSolverResult = {};
      if (r !== undefined && theta !== undefined) results.s = exPos(r * theta, 'Arc length', settings);
      if (s !== undefined && theta !== undefined && theta !== 0) results.r = exPos(s / theta, 'Radius', settings);
      if (s !== undefined && r !== undefined && r !== 0) results.theta = exPos(s / r, 'Angle', settings);
      return results;
    },
    examples: [{ input: { r: 4, theta: 1.5 }, description: 's = 4 × 1.5 = 6 units' }],
    tags: ['arc', 'length', 'angle', 'radians', 'circle'],
    level: 'gcse',
  },
  // ── Coordinate geometry ─────────────────────────────────────────────
  {
    id: 'distance-two-points',
    name: 'Distance Between Two Points',
    category: 'Geometry',
    subcategory: 'Coordinate Geometry',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    description: 'Euclidean distance between two points in the plane',
    solverType: 'geometric',
    variables: [
      { name: 'Distance', symbol: 'd', unit: 'units', constraints: { positive: true } },
      { name: 'x₁', symbol: 'x_1', unit: '' },
      { name: 'y₁', symbol: 'y_1', unit: '' },
      { name: 'x₂', symbol: 'x_2', unit: '' },
      { name: 'y₂', symbol: 'y_2', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { x_1, y_1, x_2, y_2 } = inputs;
      const results: EquationSolverResult = {};
      if (x_1 !== undefined && y_1 !== undefined && x_2 !== undefined && y_2 !== undefined) {
        results.d = exPos(Math.sqrt((x_2 - x_1) ** 2 + (y_2 - y_1) ** 2), 'Distance', settings);
      }
      return results;
    },
    examples: [{ input: { x_1: 1, y_1: 2, x_2: 4, y_2: 6 }, description: 'd = √(9+16) = 5' }],
    tags: ['distance', 'coordinate', 'geometry', 'pythagoras'],
    level: 'gcse',
  },
  {
    id: 'midpoint-formula',
    name: 'Midpoint of Two Points',
    category: 'Geometry',
    subcategory: 'Coordinate Geometry',
    latex: 'M = \\left(\\frac{x_1 + x_2}{2},\\; \\frac{y_1 + y_2}{2}\\right)',
    description: 'Find the midpoint of a line segment connecting two coordinates',
    solverType: 'geometric',
    variables: [
      { name: 'x₁', symbol: 'x_1', unit: '' },
      { name: 'y₁', symbol: 'y_1', unit: '' },
      { name: 'x₂', symbol: 'x_2', unit: '' },
      { name: 'y₂', symbol: 'y_2', unit: '' },
      { name: 'Midpoint x (Mx)', symbol: 'M_x', unit: '' },
      { name: 'Midpoint y (My)', symbol: 'M_y', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { x_1, y_1, x_2, y_2 } = inputs;
      const results: EquationSolverResult = {};
      if (x_1 !== undefined && x_2 !== undefined) results.M_x = ex((x_1 + x_2) / 2, settings);
      if (y_1 !== undefined && y_2 !== undefined) results.M_y = ex((y_1 + y_2) / 2, settings);
      return results;
    },
    examples: [{ input: { x_1: 2, y_1: 4, x_2: 8, y_2: 10 }, description: 'M = (5, 7)' }],
    tags: ['midpoint', 'coordinate', 'geometry', 'bisect'],
    level: 'gcse',
  },
  {
    id: 'line-gradient',
    name: 'Gradient of a Line',
    category: 'Geometry',
    subcategory: 'Coordinate Geometry',
    latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
    description: 'Calculate the gradient (slope) of a straight line through two points',
    solverType: 'linear',
    variables: [
      { name: 'Gradient m', symbol: 'm', unit: '' },
      { name: 'x₁', symbol: 'x_1', unit: '' },
      { name: 'y₁', symbol: 'y_1', unit: '' },
      { name: 'x₂', symbol: 'x_2', unit: '' },
      { name: 'y₂', symbol: 'y_2', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { x_1, y_1, x_2, y_2 } = inputs;
      const results: EquationSolverResult = {};
      if (x_1 !== undefined && y_1 !== undefined && x_2 !== undefined && y_2 !== undefined) {
        const dx = x_2 - x_1;
        if (Math.abs(dx) < 1e-12) {
          results.m = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'Vertical line — gradient is undefined' };
        } else {
          results.m = ex((y_2 - y_1) / dx, settings);
        }
      }
      return results;
    },
    examples: [{ input: { x_1: 1, y_1: 3, x_2: 5, y_2: 11 }, description: 'm = (11-3)/(5-1) = 2' }],
    tags: ['gradient', 'slope', 'line', 'coordinate'],
    level: 'gcse',
  },
  {
    id: 'line-equation',
    name: 'Equation of a Line',
    category: 'Geometry',
    subcategory: 'Coordinate Geometry',
    latex: 'y - y_1 = m(x - x_1)',
    description: 'Find the y-intercept c of a line y = mx + c given gradient m and a point (x₁, y₁)',
    solverType: 'linear',
    variables: [
      { name: 'Gradient m', symbol: 'm', unit: '' },
      { name: 'x₁', symbol: 'x_1', unit: '' },
      { name: 'y₁', symbol: 'y_1', unit: '' },
      { name: 'y-intercept c', symbol: 'c', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { m, x_1, y_1, c } = inputs;
      const results: EquationSolverResult = {};
      if (m !== undefined && x_1 !== undefined && y_1 !== undefined) results.c = ex(y_1 - m * x_1, settings);
      if (m !== undefined && x_1 !== undefined && c !== undefined) results.y_1 = ex(m * x_1 + c, settings);
      if (m !== undefined && y_1 !== undefined && c !== undefined) results.x_1 = ex((y_1 - c) / m, settings);
      return results;
    },
    examples: [{ input: { m: 3, x_1: 2, y_1: 7 }, description: 'y = 3x + c → c = 7 - 6 = 1' }],
    tags: ['line', 'gradient', 'intercept', 'equation', 'straight'],
    level: 'gcse',
  },
  {
    id: 'triangle-sine-area',
    name: 'Triangle Area — Sine Rule',
    category: 'Geometry',
    latex: 'A = \\frac{1}{2} ab \\sin C',
    description: 'Area of a triangle when two sides and the included angle are known',
    solverType: 'trigonometry',
    angleMode: 'both',
    variables: [
      { name: 'Area', symbol: 'A', unit: 'units²', constraints: { positive: true } },
      { name: 'Side a', symbol: 'a', unit: 'units', constraints: { positive: true } },
      { name: 'Side b', symbol: 'b', unit: 'units', constraints: { positive: true } },
      { name: 'Included angle C', symbol: 'C', unit: '°' },
    ],
    solve: (inputs, settings) => {
      const { A, a, b, C } = inputs;
      const results: EquationSolverResult = {};
      const toRad = settings?.angle_mode === 'radians' ? 1 : Math.PI / 180;
      if (a !== undefined && b !== undefined && C !== undefined) {
        const area = 0.5 * a * b * Math.sin(C * toRad);
        results.A = exPos(area, 'Area', settings);
      }
      if (A !== undefined && b !== undefined && C !== undefined && b !== 0 && Math.sin(C * toRad) !== 0) {
        results.a = exPos(2 * A / (b * Math.sin(C * toRad)), 'Side a', settings);
      }
      if (A !== undefined && a !== undefined && C !== undefined && a !== 0 && Math.sin(C * toRad) !== 0) {
        results.b = exPos(2 * A / (a * Math.sin(C * toRad)), 'Side b', settings);
      }
      return results;
    },
    examples: [{ input: { a: 7, b: 5, C: 60 }, description: 'A = ½ × 7 × 5 × sin60° = 35√3/4 ≈ 15.16 units²' }],
    tags: ['triangle', 'area', 'sine', 'angle', 'trig'],
    level: 'gcse',
  },
];
