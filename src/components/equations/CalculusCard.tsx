"use client";

import { useState, useEffect, useCallback } from "react";
import * as math from "mathjs";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "differentiate" | "indefinite" | "definite";

const KNOWN_CONSTANTS = new Set(['e', 'pi', 'i', 'Inf', 'NaN', 'true', 'false', 'Infinity', 'tau', 'phi']);

function detectVariable(expr: string): string {
  try {
    const node = math.parse(expr);
    const symbols = new Set<string>();
    node.traverse((n: math.MathNode) => {
      if (n.type === 'SymbolNode') {
        const name = (n as math.SymbolNode).name;
        if (!KNOWN_CONSTANTS.has(name) && !/^[A-Z]/.test(name)) {
          symbols.add(name);
        }
      }
    });
    if (symbols.has('x')) return 'x';
    const arr = Array.from(symbols).sort();
    return arr.length > 0 ? arr[0] : 'x';
  } catch {
    return 'x';
  }
}

function containsVar(node: math.MathNode, v: string): boolean {
  let found = false;
  try {
    node.traverse((n: math.MathNode) => {
      if (n.type === 'SymbolNode' && (n as math.SymbolNode).name === v) found = true;
    });
  } catch {}
  return found;
}

function integrateNodeToExpr(node: math.MathNode, v: string): string {
  if (node.type === 'ParenthesisNode') {
    return integrateNodeToExpr((node as math.ParenthesisNode).content, v);
  }
  if (node.type === 'ConstantNode') {
    const val = (node as math.ConstantNode).value;
    return `(${val}) * ${v}`;
  }
  if (node.type === 'SymbolNode') {
    const name = (node as math.SymbolNode).name;
    if (name === v) return `${v}^2 / 2`;
    return `${name} * ${v}`;
  }
  if (node.type === 'OperatorNode') {
    const op = node as math.OperatorNode;
    if (op.op === '+') {
      return `(${integrateNodeToExpr(op.args[0], v)}) + (${integrateNodeToExpr(op.args[1], v)})`;
    }
    if (op.op === '-') {
      if (op.args.length === 1) return `-(${integrateNodeToExpr(op.args[0], v)})`;
      return `(${integrateNodeToExpr(op.args[0], v)}) - (${integrateNodeToExpr(op.args[1], v)})`;
    }
    if (op.op === '*') {
      if (!containsVar(op.args[0], v)) {
        return `(${op.args[0].toString()}) * (${integrateNodeToExpr(op.args[1], v)})`;
      }
      if (!containsVar(op.args[1], v)) {
        return `(${op.args[1].toString()}) * (${integrateNodeToExpr(op.args[0], v)})`;
      }
      throw new Error("Product of two variable expressions — try expanding first");
    }
    if (op.op === '/') {
      // constant denominator
      if (!containsVar(op.args[1], v)) {
        return `(${integrateNodeToExpr(op.args[0], v)}) / (${op.args[1].toString()})`;
      }
      // 1/x → ln(x)
      if (
        op.args[0].type === 'ConstantNode' &&
        Number((op.args[0] as math.ConstantNode).value) === 1 &&
        op.args[1].type === 'SymbolNode' &&
        (op.args[1] as math.SymbolNode).name === v
      ) {
        return `log(${v})`;
      }
      throw new Error("Cannot integrate this quotient symbolically");
    }
    if (op.op === '^') {
      const base = op.args[0];
      const expNode = op.args[1];
      // x^n
      if (base.type === 'SymbolNode' && (base as math.SymbolNode).name === v && !containsVar(expNode, v)) {
        try {
          const n = math.evaluate(expNode.toString()) as number;
          if (Math.abs(n + 1) < 1e-10) return `log(${v})`;
          const newExp = n + 1;
          const expStr = Number.isInteger(newExp) ? String(newExp) : `(${expNode.toString()} + 1)`;
          return `${v}^${expStr} / ${Number.isInteger(newExp) ? newExp : `(${expNode.toString()} + 1)`}`;
        } catch {
          return `${v}^(${expNode.toString()} + 1) / (${expNode.toString()} + 1)`;
        }
      }
      // e^x
      if (
        base.type === 'SymbolNode' && (base as math.SymbolNode).name === 'e' &&
        expNode.type === 'SymbolNode' && (expNode as math.SymbolNode).name === v
      ) {
        return `exp(${v})`;
      }
      throw new Error("Cannot integrate this power symbolically");
    }
  }
  if (node.type === 'FunctionNode') {
    const fn = node as math.FunctionNode;
    const fnName = (fn.fn as math.SymbolNode).name ?? fn.fn.toString();
    const arg = fn.args[0];
    if (arg.type === 'SymbolNode' && (arg as math.SymbolNode).name === v) {
      if (fnName === 'sin')  return `-cos(${v})`;
      if (fnName === 'cos')  return `sin(${v})`;
      if (fnName === 'tan')  return `-log(cos(${v}))`;
      if (fnName === 'exp')  return `exp(${v})`;
      if (fnName === 'log' || fnName === 'ln') return `${v} * log(${v}) - ${v}`;
      if (fnName === 'sqrt') return `(2 / 3) * ${v}^(3/2)`;
      if (fnName === 'sec')  return `log(tan(${v}) + sec(${v}))`;
      if (fnName === 'csc')  return `-log(csc(${v}) + cot(${v}))`;
      if (fnName === 'cot')  return `log(sin(${v}))`;
      if (fnName === 'sinh') return `cosh(${v})`;
      if (fnName === 'cosh') return `sinh(${v})`;
    }
    // constant * f(v) — check if f has no v in it
    if (!containsVar(node, v)) {
      return `(${node.toString()}) * ${v}`;
    }
    throw new Error(`Cannot integrate ${fnName}(...) symbolically`);
  }
  throw new Error("Cannot integrate this expression symbolically");
}

