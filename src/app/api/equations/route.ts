import { NextRequest, NextResponse } from 'next/server';
import { getAllEquations, searchEquations, getEquationsByCategory } from '@/data/equations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let equations = search
    ? searchEquations(search, category ?? undefined)
    : category && category !== 'all'
    ? getEquationsByCategory(category)
    : getAllEquations();

  // Strip the solve() function before serializing (not serializable)
  const serializable = equations.map(({ solve: _solve, ...rest }) => rest);

  return NextResponse.json({ data: serializable, count: serializable.length });
}
