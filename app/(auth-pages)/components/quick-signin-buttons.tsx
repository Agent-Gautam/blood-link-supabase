"use client";

import { signInAction } from "@/app/(auth-pages)/actions";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Loader } from "lucide-react";

type QuickSignInUser = {
  type: string;
  email: string;
  password: string;
};

const quickSignInUsers: QuickSignInUser[] = [
  {
    type: "Donor",
    email: "gautamanand931@gmail.com",
    password: "agentgautam",
  },
  {
    type: "Organisation",
    email: "gautam.anand.ptu@gmail.com",
    password: "iamdonor",
  },
  {
    type: "Admin",
    email: "thefutureleader7@gmail.com",
    password: "iamadmin",
  },
];

export default function QuickSignInButtons() {
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleQuickSignIn = (user: QuickSignInUser) => {
    setPendingUser(user.type);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("password", user.password);
      await signInAction(formData);
    });
  };

  return (
    <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-3">Quick Sign In (Demo)</p>
      </div>
      <div className="flex flex-col gap-2">
        {quickSignInUsers.map((user) => {
          const isPendingForThisUser = isPending && pendingUser === user.type;
          return (
            <Button
              key={user.type}
              type="button"
              variant="outline"
              className="w-full"
              disabled={isPendingForThisUser || isPending}
              onClick={() => handleQuickSignIn(user)}
            >
              {isPendingForThisUser ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Signing in as {user.type}...
                </span>
              ) : (
                `Sign in as ${user.type}`
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
