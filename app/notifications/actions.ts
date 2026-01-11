"use server";

import { createClient, getUser } from "@/utils/supabase/server";
import { ApiResponse, Notification } from "@/app/types";

export async function fetchNotifications(): Promise<
  ApiResponse<Notification[]>
> {
  try {
    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("id, user_id, message, type, sent_at, is_read")
      .eq("user_id", userId)
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Notification[] };
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: error.message };
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<ApiResponse<void>> {
  try {
    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
  try {
    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: error.message };
  }
}

