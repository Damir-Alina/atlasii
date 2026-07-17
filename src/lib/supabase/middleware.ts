import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/lib/constants";

const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];
const PROTECTED_PREFIXES: string[] = [
  ROUTES.dashboard,
  ROUTES.learn,
  ROUTES.map,
  ROUTES.profile,
  ROUTES.statistics,
  ROUTES.achievements,
  ROUTES.leaderboard,
  ROUTES.settings,
  ROUTES.admin,
  ROUTES.pricing,
];

/**
 * Refreshes the Supabase session on every request and applies the two
 * auth-related redirects Stage 4 requires:
 *   - signed-in users hitting /login, /register, /forgot-password → /dashboard
 *   - signed-out users hitting a protected route → /login
 *
 * Must be called from the root middleware.ts and its response returned
 * unmodified (or with headers copied over) so the refreshed cookies reach
 * the browser.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

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
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  return response;
}
