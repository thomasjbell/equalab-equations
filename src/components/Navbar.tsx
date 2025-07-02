"use client";

import { useState } from "react";
import {
  Menu,
  X,
  BookOpen,
  Settings,
  User,
  PlusSquare,
} from "lucide-react";
import LittleLogo from "./ui/LittleLogo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-cyan-50 shadow-sm border-b border-slate-200 sticky top-0 z-50
    dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <a href="/">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Assuming LittleLogo handles its own dark mode or is purely illustrative */}
                <LittleLogo className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    <span className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-cyan-50 dark:to-cyan-200">EquaLab</span>
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1 dark:text-gray-300">Equations</p>
                </div>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 mx-auto">
            <a
              href="/"
              className="flex items-center space-x-1 text-cyan-900 hover:text-cyan-600 transition-colors font-medium
              dark:text-cyan-100 dark:hover:text-cyan-300"
            >
              <BookOpen className="w-4 h-4 color-inherit" />
              <span>Library</span>
            </a>
            <a
              href="/add"
              className="flex items-center space-x-1 text-cyan-900 hover:text-cyan-600 transition-colors font-medium
              dark:text-cyan-100 dark:hover:text-cyan-300"
            >
              <PlusSquare className="w-4 h-4 color-inherit" />
              <span>Add Equation</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-cyan-900 hover:text-cyan-600 transition-colors font-medium
              dark:text-cyan-100 dark:hover:text-cyan-300"
            >
              <Settings className="w-4 h-4 color-inherit" />
              <span>Settings</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors
              dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-cyan-50
          dark:border-gray-700 dark:bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Library Link */}
              <a
                href="/"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors
                dark:text-gray-200 dark:hover:text-cyan-400 dark:hover:bg-gray-700"
              >
                <BookOpen className="w-5 h-5 dark:text-cyan-300" />
                <span className="font-medium">Library</span>
              </a>
              {/* Add Equation Link */}
              <a
                href="/add"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors
                dark:text-gray-200 dark:hover:text-cyan-400 dark:hover:bg-gray-700"
              >
                <PlusSquare className="w-5 h-5 dark:text-cyan-300" />
                <span className="font-medium">Add Equation</span>
              </a>
              {/* Settings Link */}
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors
                dark:text-gray-200 dark:hover:text-cyan-400 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5 dark:text-cyan-300" />
                <span className="font-medium">Settings</span>
              </a>
              {/* Account Link */}
              <div className="border-t border-gray-200 pt-2 mt-2 dark:border-gray-600">
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors
                  dark:text-gray-200 dark:hover:text-cyan-400 dark:hover:bg-gray-700"
                >
                  <User className="w-5 h-5 dark:text-cyan-300" />
                  <span className="font-medium">Account</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}