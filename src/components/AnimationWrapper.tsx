"use client";

import { MotionConfig } from "framer-motion";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { ReactNode } from "react";

export default function AnimationWrapper({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  return (
    <MotionConfig reducedMotion={settings.animations_enabled ? "never" : "always"}>
      {children}
    </MotionConfig>
  );
}
