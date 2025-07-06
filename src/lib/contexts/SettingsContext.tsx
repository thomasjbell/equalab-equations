'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  decimal_places: number;
  significant_figures: number;
  number_format: 'decimal_places' | 'significant_figures';
  default_equation_view: 'expanded' | 'collapsed';
  default_result_mode: 'symbolic' | 'decimal' | 'both';
  animations_enabled: boolean;
  auto_solve: boolean;
  favorite_categories: string[];
}

const defaultSettings: UserSettings = {
  theme: 'system',
  decimal_places: 4,
  significant_figures: 6,
  number_format: 'decimal_places',
  default_equation_view: 'collapsed',
  default_result_mode: 'symbolic',
  animations_enabled: true,
  auto_solve: true,
  favorite_categories: [],
};

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
  saving: boolean;
  lastSaved: Date | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveQueue, setSaveQueue] = useState<UserSettings | null>(null);
  
  const { user } = useAuth();
  const supabase = createClient();

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (settingsToSave: UserSettings) => {
      if (!user) return;
      
      try {
        setSaving(true);
        
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            ...settingsToSave,
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error saving settings to database:', error);
          throw error;
        }
        
        setLastSaved(new Date());
        setSaveQueue(null);
      } catch (error) {
        console.error('Failed to save settings:', error);
        // Could add toast notification here
      } finally {
        setSaving(false);
      }
    }, 1000), // 1 second debounce
    [user, supabase]
  );

  // Load settings on mount and user change
  useEffect(() => {
    loadSettings();
  }, [user]);

  // Save settings when they change (for logged-in users)
  useEffect(() => {
    if (user && settings !== defaultSettings && !loading) {
      // Don't save if we're still loading initial settings
      debouncedSave(settings);
    }
  }, [settings, user, loading, debouncedSave]);

  // Apply theme changes immediately
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const loadSettings = async () => {
    setLoading(true);
    
    if (user) {
      // Load from database
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading settings:', error);
        } else if (data) {
          const loadedSettings: UserSettings = {
            theme: data.theme || defaultSettings.theme,
            decimal_places: data.decimal_places ?? defaultSettings.decimal_places,
            significant_figures: data.significant_figures ?? defaultSettings.significant_figures,
            number_format: data.number_format || defaultSettings.number_format,
            default_equation_view: data.default_equation_view || defaultSettings.default_equation_view,
            default_result_mode: data.default_result_mode || defaultSettings.default_result_mode,
            animations_enabled: data.animations_enabled ?? defaultSettings.animations_enabled,
            auto_solve: data.auto_solve ?? defaultSettings.auto_solve,
            favorite_categories: data.favorite_categories || defaultSettings.favorite_categories,
          };
          setSettings(loadedSettings);
          setLastSaved(new Date(data.updated_at));
        } else {
          // No settings found, create default ones
          setSettings(defaultSettings);
          debouncedSave(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
      }
    } else {
      // Load from localStorage
      try {
        const saved = localStorage.getItem('equationlab_settings');
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
        setSettings(defaultSettings);
      }
    }
    
    setLoading(false);
  };

  const saveToLocalStorage = useCallback((newSettings: UserSettings) => {
    try {
      localStorage.setItem('equationlab_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, []);

  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    // Optimistic update - update UI immediately
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Save to appropriate storage
    if (user) {
      // For logged-in users, the useEffect will handle the debounced save
      setSaveQueue(newSettings);
    } else {
      // For anonymous users, save to localStorage immediately
      saveToLocalStorage(newSettings);
    }
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    
    if (user) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            ...defaultSettings,
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error resetting settings:', error);
          throw error;
        }
        
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to reset settings:', error);
      } finally {
        setSaving(false);
      }
    } else {
      saveToLocalStorage(defaultSettings);
    }
  };

  const applyTheme = (theme: UserSettings['theme']) => {
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('dark');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      // Light mode is default, no class needed
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        loading,
        saving,
        lastSaved,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}