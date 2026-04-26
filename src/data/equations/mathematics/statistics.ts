import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const statisticsEquations: Equation[] = [
  {
    id: 'mean',
    name: 'Arithmetic Mean',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: '\\bar{x} = \\frac{\\sum x}{n}',
    description: 'Calculate the mean of a dataset. Enter values comma-separated.',
    solverType: 'statistics',
    variables: [
      { name: 'Mean', symbol: 'mean', unit: '' },
      { name: 'Sum', symbol: 'sum', unit: '' },
      { name: 'Count', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => {
      const { mean, sum, n } = inputs;
      const results: EquationSolverResult = {};
      if (sum !== undefined && n !== undefined && mean === undefined)
        results.mean = { value: SymbolicConverter.convertToExact(sum / n, settings), validity: 'valid' };
      if (mean !== undefined && n !== undefined && sum === undefined)
        results.sum = { value: SymbolicConverter.convertToExact(mean * n, settings), validity: 'valid' };
      if (mean !== undefined && sum !== undefined && n === undefined && mean !== 0)
        results.n = { value: SymbolicConverter.convertToExact(sum / mean, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { sum: 45, n: 5 }, description: 'Mean of 5 values summing to 45' }],
    tags: ['mean', 'average', 'statistics'],
    level: 'gcse',
  },
  {
    id: 'z-score',
    name: 'Z-Score (Standard Score)',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'z = \\frac{x - \\mu}{\\sigma}',
    description: 'How many standard deviations a value is from the mean',
    solverType: 'linear',
    variables: [
      { name: 'Z-Score', symbol: 'z', unit: '' },
      { name: 'Value', symbol: 'x', unit: '' },
      { name: 'Mean (μ)', symbol: 'mu', unit: '' },
      { name: 'Standard Deviation (σ)', symbol: 'sigma', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ z: '(x - mu) / sigma', x: 'mu + z * sigma', mu: 'x - z * sigma', sigma: '(x - mu) / z' }, inputs, settings)
    ),
    examples: [{ input: { x: 85, mu: 70, sigma: 10 }, description: 'z = 1.5' }],
    tags: ['z-score', 'standard score', 'normal distribution', 'statistics'],
    level: 'alevel',
  },
  {
    id: 'standard-deviation',
    name: 'Standard Deviation (Population)',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: '\\sigma = \\sqrt{\\frac{\\sum(x - \\mu)^2}{n}}',
    description: 'Population standard deviation — measures spread of data',
    solverType: 'statistics',
    variables: [
      { name: 'Standard Deviation', symbol: 'sigma', unit: '' },
      { name: 'Variance', symbol: 'variance', unit: '' },
      { name: 'Count', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { sigma, variance } = inputs;
      const results: EquationSolverResult = {};
      if (variance !== undefined && sigma === undefined)
        results.sigma = { value: SymbolicConverter.convertToExact(Math.sqrt(variance), settings), validity: variance >= 0 ? 'valid' : 'invalid', validityReason: variance < 0 ? 'Variance cannot be negative' : undefined };
      if (sigma !== undefined && variance === undefined)
        results.variance = { value: SymbolicConverter.convertToExact(sigma * sigma, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { variance: 25 }, description: 'σ = 5' }],
    tags: ['standard deviation', 'variance', 'statistics'],
    level: 'alevel',
  },
  {
    id: 'binomial-probability',
    name: 'Binomial Probability',
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}',
    description: 'Probability of exactly k successes in n trials',
    solverType: 'statistics',
    variables: [
      { name: 'Probability P(X = k)', symbol: 'P', unit: '' },
      { name: 'Trials (n)', symbol: 'n', unit: '', constraints: { positive: true } },
      { name: 'Successes (k)', symbol: 'k', unit: '' },
      { name: 'Success Probability (p)', symbol: 'p', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { n, k, p } = inputs;
      const results: EquationSolverResult = {};
      if (n !== undefined && k !== undefined && p !== undefined) {
        const nk = Math.floor(k);
        const nn = Math.floor(n);
        let comb = 1;
        for (let i = 0; i < Math.min(nk, nn - nk); i++) {
          comb = (comb * (nn - i)) / (i + 1);
        }
        const prob = comb * Math.pow(p, nk) * Math.pow(1 - p, nn - nk);
        const validity = (p >= 0 && p <= 1 && nk >= 0 && nk <= nn) ? 'valid' : 'invalid';
        results.P = {
          value: SymbolicConverter.convertToExact(prob, settings),
          validity,
          validityReason: validity === 'invalid' ? 'p must be in [0,1] and k must be in [0,n]' : undefined,
        };
      }
      return results;
    },
    examples: [{ input: { n: 10, k: 3, p: 0.5 }, description: '10 coin flips, exactly 3 heads' }],
    tags: ['binomial', 'probability', 'statistics', 'combinatorics'],
    level: 'alevel',
  },
  {
    id: 'pearson-correlation',
    name: "Pearson's Correlation",
    category: 'Mathematics',
    subcategory: 'Statistics',
    latex: 'r = \\frac{n\\sum xy - \\sum x \\sum y}{\\sqrt{[n\\sum x^2-(\\sum x)^2][n\\sum y^2-(\\sum y)^2]}}',
    description: 'Formula structure for Pearson correlation coefficient. Enter pre-computed sums.',
    solverType: 'statistics',
    variables: [
      { name: 'Correlation r', symbol: 'r', unit: '' },
      { name: 'n×Σxy', symbol: 'nSxy', unit: '' },
      { name: 'Σx × Σy', symbol: 'SxSy', unit: '' },
      { name: '√[nΣx² − (Σx)²]', symbol: 'Dx', unit: '' },
      { name: '√[nΣy² − (Σy)²]', symbol: 'Dy', unit: '' },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { nSxy, SxSy, Dx, Dy } = inputs;
      const results: EquationSolverResult = {};
      if (nSxy !== undefined && SxSy !== undefined && Dx !== undefined && Dy !== undefined && Dx * Dy !== 0) {
        const rVal = (nSxy - SxSy) / (Dx * Dy);
        results.r = {
          value: SymbolicConverter.convertToExact(rVal, settings),
          validity: Math.abs(rVal) <= 1 ? 'valid' : 'warning',
          validityReason: Math.abs(rVal) > 1 ? 'Check inputs — r must be in [-1, 1]' : undefined,
        };
      }
      return results;
    },
    examples: [],
    tags: ['correlation', 'Pearson', 'statistics', 'regression'],
    level: 'alevel',
  },
];
