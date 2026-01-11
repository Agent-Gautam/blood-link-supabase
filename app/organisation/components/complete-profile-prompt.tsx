import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CompleteProfilePromptProps {
  title?: string;
  description?: string;
  buttonText?: string;
  redirectUrl?: string;
}

export default function CompleteProfilePrompt({
  title = "Complete Your Profile",
  description = "Finish setting up your organisation profile to access the dashboard.",
  buttonText = "Complete Profile",
  redirectUrl = "/organisation/register",
}: CompleteProfilePromptProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border border-red-100 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-red-600 tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="mt-3 text-gray-600 text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            <Link href={redirectUrl}>{buttonText}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
