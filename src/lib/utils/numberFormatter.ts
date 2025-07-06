import { UserSettings } from '@/lib/contexts/SettingsContext';

export class NumberFormatter {
  static formatNumber(
    value: number, 
    settings: UserSettings
  ): number {
    if (!isFinite(value)) {
      return value;
    }

    if (settings.number_format === 'significant_figures') {
      return parseFloat(value.toPrecision(settings.significant_figures));
    } else {
      return parseFloat(value.toFixed(settings.decimal_places));
    }
  }

  static formatForDisplay(
    value: number,
    settings: UserSettings
  ): string {
    if (!isFinite(value)) {
      return value.toString();
    }

    if (Math.abs(value) < 1e-15) return '0';

    if (settings.number_format === 'significant_figures') {
      // Handle scientific notation for very large or small numbers
      if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) {
        return value.toExponential(Math.max(0, settings.significant_figures - 1));
      }
      
      // Use toPrecision and clean up unnecessary trailing zeros and decimal points
      const formatted = value.toPrecision(settings.significant_figures);
      return parseFloat(formatted).toString();
    } else {
      // For decimal places, preserve trailing zeros
      return value.toFixed(settings.decimal_places);
    }
  }

  static formatForLatex(
    value: number,
    settings: UserSettings
  ): string {
    if (!isFinite(value)) return '\\text{NaN}';
    
    if (Math.abs(value) < 1e-15) return '0';
    
    if (settings.number_format === 'significant_figures') {
      // Handle scientific notation for very large or small numbers
      if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) {
        const precision = Math.max(0, settings.significant_figures - 1);
        const scientificNotation = value.toExponential(precision);
        const [mantissa, exponent] = scientificNotation.split('e');
        const exp = parseInt(exponent);
        const cleanMantissa = parseFloat(mantissa);
        return `${cleanMantissa} \\times 10^{${exp}}`;
      }
      
      // Use toPrecision and clean up unnecessary trailing zeros and decimal points
      const formatted = value.toPrecision(settings.significant_figures);
      return parseFloat(formatted).toString();
    } else {
      // For decimal places, handle scientific notation if needed
      if (Math.abs(value) >= 1e6 || (Math.abs(value) < 1e-4 && value !== 0)) {
        const scientificNotation = value.toExponential(settings.decimal_places);
        const [mantissa, exponent] = scientificNotation.split('e');
        const exp = parseInt(exponent);
        return `${mantissa} \\times 10^{${exp}}`;
      }
      
      // For normal numbers, preserve trailing zeros with toFixed
      return value.toFixed(settings.decimal_places);
    }
  }

  // Helper method to format numbers consistently
  static formatNumberWithSettings(
    value: number,
    settings: UserSettings,
    forLatex: boolean = false
  ): string {
    return forLatex 
      ? this.formatForLatex(value, settings)
      : this.formatForDisplay(value, settings);
  }
}