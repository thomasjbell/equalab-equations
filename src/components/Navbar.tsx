"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Heart, Settings, UserIcon, ChevronDown } from "lucide-react";
import LittleLogo from "./ui/LittleLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import LoginModal from "./auth/LoginModal";
import Link from "next/link";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const accountVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        staggerChildren: 0.05,
      },
    },
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    hover: {
      x: 4,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const DropdownMenuItem = ({
    href,
    icon: Icon,
    children,
    onClick,
    danger = false,
  }: {
    href?: string;
    icon: any;
    children: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
  }) => {
    const baseClasses = `flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-lg mx-2 ${
      danger
        ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

    const content = (
      <>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{children}</span>
      </>
    );

    if (href) {
      return (
        <motion.a
          href={href}
          className={baseClasses}
          onClick={() => setIsDropdownOpen(false)}
          variants={dropdownItemVariants}
          whileHover="hover"
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        onClick={onClick}
        className={`${baseClasses} w-full text-left`}
        variants={dropdownItemVariants}
        whileHover="hover"
      >
        {content}
      </motion.button>
    );
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <motion.div variants={logoVariants} className="flex-shrink-0">
            <motion.a
              href="/"
              className="flex items-center space-x-3 group"
              whileHover="hover"
              variants={logoVariants}
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <LittleLogo className="w-10 h-10" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-xl font-bold text-gray-900 dark:text-white"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 text-transparent bg-clip-text">
                    EquaLab
                  </span>
                </motion.h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Equations
                </p>
              </div>
            </motion.a>
          </motion.div>

          {/* Right: Settings + Account Area */}
          <motion.div variants={accountVariants} className="flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Settings Icon - Always visible */}
              <Link
                href="/settings"
                className="inline-flex items-center justify-center p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                title="Settings"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex items-center justify-center"
                >
                  <Settings className="w-5 h-5" />
                </motion.div>
              </Link>

              {/* User Section */}
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-gray-300 border-t-cyan-600 rounded-full"
                />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <UserIcon className="w-4 h-4 text-white" />
                    </motion.div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.user_metadata?.name ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email && user.email.length > 20
                          ? `${user.email.substring(0, 20)}...`
                          : user.email || "No email"}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 backdrop-blur-lg overflow-hidden"
                        style={{
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {/* User Info Header */}
                        <motion.div
                          className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50"
                          variants={dropdownItemVariants}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {user.user_metadata?.name || "User"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <DropdownMenuItem href="/favorites" icon={Heart}>
                            My Favourites
                          </DropdownMenuItem>

                          <DropdownMenuItem href="/settings" icon={Settings}>
                            Settings
                          </DropdownMenuItem>
                        </div>

                        {/* Separator */}
                        <motion.div
                          className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"
                          variants={dropdownItemVariants}
                        />

                        {/* Sign Out */}
                        <div className="py-2">
                          <DropdownMenuItem
                            icon={LogOut}
                            onClick={handleSignOut}
                            danger
                          >
                            Sign Out
                          </DropdownMenuItem>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="relative z-10">Sign In</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </motion.header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
