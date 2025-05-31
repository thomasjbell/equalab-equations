"use client";

import { useState, useMemo } from "react";
import EquationCard from "./EquationCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import { equations } from "../lib/equations";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline"; // Assuming you have Heroicons installed

export default function EquationGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list"); // 'list' | 'grid' state

  const filteredAndSortedEquations = useMemo(() => {
    let filtered = equations.filter(
      (equation) =>
        equation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equation.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (equation.description &&
          equation.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
  }, [searchTerm, sortBy]);

  const handleCardToggle = (equationId: string) => {
    setExpandedCard(expandedCard === equationId ? null : equationId);
  };

  const toggleDisplayMode = () => {
    setDisplayMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search equations, categories, or descriptions..."
          />
        </div>

        <div className="md:hidden sm:w-48 flex items-center gap-2">
          <SortDropdown value={sortBy} onChange={setSortBy} />
          <button
            onClick={toggleDisplayMode}
            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 outline-none transition-all shadow-sm"
          >
            {displayMode === "list" ? (
              <Squares2X2Icon className="h-8 w-8" />
            ) : (
              <ListBulletIcon className="h-8 w-8" />
            )}
          </button>
        </div>
        <div className="hidden md:flex">
          <div className="sm:w-48 md:flex items-center gap-2">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
          <button
            onClick={toggleDisplayMode}
            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 outline-none transition-all shadow-sm"
          >
            {displayMode === "list" ? (
              <Squares2X2Icon className="h-8 w-8" />
            ) : (
              <ListBulletIcon className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredAndSortedEquations.length} equation
        {filteredAndSortedEquations.length !== 1 ? "s" : ""} found
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
            {" "}
            {/* Added a wrapping div for grid layout */}
            <EquationCard
              equation={equation}
              isExpanded={expandedCard === equation.id}
              onToggle={() => handleCardToggle(equation.id)}
            />
          </div>
        ))}
      </div>

      {filteredAndSortedEquations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No equations found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
