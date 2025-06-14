"use client";

import Head from 'next/head';
import React, { useState } from 'react';
import { EnhancedEquationConfig } from '@/types/enhancedEquation';

interface Variable {
  name: string;
  symbol: string;
  unit: string;
}

interface LinearRelationship {
  variable: string;
  formula: string;
}

const EquationGeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<EnhancedEquationConfig>>({
    id: '',
    name: '',
    category: '',
    latex: '',
    description: '',
    variables: [],
    type: 'linear',
    config: {},
  });

  const [currentVariable, setCurrentVariable] = useState<Variable>({
    name: '',
    symbol: '',
    unit: '',
  });

  const [linearRelationships, setLinearRelationships] = useState<LinearRelationship[]>([]);
  const [currentRelationship, setCurrentRelationship] = useState<LinearRelationship>({
    variable: '',
    formula: '',
  });

  const [generatedCode, setGeneratedCode] = useState<string>('');

  const equationTypes = [
    { value: 'linear', label: 'Linear (e.g., V=IR, solve for any variable)' },
    { value: 'quadratic', label: 'Quadratic Formula' },
    { value: 'geometric', label: 'Geometric Formula' },
    { value: 'physics', label: 'Physics Formula' },
    { value: 'symbolic', label: 'Symbolic (auto-solve from equation)' },
    { value: 'custom', label: 'Custom Logic (manual)' },
  ];

  const geometricFormulas = [
    { value: 'circle_area', label: 'Circle Area (A = πr²)' },
    { value: 'sphere_volume', label: 'Sphere Volume (V = 4/3πr³)' },
    { value: 'pythagoras', label: 'Pythagorean Theorem (c² = a² + b²)' },
  ];

  const handleFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData(prev => ({ ...prev, [name]: value, config: {} }));
      setLinearRelationships([]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVariableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVariable(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVariable = () => {
    if (currentVariable.name.trim() && currentVariable.symbol.trim()) {
      if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(currentVariable.symbol.trim())) {
        alert('Variable Symbol must be a valid JavaScript identifier (e.g., myVar, x_1, R).');
        return;
      }
      setFormData(prev => ({
        ...prev,
        variables: [...(prev.variables || []), { ...currentVariable, symbol: currentVariable.symbol.trim() }],
      }));
      setCurrentVariable({ name: '', symbol: '', unit: '' });
    } else {
      alert('Variable Name and Symbol are required.');
    }
  };

  const handleRemoveVariable = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      variables: (prev.variables || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleRelationshipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentRelationship(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRelationship = () => {
    if (currentRelationship.variable && currentRelationship.formula) {
      setLinearRelationships(prev => [...prev, { ...currentRelationship }]);
      setCurrentRelationship({ variable: '', formula: '' });
    }
  };

  const handleRemoveRelationship = (indexToRemove: number) => {
    setLinearRelationships(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleConfigInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [name]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id?.trim() || !formData.name?.trim() || !formData.category?.trim() || !formData.latex?.trim()) {
      alert("ID, Name, Category, and LaTeX are required fields.");
      return;
    }

    // Build config based on equation type
    let config: any = {};
    
    switch (formData.type) {
      case 'linear':
      case 'physics':
        if (linearRelationships.length === 0) {
          alert("Please add at least one relationship for linear/physics equations.");
          return;
        }
        config = {
          relationships: linearRelationships.reduce((acc, rel) => {
            acc[rel.variable] = rel.formula;
            return acc;
          }, {} as Record<string, string>)
        };
        break;
      
      case 'geometric':
        config = { formula: formData.config?.formula };
        break;
      
      case 'symbolic':
        config = { equation: formData.config?.equation };
        break;
      
      case 'quadratic':
        config = {};
        break;
      
      case 'custom':
        config = { customSolver: formData.config?.customSolver };
        break;
    }

    const variablesString = (formData.variables || []).map(v =>
      `      { name: '${v.name}', symbol: '${v.symbol}', unit: '${v.unit}' }`
    ).join(',\n');

    const configString = JSON.stringify(config, null, 6).replace(/^/gm, '    ');

    const code = `  {
    id: '${formData.id.trim()}',
    name: '${formData.name.trim()}',
    category: '${formData.category.trim()}',
    latex: '${formData.latex.trim().replace(/\\/g, '\\\\')}',
    description: '${formData.description?.trim() || ''}',
    type: '${formData.type}',
    variables: [\n${variablesString}${formData.variables?.length ? '\n    ' : ''}],
    config: ${configString},
  },`;
    
    setGeneratedCode(code);
  };

  const handleCopyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
        .then(() => alert('Code copied to clipboard! Add it to your enhancedEquationsData.ts file.'))
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
        <title>Enhanced Equation Generator</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enhanced Equation Generator 🚀</h1>
            <p className="mt-2 text-sm text-slate-600">
              Generate equations with automatic solving using templates - no manual coding required!
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow-xl rounded-lg">
            {/* Section 1: Basic Details */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-6">Equation Details</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="id" className={labelClass}>ID (kebab-case, unique) <span className="text-red-500">*</span></label>
                  <input type="text" name="id" id="id" value={formData.id || ''} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., new-physics-law" required />
                </div>
                <div>
                  <label htmlFor="name" className={labelClass}>Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., New Physics Law" required />
                </div>
                <div>
                  <label htmlFor="category" className={labelClass}>Category <span className="text-red-500">*</span></label>
                  <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., Physics" required />
                </div>
                <div>
                  <label htmlFor="type" className={labelClass}>Equation Type <span className="text-red-500">*</span></label>
                  <select name="type" id="type" value={formData.type || 'linear'} onChange={handleFormInputChange} className={inputClass} required>
                    {equationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="latex" className={labelClass}>LaTeX String <span className="text-red-500">*</span></label>
                  <input type="text" name="latex" id="latex" value={formData.latex || ''} onChange={handleFormInputChange} className={inputClass} placeholder="e.g., F = ma" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClass}>Description</label>
                  <textarea name="description" id="description" value={formData.description || ''} onChange={handleFormInputChange} rows={3} className={inputClass} placeholder="Describe what this equation does"></textarea>
                </div>
              </div>
            </section>

            <hr/>

            {/* Section 2: Variables */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-6">Variables</h2>
              {(formData.variables || []).length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-md font-medium text-slate-700">Added Variables:</h3>
                  <ul className="list-disc list-inside pl-2 space-y-2">
                    {(formData.variables || []).map((variable, index) => (
                      <li key={index} className="text-sm text-slate-600 flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span>
                          <strong>Name:</strong> {variable.name}, <strong>Symbol:</strong> <code>{variable.symbol}</code>, <strong>Unit:</strong> {variable.unit || 'N/A'}
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
                    <label htmlFor="varName" className={labelClass}>Variable Name</label>
                    <input type="text" name="name" id="varName" value={currentVariable.name} onChange={handleVariableInputChange} className={inputClass} placeholder="e.g., Force" />
                  </div>
                  <div>
                    <label htmlFor="varSymbol" className={labelClass}>Symbol (for code)</label>
                    <input type="text" name="symbol" id="varSymbol" value={currentVariable.symbol} onChange={handleVariableInputChange} className={inputClass} placeholder="e.g., F, mass, R1" />
                  </div>
                  <div>
                    <label htmlFor="varUnit" className={labelClass}>Unit</label>
                    <input type="text" name="unit" id="varUnit" value={currentVariable.unit} onChange={handleVariableInputChange} className={inputClass} placeholder="e.g., N, kg, Ω" />
                  </div>
                </div>
                <button type="button" onClick={handleAddVariable} className={`${buttonClass} mt-4 bg-green-600 hover:bg-green-700`}>
                  Add Variable
                </button>
              </div>
            </section>
            
            <hr/>

            {/* Section 3: Type-specific Configuration */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-6">Configuration</h2>
              
              {(formData.type === 'linear' || formData.type === 'physics') && (
                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-3">Linear Relationships</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Define how to calculate each variable. Use variable symbols in formulas (e.g., "F / a" to get mass from force and acceleration).
                  </p>
                  
                  {linearRelationships.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {linearRelationships.map((rel, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                          <span className="text-sm"><strong>{rel.variable}</strong> = {rel.formula}</span>
                          <button type="button" onClick={() => handleRemoveRelationship(index)} className={`${secondaryButtonClass} bg-red-100 text-red-700 hover:bg-red-200`}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
                    <div>
                      <label htmlFor="relVariable" className={labelClass}>Target Variable</label>
                      <select name="variable" id="relVariable" value={currentRelationship.variable} onChange={handleRelationshipChange} className={inputClass}>
                        <option value="">Select variable...</option>
                        {(formData.variables || []).map(v => (
                          <option key={v.symbol} value={v.symbol}>{v.symbol} ({v.name})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="relFormula" className={labelClass}>Formula</label>
                      <input type="text" name="formula" id="relFormula" value={currentRelationship.formula} onChange={handleRelationshipChange} className={inputClass} placeholder="e.g., I * R, F / a" />
                    </div>
                  </div>
                  <button type="button" onClick={handleAddRelationship} className={`${buttonClass} mt-4 bg-green-600 hover:bg-green-700`}>
                    Add Relationship
                  </button>
                </div>
              )}

              {formData.type === 'geometric' && (
                <div>
                  <label htmlFor="geometricFormula" className={labelClass}>Geometric Formula Type</label>
                  <select name="formula" id="geometricFormula" value={formData.config?.formula || ''} onChange={handleConfigInputChange} className={inputClass}>
                    <option value="">Select formula...</option>
                    {geometricFormulas.map(formula => (
                      <option key={formula.value} value={formula.value}>{formula.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === 'symbolic' && (
                <div>
                  <label htmlFor="equation" className={labelClass}>Equation (for symbolic solving)</label>
                  <input type="text" name="equation" id="equation" value={formData.config?.equation || ''} onChange={handleConfigInputChange} className={inputClass} placeholder="e.g., F = m * a, V = I * R" />
                  <p className="mt-1 text-xs text-slate-500">Enter the equation as it would appear mathematically (e.g., y = m * x + b)</p>
                </div>
              )}

              {formData.type === 'quadratic' && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    Quadratic equations automatically solve for x₁ and x₂ given coefficients a, b, and c.
                    Make sure your variables are named 'a', 'b', 'c', 'x_1', and 'x_2'.
                  </p>
                </div>
              )}

              {formData.type === 'custom' && (
                <div className="p-4 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Custom equations require manual implementation. You'll need to add the solve function manually to the generated code.
                  </p>
                </div>
              )}
            </section>

            <div className="pt-5">
              <button type="submit" className={`${buttonClass} w-full sm:w-auto text-base`}>
                Generate Enhanced Equation Code
              </button>
            </div>
          </form>

          {generatedCode && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-slate-800">Generated Code:</h2>
              <p className="mt-1 mb-2 text-sm text-slate-600">
                Copy this code and add it to the <code>equationConfigs</code> array in <code>enhancedEquationsData.ts</code>.
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