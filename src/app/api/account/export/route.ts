import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get user's favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select(`
        *,
        equations!inner(name, category, description)
      `)
      .eq('user_id', user.id);

    // Get user's settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get user's created equations (if applicable)
    const { data: createdEquations } = await supabase
      .from('equations')
      .select('*')
      .eq('author_id', user.id);

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      profile,
      settings,
      favorites: favorites?.map(fav => ({
        equation_name: fav.equations?.name,
        equation_category: fav.equations?.category,
        favorited_at: fav.created_at,
      })),
      createdEquations: createdEquations?.map(eq => ({
        name: eq.name,
        category: eq.category,
        description: eq.description,
        created_at: eq.created_at,
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="equalab-data-${user.id}.json"`,
      },
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ 
      error: 'Failed to export data' 
    }, { status: 500 });
  }
}