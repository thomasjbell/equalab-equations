export type Dimension =
  | 'length' | 'mass' | 'time' | 'temperature' | 'amount'
  | 'current' | 'luminosity' | 'dimensionless' | 'angle'
  | 'force' | 'energy' | 'power' | 'pressure' | 'velocity'
  | 'acceleration' | 'frequency' | 'charge' | 'voltage' | 'resistance'
  | 'capacitance' | 'area' | 'volume' | 'density' | 'momentum'
  | 'magnetic_flux' | 'magnetic_field' | 'inductance' | 'concentration';

export interface UnitDefinition {
  symbol: string;
  name: string;
  pluralName?: string;
  dimension: Dimension;
  siConversionFactor: number;
  siUnit: string;
  isBase?: boolean;
}

export const UNITS: Record<string, UnitDefinition> = {
  // ──── Length ────
  m:   { symbol: 'm',  name: 'Metre',      dimension: 'length', siConversionFactor: 1,        siUnit: 'm', isBase: true },
  km:  { symbol: 'km', name: 'Kilometre',   dimension: 'length', siConversionFactor: 1000,     siUnit: 'm' },
  cm:  { symbol: 'cm', name: 'Centimetre',  dimension: 'length', siConversionFactor: 0.01,     siUnit: 'm' },
  mm:  { symbol: 'mm', name: 'Millimetre',  dimension: 'length', siConversionFactor: 0.001,    siUnit: 'm' },
  nm:  { symbol: 'nm', name: 'Nanometre',   dimension: 'length', siConversionFactor: 1e-9,     siUnit: 'm' },
  ft:  { symbol: 'ft', name: 'Foot',        dimension: 'length', siConversionFactor: 0.3048,   siUnit: 'm' },
  in:  { symbol: 'in', name: 'Inch',        dimension: 'length', siConversionFactor: 0.0254,   siUnit: 'm' },
  mi:  { symbol: 'mi', name: 'Mile',        dimension: 'length', siConversionFactor: 1609.344, siUnit: 'm' },
  ly:  { symbol: 'ly', name: 'Light Year',  dimension: 'length', siConversionFactor: 9.461e15, siUnit: 'm' },
  AU:  { symbol: 'AU', name: 'Astronomical Unit', dimension: 'length', siConversionFactor: 1.496e11, siUnit: 'm' },

  // ──── Mass ────
  kg:  { symbol: 'kg',  name: 'Kilogram',  dimension: 'mass', siConversionFactor: 1,       siUnit: 'kg', isBase: true },
  g:   { symbol: 'g',   name: 'Gram',      dimension: 'mass', siConversionFactor: 0.001,   siUnit: 'kg' },
  mg:  { symbol: 'mg',  name: 'Milligram', dimension: 'mass', siConversionFactor: 1e-6,    siUnit: 'kg' },
  t:   { symbol: 't',   name: 'Tonne',     dimension: 'mass', siConversionFactor: 1000,    siUnit: 'kg' },
  lb:  { symbol: 'lb',  name: 'Pound',     dimension: 'mass', siConversionFactor: 0.45359, siUnit: 'kg' },
  oz:  { symbol: 'oz',  name: 'Ounce',     dimension: 'mass', siConversionFactor: 0.028350, siUnit: 'kg' },

  // ──── Time ────
  s:   { symbol: 's',   name: 'Second', dimension: 'time', siConversionFactor: 1,     siUnit: 's', isBase: true },
  ms:  { symbol: 'ms',  name: 'Millisecond', dimension: 'time', siConversionFactor: 0.001, siUnit: 's' },
  min: { symbol: 'min', name: 'Minute', dimension: 'time', siConversionFactor: 60,    siUnit: 's' },
  h:   { symbol: 'h',   name: 'Hour',   dimension: 'time', siConversionFactor: 3600,  siUnit: 's' },
  d:   { symbol: 'd',   name: 'Day',    dimension: 'time', siConversionFactor: 86400, siUnit: 's' },
  yr:  { symbol: 'yr',  name: 'Year',   dimension: 'time', siConversionFactor: 3.156e7, siUnit: 's' },

  // ──── Temperature ────
  K:   { symbol: 'K',  name: 'Kelvin',     dimension: 'temperature', siConversionFactor: 1, siUnit: 'K', isBase: true },
  // °C and °F have offset conversions — handled separately in convertUnit()
  degC: { symbol: '°C', name: 'Celsius',    dimension: 'temperature', siConversionFactor: 1, siUnit: 'K' },
  degF: { symbol: '°F', name: 'Fahrenheit', dimension: 'temperature', siConversionFactor: 1, siUnit: 'K' },

  // ──── Pressure ────
  Pa:   { symbol: 'Pa',  name: 'Pascal',     dimension: 'pressure', siConversionFactor: 1,         siUnit: 'Pa', isBase: true },
  kPa:  { symbol: 'kPa', name: 'Kilopascal', dimension: 'pressure', siConversionFactor: 1000,      siUnit: 'Pa' },
  MPa:  { symbol: 'MPa', name: 'Megapascal', dimension: 'pressure', siConversionFactor: 1e6,       siUnit: 'Pa' },
  bar:  { symbol: 'bar', name: 'Bar',        dimension: 'pressure', siConversionFactor: 1e5,       siUnit: 'Pa' },
  atm:  { symbol: 'atm', name: 'Atmosphere', dimension: 'pressure', siConversionFactor: 101325,    siUnit: 'Pa' },
  psi:  { symbol: 'psi', name: 'Pounds per Square Inch', dimension: 'pressure', siConversionFactor: 6894.76, siUnit: 'Pa' },
  mmHg: { symbol: 'mmHg', name: 'Millimetres of Mercury', dimension: 'pressure', siConversionFactor: 133.322, siUnit: 'Pa' },
  torr: { symbol: 'torr', name: 'Torr',      dimension: 'pressure', siConversionFactor: 133.322,   siUnit: 'Pa' },

  // ──── Energy ────
  J:   { symbol: 'J',   name: 'Joule',       dimension: 'energy', siConversionFactor: 1,        siUnit: 'J', isBase: true },
  kJ:  { symbol: 'kJ',  name: 'Kilojoule',   dimension: 'energy', siConversionFactor: 1000,     siUnit: 'J' },
  MJ:  { symbol: 'MJ',  name: 'Megajoule',   dimension: 'energy', siConversionFactor: 1e6,      siUnit: 'J' },
  eV:  { symbol: 'eV',  name: 'Electronvolt', dimension: 'energy', siConversionFactor: 1.602e-19, siUnit: 'J' },
  cal: { symbol: 'cal', name: 'Calorie',      dimension: 'energy', siConversionFactor: 4.184,    siUnit: 'J' },
  kWh: { symbol: 'kWh', name: 'Kilowatt-hour', dimension: 'energy', siConversionFactor: 3.6e6, siUnit: 'J' },

  // ──── Power ────
  W:   { symbol: 'W',  name: 'Watt',     dimension: 'power', siConversionFactor: 1,    siUnit: 'W', isBase: true },
  kW:  { symbol: 'kW', name: 'Kilowatt', dimension: 'power', siConversionFactor: 1000, siUnit: 'W' },
  MW:  { symbol: 'MW', name: 'Megawatt', dimension: 'power', siConversionFactor: 1e6,  siUnit: 'W' },
  hp:  { symbol: 'hp', name: 'Horsepower', dimension: 'power', siConversionFactor: 745.7, siUnit: 'W' },

  // ──── Force ────
  N:  { symbol: 'N',  name: 'Newton',  dimension: 'force', siConversionFactor: 1,       siUnit: 'N', isBase: true },
  kN: { symbol: 'kN', name: 'Kilonewton', dimension: 'force', siConversionFactor: 1000, siUnit: 'N' },
  lbf: { symbol: 'lbf', name: 'Pound-force', dimension: 'force', siConversionFactor: 4.44822, siUnit: 'N' },

  // ──── Angle ────
  deg:  { symbol: '°',   name: 'Degree', dimension: 'angle', siConversionFactor: Math.PI / 180, siUnit: 'rad' },
  rad:  { symbol: 'rad', name: 'Radian', dimension: 'angle', siConversionFactor: 1, siUnit: 'rad', isBase: true },

  // ──── Frequency ────
  Hz:  { symbol: 'Hz',  name: 'Hertz',     dimension: 'frequency', siConversionFactor: 1,     siUnit: 'Hz', isBase: true },
  kHz: { symbol: 'kHz', name: 'Kilohertz', dimension: 'frequency', siConversionFactor: 1000,  siUnit: 'Hz' },
  MHz: { symbol: 'MHz', name: 'Megahertz', dimension: 'frequency', siConversionFactor: 1e6,   siUnit: 'Hz' },
  GHz: { symbol: 'GHz', name: 'Gigahertz', dimension: 'frequency', siConversionFactor: 1e9,   siUnit: 'Hz' },

  // ──── Electrical ────
  V:   { symbol: 'V',  name: 'Volt',     dimension: 'voltage',    siConversionFactor: 1,    siUnit: 'V',  isBase: true },
  mV:  { symbol: 'mV', name: 'Millivolt', dimension: 'voltage',   siConversionFactor: 0.001, siUnit: 'V' },
  kV:  { symbol: 'kV', name: 'Kilovolt', dimension: 'voltage',    siConversionFactor: 1000, siUnit: 'V' },
  A:   { symbol: 'A',  name: 'Ampere',   dimension: 'current',    siConversionFactor: 1,    siUnit: 'A',  isBase: true },
  mA:  { symbol: 'mA', name: 'Milliampere', dimension: 'current', siConversionFactor: 0.001, siUnit: 'A' },
  Ohm: { symbol: 'Ω',  name: 'Ohm',      dimension: 'resistance', siConversionFactor: 1,    siUnit: 'Ω',  isBase: true },
  kOhm:{ symbol: 'kΩ', name: 'Kilohm',   dimension: 'resistance', siConversionFactor: 1000, siUnit: 'Ω' },
  F:   { symbol: 'F',  name: 'Farad',    dimension: 'capacitance', siConversionFactor: 1,   siUnit: 'F',  isBase: true },
  uF:  { symbol: 'μF', name: 'Microfarad', dimension: 'capacitance', siConversionFactor: 1e-6, siUnit: 'F' },
  nF:  { symbol: 'nF', name: 'Nanofarad', dimension: 'capacitance', siConversionFactor: 1e-9, siUnit: 'F' },
  pF:  { symbol: 'pF', name: 'Picofarad', dimension: 'capacitance', siConversionFactor: 1e-12, siUnit: 'F' },
  C:   { symbol: 'C',  name: 'Coulomb',  dimension: 'charge',     siConversionFactor: 1,    siUnit: 'C',  isBase: true },

  // ──── Concentration ────
  'mol/dm3': { symbol: 'mol/dm³', name: 'Molar',       dimension: 'concentration', siConversionFactor: 1000, siUnit: 'mol/m³' },
  'mol/m3':  { symbol: 'mol/m³',  name: 'Moles per m³', dimension: 'concentration', siConversionFactor: 1, siUnit: 'mol/m³', isBase: true },
};

