'use client';

import { useState, useMemo } from 'react';
import EquationCard from './EquationCard';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import { equations } from '../lib/equations';

export default function EquationGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filteredAndSortedEquations = useMemo(() => {
    let filtered = equations.filter(equation =>
      equation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equation.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equation.description && equation.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
  }, [searchTerm, sortBy]);

  const handleCardToggle = (equationId: string) => {
    setExpandedCard(expandedCard === equationId ? null : equationId);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search equations, categories, or descriptions..."
          />
        </div>
        <div className="sm:w-48">
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredAndSortedEquations.length} equation{filteredAndSortedEquations.length !== 1 ? 's' : ''} found
      </div>

      {/* Equation Cards */}
      <div className="space-y-4">
        {filteredAndSortedEquations.map((equation) => (
          <EquationCard
            key={equation.id}
            equation={equation}
            isExpanded={expandedCard === equation.id}
            onToggle={() => handleCardToggle(equation.id)}
          />
        ))}
      </div>

      {filteredAndSortedEquations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No equations found matching your search.</p>
        </div>
      )}
    </div>
  );
}