import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    const userRole = user.data?.user?.user_metadata.role;
    const pathname = request.nextUrl.pathname;

    // protected routes
    if (
      (pathname.startsWith("/donor") ||
      pathname.startsWith("/organisation") ||
      pathname.startsWith("/admin")) &&
      user.error
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // if (pathname.startsWith("/") && !user.error) {
    //   return NextResponse.redirect(
    //     new URL(`/${userRole.toLowerCase()}`, request.url)
    //   );
    // }
    // if (pathname === "/" && !user.error) {
    //   return NextResponse.redirect(new URL("/protected", request.url));
    // }
    if (pathname.startsWith("/organisation")) {
      if (userRole !== "ORGANISATION") {
      return NextResponse.redirect(new URL("/not-found", request.url));
      }
    }

    if (pathname.startsWith("/donor")) {
      if (userRole !== "DONOR") {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
    }
    if (request.nextUrl.pathname.startsWith("/admin") && ['DONOR','ORGANISATION'].includes(userRole)) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
