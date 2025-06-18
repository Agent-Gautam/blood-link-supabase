"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";

const routeLabels: Record<string, string> = {
  "/": "dashboard",
  "/donor/request/history": "requests",
  "/donor/donation-history": "donation history",
  "/donor/requests/history": "requests history",
  "/donor/donation-camps": "donation camps",
  // Add more routes and their labels as needed
};
function getReadablePageName(refererUrl: string | null): string {
  if (!refererUrl) return "Unknown Page";

  try {
    const formatedPathname = refererUrl.slice(refererUrl.indexOf("/")); // removes empty strings
    console.log(refererUrl, formatedPathname);
    if (formatedPathname) return routeLabels[formatedPathname];
    else return "";
  } catch (e) {
    return "";
  }
}

export default function BackTo() {
  const searchParams = useSearchParams();
  const backToRoute = searchParams.get("backTo");
  console.log(backToRoute);
  const prevPage = getReadablePageName(backToRoute);
  const router = useRouter();

  return backToRoute ? (
    <Button variant="ghost">
      <Link href={backToRoute} className="flex items-center gap-2">
        <CircleArrowLeft className="mr-2" />
        <span>Back to {prevPage}</span>
      </Link>
    </Button>
  ) : (
    <Button
      variant="ghost"
      className="mb-4 flex items-center gap-2"
      onClick={() => router.back()}
    >
      <CircleArrowLeft className="mr-2" />
      <span>Back to {prevPage}</span>
    </Button>
  );
}
