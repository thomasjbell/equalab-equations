"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DatabaseEquation } from "@/lib/services/equationSolver";
import EnhancedEquationCard from "@/components/EnhancedEquationCard";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EquationPage() {
  const params = useParams();
  const [equation, setEquation] = useState<DatabaseEquation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (params.id) {
      fetchEquation(params.id as string);
    }
  }, [params.id]);

  const fetchEquation = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('equations')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (fetchError) throw fetchError;
      setEquation(data);
    } catch (err) {
      console.error('Error fetching equation:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-xl text-gray-600 dark:text-gray-400">Loading equation...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !equation) {
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
          {/* Back Link */}
          <div>
            <Link
              href="/"
              className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium"
            >
              ← Back to Equation Library
            </Link>
          </div>

          {/* Equation Card - Expanded by default */}
          <EnhancedEquationCard
            equation={equation}
            isExpanded={true}
            onToggle={() => {}} // No toggle on individual page
            showFavoriteButton={false} // Disabled for direct links
          />

          {/* Call to Action */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Discover More Equations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore our comprehensive library of mathematical, physics, and engineering equations.
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Browse All Equations
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}