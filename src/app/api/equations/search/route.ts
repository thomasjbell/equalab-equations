import { NextRequest, NextResponse } from 'next/server';
import { searchEquations } from '@/data/equations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? undefined;

  const equations = searchEquations(query, category);
  const serializable = equations.map(({ solve: _solve, ...rest }) => rest);

  return NextResponse.json(serializable);
}
