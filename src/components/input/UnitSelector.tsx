"use client";

import { convertUnit } from "@/data/units";

interface UnitSelectorProps {
  currentUnit: string;
  alternatives: string[];
  currentValue: string;
  onUnitChange: (newUnit: string, convertedValue: string) => void;
}

export default function UnitSelector({ currentUnit, alternatives, currentValue, onUnitChange }: UnitSelectorProps) {
  const allUnits = [currentUnit, ...alternatives.filter(u => u !== currentUnit)];

  const handleChange = (newUnit: string) => {
    if (newUnit === currentUnit) return;
    let converted = currentValue;
    const num = parseFloat(currentValue);
    if (!isNaN(num)) {
      try {
        const result = convertUnit(num, currentUnit, newUnit);
        converted = Number.isInteger(result) ? result.toString() : result.toPrecision(6).replace(/\.?0+$/, '');
      } catch {}
    }
    onUnitChange(newUnit, converted);
  };

  return (
    <select
      value={currentUnit}
      onChange={(e) => handleChange(e.target.value)}
      className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {allUnits.map((unit) => (
        <option key={unit} value={unit}>{unit}</option>
      ))}
    </select>
  );
}
