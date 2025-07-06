import { useSettings } from '@/lib/contexts/SettingsContext';
import { NumberFormatter } from '@/lib/utils/numberFormatter';

export function useFormattedNumber() {
  const { settings } = useSettings();

  const formatNumber = (value: number): string => {
    return NumberFormatter.formatForDisplay(value, settings);
  };

  const formatForLatex = (value: number): string => {
    return NumberFormatter.formatForLatex(value, settings);
  };

  return {
    formatNumber,
    formatForLatex,
    settings
  };
}