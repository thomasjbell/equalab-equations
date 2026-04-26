"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedEquationCard from "@/components/EnhancedEquationCard";
import SearchBar from "@/components/SearchBar";
import { ListBulletIcon, Squares2X2Icon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getAllEquations } from "@/data/equations";
import { useFavourites } from "@/lib/hooks/useFavourites";
import Link from "next/link";

export default function FavouritesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { favouriteIds, toggleFavourite, isFavourite } = useFavourites();
  const allEquations = useMemo(() => getAllEquations(), []);

  const favouriteEquations = useMemo(
    () => allEquations.filter((eq) => favouriteIds.includes(eq.id)),
    [allEquations, favouriteIds]
  );

  const uniqueCategories = useMemo(
    () => [...new Set(favouriteEquations.map((eq) => eq.category))].sort(),
    [favouriteEquations]
  );

  const filteredEquations = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return favouriteEquations
      .filter((eq) => {
        const matchSearch =
          !q ||
          eq.name.toLowerCase().includes(q) ||
          eq.category.toLowerCase().includes(q) ||
          eq.description.toLowerCase().includes(q);
        const matchTag = !selectedTag || eq.category === selectedTag;
        return matchSearch && matchTag;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [favouriteEquations, searchTerm, selectedTag]);

  const handleCardToggle = (id: string) => {
    const next = new Set(expandedCards);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedCards(next);
  };

  const toggleDisplayMode = () => {
    setDisplayMode((m) => (m === "list" ? "grid" : "list"));
    if (displayMode === "list") setExpandedCards(new Set());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
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
            <h1 className="text-4xl md:text-5xl font-800 text-foreground mb-4">
              My Favourites
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your carefully curated collection of mathematical tools
            </p>
          </motion.div>

          {favouriteEquations.length === 0 ? (
            <motion.div className="text-center py-20" variants={cardVariants}>
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <HeartIcon className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-700 text-foreground mb-6">
                No favourites yet
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start building your collection by clicking the heart icon on any equation in the library.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                className="bg-card rounded-2xl border border-border p-6"
                variants={cardVariants}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-full md:flex-1">
                      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search your favourite equations..." />
                    </div>
                    <button
                      onClick={toggleDisplayMode}
                      className="p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
                    >
                      {displayMode === "list"
                        ? <Squares2X2Icon className="h-5 w-5 text-muted-foreground" />
                        : <ListBulletIcon className="h-5 w-5 text-muted-foreground" />
                      }
                    </button>
                  </div>

                  {uniqueCategories.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {[null, ...uniqueCategories].map((tag) => (
                        <motion.button
                          key={tag ?? '__all__'}
                          className={`px-4 py-1.5 rounded-full text-sm font-500 border transition-colors ${
                            selectedTag === tag
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => setSelectedTag(tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tag ?? 'All'}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Results Count */}
              <motion.div className="text-center" variants={cardVariants}>
                <p className="text-muted-foreground">
                  {filteredEquations.length} favourite equation{filteredEquations.length !== 1 ? "s" : ""}
                  {selectedTag && ` in ${selectedTag}`}
                </p>
              </motion.div>

              {/* Cards */}
              <motion.div
                className={displayMode === "list" ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
                variants={containerVariants}
              >
                <AnimatePresence>
                  {filteredEquations.map((equation) => (
                    <motion.div
                      key={equation.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <EnhancedEquationCard
                        equation={equation}
                        isExpanded={expandedCards.has(equation.id)}
                        onToggle={() => handleCardToggle(equation.id)}
                        isFavorited={isFavourite(equation.id)}
                        onFavoriteToggle={() => toggleFavourite(equation.id)}
                        displayMode={displayMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredEquations.length === 0 && (
                <motion.div className="text-center py-12" variants={cardVariants}>
                  <p className="text-gray-500 text-lg dark:text-gray-400">
                    No favourites found matching your search{selectedTag && ` in "${selectedTag}"`}.
                  </p>
                  <motion.button
                    onClick={() => { setSearchTerm(""); setSelectedTag(null); }}
                    className="mt-4 px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
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