function exprToLatex(expr: string): string {
  try { return math.parse(expr).toTex({ parenthesis: "auto" }); }
  catch { return expr; }
}

function differentiate(expr: string): { latex: string; variable: string; ok: boolean; error?: string } {
  const variable = detectVariable(expr);
  try {
    const node = math.derivative(expr, variable);
    const simplified = math.simplify(node);
    return { latex: simplified.toTex({ parenthesis: "auto" }), variable, ok: true };
  } catch (e: unknown) {
    return { latex: "", variable, ok: false, error: e instanceof Error ? e.message : "Cannot differentiate this expression" };
  }
}

function symbolicIntegral(expr: string): { latex: string; variable: string; ok: boolean; error?: string } {
  const variable = detectVariable(expr);
  try {
    const node = math.parse(expr);
    const resultExpr = integrateNodeToExpr(node, variable);
    // parse + simplify to normalise (e.g. collapse double fractions)
    let latex: string;
    try {
      const simplified = math.simplify(math.parse(resultExpr));
      latex = simplified.toTex({ parenthesis: "auto" });
    } catch {
      latex = math.parse(resultExpr).toTex({ parenthesis: "auto" });
    }
    return { latex: latex + ' + C', variable, ok: true };
  } catch (e: unknown) {
    return { latex: "", variable, ok: false, error: e instanceof Error ? e.message : "Cannot integrate this expression symbolically" };
  }
}

function numericalIntegral(expr: string, a: number, b: number): { value: number; variable: string; ok: boolean; error?: string } {
  const variable = detectVariable(expr);
  try {
    const compiled = math.compile(expr);
    const evaluate = (v: number) => {
      const result = compiled.evaluate({ [variable]: v });
      return typeof result === "number" ? result : NaN;
    };
    const n = 1000;
    const h = (b - a) / n;
    let sum = evaluate(a) + evaluate(b);
    for (let i = 1; i < n; i++) {
      sum += evaluate(a + i * h) * (i % 2 === 0 ? 2 : 4);
    }
    const value = (h / 3) * sum;
    if (!isFinite(value)) return { value: NaN, variable, ok: false, error: "Result is not finite — check your bounds" };
    return { value, variable, ok: true };
  } catch (e: unknown) {
    return { value: NaN, variable, ok: false, error: e instanceof Error ? e.message : "Cannot evaluate" };
  }
}

function formatNumber(n: number): string {
  if (Math.abs(n) < 1e-10) return "0";
  if (Number.isInteger(n)) return String(n);
  if (Math.abs(n) >= 1000 || Math.abs(n) < 0.001) return n.toExponential(5).replace(/\.?0+e/, 'e');
  return (Math.round(n * 1e8) / 1e8).toString().replace(/\.?0+$/, '');
}

