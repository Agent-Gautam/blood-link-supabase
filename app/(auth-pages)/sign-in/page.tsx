import { signInAction } from "@/app/(auth-pages)/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FiMail, FiLock } from "react-icons/fi";

export default async function SignIn(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  return (
    <div className="flex w-full h-screen font-sans" style={{ fontFamily: 'Inter, Poppins, Lato, sans-serif' }}>
      {/* Left Side: Medical Image, Quote, Droplet */}
      <div className="w-1/2 min-h-full relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/login-side.jpg)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <p className="text-2xl md:text-3xl font-bold text-center px-8 mb-10 drop-shadow-lg bg-[#f15e5e] text-white rounded-xl py-4 px-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.07), 0 0 2px #fff' }}>
            "Your blood can give someone another chance at life."
          </p>
        </div>
      </div>
      {/* Right Side: Login Form */}
      <div className="w-1/2 min-h-full flex items-center justify-center bg-white">
        <form action={signInAction} className="w-full max-w-md mx-auto p-8 rounded-2xl border border-gray-200 bg-white shadow-md space-y-5">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-semibold mb-2 text-[#1f1f1f] tracking-normal" style={{ letterSpacing: '-0.5px' }}>
              Welcome Back!
            </h1>
            <p className="text-base text-gray-600 mb-2 text-center">
              Sign in to save lives by donating or requesting blood.
            </p>
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-1 text-[#1f1f1f]">Email</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiMail />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 rounded-lg shadow-sm border-gray-300 focus:border-[#ef4444] focus:ring-[#ef4444] transition"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium mb-1 text-[#1f1f1f]">Password</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiLock />
              </span>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 pr-10 rounded-lg shadow-sm border-gray-300 focus:border-[#ef4444] focus:ring-[#ef4444] transition"
                required
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <Link href="/forgot-password" className="text-gray-500 hover:underline transition">
              Forgot Password?
            </Link>
          </div>
          <SubmitButton pendingText="Signing In..." className="w-full rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold shadow-md transition">
            Sign In
          </SubmitButton>
          <FormMessage message={searchParams} />
          <div className="text-center text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#ef4444] font-medium underline hover:text-[#dc2626] transition">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
