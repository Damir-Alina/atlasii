import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AppHeader, Sidebar } from "@/components/layout";
import { getCurrentProfile } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

// Everything under (app) is behind auth and personal to the signed-in
// user — never index it, and don't let it show up in "site:" searches.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects signed-out users away
  // from every route under this group, but a Server Component guard keeps
  // this layout safe even if it's ever reused outside that matcher.
  if (!user) {
    redirect(ROUTES.login);
  }

  // DB-backed (Stage 9), with a built-in graceful fallback if migrations
  // haven't been applied yet — see getCurrentProfile's own doc comment.
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader profile={profile} />
        <main id="main-content" className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
