import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface ErrorComponentProps {
  message?: string;
  title?: string;
}

export default function ErrorComponent({
  message = "Something went wrong.",
  title = "Error",
}: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm text-center max-w-md mx-auto">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-red-700 mb-2">{title}</h2>
      <p className="text-red-600 text-base mb-2">{message}</p>
      <p className="text-sm text-red-400 mb-4">Please try again</p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        variant={"secondary"}
      >
        <RefreshCw /> <span className="mr-2">Refresh</span>
      </Button>
    </div>
  );
}