const MODES: { key: Mode; label: string }[] = [
  { key: "differentiate", label: "d/dx  Differentiate" },
  { key: "indefinite",    label: "∫ Indefinite" },
  { key: "definite",      label: "∫ₐᵇ Definite" },
];

export default function CalculusCard() {
  const [expr, setExpr] = useState("");
  const [mode, setMode] = useState<Mode>("differentiate");
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [exprLatex, setExprLatex] = useState("");
  const [result, setResult] = useState<{
    latex?: string;
    number?: number;
    variable?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!expr.trim()) { setExprLatex(""); setResult(null); return; }
    setExprLatex(exprToLatex(expr));
  }, [expr]);

  const compute = useCallback(() => {
    if (!expr.trim()) return;
    if (mode === "differentiate") {
      const res = differentiate(expr);
      setResult(res.ok ? { latex: res.latex, variable: res.variable } : { error: res.error });
    } else if (mode === "indefinite") {
      const res = symbolicIntegral(expr);
      setResult(res.ok ? { latex: res.latex, variable: res.variable } : { error: res.error });
    } else {
      const a = parseFloat(lowerBound);
      const b = parseFloat(upperBound);
      if (isNaN(a) || isNaN(b)) { setResult({ error: "Enter valid numeric bounds" }); return; }
      const res = numericalIntegral(expr, a, b);
      setResult(res.ok ? { number: res.value, variable: res.variable } : { error: res.error });
    }
  }, [expr, mode, lowerBound, upperBound]);

  useEffect(() => { setResult(null); }, [mode, expr]);

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden text-sm font-medium">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex-1 px-3 py-2 transition-colors ${
              mode === m.key
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Expression input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Expression — any variable (x, k, t…)
        </label>
        <Input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="e.g.  2*k^2   sin(x)   3*t^3 + 2*t"
          className="font-mono text-sm h-11"
          onKeyDown={(e) => e.key === "Enter" && compute()}
        />
        {exprLatex && (
          <div className="text-center py-1 text-foreground/80">
            <InlineMath math={`f = ${exprLatex}`} />
          </div>
        )}
      </div>

      {/* Bounds (definite only) */}
      {mode === "definite" && (
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lower bound a</label>
            <Input value={lowerBound} onChange={(e) => setLowerBound(e.target.value)} placeholder="0" className="text-sm" onKeyDown={(e) => e.key === "Enter" && compute()} />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Upper bound b</label>
            <Input value={upperBound} onChange={(e) => setUpperBound(e.target.value)} placeholder="1" className="text-sm" onKeyDown={(e) => e.key === "Enter" && compute()} />
          </div>
        </div>
      )}

      {/* Compute */}
      <Button
        onClick={compute}
        disabled={!expr.trim()}
        className="w-full bg-primary text-primary-foreground hover:opacity-90"
        size="sm"
      >
        {mode === "differentiate" ? "Differentiate" : mode === "indefinite" ? "Find Antiderivative" : "Compute Integral"}
      </Button>

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-4 text-center ${
          result.error
            ? "bg-red-950/40 border border-red-600/50"
            : "bg-green-950/40 border border-green-600/50"
        }`}>
          {result.error ? (
            <p className="text-sm text-red-400">{result.error}</p>
          ) : mode === "differentiate" && result.latex ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                d/d{result.variable} [{expr}] =
              </p>
              <div className="text-foreground">
                <BlockMath math={result.latex} />
              </div>
            </div>
          ) : mode === "indefinite" && result.latex ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                ∫ {expr} d{result.variable} =
              </p>
              <div className="text-foreground">
                <BlockMath math={result.latex} />
              </div>
            </div>
          ) : result.number !== undefined ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                ∫ from {lowerBound} to {upperBound} of {expr} d{result.variable} =
              </p>
              <p className="text-2xl font-semibold text-green-400 tabular-nums">
                {formatNumber(result.number)}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Hint for indefinite */}
      {mode === "indefinite" && !result && (
        <p className="text-xs text-muted-foreground text-center">
          Supports polynomials, sin, cos, tan, exp, log, sqrt and scalar multiples
        </p>
      )}
    </div>
  );
}
