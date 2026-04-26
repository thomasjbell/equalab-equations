"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cog6ToothIcon,
  ArrowPathIcon,
  CheckIcon,
  CalculatorIcon,
  ClockIcon,
  HeartIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { FavouritesService } from "@/lib/storage/favouritesService";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [clearFavouritesConfirm, setClearFavouritesConfirm] = useState(false);
  const [clearFavouritesSuccess, setClearFavouritesSuccess] = useState(false);

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
      return;
    }
    resetSettings();
    setResetConfirm(false);
  };

  const handleClearFavourites = () => {
    if (!clearFavouritesConfirm) {
      setClearFavouritesConfirm(true);
      setTimeout(() => setClearFavouritesConfirm(false), 3000);
      return;
    }
    FavouritesService.getFavouriteIds().forEach((id) => FavouritesService.removeFavourite(id));
    setClearFavouritesSuccess(true);
    setClearFavouritesConfirm(false);
    setTimeout(() => setClearFavouritesSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      settings,
      favourites: FavouritesService.getFavouriteIds(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `equalab-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 10 } },
    tap: { scale: 0.98 },
  };

  const numberFormatOptions = [
    { value: "decimal_places", label: "Decimal Places", description: "Fixed number of digits after decimal" },
    { value: "significant_figures", label: "Significant Figures", description: "Total number of meaningful digits" },
  ];

  const resultModeOptions = [
    { value: "symbolic", label: "Exact (Symbolic)", description: "Show results in exact form with fractions and surds" },
    { value: "decimal", label: "Decimal", description: "Show results as decimal approximations" },
    { value: "both", label: "Both", description: "Show both exact and decimal forms" },
  ];

  const equationViewOptions = [
    { value: "collapsed", label: "Collapsed", description: "Equations start minimized" },
    { value: "expanded", label: "Expanded", description: "Equations start expanded" },
  ];

  const angleModeOptions = [
    { value: "degrees", label: "Degrees", description: "Angles measured in degrees (0–360°)" },
    { value: "radians", label: "Radians", description: "Angles measured in radians (0–2π)" },
  ];

  const numberModeOptions = [
    { value: "real", label: "Real Numbers Only", description: "Return no solution for equations with complex roots" },
    { value: "complex", label: "Complex Numbers", description: "Return complex roots (e.g. x = 2 ± 3i)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
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
            <h1 className="text-4xl md:text-5xl font-800 text-foreground mb-4">Settings</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Customise your EquaLab experience
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
              <CheckIcon className="w-4 h-4" />
              Saved locally on this device
            </div>
          </motion.div>

          {/* Display & Behavior */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-8"
            variants={cardVariants}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center">
                <CalculatorIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-700 text-foreground">Display & Behaviour</h2>
                <p className="text-muted-foreground text-sm">How numbers are formatted and equations function</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Number Display */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-700 text-foreground mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Number Display
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-600 text-foreground mb-3">Number Format</label>
                    <div className="space-y-3">
                      {numberFormatOptions.map((opt) => (
                        <motion.label key={opt.value} className="flex items-start cursor-pointer group" whileHover={{ x: 4 }}>
                          <input
                            type="radio" name="number_format" value={opt.value}
                            checked={settings.number_format === opt.value}
                            onChange={(e) => updateSetting("number_format", e.target.value as "decimal_places" | "significant_figures")}
                            className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-500 text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                            <p className="text-xs text-muted-foreground">{opt.description}</p>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {settings.number_format === "decimal_places" ? (
                      <motion.div key="decimal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mb-6">
                        <label className="block text-sm font-600 text-foreground mb-3">
                          Decimal Places: {settings.decimal_places}
                        </label>
                        <input type="range" min="0" max="10" value={settings.decimal_places}
                          onChange={(e) => updateSetting("decimal_places", parseInt(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>0</span><span>5</span><span>10</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="significant" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mb-6">
                        <label className="block text-sm font-600 text-foreground mb-3">
                          Significant Figures: {settings.significant_figures}
                        </label>
                        <input type="range" min="1" max="15" value={settings.significant_figures}
                          onChange={(e) => updateSetting("significant_figures", parseInt(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>1</span><span>8</span><span>15</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Preview */}
                  <motion.div className="p-4 bg-muted rounded-xl border border-border" whileHover={{ scale: 1.02 }}>
                    <div className="text-xs font-600 text-muted-foreground mb-2">Live Preview:</div>
                    <div className="space-y-2">
                      {[['π', Math.PI], ['√2', Math.sqrt(2)], ['e', Math.E]].map(([label, val]) => (
                        <div key={label as string} className="font-mono text-sm text-foreground">
                          {label} ≈ {settings.number_format === "decimal_places"
                            ? (val as number).toFixed(settings.decimal_places)
                            : (val as number).toPrecision(settings.significant_figures)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right: Equation Behavior */}
              <div className="space-y-8">
                <h3 className="text-sm font-700 text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Equation Behaviour
                </h3>

                {/* Result Mode */}
                <div className="mb-6">
                  <label className="block text-sm font-600 text-foreground mb-3">Default Result Display</label>
                  <div className="space-y-3">
                    {resultModeOptions.map((opt) => (
                      <motion.label key={opt.value} className="flex items-start cursor-pointer group" whileHover={{ x: 4 }}>
                        <input
                          type="radio" name="result_mode" value={opt.value}
                          checked={settings.default_result_mode === opt.value}
                          onChange={(e) => updateSetting("default_result_mode", e.target.value as "symbolic" | "decimal" | "both")}
                          className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-500 text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Equation View */}
                <div className="mb-6">
                  <label className="block text-sm font-600 text-foreground mb-3">Default Equation View</label>
                  <div className="space-y-3">
                    {equationViewOptions.map((opt) => (
                      <motion.label key={opt.value} className="flex items-start cursor-pointer group" whileHover={{ x: 4 }}>
                        <input
                          type="radio" name="equation_view" value={opt.value}
                          checked={settings.default_equation_view === opt.value}
                          onChange={(e) => updateSetting("default_equation_view", e.target.value as "collapsed" | "expanded")}
                          className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-500 text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                {[
                  { key: "auto_solve" as const, label: "Auto-solve Equations", desc: "Automatically calculate results as you type" },
                  { key: "animations_enabled" as const, label: "Enable Animations", desc: "Smooth transitions and motion effects" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between mb-4">
                    <div>
                      <label className="text-sm font-600 text-foreground">{label}</label>
                      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                    </div>
                    <Switch
                      checked={settings[key]}
                      onCheckedChange={(checked) => updateSetting(key, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Angle & Number Mode */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-8"
            variants={cardVariants}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center">
                <CalculatorIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-700 text-foreground">Computation Settings</h2>
                <p className="text-muted-foreground text-sm">Angle units and number system for solving equations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Angle Mode */}
              <div>
                <label className="block text-sm font-600 text-foreground mb-3">Angle Mode</label>
                <div className="space-y-3">
                  {angleModeOptions.map((opt) => (
                    <motion.label key={opt.value} className="flex items-start cursor-pointer group" whileHover={{ x: 4 }}>
                      <input
                        type="radio" name="angle_mode" value={opt.value}
                        checked={settings.angle_mode === opt.value}
                        onChange={(e) => updateSetting("angle_mode", e.target.value as "degrees" | "radians")}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-500 text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Number Mode */}
              <div>
                <label className="block text-sm font-600 text-foreground mb-3">Number System</label>
                <div className="space-y-3">
                  {numberModeOptions.map((opt) => (
                    <motion.label key={opt.value} className="flex items-start cursor-pointer group" whileHover={{ x: 4 }}>
                      <input
                        type="radio" name="number_mode" value={opt.value}
                        checked={settings.number_mode === opt.value}
                        onChange={(e) => updateSetting("number_mode", e.target.value as "real" | "complex")}
                        className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-500 text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data & Reset */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-8"
            variants={cardVariants}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-destructive/15 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-700 text-foreground">Data & Reset</h2>
                <p className="text-muted-foreground text-sm">Manage your local data and preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reset Settings */}
              <motion.div className="p-5 bg-amber-950/30 rounded-xl border border-amber-800/50" whileHover={{ scale: 1.02 }}>
                <h3 className="text-sm font-700 text-amber-300 mb-2 flex items-center gap-2">
                  <ArrowPathIcon className="w-5 h-5" />
                  Reset Settings
                </h3>
                <p className="text-sm text-amber-400/80 mb-3">
                  Restore all settings to default values.
                </p>
                <motion.button
                  onClick={handleReset}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${resetConfirm ? "bg-red-600 text-white hover:bg-red-700" : "bg-yellow-600 text-white hover:bg-yellow-700"}`}
                  variants={buttonVariants} whileHover="hover" whileTap="tap"
                >
                  {resetConfirm ? (
                    <span className="flex items-center gap-2"><CheckIcon className="w-5 h-5" />Click Again</span>
                  ) : "Reset to Defaults"}
                </motion.button>
              </motion.div>

              {/* Clear Favourites */}
              <motion.div className="p-5 bg-red-950/30 rounded-xl border border-red-800/50" whileHover={{ scale: 1.02 }}>
                <h3 className="text-sm font-700 text-red-300 mb-2 flex items-center gap-2">
                  <HeartIcon className="w-5 h-5" />
                  Clear Favourites
                </h3>
                <p className="text-sm text-red-400/80 mb-3">
                  Remove all equations from your favourites list.
                </p>
                <AnimatePresence>
                  {clearFavouritesSuccess && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-green-400 mb-3 font-500">
                      Favourites cleared.
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={handleClearFavourites}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${clearFavouritesConfirm ? "bg-red-700 text-white hover:bg-red-800" : "bg-red-500 text-white hover:bg-red-600"}`}
                  variants={buttonVariants} whileHover="hover" whileTap="tap"
                >
                  {clearFavouritesConfirm ? (
                    <span className="flex items-center gap-2"><TrashIcon className="w-5 h-5" />Click Again</span>
                  ) : <span className="flex items-center gap-2"><HeartIcon className="w-5 h-5" />Clear All</span>}
                </motion.button>
              </motion.div>

              {/* Export Data */}
              <motion.div className="p-5 bg-green-950/30 rounded-xl border border-green-800/50" whileHover={{ scale: 1.02 }}>
                <h3 className="text-sm font-700 text-green-300 mb-2 flex items-center gap-2">
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  Export Data
                </h3>
                <p className="text-sm text-green-400/80 mb-3">
                  Download your settings and favourites as a JSON file.
                </p>
                <motion.button
                  onClick={handleExportData}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
                  variants={buttonVariants} whileHover="hover" whileTap="tap"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  Export Data
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
