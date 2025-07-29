import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export async function clearDuplicateNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // Get all notifications for the user
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (notifications && notifications.length > 0) {
      // Group by title + message + related_id to find duplicates
      const seen = new Set();
      const toDelete = [];

      for (const notif of notifications) {
        const key = `${notif.title}-${notif.message}-${notif.related_id}`;
        if (seen.has(key)) {
          toDelete.push(notif.id);
        } else {
          seen.add(key);
        }
      }

      // Delete duplicates
      if (toDelete.length > 0) {
        await supabase
          .from('notifications')
          .delete()
          .in('id', toDelete);
        
        console.log(`Removed ${toDelete.length} duplicate notifications`);
      }
    }
  } catch (error) {
    console.error('Error clearing duplicate notifications:', error);
  }
}