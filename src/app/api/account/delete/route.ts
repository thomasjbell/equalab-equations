import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get confirmation from request body
    const { confirmDelete } = await request.json();
    
    if (!confirmDelete) {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
    }

    // Delete user's data in order (due to foreign key constraints)
    
    // 1. Delete user favorites
    const { error: favoritesError } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id);

    if (favoritesError) {
      console.error('Error deleting favorites:', favoritesError);
      // Continue anyway - this shouldn't block account deletion
    }

    // 2. Delete user settings (if you have a user_settings table)
    const { error: settingsError } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id);

    if (settingsError) {
      console.error('Error deleting settings:', settingsError);
      // Continue anyway
    }

    // 3. Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      // Continue anyway
    }

    // 4. Delete equations authored by user (if you allow user-created equations)
    const { error: equationsError } = await supabase
      .from('equations')
      .delete()
      .eq('author_id', user.id);

    if (equationsError) {
      console.error('Error deleting user equations:', equationsError);
      // Continue anyway
    }

    // 5. Finally, delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      return NextResponse.json({ 
        error: 'Failed to delete account. Please contact support.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account successfully deleted' 
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred while deleting your account' 
    }, { status: 500 });
  }
}