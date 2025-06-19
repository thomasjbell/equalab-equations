// src/app/add/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { InlineMath, BlockMath } from "react-katex";

interface Variable {
  name: string;
  symbol: string;
  unit: string;
}

interface ExampleData {
  input: Record<string, number>;
  expectedOutput: Record<string, any>;
}

export default function AddPage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    latex: "",
    description: "",
    variables: [] as Variable[],
    solverType: "linear",
    solverConfig: "",
    examples: [] as ExampleData[],
  });

  const [generatedCode, setGeneratedCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const solverTypes = [
    { value: "linear", label: "Linear Relationships" },
    { value: "quadratic", label: "Quadratic Equation" },
    { value: "cubic", label: "Cubic Equation" },
    { value: "geometric", label: "Geometric Formula" },
    { value: "physics", label: "Physics Formula" },
    { value: "suvat", label: "SUVAT Kinematics" },
    { value: "custom", label: "Custom Formula" },
  ];
  const categories = [
    "Algebra",
    "Geometry",
    "Trigonometry",
    "Physics",
    "Electronics",
    "Finance",
    "Chemistry",
    "Engineering",
    "Statistics",
  ];

  const addVariable = () => {
    setFormData({
      ...formData,
      variables: [...formData.variables, { name: "", symbol: "", unit: "" }],
    });
  };

  const updateVariable = (
    index: number,
    field: keyof Variable,
    value: string
  ) => {
    const newVariables = [...formData.variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    setFormData({ ...formData, variables: newVariables });
  };

  const removeVariable = (index: number) => {
    const newVariables = formData.variables.filter((_, i) => i !== index);
    setFormData({ ...formData, variables: newVariables });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: {}, expectedOutput: {} }],
    });
  };

  const updateExample = (
    index: number,
    field: "input" | "expectedOutput",
    value: string
  ) => {
    const newExamples = [...formData.examples];
    try {
      newExamples[index][field] = JSON.parse(value);
      setFormData({ ...formData, examples: newExamples });
    } catch (error) {
      console.warn("Invalid JSON in example");
    }
  };

  const removeExample = (index: number) => {
    const newExamples = formData.examples.filter((_, i) => i !== index);
    setFormData({ ...formData, examples: newExamples });
  };

  const generateId = () => {
    const id = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, id });
  };

  const generateSolverCode = () => {
    switch (formData.solverType) {
      case "linear":
        return `EnhancedSolver.solveLinear(${formData.solverConfig}, inputs)`;
      case "quadratic":
        return `EnhancedSolver.solveQuadratic(inputs)`;
      case "cubic":
        return `EnhancedSolver.solveCubic(inputs)`;
      case "geometric":
        return `EnhancedSolver.solveGeometric('${formData.solverConfig}', inputs)`;
      case "physics":
        return `EnhancedSolver.solvePhysics('${formData.solverConfig}', inputs)`;
      case "suvat":
        return `EnhancedSolver.solveSUVAT(inputs)`;
      case "custom":
        return (
          formData.solverConfig || "EnhancedSolver.solveLinear({}, inputs)"
        );
      default:
        return `EnhancedSolver.solveLinear({}, inputs)`;
    }
  };

  const generateCode = () => {
    const variablesCode = formData.variables
      .map(
        (v) => `{ name: '${v.name}', symbol: '${v.symbol}', unit: '${v.unit}' }`
      )
      .join(",\n      ");

    const examplesCode = formData.examples
      .map(
        (e) =>
          `{
        input: ${JSON.stringify(e.input)},
        expectedOutput: ${JSON.stringify(e.expectedOutput)}
      }`
      )
      .join(",\n      ");

    const code = `{
    id: '${formData.id}',
    name: "${formData.name}",
    category: '${formData.category}',
    latex: '${formData.latex}',
    description: '${formData.description}',
    variables: [
      ${variablesCode}
    ],
    solve: (inputs) => ${generateSolverCode()},${
      formData.examples.length > 0
        ? `
    examples: [
      ${examplesCode}
    ]`
        : ""
    }
  }`;

    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold text-cyan-950 dark:text-cyan-50 mb-4">
              Add New Equation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Generate code for new equations automatically
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Equation Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      onBlur={generateId}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Ohm's Law"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID (auto-generated)
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData({ ...formData, id: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                      placeholder="ohms-law"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LaTeX Formula
                    </label>
                    <textarea
                      value={formData.latex}
                      onChange={(e) =>
                        setFormData({ ...formData, latex: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="V = I \\cdot R"
                    />
                    {formData.latex && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Preview:
                        </div>
                        <BlockMath math={formData.latex} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                      placeholder="Brief description of the equation"
                    />
                  </div>
                </div>
              </div>

              {/* Variables Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Variables
                  </h2>
                  <button
                    onClick={addVariable}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Variable
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.variables.map((variable, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={variable.name}
                          onChange={(e) =>
                            updateVariable(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="Voltage"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Symbol
                        </label>
                        <input
                          type="text"
                          value={variable.symbol}
                          onChange={(e) =>
                            updateVariable(index, "symbol", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="V"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={variable.unit}
                          onChange={(e) =>
                            updateVariable(index, "unit", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="V"
                        />
                      </div>
                      <button
                        onClick={() => removeVariable(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solver Configuration */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Solver Configuration
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Solver Type
                    </label>
                    <select
                      value={formData.solverType}
                      onChange={(e) =>
                        setFormData({ ...formData, solverType: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {solverTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Solver Configuration
                    </label>
                    <textarea
                      value={formData.solverConfig}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          solverConfig: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      placeholder={
                        formData.solverType === "linear"
                          ? '{\n  V: "I * R",\n  I: "V / R",\n  R: "V / I"\n}'
                          : formData.solverType === "geometric"
                          ? "circle_area"
                          : formData.solverType === "physics"
                          ? "kinetic_energy"
                          : "Configuration specific to solver type"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview/Code Section */}
            <div className="space-y-6">
              {/* Examples Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Examples
                  </h2>
                  <button
                    onClick={addExample}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Example
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.examples.map((example, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Example {index + 1}
                        </h3>
                        <button
                          onClick={() => removeExample(index)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-1 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Input (JSON)
                          </label>
                          <textarea
                            defaultValue={JSON.stringify(
                              example.input,
                              null,
                              2
                            )}
                            onBlur={(e) =>
                              updateExample(index, "input", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                            rows={3}
                            placeholder='{ "V": 12, "R": 4 }'
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Expected Output (JSON)
                          </label>
                          <textarea
                            defaultValue={JSON.stringify(
                              example.expectedOutput,
                              null,
                              2
                            )}
                            onBlur={(e) =>
                              updateExample(
                                index,
                                "expectedOutput",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                            rows={3}
                            placeholder='{ "I": { "type": "integer", "decimal": 3, "exact": 3, "latex": "3", "simplified": true } }'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Code Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Generated Code
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      {showPreview ? "Hide" : "Show"} Preview
                    </button>
                    <button
                      onClick={generateCode}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CodeBracketIcon className="h-4 w-4" />
                      Generate
                    </button>
                  </div>
                </div>

                {generatedCode && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Copy this code and add it to symbolicEquationsData.ts
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                        Copy
                      </button>
                    </div>

                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96">
                      {generatedCode}
                    </pre>
                  </div>
                )}

                {showPreview && formData.name && formData.latex && (
                  <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Preview
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {formData.name}
                        </h4>
                        {formData.category && (
                          <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-sm font-medium rounded-full">
                            {formData.category}
                          </span>
                        )}
                      </div>

                      {formData.latex && (
                        <div className="text-2xl">
                          <BlockMath math={formData.latex} />
                        </div>
                      )}

                      {formData.description && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {formData.description}
                        </p>
                      )}

                      {formData.variables.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {formData.variables.map((variable, index) => (
                            <div
                              key={index}
                              className="p-2 bg-gray-50 dark:bg-gray-700 rounded"
                            >
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {variable.name}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {variable.symbol}{" "}
                                {variable.unit && `(${variable.unit})`}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
