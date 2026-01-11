import { createClient } from "@/utils/supabase/server";
import NotificationDrawer from "./notification-drawer";

export default async function NotificationDrawerWrapper() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase.auth.getUser();

    // Only show notification drawer for authenticated users
    if (error || !data?.user) {
      return null;
    }

    return <NotificationDrawer />;
  } catch (error) {
    // Silently fail if there's an error
    return null;
  }
}
