"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedEquationCard from "./EnhancedEquationCard";
import SearchBar from "./SearchBar";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getAllEquations } from "@/data/equations";
import { useFavourites } from "@/lib/hooks/useFavourites";
import { Equation } from "@/types/equation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

interface PersistedState {
  searchTerm: string;
  selectedTag: string | null;
  expandedCards: string[];
  displayMode: "list" | "grid";
  timestamp: number;
}

const STATE_KEY = 'equalab:grid_state';
const VISIT_KEY = 'equalab:has_visited';
const STATE_EXPIRY = 24 * 60 * 60 * 1000;

export default function EnhancedEquationGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [stateRestored, setStateRestored] = useState(false);
  const [isReturningVisit, setIsReturningVisit] = useState(false);

  const equations: Equation[] = useMemo(() => getAllEquations(), []);
  const { toggleFavourite, isFavourite } = useFavourites();

  useEffect(() => {
    const hasVisited = localStorage.getItem(VISIT_KEY);
    const hasState = localStorage.getItem(STATE_KEY);
    if (hasVisited && hasState) setIsReturningVisit(true);
    else localStorage.setItem(VISIT_KEY, 'true');
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        const parsed: PersistedState = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < STATE_EXPIRY) {
          const hasUrlParams = searchParams.get('search') || searchParams.get('category');
          if (!hasUrlParams) {
            setSearchTerm(parsed.searchTerm);
            setSelectedTag(parsed.selectedTag);
            setExpandedCards(new Set(parsed.expandedCards));
            setDisplayMode(parsed.displayMode);
          }
        } else { localStorage.removeItem(STATE_KEY); }
      }
    } catch {}
    setStateRestored(true);
  }, []);

  useEffect(() => {
    if (!stateRestored) return;
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    if (urlSearch) setSearchTerm(urlSearch);
    if (urlCategory) setSelectedTag(urlCategory);
  }, [searchParams, stateRestored]);

  useEffect(() => {
    if (!stateRestored) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STATE_KEY, JSON.stringify({
          searchTerm, selectedTag,
          expandedCards: Array.from(expandedCards),
          displayMode, timestamp: Date.now(),
        }));
      } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [searchTerm, selectedTag, expandedCards, displayMode, stateRestored]);

  const updateURL = (search: string, tag: string | null) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tag) params.set('category', tag);
    router.replace(params.toString() ? `?${params}` : '/', { scroll: false });
  };

  const handleSearchChange = (v: string) => { setSearchTerm(v); updateURL(v, selectedTag); };
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setSelectedSubcategory(null);
    updateURL(searchTerm, tag);
  };
  const clearAllFilters = () => {
    setSearchTerm(""); setSelectedTag(null); setSelectedSubcategory(null);
    updateURL("", null);
  };

  const uniqueCategories = useMemo(() => [...new Set(equations.map((eq) => eq.category))].sort(), [equations]);

  const subcategoriesForTag = useMemo(() => {
    if (!selectedTag) return [];
    return [...new Set(equations.filter(eq => eq.category === selectedTag && eq.subcategory).map(eq => eq.subcategory as string))].sort();
  }, [selectedTag, equations]);

  const filteredEquations = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return equations
      .filter((eq) => {
        const matchSearch = !q || eq.name.toLowerCase().includes(q) || eq.category.toLowerCase().includes(q) || eq.description.toLowerCase().includes(q) || eq.tags?.some((t) => t.toLowerCase().includes(q));
        const matchTag = !selectedTag || eq.category === selectedTag;
        const matchSub = !selectedSubcategory || eq.subcategory === selectedSubcategory;
        return matchSearch && matchTag && matchSub;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, selectedTag, selectedSubcategory, equations]);

  const handleCardToggle = (id: string) => {
    const next = new Set(expandedCards);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedCards(next);
  };

  const hasActiveFilters = !!(searchTerm || selectedTag || selectedSubcategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={isReturningVisit ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="pt-4"
      >
        <h1 className="text-4xl md:text-5xl font-800 text-foreground tracking-tight">
          Equation Library
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {equations.length}+ equations — exact symbolic results with fractions, surds, and complex numbers
        </p>
      </motion.div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <motion.div
        initial={isReturningVisit ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search equations, topics, or descriptions…"
            />
          </div>
          <button
            onClick={() => {
              setDisplayMode((m) => m === "list" ? "grid" : "list");
              if (displayMode === "list") setExpandedCards(new Set());
            }}
            className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
            title={displayMode === "list" ? "Grid view" : "List view"}
          >
            {displayMode === "list" ? <Squares2X2Icon className="h-5 w-5" /> : <ListBulletIcon className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      {/* ── Category filter ──────────────────────────────────────────── */}
      <motion.div
        initial={isReturningVisit ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider">Filter by category</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-xs font-500 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        <Tabs value={selectedTag ?? '__all__'} onValueChange={(v) => handleTagSelect(v === '__all__' ? null : v)}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border p-1 w-full justify-start">
            <TabsTrigger
              value="__all__"
              className="text-sm data-active:bg-primary data-active:text-primary-foreground"
            >
              All
            </TabsTrigger>
            {uniqueCategories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-sm data-active:bg-primary data-active:text-primary-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Subcategory pills */}
        {selectedTag && subcategoriesForTag.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {[null, ...subcategoriesForTag].map((sub) => (
              <button
                key={sub ?? '__all_sub__'}
                className={`px-3 py-1 rounded-full text-xs font-500 border transition-colors ${
                  selectedSubcategory === sub
                    ? "bg-primary/15 border-primary/50 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub ?? 'All'}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {filteredEquations.length} equation{filteredEquations.length !== 1 ? "s" : ""}
        {selectedTag && <> in <span className="text-foreground font-500">{selectedTag}</span></>}
        {selectedSubcategory && <> › <span className="text-foreground font-500">{selectedSubcategory}</span></>}
        {searchTerm && <> for <span className="text-foreground font-500">"{searchTerm}"</span></>}
      </p>

      {/* Cards */}
      <div className={displayMode === "list" ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
        {filteredEquations.map((equation) => (
          <EnhancedEquationCard
            key={equation.id}
            equation={equation}
            isExpanded={expandedCards.has(equation.id)}
            onToggle={() => handleCardToggle(equation.id)}
            isFavorited={isFavourite(equation.id)}
            onFavoriteToggle={() => toggleFavourite(equation.id)}
            displayMode={displayMode}
            disableInitialAnimation={isReturningVisit}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredEquations.length === 0 && (
        <div className="text-center py-24">
          <p className="text-muted-foreground text-lg mb-4">
            No equations found{selectedTag && ` in "${selectedTag}"`}{searchTerm && ` for "${searchTerm}"`}.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-500 hover:opacity-90 transition-opacity"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
