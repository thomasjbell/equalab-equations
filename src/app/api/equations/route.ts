// src/app/api/equations/route.ts (updated version)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('equations')
      .select(`
        *,
        profiles:author_id (name),
        user_favorites!left (id)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }

    if (userId) {
      query = query.eq('user_favorites.user_id', userId);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match expected format
    const transformedData = data?.map(equation => ({
      ...equation,
      user_favorites: equation.user_favorites.filter(Boolean) // Remove null entries
    }));

    return NextResponse.json({
      data: transformedData,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'category', 'latex', 'description', 'variables', 'solver_type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate solver_type
    const validSolverTypes = ['linear', 'quadratic', 'cubic', 'geometric', 'physics', 'suvat', 'trigonometry', 'statistics', 'chemistry', 'custom'];
    if (!validSolverTypes.includes(body.solver_type)) {
      return NextResponse.json(
        { error: `Invalid solver_type. Must be one of: ${validSolverTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate variables array
    if (!Array.isArray(body.variables) || body.variables.length === 0) {
      return NextResponse.json(
        { error: 'Variables must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate each variable has required fields
    const variableFields = ['name', 'symbol', 'unit'];
    for (const variable of body.variables) {
      const missingVarFields = variableFields.filter(field => !(field in variable));
      if (missingVarFields.length > 0) {
        return NextResponse.json(
          { error: `Variable missing fields: ${missingVarFields.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('equations')
      .insert({
        ...body,
        author_id: user.id,
        is_public: body.is_public !== false, // Default to true
        solver_config: body.solver_config || {},
        examples: body.examples || []
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating equation:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}