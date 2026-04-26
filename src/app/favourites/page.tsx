"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import EnhancedEquationCard from "@/components/EnhancedEquationCard";
import SearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import { ListBulletIcon, Squares2X2Icon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { DatabaseEquation } from "@/lib/services/equationSolver";
import Link from "next/link";

interface DatabaseEquationWithFavorites extends DatabaseEquation {
  profiles?: { name: string } | null;
  user_favorites: Array<{ id: string }>;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [equations, setEquations] = useState<DatabaseEquationWithFavorites[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const supabase = createClient();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const fetchFavoriteEquations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data: favoriteIds, error: favError } = await supabase
        .from('user_favorites')
        .select('equation_id')
        .eq('user_id', user.id);

      if (favError) throw favError;

      if (!favoriteIds || favoriteIds.length === 0) {
        setEquations([]);
        setLoading(false);
        return;
      }

      const equationIds = favoriteIds.map(f => f.equation_id);

      const { data: equationsData, error: eqError } = await supabase
        .from('equations')
        .select('*')
        .in('id', equationIds)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (eqError) throw eqError;

      const transformedEquations = equationsData?.map(equation => ({
        ...equation,
        profiles: equation.author_id ? { name: 'System' } : null,
        user_favorites: [{ id: 'favorite' }]
      })) || [];

      setEquations(transformedEquations);
    } catch (err) {
      console.error('Error fetching favourite equations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch favourite equations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteEquations();
  }, [user]);

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
  }, [searchTerm, sortBy, selectedTag, equations]);

  const handleCardToggle = (equationId: string) => {
    if (displayMode === "grid") {
      // Navigate to equation page in grid mode
      router.push(`/equation/${equationId}`);
    } else {
      // Toggle expansion in list mode
      const newExpandedCards = new Set(expandedCards);
      if (newExpandedCards.has(equationId)) {
        newExpandedCards.delete(equationId);
      } else {
        newExpandedCards.add(equationId);
      }
      setExpandedCards(newExpandedCards);
    }
  };

  const toggleDisplayMode = () => {
    setDisplayMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
    // Clear expanded cards when switching to grid mode
    if (displayMode === "list") {
      setExpandedCards(new Set());
    }
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleFavoriteToggle = async (equationId: string, isFavorited: boolean) => {
    if (!user) return;

    try {
      if (isFavorited) {
        await fetch(`/api/favorites?equation_id=${equationId}`, {
          method: 'DELETE',
        });
        
        setEquations(prev => prev.filter(eq => eq.id !== equationId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <HeartIcon className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 text-transparent bg-clip-text">
                Sign In to View Favourites
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Create an account to save your favourite equations and access them from any device.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all"
              >
                <SparklesIcon className="w-6 h-6" />
                Explore Equation Library
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="text-xl text-red-600 dark:text-red-400">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div className="text-center" variants={cardVariants}>
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <HeartIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-400 dark:to-pink-500 text-transparent bg-clip-text">
                My Favourite Equations
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your carefully curated collection of mathematical tools
            </p>
          </motion.div>

          {equations.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              variants={cardVariants}
            >
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <HeartIcon className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                No Favourite Equations Yet
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Start building your collection by clicking the heart icon on any equation in the library.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all"
                >
                  <SparklesIcon className="w-6 h-6" />
                  Browse Equation Library
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <>
              {/* Controls */}
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6"
                variants={cardVariants}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-full md:flex-1">
                      <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search your favorite equations..."
                      />
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="flex-1 md:flex-none">
                        <SortDropdown value={sortBy} onChange={setSortBy} />
                      </div>
                      <motion.button
                        onClick={toggleDisplayMode}
                        className="p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
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
                  {uniqueCategories.length > 0 && (
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
                  )}
                </div>
              </motion.div>

              {/* Results Count */}
              <motion.div 
                className="text-center"
                variants={cardVariants}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredAndSortedEquations.length} favourite equation
                  {filteredAndSortedEquations.length !== 1 ? "s" : ""}
                  {selectedTag && ` in ${selectedTag}`}
                </p>
                {/* Display mode indicator on mobile */}
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 md:hidden">
                  Viewing in {displayMode} mode
                  {displayMode === "grid" && " - Click equations to open"}
                </p>
              </motion.div>

              {/* Equation Cards */}
              <motion.div
                className={
                  displayMode === "list"
                    ? "space-y-6"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }
                variants={containerVariants}
              >
                <AnimatePresence>
                  {filteredAndSortedEquations.map((equation, index) => (
                    <motion.div 
                      key={equation.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ delay: index * 0.1 }}
                    >
                      <EnhancedEquationCard
                        equation={equation}
                        isExpanded={expandedCards.has(equation.id)}
                        onToggle={() => handleCardToggle(equation.id)}
                        isFavorited={true}
                        onFavoriteToggle={(isFavorited) => handleFavoriteToggle(equation.id, isFavorited)}
                        author={equation.profiles?.name}
                        showFavoriteButton={true}
                        displayMode={displayMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredAndSortedEquations.length === 0 && equations.length > 0 && (
                <motion.div 
                  className="text-center py-12"
                  variants={cardVariants}
                >
                  <p className="text-gray-500 text-lg dark:text-gray-400">
                    No favourite equations found matching your search
                    {selectedTag && ` in category "${selectedTag}"`}.
                  </p>
                  <motion.button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTag(null);
                    }}
                    className="mt-4 px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Search & Filters
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}