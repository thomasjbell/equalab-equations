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
function exWarn(n: number, reason: string, settings?: Parameters<typeof SymbolicConverter.convertToExact>[1]) {
  return {
    value: SymbolicConverter.convertToExact(n, settings),
    validity: 'warning' as const,
    validityReason: reason,
  };
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export const algebraExtraEquations: Equation[] = [
  {
    id: 'linear-equation',
    name: 'Linear Equation',
    category: 'Algebra',
    latex: 'ax + b = c \\Rightarrow x = \\frac{c - b}{a}',
    description: 'Solve a linear equation for x given coefficients a, b and constant c',
    solverType: 'linear',
    variables: [
      { name: 'Coefficient a', symbol: 'a', unit: '' },
      { name: 'Constant b', symbol: 'b', unit: '' },
      { name: 'Right-hand side c', symbol: 'c', unit: '' },
      { name: 'Solution x', symbol: 'x', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { a, b, c, x } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && b !== undefined && c !== undefined) {
        if (a === 0) results.x = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'a cannot be 0' };
        else results.x = ex((c - b) / a, settings);
      }
      if (x !== undefined && b !== undefined && c !== undefined) results.a = ex((c - b) / x, settings);
      if (x !== undefined && a !== undefined && c !== undefined) results.b = ex(c - a * x, settings);
      if (x !== undefined && a !== undefined && b !== undefined) results.c = ex(a * x + b, settings);
      return results;
    },
    examples: [{ input: { a: 3, b: 2, c: 11 }, description: '3x + 2 = 11 → x = 3' }],
    tags: ['linear', 'solve', 'algebra', 'equation'],
    level: 'gcse',
  },
  {
    id: 'simultaneous-linear-2x2',
    name: 'Simultaneous Linear Equations',
    category: 'Algebra',
    latex: 'ax + by = c, \\quad dx + ey = f',
    description: 'Solve a pair of simultaneous linear equations using elimination',
    solverType: 'linear',
    variables: [
      { name: 'Coefficient a (eq 1, x)', symbol: 'a', unit: '' },
      { name: 'Coefficient b (eq 1, y)', symbol: 'b', unit: '' },
      { name: 'Constant c (eq 1)', symbol: 'c', unit: '' },
      { name: 'Coefficient d (eq 2, x)', symbol: 'd', unit: '' },
      { name: 'Coefficient e (eq 2, y)', symbol: 'e', unit: '' },
      { name: 'Constant f (eq 2)', symbol: 'f', unit: '' },
      { name: 'Solution x', symbol: 'x', unit: '' },
      { name: 'Solution y', symbol: 'y', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { a, b, c, d, e, f } = inputs;
      const results: EquationSolverResult = {};
      if ([a, b, c, d, e, f].every(v => v !== undefined)) {
        const det = a! * e! - b! * d!;
        if (Math.abs(det) < 1e-12) {
          results.x = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'No unique solution (parallel or coincident lines)' };
          results.y = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'No unique solution (parallel or coincident lines)' };
        } else {
          results.x = ex((c! * e! - b! * f!) / det, settings);
          results.y = ex((a! * f! - c! * d!) / det, settings);
        }
      }
      return results;
    },
    examples: [
      { input: { a: 2, b: 1, c: 7, d: 1, e: -1, f: 1 }, description: '2x+y=7, x-y=1 → x=8/3… (try x=3,y=1 for clean result)' },
      { input: { a: 1, b: 1, c: 5, d: 1, e: -1, f: 1 }, description: 'x+y=5, x-y=1 → x=3, y=2' },
    ],
    tags: ['simultaneous', 'linear', 'system', 'equations'],
    level: 'gcse',
  },
  {
    id: 'arithmetic-nth-term',
    name: 'Arithmetic Sequence — nth Term',
    category: 'Algebra',
    subcategory: 'Sequences & Series',
    latex: 'a_n = a + (n-1)d',
    description: 'Find the nth term of an arithmetic sequence with first term a and common difference d',
    solverType: 'linear',
    variables: [
      { name: 'nth term (aₙ)', symbol: 'a_n', unit: '' },
      { name: 'First term (a)', symbol: 'a', unit: '' },
      { name: 'Common difference (d)', symbol: 'd', unit: '' },
      { name: 'Term number (n)', symbol: 'n', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { a_n, a, d, n } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && d !== undefined && n !== undefined) results.a_n = ex(a + (n - 1) * d, settings);
      if (a_n !== undefined && d !== undefined && n !== undefined) results.a = ex(a_n - (n - 1) * d, settings);
      if (a_n !== undefined && a !== undefined && n !== undefined && n !== 1) results.d = ex((a_n - a) / (n - 1), settings);
      if (a_n !== undefined && a !== undefined && d !== undefined && d !== 0) results.n = ex((a_n - a) / d + 1, settings);
      return results;
    },
    examples: [{ input: { a: 3, d: 4, n: 10 }, description: '3, 7, 11, ... → 10th term = 39' }],
    tags: ['arithmetic', 'sequence', 'nth term', 'series'],
    level: 'gcse',
  },
  {
    id: 'arithmetic-series-sum',
    name: 'Arithmetic Series — Sum',
    category: 'Algebra',
    subcategory: 'Sequences & Series',
    latex: 'S_n = \\frac{n}{2}(2a + (n-1)d) = \\frac{n}{2}(a + l)',
    description: 'Sum of the first n terms of an arithmetic series; l is the last term',
    solverType: 'linear',
    variables: [
      { name: 'Sum Sₙ', symbol: 'S_n', unit: '' },
      { name: 'First term (a)', symbol: 'a', unit: '' },
      { name: 'Common difference (d)', symbol: 'd', unit: '' },
      { name: 'Number of terms (n)', symbol: 'n', unit: '' },
      { name: 'Last term (l)', symbol: 'l', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { S_n, a, d, n, l } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && d !== undefined && n !== undefined) {
        results.S_n = ex(n / 2 * (2 * a + (n - 1) * d), settings);
        results.l = ex(a + (n - 1) * d, settings);
      }
      if (a !== undefined && l !== undefined && n !== undefined) results.S_n = ex(n / 2 * (a + l), settings);
      if (S_n !== undefined && a !== undefined && n !== undefined && n !== 0) results.d = ex((2 * S_n / n - 2 * a) / (n - 1), settings);
      if (S_n !== undefined && d !== undefined && n !== undefined && n !== 0) results.a = ex(S_n / n - (n - 1) * d / 2, settings);
      return results;
    },
    examples: [{ input: { a: 1, d: 1, n: 100 }, description: '1+2+3+...+100 = 5050' }],
    tags: ['arithmetic', 'series', 'sum', 'sigma'],
    level: 'gcse',
  },
  {
    id: 'geometric-nth-term',
    name: 'Geometric Sequence — nth Term',
    category: 'Algebra',
    subcategory: 'Sequences & Series',
    latex: 'a_n = ar^{n-1}',
    description: 'Find the nth term of a geometric sequence with first term a and common ratio r',
    solverType: 'linear',
    variables: [
      { name: 'nth term (aₙ)', symbol: 'a_n', unit: '' },
      { name: 'First term (a)', symbol: 'a', unit: '' },
      { name: 'Common ratio (r)', symbol: 'r', unit: '' },
      { name: 'Term number (n)', symbol: 'n', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { a_n, a, r, n } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && r !== undefined && n !== undefined) results.a_n = ex(a * Math.pow(r, n - 1), settings);
      if (a_n !== undefined && r !== undefined && n !== undefined && r !== 0) results.a = ex(a_n / Math.pow(r, n - 1), settings);
      if (a_n !== undefined && a !== undefined && n !== undefined && a !== 0 && n !== 1) results.r = ex(Math.pow(a_n / a, 1 / (n - 1)), settings);
      if (a_n !== undefined && a !== undefined && r !== undefined && r > 0 && r !== 1 && a !== 0) results.n = ex(Math.log(a_n / a) / Math.log(r) + 1, settings);
      return results;
    },
    examples: [{ input: { a: 2, r: 3, n: 5 }, description: '2, 6, 18, 54, 162 → 5th term = 162' }],
    tags: ['geometric', 'sequence', 'nth term', 'exponential'],
    level: 'gcse',
  },
  {
    id: 'geometric-series-finite',
    name: 'Geometric Series — Finite Sum',
    category: 'Algebra',
    subcategory: 'Sequences & Series',
    latex: 'S_n = \\frac{a(1 - r^n)}{1 - r} \\quad (r \\neq 1)',
    description: 'Sum of the first n terms of a geometric series',
    solverType: 'linear',
    variables: [
      { name: 'Sum Sₙ', symbol: 'S_n', unit: '' },
      { name: 'First term (a)', symbol: 'a', unit: '' },
      { name: 'Common ratio (r)', symbol: 'r', unit: '' },
      { name: 'Number of terms (n)', symbol: 'n', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { a, r, n } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && r !== undefined && n !== undefined) {
        if (Math.abs(r - 1) < 1e-12) {
          results.S_n = ex(a * n, settings);
        } else {
          results.S_n = ex(a * (1 - Math.pow(r, n)) / (1 - r), settings);
        }
      }
      return results;
    },
    examples: [
      { input: { a: 1, r: 2, n: 8 }, description: '1+2+4+...+128 = 255' },
      { input: { a: 100, r: 0.5, n: 6 }, description: '100+50+25+... (6 terms) = 196.875' },
    ],
    tags: ['geometric', 'series', 'sum', 'finite'],
    level: 'gcse',
  },
  {
    id: 'geometric-series-infinity',
    name: 'Geometric Series — Sum to Infinity',
    category: 'Algebra',
    subcategory: 'Sequences & Series',
    latex: 'S_{\\infty} = \\frac{a}{1 - r} \\quad |r| < 1',
    description: 'Sum to infinity of a convergent geometric series (requires |r| < 1)',
    solverType: 'linear',
    variables: [
      { name: 'Sum to infinity (S∞)', symbol: 'S_inf', unit: '' },
      { name: 'First term (a)', symbol: 'a', unit: '' },
      { name: 'Common ratio (r)', symbol: 'r', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { S_inf, a, r } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && r !== undefined) {
        if (Math.abs(r) >= 1) {
          results.S_inf = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: '|r| must be < 1 for convergence' };
        } else {
          results.S_inf = ex(a / (1 - r), settings);
        }
      }
      if (S_inf !== undefined && r !== undefined && Math.abs(r) < 1) results.a = ex(S_inf * (1 - r), settings);
      if (S_inf !== undefined && a !== undefined && S_inf !== 0) results.r = ex(1 - a / S_inf, settings);
      return results;
    },
    examples: [{ input: { a: 1, r: 0.5 }, description: '1 + 0.5 + 0.25 + ... = 2' }],
    tags: ['geometric', 'series', 'infinity', 'convergent'],
    level: 'alevel',
  },
  {
    id: 'exponential-growth-decay',
    name: 'Exponential Growth & Decay',
    category: 'Algebra',
    latex: 'y = ae^{kt}',
    description: 'Model exponential growth (k > 0) or decay (k < 0) over time',
    solverType: 'custom',
    variables: [
      { name: 'Value y', symbol: 'y', unit: '' },
      { name: 'Initial value a', symbol: 'a', unit: '' },
      { name: 'Growth/decay constant k', symbol: 'k', unit: '' },
      { name: 'Time t', symbol: 't', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { y, a, k, t } = inputs;
      const results: EquationSolverResult = {};
      if (a !== undefined && k !== undefined && t !== undefined) results.y = ex(a * Math.exp(k * t), settings);
      if (y !== undefined && k !== undefined && t !== undefined && k !== 0) results.a = ex(y / Math.exp(k * t), settings);
      if (y !== undefined && a !== undefined && t !== undefined && t !== 0 && a !== 0 && y / a > 0) results.k = ex(Math.log(y / a) / t, settings);
      if (y !== undefined && a !== undefined && k !== undefined && k !== 0 && a !== 0 && y / a > 0) results.t = ex(Math.log(y / a) / k, settings);
      return results;
    },
    examples: [
      { input: { a: 100, k: -0.05, t: 10 }, description: 'Decay: 100e^(-0.05×10) ≈ 60.65' },
      { input: { a: 50, k: 0.1, t: 5 }, description: 'Growth: 50e^(0.5) ≈ 82.44' },
    ],
    tags: ['exponential', 'growth', 'decay', 'natural', 'e'],
    level: 'alevel',
  },
  {
    id: 'percentage-change',
    name: 'Percentage Change',
    category: 'Algebra',
    latex: '\\% \\text{ change} = \\frac{\\text{new} - \\text{old}}{|\\text{old}|} \\times 100',
    description: 'Calculate percentage increase or decrease between two values',
    solverType: 'custom',
    variables: [
      { name: 'Percentage change (%)', symbol: 'pct', unit: '%' },
      { name: 'Original value', symbol: 'old', unit: '' },
      { name: 'New value', symbol: 'new_val', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { pct, old: oldVal, new_val } = inputs;
      const results: EquationSolverResult = {};
      if (oldVal !== undefined && new_val !== undefined) {
        if (oldVal === 0) results.pct = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'Original value cannot be zero' };
        else results.pct = ex((new_val - oldVal) / Math.abs(oldVal) * 100, settings);
      }
      if (pct !== undefined && oldVal !== undefined) results.new_val = ex(oldVal * (1 + pct / 100), settings);
      if (pct !== undefined && new_val !== undefined && pct !== -100) results.old = ex(new_val / (1 + pct / 100), settings);
      return results;
    },
    examples: [
      { input: { old: 80, new_val: 100 }, description: '80 → 100 = 25% increase' },
      { input: { old: 200, pct: -15 }, description: '200 with 15% decrease → 170' },
    ],
    tags: ['percentage', 'change', 'increase', 'decrease', 'ratio'],
    level: 'gcse',
  },
  {
    id: 'percentage-of-amount',
    name: 'Percentage of an Amount',
    category: 'Algebra',
    latex: 'A = \\frac{p}{100} \\times W',
    description: 'Find a percentage of a whole, or find what percentage one value is of another',
    solverType: 'custom',
    variables: [
      { name: 'Amount A', symbol: 'A', unit: '' },
      { name: 'Percentage p', symbol: 'p', unit: '%' },
      { name: 'Whole W', symbol: 'W', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { A, p, W } = inputs;
      const results: EquationSolverResult = {};
      if (p !== undefined && W !== undefined) results.A = ex(p / 100 * W, settings);
      if (A !== undefined && W !== undefined && W !== 0) results.p = ex(A / W * 100, settings);
      if (A !== undefined && p !== undefined && p !== 0) results.W = ex(A / (p / 100), settings);
      return results;
    },
    examples: [
      { input: { p: 35, W: 200 }, description: '35% of 200 = 70' },
      { input: { A: 15, W: 60 }, description: '15 is what % of 60? → 25%' },
    ],
    tags: ['percentage', 'proportion', 'fraction', 'amount'],
    level: 'gcse',
  },
  {
    id: 'binomial-coefficient',
    name: 'Binomial Coefficient',
    category: 'Algebra',
    latex: '\\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}',
    description: 'Calculate C(n,r) — number of ways to choose r items from n (combinations)',
    solverType: 'custom',
    variables: [
      { name: 'Result C(n,r)', symbol: 'C', unit: '' },
      { name: 'Total items n', symbol: 'n', unit: '' },
      { name: 'Items chosen r', symbol: 'r', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { n, r } = inputs;
      const results: EquationSolverResult = {};
      if (n !== undefined && r !== undefined) {
        if (!Number.isInteger(n) || !Number.isInteger(r) || r < 0 || r > n) {
          results.C = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'n and r must be non-negative integers with r ≤ n' };
        } else {
          const val = factorial(n) / (factorial(r) * factorial(n - r));
          results.C = ex(val, settings);
        }
      }
      return results;
    },
    examples: [
      { input: { n: 5, r: 2 }, description: 'C(5,2) = 10 — choose 2 from 5' },
      { input: { n: 10, r: 3 }, description: 'C(10,3) = 120' },
    ],
    tags: ['combinations', 'binomial', 'coefficient', 'factorial', 'probability'],
    level: 'alevel',
  },
  {
    id: 'log-change-of-base',
    name: 'Logarithm — Change of Base',
    category: 'Algebra',
    latex: '\\log_b x = \\frac{\\ln x}{\\ln b} = \\frac{\\log_{10} x}{\\log_{10} b}',
    description: 'Evaluate a logarithm to any base using natural logs',
    solverType: 'custom',
    variables: [
      { name: 'Result logᵦ(x)', symbol: 'L', unit: '' },
      { name: 'Argument x', symbol: 'x', unit: '' },
      { name: 'Base b', symbol: 'b', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { x, b } = inputs;
      const results: EquationSolverResult = {};
      if (x !== undefined && b !== undefined) {
        if (x <= 0 || b <= 0 || b === 1) {
          results.L = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'x and b must be positive; b ≠ 1' };
        } else {
          results.L = ex(Math.log(x) / Math.log(b), settings);
        }
      }
      return results;
    },
    examples: [
      { input: { x: 8, b: 2 }, description: 'log₂(8) = 3' },
      { input: { x: 1000, b: 10 }, description: 'log₁₀(1000) = 3' },
    ],
    tags: ['logarithm', 'log', 'base', 'change', 'natural log'],
    level: 'alevel',
  },
  {
    id: 'direct-proportion',
    name: 'Direct Proportion',
    category: 'Algebra',
    latex: 'y = kx',
    description: 'y is directly proportional to x; find the constant of proportionality k',
    solverType: 'linear',
    variables: [
      { name: 'y', symbol: 'y', unit: '' },
      { name: 'Constant k', symbol: 'k', unit: '' },
      { name: 'x', symbol: 'x', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { y, k, x } = inputs;
      const results: EquationSolverResult = {};
      if (k !== undefined && x !== undefined) results.y = ex(k * x, settings);
      if (y !== undefined && x !== undefined && x !== 0) results.k = ex(y / x, settings);
      if (y !== undefined && k !== undefined && k !== 0) results.x = ex(y / k, settings);
      return results;
    },
    examples: [{ input: { k: 4, x: 7 }, description: 'y = 4 × 7 = 28' }],
    tags: ['proportion', 'linear', 'constant', 'ratio'],
    level: 'gcse',
  },
  {
    id: 'inverse-proportion',
    name: 'Inverse Proportion',
    category: 'Algebra',
    latex: 'y = \\frac{k}{x}',
    description: 'y is inversely proportional to x',
    solverType: 'custom',
    variables: [
      { name: 'y', symbol: 'y', unit: '' },
      { name: 'Constant k', symbol: 'k', unit: '' },
      { name: 'x', symbol: 'x', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { y, k, x } = inputs;
      const results: EquationSolverResult = {};
      if (k !== undefined && x !== undefined && x !== 0) results.y = ex(k / x, settings);
      if (y !== undefined && x !== undefined) results.k = ex(y * x, settings);
      if (y !== undefined && k !== undefined && y !== 0) results.x = ex(k / y, settings);
      return results;
    },
    examples: [{ input: { k: 24, x: 6 }, description: 'y = 24/6 = 4' }],
    tags: ['inverse', 'proportion', 'reciprocal'],
    level: 'gcse',
  },
];
