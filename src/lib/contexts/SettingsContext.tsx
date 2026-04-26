'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { LocalStorageService } from '@/lib/storage/localStorageService';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  decimal_places: number;
  significant_figures: number;
  number_format: 'decimal_places' | 'significant_figures';
  default_equation_view: 'expanded' | 'collapsed';
  default_result_mode: 'symbolic' | 'decimal' | 'both';
  animations_enabled: boolean;
  auto_solve: boolean;
  angle_mode: 'degrees' | 'radians';
  number_mode: 'real' | 'complex';
}

export const defaultSettings: UserSettings = {
  theme: 'system',
  decimal_places: 4,
  significant_figures: 6,
  number_format: 'decimal_places',
  default_equation_view: 'collapsed',
  default_result_mode: 'symbolic',
  animations_enabled: true,
  auto_solve: true,
  angle_mode: 'degrees',
  number_mode: 'real',
};

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  resetSettings: () => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = LocalStorageService.get<Partial<UserSettings>>('settings', {});
    setSettings({ ...defaultSettings, ...saved });
    setLoading(false);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (loading) return;
    const root = document.documentElement;
    root.classList.remove('dark');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
  }, [settings.theme, loading]);

  // Apply/remove no-animations class
  useEffect(() => {
    if (loading) return;
    document.documentElement.classList.toggle('no-animations', !settings.animations_enabled);
  }, [settings.animations_enabled, loading]);

  // Debounced save to localStorage
  const saveToStorage = useCallback(
    debounce((s: UserSettings) => {
      LocalStorageService.set('settings', s);
    }, 500),
    []
  );

  const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    LocalStorageService.set('settings', defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
};
