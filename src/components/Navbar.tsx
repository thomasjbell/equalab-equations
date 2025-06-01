"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Calculator,
  BookOpen,
  Settings,
  User,
  PlusSquare,
} from "lucide-react";
import Logo from '/logo.png';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
               <img src="/logo.png" alt="EquaLab Logo" width={32} height={32}/>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EquaLab</h1>
                <p className="text-xs text-gray-500 -mt-1">Equations</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
            </a>
            <a
              href="/add"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <PlusSquare className="w-4 h-4" />
              <span>Add Equation</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </a>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Account</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                <span className="font-medium">Calculator</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Library</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </a>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <User className="w-5 h-5" />
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
