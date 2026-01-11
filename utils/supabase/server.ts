"use server";

import { createServerClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export const getUser = cache(async (): Promise<User["user_metadata"]> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  // Middleware ensures user exists, so we can safely assert non-null
  const userInfo = { ...data.user!.user_metadata, id: data.user!.id };
  return userInfo;
});
