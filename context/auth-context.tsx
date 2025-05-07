"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    console.log("user changed");
  }, [user]);
  useEffect(() => {
    console.log("session changed");
  }, [session]);

  useEffect(() => {
    console.log("user changed");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // if (session?.user) {
      //   const { data, error } = await supabase
      //     .from("users")
      //     .select("role")
      //     .eq("id", session.user.id)
      //     .single();
      //   if (error) {
      //     console.error("Error fetching user role:", error);
      //   } else {
      //     setUserRole(data.role as UserRole);
      //   }
      // }
      setIsLoading(false);
      router.refresh();
    });
  }, [supabase, router]);
  const value = {
    user,
    session,
    userRole,
    isLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
