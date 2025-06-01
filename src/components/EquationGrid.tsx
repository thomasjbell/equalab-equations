// components/EquationGrid.tsx
"use client";

import { useState, useMemo } from "react";
import EquationCard from "./EquationCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import { equations } from "../lib/equations";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export default function EquationGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uniqueCategories = useMemo(() => {
    return [...new Set(equations.map((eq) => eq.category))];
  }, [equations]);

  const filteredAndSortedEquations = useMemo(() => {
    let filtered = equations.filter((equation) => {
      const searchMatch =
        equation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equation.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (equation.description &&
          equation.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const tagMatch =
        selectedTag === null || equation.category === selectedTag;
      return searchMatch && tagMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
  }, [searchTerm, sortBy, selectedTag]);

  const handleCardToggle = (equationId: string) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(equationId)) {
      newExpandedCards.delete(equationId);
    } else {
      newExpandedCards.add(equationId);
    }
    setExpandedCards(newExpandedCards);
  };

  const toggleDisplayMode = () => {
    setDisplayMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search equations, categories, or descriptions..."
            />
          </div>
          {/* Mobile Version - Sort */}
          <div className="md:hidden sm:w-auto">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
          {/* Desktop Version - Sort and Display Mode */}
          <div className="hidden md:flex items-center gap-4">
            <div className="sm:w-auto">
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
            <button
              onClick={toggleDisplayMode}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none transition-all shadow-sm"
            >
              {displayMode === "list" ? (
                <Squares2X2Icon color="#164e63" className="h-6 w-6" />
              ) : (
                <ListBulletIcon color="#164e63" className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Tag List */}
        <div className="overflow-x-auto whitespace-nowrap">
          <button
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium  ${
              selectedTag === null
                ? "bg-cyan-600 text-white"
                : "bg-slate-200 text-cyan-900 hover:bg-gray-300"
            }`}
            onClick={() => handleTagSelect(null)}
          >
            All
          </button>
          {uniqueCategories.map((tag) => (
            <button
              key={tag}
              className={`inline-flex items-center rounded-full px-3 py-1 ml-2 text-sm font-medium  ${
                selectedTag === tag
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-200 text-cyan-900 hover:bg-gray-300"
              }`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredAndSortedEquations.length} equation
        {filteredAndSortedEquations.length !== 1 ? "s" : ""} found
        {selectedTag && ` in category "${selectedTag}"`}
      </div>

      {/* Equation Cards */}
      <div
        className={
          displayMode === "list"
            ? "space-y-4"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
        }
      >
        {filteredAndSortedEquations.map((equation) => (
          <div key={equation.id}>
            <EquationCard
              equation={equation}
              isExpanded={expandedCards.has(equation.id)}
              onToggle={() => handleCardToggle(equation.id)}
            />
          </div>
        ))}
      </div>

      {filteredAndSortedEquations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No equations found matching your search
            {selectedTag && ` in category "${selectedTag}"`}.
          </p>
        </div>
      )}
    </div>
  );
}
