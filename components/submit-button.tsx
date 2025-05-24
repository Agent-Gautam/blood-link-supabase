"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ReactNode, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string|ReactNode;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending ? (
        <h1 className="flex items-center justify-center gap-3">
          <Loader className="animate-spin" /> {pendingText}
        </h1>
      ) : (
        children
      )}
    </Button>
  );
}
