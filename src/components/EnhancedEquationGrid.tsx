"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedEquationCard from "./EnhancedEquationCard";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import { ListBulletIcon, Squares2X2Icon, CalculatorIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { DatabaseEquation } from "@/lib/services/equationSolver";

interface DatabaseEquationWithFavorites extends DatabaseEquation {
  profiles?: { name: string } | null;
  user_favorites: Array<{ id: string }>;
}

export default function EnhancedEquationGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize search term from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || "name");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get('category') || null);
  const [equations, setEquations] = useState<DatabaseEquationWithFavorites[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  // Update URL when search parameters change
  const updateURL = (newSearchTerm: string, newSortBy: string, newSelectedTag: string | null) => {
    const params = new URLSearchParams();
    
    if (newSearchTerm) {
      params.set('search', newSearchTerm);
    }
    
    if (newSortBy && newSortBy !== 'name') {
      params.set('sort', newSortBy);
    }
    
    if (newSelectedTag) {
      params.set('category', newSelectedTag);
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/';
    
    // Use replace to avoid cluttering browser history
    router.replace(newUrl, { scroll: false });
  };

  // Handle search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL(value, sortBy, selectedTag);
  };

  // Handle sort changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL(searchTerm, value, selectedTag);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    updateURL(searchTerm, sortBy, tag);
  };

  const fetchEquations = async () => {
    try {
      setLoading(true);

      // Simple query to avoid relationship issues
      const { data: equationsData, error: fetchError } = await supabase
        .from("equations")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Query error:", fetchError);
        throw fetchError;
      }

      // Get user favorites separately if logged in
      let userFavorites: string[] = [];
      if (user) {
        const { data: favorites } = await supabase
          .from("user_favorites")
          .select("equation_id")
          .eq("user_id", user.id);

        userFavorites = favorites?.map((f) => f.equation_id) || [];
      }

      // Transform data to match expected interface
      const transformedEquations =
        equationsData?.map((equation) => ({
          ...equation,
          profiles: equation.author_id ? { name: "System" } : null,
          user_favorites: userFavorites.includes(equation.id)
            ? [{ id: "favorite" }]
            : [],
        })) || [];

      console.log("Fetched equations:", transformedEquations.length);
      setEquations(transformedEquations);
    } catch (err) {
      console.error("Error fetching equations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch equations"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initialize from URL params on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlSort = searchParams.get('sort');
    const urlCategory = searchParams.get('category');
    
    if (urlSearch) setSearchTerm(urlSearch);
    if (urlSort) setSortBy(urlSort);
    if (urlCategory) setSelectedTag(urlCategory);
  }, [searchParams]);

  useEffect(() => {
    fetchEquations();
  }, [user]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(equations.map((eq) => eq.category))];
  }, [equations]);

  const filteredAndSortedEquations = useMemo(() => {
    let filtered = equations.filter((equation) => {
      const searchMatch = !searchTerm || 
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
  }, [searchTerm, sortBy, selectedTag, equations]);

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
    // Clear expanded cards when switching modes
    if (displayMode === "list") {
      setExpandedCards(new Set());
    }
  };

  const handleFavoriteToggle = async (
    equationId: string,
    isFavorited: boolean
  ) => {
    if (!user) return;

    // Optimistic update - update UI immediately
    setEquations((prev) =>
      prev.map((eq) => {
        if (eq.id === equationId) {
          return {
            ...eq,
            user_favorites: isFavorited ? [] : [{ id: "favorite" }],
          };
        }
        return eq;
      })
    );

    try {
      if (isFavorited) {
        const response = await fetch(
          `/api/favorites?equation_id=${equationId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to remove favorite");
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ equation_id: equationId }),
        });
        if (!response.ok) throw new Error("Failed to add favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);

      // Revert optimistic update on error
      setEquations((prev) =>
        prev.map((eq) => {
          if (eq.id === equationId) {
            return {
              ...eq,
              user_favorites: isFavorited ? [{ id: "favorite" }] : [],
            };
          }
          return eq;
        })
      );

      // Optionally show error message to user
      alert("Failed to update favorite. Please try again.");
    }
  };

  // Generate page title based on search/filter state
  const getPageTitle = () => {
    if (searchTerm && selectedTag) {
      return `"${searchTerm}" in ${selectedTag} - EquaLab Equations`;
    } else if (searchTerm) {
      return `"${searchTerm}" - Search Results - EquaLab Equations`;
    } else if (selectedTag) {
      return `${selectedTag} Equations - EquaLab Equations`;
    }
    return "EquaLab Equations - Mathematical Equation Solver";
  };

  // Update document title
  useEffect(() => {
    document.title = getPageTitle();
  }, [searchTerm, selectedTag]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Loading equations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <CalculatorIcon className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 text-transparent bg-clip-text">
            {searchTerm ? 'Search Results' : 'Equation Library'}
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto">
          {searchTerm 
            ? `Showing results for "${searchTerm}"${selectedTag ? ` in ${selectedTag}` : ''}`
            : 'Discover powerful mathematical tools with exact symbolic computation'
          }
        </p>
        
        {!searchTerm && (
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">1/2</code>
              <span>Fractions</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">sqrt(2)</code>
              <span>Surds</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">3*pi</code>
              <span>Expressions</span>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-6">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search bar takes full width on mobile, flex-1 on desktop */}
            <div className="w-full md:flex-1">
              <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search equations, categories, or descriptions..."
              />
            </div>
            
            {/* Controls row */}
            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="flex-1 md:flex-none">
                <SortDropdown value={sortBy} onChange={handleSortChange} />
              </div>
              
              {/* Display mode toggle - hidden on mobile */}
              <motion.button
                onClick={toggleDisplayMode}
                className="hidden md:flex p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={displayMode === "list" ? "Switch to Grid View" : "Switch to List View"}
              >
                {displayMode === "list" ? (
                  <Squares2X2Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <ListBulletIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Tag List */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === null
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => handleTagSelect(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {uniqueCategories.map((tag) => (
              <motion.button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => handleTagSelect(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-gray-600 dark:text-gray-400">
          {filteredAndSortedEquations.length} equation
          {filteredAndSortedEquations.length !== 1 ? "s" : ""} found
          {selectedTag && ` in ${selectedTag}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        {/* Display mode indicator on mobile */}
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 md:hidden">
          Viewing in {displayMode} mode
        </p>
      </motion.div>

      {/* Equation Cards */}
      <motion.div
        className={
          displayMode === "list"
            ? "space-y-6"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {filteredAndSortedEquations.map((equation, index) => (
          <motion.div 
            key={equation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <EnhancedEquationCard
              equation={equation}
              isExpanded={expandedCards.has(equation.id)}
              onToggle={() => handleCardToggle(equation.id)}
              isFavorited={equation.user_favorites?.length > 0}
              onFavoriteToggle={(isFavorited) => {
                handleFavoriteToggle(equation.id, isFavorited);
              }}
              author={equation.profiles?.name}
              showFavoriteButton={!!user}
              displayMode={displayMode}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredAndSortedEquations.length === 0 && (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-500 text-xl dark:text-gray-400">
            No equations found matching your search
            {selectedTag && ` in category "${selectedTag}"`}
            {searchTerm && ` for "${searchTerm}"`}.
          </p>
          {(searchTerm || selectedTag) && (
            <motion.button
              onClick={() => {
                setSearchTerm("");
                setSelectedTag(null);
                updateURL("", sortBy, null);
              }}
              className="mt-4 px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search & Filters
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}