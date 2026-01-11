import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-red-600 tracking-tight">
            Sign In Required
          </CardTitle>
          <CardDescription className="mt-3 text-gray-600 text-lg">
            You need to sign in to access this page. Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
