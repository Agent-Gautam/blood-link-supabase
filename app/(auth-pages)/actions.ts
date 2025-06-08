"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const role = formData.get("role")?.toString()!;
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstname")?.toString();
  const lastName = formData.get("lastname")?.toString();
  const phone = formData.get("phone")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
    phone: phone ? phone : "000",
    
    options: {
      data: {
      firstName: firstName,
        lastName: lastName,
        role: role,
        
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });


  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    const { error: userError } = await supabase
        .from("users")
        .insert([
          {
            id: user.user?.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            role: role,
          },
        ]);
      if (userError) {
        console.error(userError.message);
        return encodedRedirect("error", "/sign-up", userError.message);
      }
    return redirect(`/${role.toLowerCase()}/register`);
    // return encodedRedirect(
    //   "success",
    //   "/sign-up",
    //   "Thanks for signing up! Please check your email for a verification link.",
    // );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  const { data: roleData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user?.id)
    .single();
  if (roleError) {
    console.error(roleError.message);
    return encodedRedirect("error", "/sign-in", roleError.message);
  }
  const userRole = (roleData?.role as string)?.toLowerCase();
  console.log(userRole);
  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(`/${userRole}`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
