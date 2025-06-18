import { signUpAction } from "@/app/(auth-pages)/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label>Signup As</Label>

          <Label
            htmlFor="DONOR"
            className="flex gap-2 items-center justify-start p-3 border rounded-md"
          >
            <Input
              id="DONOR"
              name="role"
              type="radio"
              required
              value={"DONOR"}
              className="w-5"
            />
            <h1>Donor</h1>
          </Label>
          <Label
            htmlFor="ORGANISATION"
            className="flex gap-2 items-center justify-start p-3 border rounded-md"
          >
            <Input
              id="ORGANISATION"
              name="role"
              type="radio"
              required
              value={"ORGANISATION"}
              className="w-5"
            />
            <h1>Organisation</h1>
          </Label>
          <Label htmlFor="firstname">User first Name</Label>
          <Input name="firstname" placeholder="Your First name" required />
          <Label htmlFor="lastname">User Last name</Label>
          <Input name="lastname" placeholder="Your Last name" required />
          <Label htmlFor="phone">Phone</Label>
          <Input name="phone" placeholder="Your phone number" required />
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          {/* <Input name="verify-later" type="checkbox" />
          <Label htmlFor="verify-later">Verify </Label> */}
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
