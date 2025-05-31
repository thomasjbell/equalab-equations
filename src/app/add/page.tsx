// pages/equation-generator.tsx
"use client";

import Head from 'next/head';
import React, { useState } from 'react';

// Define the types for clarity within this component
interface Variable {
  name: string; // For display, e.g., "x₁" or "Voltage"
  symbol: string; // For code, e.g., "x_1" or "V" (used in solve function)
  unit: string;
}

interface EquationFormData {
  id: string;
  name: string;
  category: string;
  latex: string;
  description: string;
  variables: Variable[];
  solveFunctionBody: string;
}

const initialSolveBodyPlaceholder = `// Access input variables from the 'values' object using their 'symbol', e.g., values.mass, values.acceleration.
// Ensure all variable symbols used here are defined in the 'Variables' section above.
// The returned object keys must also match 'symbol's defined in the 'Variables' section.

// Example for an equation like c = a + b:
// const { a, b } = values; // 'a' and 'b' must be symbols of variables
// const result: Record<string, number> = {};
// if (a !== undefined && b !== undefined) {
//   result.c = a + b; // 'c' must be a symbol of a variable
// }
// return result;

// Example for solving for different variables (Ohm's Law V=IR):
// const { V, I, R } = values; // V, I, R are variable symbols
// const result: Record<string, number> = {};
// if (I !== undefined && R !== undefined && V === undefined) result.V = I * R;
// else if (V !== undefined && R !== undefined && I === undefined) result.I = V / R;
// else if (V !== undefined && I !== undefined && R === undefined) result.R = V / I;
// return result;

// For equations with a single set of results (like quadratic formula for x1, x2):
// const { a, b, c } = values;
// if (a !== undefined && b !== undefined && c !== undefined) {
//   const discriminant = b * b - 4 * a * c;
//   if (discriminant >= 0) {
//     const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
//     const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
//     return { x_1: x1, x_2: x2 }; // x_1, x_2 must be symbols of variables
//   }
// }
// return {}; // Return empty object if inputs are insufficient or no solution
`;

const EquationGeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState<EquationFormData>({
    id: '',
    name: '',
    category: '',
    latex: '',
    description: '',
    variables: [],
    solveFunctionBody: initialSolveBodyPlaceholder,
  });

  const [currentVariable, setCurrentVariable] = useState<Variable>({
    name: '',
    symbol: '',
    unit: '',
  });

  const [generatedCode, setGeneratedCode] = useState<string>('');

  const handleFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVariable(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVariable = () => {
    if (currentVariable.name.trim() && currentVariable.symbol.trim()) {
      // Basic validation for symbol (simple JS identifier check)
      if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(currentVariable.symbol.trim())) {
        alert('Variable Symbol must be a valid JavaScript identifier (e.g., myVar, x_1, R).');
        return;
      }
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...currentVariable, symbol: currentVariable.symbol.trim() }],
      }));
      setCurrentVariable({ name: '', symbol: '', unit: '' }); // Reset for next variable
    } else {
      alert('Variable Name and Symbol are required.');
    }
  };

  const handleRemoveVariable = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.name.trim() || !formData.category.trim() || !formData.latex.trim()) {
        alert("ID, Name, Category, and LaTeX are required fields.");
        return;
    }

    const variablesString = formData.variables.map(v =>
      `      { name: '${v.name}', symbol: '${v.symbol}', unit: '${v.unit}' }`
    ).join(',\n');

    const indentedSolveBody = formData.solveFunctionBody
      .split('\n')
      .map(line => `      ${line}`) // 6 spaces indentation for the body
      .join('\n');

    const code = `  {
    id: '${formData.id.trim()}',
    name: '${formData.name.trim()}',
    category: '${formData.category.trim()}',
    latex: '${formData.latex.trim().replace(/\\/g, '\\\\')}', // Escape backslashes for LaTeX
    description: '${formData.description.trim()}',
    variables: [\n${variablesString}${formData.variables.length > 0 ? '\n    ' : ''}],
    solve: (values) => {
${indentedSolveBody}
    },
  },`;
    setGeneratedCode(code);
  };

  const handleCopyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
        .then(() => alert('Code copied to clipboard! Add it to your `equations` array.'))
        .catch(err => {
            console.error('Failed to copy code: ', err);
            alert('Failed to copy code. See console for details.');
        });
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";
  const labelClass = "block text-sm font-medium text-slate-700";
  const buttonClass = "px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const secondaryButtonClass = "px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-slate-400";


  return (
    <>
      <Head>
        <title>Equation Syntax Generator</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Equation Syntax Generator ⚙️</h1>
            <p className="mt-2 text-sm text-slate-600">
              Use this form to generate the TypeScript object syntax for your equations.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow-xl rounded-lg">
            {/* Section 1: Basic Equation Details */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-6">Equation Details</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="id" className={labelClass}>ID (kebab-case, unique) <span className="text-red-500">*</span></label>
                  <input type="text" name="id" id="id" value={formData.id} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., quadratic-formula" required />
                </div>
                <div>
                  <label htmlFor="name" className={labelClass}>Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., Quadratic Formula" required />
                </div>
                <div>
                  <label htmlFor="category" className={labelClass}>Category <span className="text-red-500">*</span></label>
                  <input type="text" name="category" id="category" value={formData.category} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., Algebra" required />
                </div>
                <div>
                  <label htmlFor="latex" className={labelClass}>LaTeX String <span className="text-red-500">*</span></label>
                  <input type="text" name="latex" id="latex" value={formData.latex} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" required />
                  <p className="mt-1 text-xs text-slate-500">Enter LaTeX as you would normally, e.g., {' \sqrt{x} '}. It will be correctly escaped in the output.</p>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClass}>Description</label>
                  <textarea name="description" id="description" value={formData.description} onChange={handleFormInputChange} rows={3} className={inputClass} placeholder="e.g., Solves quadratic equations of the form ax² + bx + c = 0"></textarea>
                </div>
              </div>
            </section>

            <hr/>

            {/* Section 2: Variables */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-6">Variables 🔬</h2>
              {formData.variables.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-md font-medium text-slate-700">Added Variables:</h3>
                  <ul className="list-disc list-inside pl-2 space-y-2">
                    {formData.variables.map((variable, index) => (
                      <li key={index} className="text-sm text-slate-600 flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span>
                          <strong>Name:</strong> {variable.name},&nbsp;
                          <strong>Symbol:</strong> <code>{variable.symbol}</code>,&nbsp;
                          <strong>Unit:</strong> {variable.unit || 'N/A'}
                        </span>
                        <button type="button" onClick={() => handleRemoveVariable(index)} className={`${secondaryButtonClass} bg-red-100 text-red-700 hover:bg-red-200`}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="p-4 border border-dashed border-slate-300 rounded-md">
                <h3 className="text-md font-medium text-slate-700 mb-3">Add New Variable:</h3>
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3 items-end">
                  <div>
                    <label htmlFor="varName" className={labelClass}>Variable Name (Display)</label>
                    <input type="text" name="name" id="varName" value={currentVariable.name} onChange={handleVariableInputChange} className={inputClass} placeholder="e.g., Coefficient a" />
                  </div>
                  <div>
                    <label htmlFor="varSymbol" className={labelClass}>Variable Symbol (Code) <span className="text-red-500">*</span></label>
                    <input type="text" name="symbol" id="varSymbol" value={currentVariable.symbol} onChange={handleVariableInputChange} className={inputClass} placeholder="e.g., a, x_1, mass" />
                     <p className="mt-1 text-xs text-slate-500">Must be a valid JS identifier. Used in `solve` function.</p>
                  </div>
                  <div>
                    <label htmlFor="varUnit" className={labelClass}>Unit</label>
                    <input type="text" name="unit" id="varUnit" value={currentVariable.unit} onChange={handleVariableInputChange} className={inputClass} placeholder="e.g., m/s, Ω, kg" />
                  </div>
                </div>
                <button type="button" onClick={handleAddVariable} className={`${buttonClass} mt-4 bg-green-600 hover:bg-green-700`}>
                  Add Variable
                </button>
              </div>
            </section>
            
            <hr/>

            {/* Section 3: Solve Function */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-6">Solve Function Logic 🧠</h2>
              <div>
                <label htmlFor="solveFunctionBody" className={labelClass}>
                  JavaScript body for the <code>solve</code> function:
                </label>
                <p className="mt-1 mb-2 text-xs text-slate-500">
                  Write the core logic. Input values are in the <code>values</code> object (e.g., <code>values.symbolName</code>).
                  Return an object with calculated variable symbols as keys (e.g., <code>{'{ resultSymbol: calculatedValue }'}</code>).
                </p>
                <textarea
                  name="solveFunctionBody"
                  id="solveFunctionBody"
                  value={formData.solveFunctionBody}
                  onChange={handleFormInputChange}
                  rows={15}
                  className={`${inputClass} font-mono text-xs`}
                  placeholder={initialSolveBodyPlaceholder}
                ></textarea>
              </div>
            </section>

            <div className="pt-5">
              <button type="submit" className={`${buttonClass} w-full sm:w-auto text-base`}>
                Generate Equation Code
              </button>
            </div>
          </form>

          {generatedCode && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-slate-800">Generated Code:</h2>
              <p className="mt-1 mb-2 text-sm text-slate-600">
                Copy this code and add it to your <code>equations.ts</code> array.
              </p>
              <div className="relative bg-slate-800 text-white p-4 rounded-md shadow-lg overflow-x-auto">
                <button
                  onClick={handleCopyToClipboard}
                  className="absolute top-2 right-2 px-3 py-1 bg-sky-500 text-white text-xs font-medium rounded hover:bg-sky-600"
                >
                  Copy to Clipboard
                </button>
                <pre><code className="language-typescript text-sm">{generatedCode}</code></pre>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default EquationGeneratorPage;