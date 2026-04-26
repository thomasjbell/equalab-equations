"use client";

import { motion } from "framer-motion";
import { GlobeAltIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import LittleLogo from "./ui/LittleLogo";

const Footer = () => (
  <footer className="mt-20 border-t border-border bg-card">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <LittleLogo className="w-8 h-8" />
            <div className="leading-none">
              <p className="text-sm font-700 text-foreground">EquaLab</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Equations</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Interactive equation solver with exact symbolic computation for maths, physics, and chemistry.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Created by{" "}
            <a href="https://webbldesign.vercel.app" className="text-muted-foreground hover:text-foreground transition-colors">
              webbl design
            </a>
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-700 text-foreground uppercase tracking-wider">Contact</h4>
          <div className="space-y-3">
            <a href="mailto:info@equalab.uk" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <EnvelopeIcon className="w-4 h-4" />
              info@equalab.uk
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GlobeAltIcon className="w-4 h-4" />
              Milton Keynes, UK
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-700 text-foreground uppercase tracking-wider">Explore</h4>
          <div className="space-y-2">
            {[
              { href: "/",             label: "Equation Library" },
              { href: "/favourites",   label: "My Favourites" },
              { href: "/settings",     label: "Settings" },
              { href: "https://www.equalab.uk", label: "EquaLab Home" },
            ].map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} EquaLab. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
