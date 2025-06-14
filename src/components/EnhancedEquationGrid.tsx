"use client";

import { useState, useMemo } from "react";
import EnhancedEquationCard from "./EnhancedEquationCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import { symbolicEquations } from "../lib/symbolicEquationsData";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function EnhancedEquationGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uniqueCategories = useMemo(() => {
    return [...new Set(symbolicEquations.map((eq) => eq.category))];
  }, []);

  const filteredAndSortedEquations = useMemo(() => {
    let filtered = symbolicEquations.filter((equation) => {
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
      <div>
        <h1 className="text-5xl font-bold text-cyan-950 text-center mb-4 dark:text-cyan-50">
          Library
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-2 text-lg">
          Input fractions, surds, decimals → Get exact symbolic results
        </p>
        <p className="text-center text-gray-500 dark:text-gray-500 mb-6 text-sm">
          Try inputs like: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">1/2</code>, 
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-2">sqrt(2)</code>, 
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-2">3*pi</code>, 
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-2">2 1/4</code>
        </p>
        <motion.div
          className="bg-gradient-to-r from-cyan-800 to-cyan-500 h-0.5 w-1/3 md:w-1/4 mx-auto rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            delay: 0.1,
          }}
          viewport={{ once: true }}
        />
      </div>

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
          <div className="md:hidden sm:w-auto">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="sm:w-auto">
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>
            <button
              onClick={toggleDisplayMode}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none transition-all shadow-sm
              dark:bg-gray-700 dark:border-gray-600 dark:shadow-none"
            >
              {displayMode === "list" ? (
                <Squares2X2Icon className="h-6 w-6 text-cyan-900 dark:text-cyan-50" />
              ) : (
                <ListBulletIcon className="h-6 w-6 text-cyan-900 dark:text-cyan-50" />
              )}
            </button>
          </div>
        </div>

        {/* Tag List */}
        <div className="overflow-x-auto whitespace-nowrap">
          <button
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium  ${
              selectedTag === null
                ? "bg-cyan-600 text-cyan-50 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                : "bg-slate-200 text-cyan-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-cyan-50 dark:hover:bg-gray-600"
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
                  ? "bg-cyan-600 text-cyan-50 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                  : "bg-slate-200 text-cyan-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-cyan-50 dark:hover:bg-gray-600"
              }`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
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
            <EnhancedEquationCard
              equation={equation}
              isExpanded={expandedCards.has(equation.id)}
              onToggle={() => handleCardToggle(equation.id)}
            />
          </div>
        ))}
      </div>

      {filteredAndSortedEquations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg dark:text-gray-400">
            No equations found matching your search
            {selectedTag && ` in category "${selectedTag}"`}.
          </p>
        </div>
      )}
    </div>
  );
}