export const UNIT_GROUPS: Partial<Record<Dimension, string[]>> = {
  length:       ['m', 'km', 'cm', 'mm', 'nm', 'ft', 'in', 'mi'],
  mass:         ['kg', 'g', 'mg', 't', 'lb', 'oz'],
  time:         ['s', 'ms', 'min', 'h', 'd', 'yr'],
  temperature:  ['K', 'degC', 'degF'],
  pressure:     ['Pa', 'kPa', 'MPa', 'bar', 'atm', 'psi', 'mmHg', 'torr'],
  energy:       ['J', 'kJ', 'MJ', 'eV', 'cal', 'kWh'],
  power:        ['W', 'kW', 'MW', 'hp'],
  force:        ['N', 'kN', 'lbf'],
  angle:        ['deg', 'rad'],
  frequency:    ['Hz', 'kHz', 'MHz', 'GHz'],
  voltage:      ['V', 'mV', 'kV'],
  current:      ['A', 'mA'],
  resistance:   ['Ohm', 'kOhm'],
  capacitance:  ['F', 'uF', 'nF', 'pF'],
  concentration: ['mol/dm3', 'mol/m3'],
};

export function convertUnit(value: number, fromSymbol: string, toSymbol: string): number {
  if (fromSymbol === toSymbol) return value;

  // Handle temperature offset conversions
  const tempConversions: Record<string, Record<string, (v: number) => number>> = {
    K:     { degC: (v) => v - 273.15,              degF: (v) => (v - 273.15) * 9/5 + 32 },
    degC:  { K:    (v) => v + 273.15,              degF: (v) => v * 9/5 + 32 },
    degF:  { K:    (v) => (v - 32) * 5/9 + 273.15, degC: (v) => (v - 32) * 5/9 },
  };
  if (tempConversions[fromSymbol]?.[toSymbol]) {
    return tempConversions[fromSymbol][toSymbol](value);
  }

  const from = UNITS[fromSymbol];
  const to   = UNITS[toSymbol];
  if (!from || !to || from.dimension !== to.dimension) {
    throw new Error(`Cannot convert ${fromSymbol} to ${toSymbol}`);
  }
  const siValue = value * from.siConversionFactor;
  return siValue / to.siConversionFactor;
}

export function getCompatibleUnits(symbol: string): string[] {
  const unit = UNITS[symbol];
  if (!unit) return [];
  const group = UNIT_GROUPS[unit.dimension];
  return group ?? Object.keys(UNITS).filter((k) => UNITS[k].dimension === unit.dimension);
}
