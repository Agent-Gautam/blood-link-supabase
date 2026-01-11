import { Lock } from "lucide-react";
import React from "react";

interface UnauthorizedProps {
  message?: string;
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 bg-gradient-to-br from-blue-50 to-red-50 border-b border-gray-100">
      <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <Lock className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-2 text-center">
          Unauthorized
        </h1>
        <p className="text-gray-700 text-center mb-2">
          {message || "You are not authorized to view this page."}
        </p>
        <p className="text-sm text-gray-500 text-center">
          Please sign in with the correct account or contact support if you
          believe this is a mistake.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
