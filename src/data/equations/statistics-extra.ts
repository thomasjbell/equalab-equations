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
    validity: n < 0 ? 'invalid' as const : isFinite(n) ? 'valid' as const : 'invalid' as const,
    validityReason: n < 0 ? `${label} cannot be negative` : undefined,
  };
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
}

export const statisticsExtraEquations: Equation[] = [
  {
    id: 'variance-population',
    name: 'Population Variance',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: '\\sigma^2 = \\frac{\\sum(x - \\mu)^2}{n}',
    description: 'Compute population variance from the sum of squared deviations, mean, and count',
    solverType: 'statistics',
    variables: [
      { name: 'Variance σ²', symbol: 'sigma2', unit: '' },
      { name: 'Sum of (x−μ)²', symbol: 'sum_sq', unit: '' },
      { name: 'Population mean μ', symbol: 'mu', unit: '' },
      { name: 'Count n', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { sigma2, sum_sq, n } = inputs;
      const results: EquationSolverResult = {};
      if (sum_sq !== undefined && n !== undefined && n > 0) results.sigma2 = exPos(sum_sq / n, 'Variance', settings);
      if (sigma2 !== undefined && n !== undefined) results.sum_sq = ex(sigma2 * n, settings);
      return results;
    },
    examples: [{ input: { sum_sq: 50, n: 10 }, description: 'σ² = 50/10 = 5' }],
    tags: ['variance', 'statistics', 'spread', 'population'],
    level: 'alevel',
  },
  {
    id: 'sample-std-dev',
    name: 'Sample Standard Deviation',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 's = \\sqrt{\\frac{\\sum(x - \\bar{x})^2}{n - 1}}',
    description: 'Bessel-corrected standard deviation for a sample',
    solverType: 'statistics',
    variables: [
      { name: 'Sample std dev s', symbol: 's', unit: '', constraints: { nonNegative: true } },
      { name: 'Sum of (x−x̄)²', symbol: 'sum_sq', unit: '', constraints: { nonNegative: true } },
      { name: 'Sample size n', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { s, sum_sq, n } = inputs;
      const results: EquationSolverResult = {};
      if (sum_sq !== undefined && n !== undefined && n > 1) results.s = exPos(Math.sqrt(sum_sq / (n - 1)), 'Std dev', settings);
      if (s !== undefined && n !== undefined && n > 1) results.sum_sq = exPos(s * s * (n - 1), 'Sum sq', settings);
      return results;
    },
    examples: [{ input: { sum_sq: 36, n: 5 }, description: 's = √(36/4) = √9 = 3' }],
    tags: ['standard deviation', 'sample', 'statistics', 'bessel'],
    level: 'alevel',
  },
  {
    id: 'poisson-probability',
    name: 'Poisson Distribution',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}',
    description: 'Probability of exactly k events in a Poisson process with mean λ',
    solverType: 'statistics',
    variables: [
      { name: 'P(X = k)', symbol: 'P_k', unit: '' },
      { name: 'Mean rate λ', symbol: 'lambda', unit: '', constraints: { positive: true } },
      { name: 'Number of events k', symbol: 'k', unit: '', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => {
      const { lambda, k } = inputs;
      const results: EquationSolverResult = {};
      if (lambda !== undefined && k !== undefined) {
        if (!Number.isInteger(k) || k < 0) {
          results.P_k = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'k must be a non-negative integer' };
        } else {
          const p = Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
          results.P_k = exPos(p, 'Probability', settings);
        }
      }
      return results;
    },
    examples: [
      { input: { lambda: 3, k: 2 }, description: 'P(X=2; λ=3) = e⁻³×9/2 ≈ 0.224' },
      { input: { lambda: 1, k: 0 }, description: 'P(X=0; λ=1) = e⁻¹ ≈ 0.368' },
    ],
    tags: ['poisson', 'probability', 'distribution', 'events'],
    level: 'alevel',
  },
  {
    id: 'confidence-interval',
    name: 'Confidence Interval (z)',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'CI = \\bar{x} \\pm z \\cdot \\frac{\\sigma}{\\sqrt{n}}',
    description: 'Confidence interval for a population mean using z-statistic',
    solverType: 'statistics',
    variables: [
      { name: 'Sample mean x̄', symbol: 'x_bar', unit: '' },
      { name: 'z-value', symbol: 'z', unit: '' },
      { name: 'Population std dev σ', symbol: 'sigma', unit: '', constraints: { positive: true } },
      { name: 'Sample size n', symbol: 'n', unit: '', constraints: { positive: true } },
      { name: 'Margin of error E', symbol: 'E', unit: '', constraints: { nonNegative: true } },
      { name: 'Lower bound CI⁻', symbol: 'CI_lower', unit: '' },
      { name: 'Upper bound CI⁺', symbol: 'CI_upper', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { x_bar, z, sigma, n } = inputs;
      const results: EquationSolverResult = {};
      if (z !== undefined && sigma !== undefined && n !== undefined && n > 0) {
        const moe = z * sigma / Math.sqrt(n);
        results.E = exPos(moe, 'Margin of error', settings);
        if (x_bar !== undefined) {
          results.CI_lower = ex(x_bar - moe, settings);
          results.CI_upper = ex(x_bar + moe, settings);
        }
      }
      return results;
    },
    examples: [
      { input: { x_bar: 50, z: 1.96, sigma: 10, n: 100 }, description: '95% CI: 50 ± 1.96×1 = (48.04, 51.96)' },
    ],
    tags: ['confidence interval', 'statistics', 'z-score', 'mean', 'inference'],
    level: 'alevel',
  },
  {
    id: 'geometric-probability',
    name: 'Geometric Distribution',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'P(X = k) = (1-p)^{k-1} p',
    description: 'Probability that the first success occurs on the kth trial',
    solverType: 'statistics',
    variables: [
      { name: 'P(X = k)', symbol: 'P_k', unit: '' },
      { name: 'Success probability p', symbol: 'p', unit: '' },
      { name: 'Trial number k', symbol: 'k', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { p, k } = inputs;
      const results: EquationSolverResult = {};
      if (p !== undefined && k !== undefined) {
        if (p < 0 || p > 1) {
          results.P_k = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'p must be between 0 and 1' };
        } else if (!Number.isInteger(k) || k < 1) {
          results.P_k = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'k must be a positive integer' };
        } else {
          results.P_k = exPos(Math.pow(1 - p, k - 1) * p, 'Probability', settings);
        }
      }
      return results;
    },
    examples: [
      { input: { p: 0.3, k: 3 }, description: 'P(first success on 3rd trial) = 0.7² × 0.3 = 0.147' },
    ],
    tags: ['geometric', 'distribution', 'probability', 'trials'],
    level: 'alevel',
  },
  {
    id: 'expected-value',
    name: 'Expected Value (Discrete)',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'E(X) = np',
    description: 'Expected value of a binomial distribution with n trials and success probability p',
    solverType: 'statistics',
    variables: [
      { name: 'E(X)', symbol: 'EX', unit: '' },
      { name: 'Number of trials n', symbol: 'n', unit: '', constraints: { positive: true } },
      { name: 'Success probability p', symbol: 'p', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { EX, n, p } = inputs;
      const results: EquationSolverResult = {};
      if (n !== undefined && p !== undefined) {
        if (p < 0 || p > 1) results.EX = { value: SymbolicConverter.convertToExact(NaN, settings), validity: 'invalid', validityReason: 'p must be in [0,1]' };
        else results.EX = ex(n * p, settings);
      }
      if (EX !== undefined && p !== undefined && p !== 0) results.n = exPos(EX / p, 'Trials', settings);
      if (EX !== undefined && n !== undefined && n !== 0) results.p = ex(EX / n, settings);
      return results;
    },
    examples: [{ input: { n: 20, p: 0.3 }, description: 'E(X) = 20 × 0.3 = 6' }],
    tags: ['expected value', 'mean', 'binomial', 'statistics'],
    level: 'alevel',
  },
  {
    id: 'interquartile-range',
    name: 'Interquartile Range',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'IQR = Q_3 - Q_1',
    description: 'Range of the middle 50% of data — measure of spread',
    solverType: 'statistics',
    variables: [
      { name: 'IQR', symbol: 'IQR', unit: '' },
      { name: 'Lower quartile Q₁', symbol: 'Q_1', unit: '' },
      { name: 'Upper quartile Q₃', symbol: 'Q_3', unit: '' },
    ],
    solve: (inputs, settings) => {
      const { IQR, Q_1, Q_3 } = inputs;
      const results: EquationSolverResult = {};
      if (Q_1 !== undefined && Q_3 !== undefined) results.IQR = ex(Q_3 - Q_1, settings);
      if (IQR !== undefined && Q_1 !== undefined) results.Q_3 = ex(IQR + Q_1, settings);
      if (IQR !== undefined && Q_3 !== undefined) results.Q_1 = ex(Q_3 - IQR, settings);
      return results;
    },
    examples: [{ input: { Q_1: 15, Q_3: 35 }, description: 'IQR = 35 − 15 = 20' }],
    tags: ['IQR', 'quartile', 'spread', 'statistics', 'range'],
    level: 'gcse',
  },
];
