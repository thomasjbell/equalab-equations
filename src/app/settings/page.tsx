"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ArrowPathIcon,
  CheckIcon,
  SparklesIcon,
  CalculatorIcon,
  EyeIcon,
  ClockIcon,
  CloudIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useAuth } from "@/lib/auth/AuthContext";

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings, loading, saving, lastSaved } =
    useSettings();
  const { user } = useAuth();
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
      return;
    }

    await resetSettings();
    setResetConfirm(false);
  };

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

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: ComputerDesktopIcon },
  ];

  const numberFormatOptions = [
    {
      value: "decimal_places",
      label: "Decimal Places",
      description: "Fixed number of digits after decimal",
    },
    {
      value: "significant_figures",
      label: "Significant Figures",
      description: "Total number of meaningful digits",
    },
  ];

  const resultModeOptions = [
    {
      value: "symbolic",
      label: "Exact (Symbolic)",
      description: "Show results in exact form with fractions and surds",
    },
    {
      value: "decimal",
      label: "Decimal",
      description: "Show results as decimal approximations",
    },
    {
      value: "both",
      label: "Both",
      description: "Show both exact and decimal forms",
    },
  ];

  const equationViewOptions = [
    {
      value: "collapsed",
      label: "Collapsed",
      description: "Equations start minimized",
    },
    {
      value: "expanded",
      label: "Expanded",
      description: "Equations start expanded",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
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
                className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Cog6ToothIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 text-transparent bg-clip-text">
                Settings
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Customize your EquaLab experience to match your preferences
            </p>

            {/* Status Indicators */}
            <div className="flex justify-center gap-4 mt-6">
              {user ? (
                <AnimatePresence mode="wait">
                  {saving ? (
                    <motion.div
                      key="saving"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                      />
                      Saving changes...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                    >
                      <CloudIcon className="w-4 h-4" />
                      Synced to cloud
                      {lastSaved && (
                        <span className="text-xs opacity-75">
                          {lastSaved.toLocaleTimeString()}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <SparklesIcon className="w-4 h-4" />
                  Sign in to sync across devices
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
            {/* Appearance Settings */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8"
              variants={cardVariants}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <EyeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Appearance
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visual preferences and theme
                  </p>
                </div>
              </div>
<h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mt-32">Coming Soon</h1>
              {/* <div className="space-y-8">
                // Theme Selection 
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() =>
                            updateSetting("theme", option.value as any)
                          }
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            settings.theme === option.value
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-lg"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md"
                          }`}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-gray-400" />
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {option.label}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                // Animations Toggle 
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Enable Animations
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Smooth transitions and micro-interactions
                    </p>
                  </div>
                  <motion.button
                    onClick={() =>
                      updateSetting(
                        "animations_enabled",
                        !settings.animations_enabled
                      )
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      settings.animations_enabled
                        ? "bg-cyan-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.span
                      className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
                      animate={{
                        x: settings.animations_enabled ? 24 : 4,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                </div>
              </div> */}
            </motion.div>

            {/* Number Display Settings */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8"
              variants={cardVariants}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CalculatorIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Number Display
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    How numbers are formatted
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Number Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Number Format
                  </label>
                  <div className="space-y-3">
                    {numberFormatOptions.map((option) => (
                      <motion.label
                        key={option.value}
                        className="flex items-start cursor-pointer group"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="radio"
                          name="number_format"
                          value={option.value}
                          checked={settings.number_format === option.value}
                          onChange={(e) =>
                            updateSetting(
                              "number_format",
                              e.target.value as any
                            )
                          }
                          className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {option.label}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Slider Controls */}
                <AnimatePresence mode="wait">
                  {settings.number_format === "decimal_places" ? (
                    <motion.div
                      key="decimal"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Decimal Places: {settings.decimal_places}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={settings.decimal_places}
                        onChange={(e) =>
                          updateSetting(
                            "decimal_places",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="significant"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Significant Figures: {settings.significant_figures}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        value={settings.significant_figures}
                        onChange={(e) =>
                          updateSetting(
                            "significant_figures",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>1</span>
                        <span>8</span>
                        <span>15</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preview */}
                <motion.div
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-gray-200 dark:border-gray-600"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Live Preview:
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-lg text-gray-900 dark:text-white">
                      π ≈{" "}
                      {settings.number_format === "decimal_places"
                        ? Math.PI.toFixed(settings.decimal_places)
                        : Math.PI.toPrecision(settings.significant_figures)}
                    </div>
                    <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      √2 ≈{" "}
                      {settings.number_format === "decimal_places"
                        ? Math.sqrt(2).toFixed(settings.decimal_places)
                        : Math.sqrt(2).toPrecision(
                            settings.significant_figures
                          )}
                    </div>
                    <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      e ≈{" "}
                      {settings.number_format === "decimal_places"
                        ? Math.E.toFixed(settings.decimal_places)
                        : Math.E.toPrecision(settings.significant_figures)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Format:{" "}
                    {settings.number_format === "decimal_places"
                      ? `${settings.decimal_places} decimal places`
                      : `${settings.significant_figures} significant figures`}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Equation Behavior */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8"
              variants={cardVariants}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Equation Behavior
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    How equations function
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Default Result Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Default Result Display
                  </label>
                  <div className="space-y-3">
                    {resultModeOptions.map((option) => (
                      <motion.label
                        key={option.value}
                        className="flex items-start cursor-pointer group"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="radio"
                          name="result_mode"
                          value={option.value}
                          checked={
                            settings.default_result_mode === option.value
                          }
                          onChange={(e) =>
                            updateSetting(
                              "default_result_mode",
                              e.target.value as any
                            )
                          }
                          className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {option.label}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Default Equation View */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Default Equation View
                  </label>
                  <div className="space-y-3">
                    {equationViewOptions.map((option) => (
                      <motion.label
                        key={option.value}
                        className="flex items-start cursor-pointer group"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="radio"
                          name="equation_view"
                          value={option.value}
                          checked={
                            settings.default_equation_view === option.value
                          }
                          onChange={(e) =>
                            updateSetting(
                              "default_equation_view",
                              e.target.value as any
                            )
                          }
                          className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {option.label}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Auto Solve */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Auto-solve Equations
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Automatically calculate results as you type
                    </p>
                  </div>
                  <motion.button
                    onClick={() =>
                      updateSetting("auto_solve", !settings.auto_solve)
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      settings.auto_solve
                        ? "bg-cyan-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.span
                      className="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg"
                      animate={{
                        x: settings.auto_solve ? 24 : 4,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Data & Reset */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8"
              variants={cardVariants}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Data & Reset
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your preferences
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                    <ArrowPathIcon className="w-5 h-5" />
                    Reset All Settings
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                    This will restore all settings to their default values. This
                    action cannot be undone.
                  </p>
                  <motion.button
                    onClick={handleReset}
                    disabled={saving}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      resetConfirm
                        ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                        : "bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    variants={buttonVariants}
                    whileHover={!saving ? "hover" : {}}
                    whileTap={!saving ? "tap" : {}}
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Resetting...
                      </div>
                    ) : resetConfirm ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-5 h-5" />
                        Click Again to Confirm
                      </div>
                    ) : (
                      "Reset to Defaults"
                    )}
                  </motion.button>
                </motion.div>

                {user && (
                  <motion.div
                    className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <CloudArrowUpIcon className="w-5 h-5" />
                      Cloud Sync Active
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your settings are automatically synchronized across all
                      your devices. Changes are saved within seconds and synced
                      to the cloud.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
