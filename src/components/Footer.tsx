"use client";

import { motion } from "framer-motion";
import {
  HeartIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import LittleLogo from "./ui/LittleLogo";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
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

  const linkVariants = {
    hover: {
      scale: 1.05,
      x: 4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-cyan-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Subtle top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <motion.div
        className="relative backdrop-blur-sm"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <LittleLogo className="w-12 h-12" />
                </motion.div>
                <div>
                  <motion.h3
                    className="text-2xl font-bold text-white"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                      EquaLab
                    </span>
                  </motion.h3>
                  <p className="text-cyan-200 text-sm">Equations</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                EquaLab is a powerful platform providing engineers, scientists,
                and students with interactive tools for mathematical computation
                and symbolic equation solving.
              </p>
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-center">
                  Made by{" "}
                  <a
                    href="https://webbldesign.vercel.app"
                    className="hover:bg-gradient-to-r hover:from-violet-400 hover:to-fuchsia-400 bg-clip-text text-transparent transition-colors bg-gray-400 duration-200"
                  >
                    webbl design
                  </a>
                </span>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-cyan-400" />
                Get in Touch
              </h4>
              <div className="space-y-4">
                <motion.a
                  href="mailto:info@equalab.uk"
                  className="flex items-center space-x-3 text-gray-300 hover:text-cyan-400 transition-colors"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="w-4 h-4" />
                  </div>
                  <span>info@equalab.uk</span>
                </motion.a>
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <GlobeAltIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p>Milton Keynes</p>
                    <p className="text-sm">Buckinghamshire, UK</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Explore</h4>
              <div className="space-y-3">
                {[
                  { href: "/", label: "Equation Library" },
                  { href: "/favourites", label: "My Favourites" },
                  { href: "/settings", label: "Settings" },
                  { href: "https://equalab.uk", label: "EquaLab Home" },
              
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="block text-gray-300 hover:text-cyan-400 transition-colors"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-gray-700/50"
          >
            <div className="flex mx-auto justify-center items-center space-y-4 md:space-y-0">
              <motion.p
                className="text-gray-400 text-sm"
                whileHover={{ scale: 1.02 }}
              >
                &copy; {new Date().getFullYear()} EquaLab. All rights reserved.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
