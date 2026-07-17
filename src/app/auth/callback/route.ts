import { NextResponse } from "next/server";

import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase redirects here after a successful OAuth (Google) sign-in.
 * We exchange the auth code for a session, then send the user to the
 * dashboard — or back to login with an error flag if the exchange fails.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect_to") ?? ROUTES.dashboard;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(
    `${origin}${ROUTES.login}?error=oauth_failed`,
  );
}
