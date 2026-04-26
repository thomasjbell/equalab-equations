import { Equation, EquationSolverResult, wrapResults } from '@/types/equation';
import { EnhancedSolver } from '@/lib/enhancedSolver';
import { SymbolicConverter } from '@/lib/symbolicConverter';

export const financeEquations: Equation[] = [
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    category: 'Finance',
    latex: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
    description: 'Calculate compound interest with principal, rate, compounding frequency, and time',
    solverType: 'physics',
    variables: [
      { name: 'Final Amount', symbol: 'A', unit: '£' },
      { name: 'Principal', symbol: 'P', unit: '£', constraints: { positive: true } },
      { name: 'Annual Rate (decimal)', symbol: 'r', unit: '' },
      { name: 'Compounds per Year', symbol: 'n', unit: '', constraints: { positive: true } },
      { name: 'Time in Years', symbol: 't', unit: 'years', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { P, r, n, t, A } = inputs;
      const results: EquationSolverResult = {};
      if (P !== undefined && r !== undefined && n !== undefined && t !== undefined && A === undefined)
        results.A = { value: SymbolicConverter.convertToExact(P * Math.pow(1 + r / n, n * t), settings), validity: 'valid' };
      if (A !== undefined && r !== undefined && n !== undefined && t !== undefined && P === undefined && Math.pow(1 + r / n, n * t) !== 0)
        results.P = { value: SymbolicConverter.convertToExact(A / Math.pow(1 + r / n, n * t), settings), validity: 'valid' };
      if (A !== undefined && P !== undefined && r !== undefined && n !== undefined && t === undefined && P > 0 && (1 + r/n) > 0)
        results.t = { value: SymbolicConverter.convertToExact(Math.log(A / P) / (n * Math.log(1 + r / n)), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { P: 1000, r: 0.05, n: 12, t: 1 }, description: 'A ≈ £1051.16' }],
    tags: ['compound interest', 'finance', 'investment'],
    level: 'gcse',
  },
  {
    id: 'simple-interest',
    name: 'Simple Interest',
    category: 'Finance',
    latex: 'I = PRT',
    description: 'Calculate simple interest',
    solverType: 'linear',
    variables: [
      { name: 'Interest', symbol: 'I', unit: '£' },
      { name: 'Principal', symbol: 'P', unit: '£', constraints: { positive: true } },
      { name: 'Rate (decimal)', symbol: 'R', unit: '' },
      { name: 'Time', symbol: 'T', unit: 'years', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings) => wrapResults(
      EnhancedSolver.solveLinear({ I: 'P * R * T', P: 'I / (R * T)', R: 'I / (P * T)', T: 'I / (P * R)' }, inputs, settings)
    ),
    examples: [{ input: { P: 1000, R: 0.05, T: 2 }, description: 'I = £100' }],
    tags: ['simple interest', 'finance'],
    level: 'gcse',
  },
  {
    id: 'present-value',
    name: 'Present Value',
    category: 'Finance',
    latex: 'PV = \\frac{FV}{(1 + r)^n}',
    description: 'Present value of a future cash flow',
    solverType: 'physics',
    variables: [
      { name: 'Present Value', symbol: 'PV', unit: '£' },
      { name: 'Future Value', symbol: 'FV', unit: '£' },
      { name: 'Discount Rate (decimal)', symbol: 'r', unit: '' },
      { name: 'Periods', symbol: 'n', unit: '', constraints: { nonNegative: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { PV, FV, r, n } = inputs;
      const results: EquationSolverResult = {};
      const factor = Math.pow(1 + (r ?? 0), n ?? 0);
      if (FV !== undefined && r !== undefined && n !== undefined && PV === undefined && factor !== 0)
        results.PV = { value: SymbolicConverter.convertToExact(FV / factor, settings), validity: 'valid' };
      if (PV !== undefined && r !== undefined && n !== undefined && FV === undefined)
        results.FV = { value: SymbolicConverter.convertToExact(PV * factor, settings), validity: 'valid' };
      if (PV !== undefined && FV !== undefined && n !== undefined && r === undefined && n !== 0)
        results.r = { value: SymbolicConverter.convertToExact(Math.pow(FV / PV, 1 / n) - 1, settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { FV: 1000, r: 0.05, n: 5 }, description: 'PV ≈ £783.53' }],
    tags: ['present value', 'discounting', 'time value of money', 'finance'],
    level: 'alevel',
  },
  {
    id: 'mortgage-payment',
    name: 'Mortgage Monthly Payment',
    category: 'Finance',
    latex: 'M = P\\frac{r(1+r)^n}{(1+r)^n - 1}',
    description: 'Fixed monthly mortgage payment from principal, monthly rate, and number of payments',
    solverType: 'physics',
    variables: [
      { name: 'Monthly Payment', symbol: 'M', unit: '£' },
      { name: 'Principal', symbol: 'P', unit: '£', constraints: { positive: true } },
      { name: 'Monthly Rate', symbol: 'r', unit: '', constraints: { positive: true } },
      { name: 'Number of Payments', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { M, P, r, n } = inputs;
      const results: EquationSolverResult = {};
      if (P !== undefined && r !== undefined && n !== undefined && M === undefined) {
        const factor = Math.pow(1 + r, n);
        const payment = P * (r * factor) / (factor - 1);
        results.M = { value: SymbolicConverter.convertToExact(payment, settings), validity: 'valid' };
      }
      return results;
    },
    examples: [{ input: { P: 200000, r: 0.004167, n: 360 }, description: '£200k at 5% p.a. over 30 years' }],
    tags: ['mortgage', 'loan', 'finance', 'payment'],
    level: 'alevel',
  },
  {
    id: 'annuity',
    name: 'Annuity (Present Value)',
    category: 'Finance',
    latex: 'PV = C \\cdot \\frac{1 - (1+r)^{-n}}{r}',
    description: 'Present value of regular equal payments (annuity)',
    solverType: 'physics',
    variables: [
      { name: 'Present Value', symbol: 'PV', unit: '£' },
      { name: 'Payment per Period', symbol: 'C', unit: '£' },
      { name: 'Rate per Period', symbol: 'r', unit: '', constraints: { positive: true } },
      { name: 'Number of Periods', symbol: 'n', unit: '', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { PV, C, r, n } = inputs;
      const results: EquationSolverResult = {};
      if (C !== undefined && r !== undefined && n !== undefined && PV === undefined) {
        const pv = C * (1 - Math.pow(1 + r, -n)) / r;
        results.PV = { value: SymbolicConverter.convertToExact(pv, settings), validity: 'valid' };
      }
      if (PV !== undefined && r !== undefined && n !== undefined && C === undefined && (1 - Math.pow(1 + r, -n)) !== 0) {
        const c = PV * r / (1 - Math.pow(1 + r, -n));
        results.C = { value: SymbolicConverter.convertToExact(c, settings), validity: 'valid' };
      }
      return results;
    },
    examples: [{ input: { C: 1000, r: 0.05, n: 10 }, description: 'PV ≈ £7,721.73' }],
    tags: ['annuity', 'present value', 'finance'],
    level: 'alevel',
  },
  {
    id: 'roi',
    name: 'Return on Investment',
    category: 'Finance',
    latex: 'ROI = \\frac{Gain - Cost}{Cost} \\times 100\\%',
    description: 'Percentage return on an investment',
    solverType: 'physics',
    variables: [
      { name: 'ROI (%)', symbol: 'ROI', unit: '%' },
      { name: 'Gain from Investment', symbol: 'Gain', unit: '£' },
      { name: 'Cost of Investment', symbol: 'Cost', unit: '£', constraints: { positive: true } },
    ],
    solve: (inputs, settings): EquationSolverResult => {
      const { ROI, Gain, Cost } = inputs;
      const results: EquationSolverResult = {};
      if (Gain !== undefined && Cost !== undefined && ROI === undefined)
        results.ROI = { value: SymbolicConverter.convertToExact(((Gain - Cost) / Cost) * 100, settings), validity: 'valid' };
      if (ROI !== undefined && Cost !== undefined && Gain === undefined)
        results.Gain = { value: SymbolicConverter.convertToExact(Cost * (1 + ROI / 100), settings), validity: 'valid' };
      if (ROI !== undefined && Gain !== undefined && Cost === undefined && ROI !== -100)
        results.Cost = { value: SymbolicConverter.convertToExact(Gain / (1 + ROI / 100), settings), validity: 'valid' };
      return results;
    },
    examples: [{ input: { Gain: 1500, Cost: 1000 }, description: 'ROI = 50%' }],
    tags: ['ROI', 'return', 'investment', 'finance'],
    level: 'gcse',
  },
];
