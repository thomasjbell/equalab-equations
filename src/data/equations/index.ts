import { Equation } from '@/types/equation';
import { algebraEquations } from './algebra';
import { algebraExtraEquations } from './algebra-extra';
import { geometryEquations } from './geometry';
import { geometryExtraEquations } from './geometry-extra';
import { trigonometryEquations } from './trigonometry';
import { trigonometryExtraEquations } from './trigonometry-extra';
import { mechanicsEquations } from './physics/mechanics';
import { materialsEquations } from './physics/materials';
import { astrophysicsEquations } from './physics/astrophysics';
import { thermodynamicsEquations } from './physics/thermodynamics';
import { wavesEquations } from './physics/waves';
import { wavesExtraEquations } from './physics/waves-extra';
import { electromagnetismEquations } from './physics/electromagnetism';
import { electromagnetismExtraEquations } from './physics/electromagnetism-extra';
import { quantumEquations } from './physics/quantum';
import { statisticsEquations } from './mathematics/statistics';
import { statisticsExtraEquations } from './statistics-extra';
import { calculusEquations } from './mathematics/calculus';
import { physicalChemistryEquations } from './chemistry/physical';
import { chemistryExtraEquations } from './chemistry/chemistry-extra';
import { financeEquations } from './finance/index';

export const ALL_EQUATIONS: Equation[] = [
  ...algebraEquations,
  ...algebraExtraEquations,
  ...geometryEquations,
  ...geometryExtraEquations,
  ...trigonometryEquations,
  ...trigonometryExtraEquations,
  ...mechanicsEquations,
  ...materialsEquations,
  ...astrophysicsEquations,
  ...thermodynamicsEquations,
  ...wavesEquations,
  ...wavesExtraEquations,
  ...electromagnetismEquations,
  ...electromagnetismExtraEquations,
  ...quantumEquations,
  ...statisticsEquations,
  ...statisticsExtraEquations,
  ...calculusEquations,
  ...physicalChemistryEquations,
  ...chemistryExtraEquations,
  ...financeEquations,
];

export function getAllEquations(): Equation[] {
  return ALL_EQUATIONS;
}

export function getEquationById(id: string): Equation | undefined {
  return ALL_EQUATIONS.find((eq) => eq.id === id);
}

export function searchEquations(query: string, category?: string, subcategory?: string): Equation[] {
  const q = query.toLowerCase();
  return ALL_EQUATIONS.filter((eq) => {
    const matchesCategory = !category || eq.category === category;
    const matchesSubcategory = !subcategory || eq.subcategory === subcategory;
    const matchesQuery =
      !q ||
      eq.name.toLowerCase().includes(q) ||
      eq.category.toLowerCase().includes(q) ||
      (eq.subcategory?.toLowerCase().includes(q)) ||
      eq.description.toLowerCase().includes(q) ||
      eq.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSubcategory && matchesQuery;
  });
}

export function getCategories(): string[] {
  return [...new Set(ALL_EQUATIONS.map((eq) => eq.category))].sort();
}

export function getSubcategories(category: string): string[] {
  return [
    ...new Set(
      ALL_EQUATIONS.filter((eq) => eq.category === category)
        .map((eq) => eq.subcategory)
        .filter((s): s is string => !!s)
    ),
  ].sort();
}

export function getEquationsByCategory(category: string): Equation[] {
  return ALL_EQUATIONS.filter((eq) => eq.category === category);
}
