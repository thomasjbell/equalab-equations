"use client";

import { motion } from "framer-motion";
import { Heart, Settings } from "lucide-react";
import LittleLogo from "./ui/LittleLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
    >
      <div className="w-full h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{ rotate: 8 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
            <LittleLogo className="w-9 h-9" />
          </motion.div>
          <div className="leading-none">
            <p className="text-base font-700 text-foreground tracking-tight">EquaLab</p>
            <p className="text-[10px] font-500 text-muted-foreground tracking-wider uppercase">Equations</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {[
            { href: "/favourites", icon: Heart, label: "Favourites", activeColor: "text-rose-400 bg-rose-950/50" },
            { href: "/settings",   icon: Settings, label: "Settings",    activeColor: "text-primary bg-primary/10" },
          ].map(({ href, icon: Icon, label, activeColor }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150 ${
                  active ? activeColor : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
