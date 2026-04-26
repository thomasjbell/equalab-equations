import { NextRequest, NextResponse } from 'next/server';
import { getEquationById } from '@/data/equations';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const equation = getEquationById(id);

  if (!equation) {
    return NextResponse.json({ error: 'Equation not found' }, { status: 404 });
  }

  const { solve: _solve, ...serializable } = equation;
  return NextResponse.json(serializable);
}
