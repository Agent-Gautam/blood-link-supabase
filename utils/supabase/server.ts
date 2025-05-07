import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export const getUser = async () => {
  const supabase = await createClient();
  const {data} = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }
  const userId = data.user.id;
  const {data: userInfo} = await (await supabase)
    .from("users")
    .select("*, organisations(id), donors(id)")
    .eq("id", userId)
    .single();
  const userData = {
    id: userInfo.id,
    email: userInfo.email,
    firstName: userInfo.first_name,
    lastName: userInfo.last_name,
    phoneNumber: userInfo.phone_number,
    role: userInfo.role,
    organisation_id: userInfo.organisations?.id,
    donor_id: userInfo.donors?.id,
  }
  return userData;
};
