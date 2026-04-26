"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { getEquationById } from "@/data/equations";
import EnhancedEquationCard from "@/components/EnhancedEquationCard";
import { useFavourites } from "@/lib/hooks/useFavourites";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EquationPage() {
  const params = useParams();
  const id = params.id as string;

  const equation = useMemo(() => getEquationById(id), [id]);
  const { isFavourite, toggleFavourite } = useFavourites();

  if (!equation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Equation Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The equation you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/"
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Browse All Equations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-cyan-600">Home</Link></li>
              <li>/</li>
              <li>
                <Link href={`/?category=${encodeURIComponent(equation.category)}`} className="hover:text-cyan-600">
                  {equation.category}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 dark:text-white font-medium">{equation.name}</li>
            </ol>
          </nav>

          <div>
            <Link href="/" className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium">
              ← Back to Equation Library
            </Link>
          </div>

          <EnhancedEquationCard
            equation={equation}
            isExpanded={true}
            onToggle={() => {}}
            isFavorited={isFavourite(equation.id)}
            onFavoriteToggle={() => toggleFavourite(equation.id)}
            displayMode="list"
          />

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Discover More {equation.category} Equations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore our comprehensive library of mathematical, physics, and engineering equations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/?category=${encodeURIComponent(equation.category)}`}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                More {equation.category} Equations
              </Link>
              <Link
                href="/"
                className="border border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Browse All Equations
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
