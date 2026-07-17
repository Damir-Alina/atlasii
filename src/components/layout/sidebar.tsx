"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import { Avatar, Badge } from "@/components/ui";
import { useMounted } from "@/hooks";
import { ROUTES, SIDEBAR_LINKS, SITE_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";
import type { Profile } from "@/types";

function SidebarLogo() {
  return (
    <Link href={ROUTES.home} className="flex items-center gap-2 px-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow-primary">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        {SITE_CONFIG.name}
      </span>
    </Link>
  );
}

function SidebarNav({
  onNavigate,
  showAdminLink,
}: {
  onNavigate?: () => void;
  showAdminLink: boolean;
}) {
  const pathname = usePathname();
  const links = showAdminLink
    ? [
        ...SIDEBAR_LINKS,
        { label: "Админ-панель", href: ROUTES.admin, icon: ShieldCheck },
      ]
    : SIDEBAR_LINKS;

  return (
    <nav className="flex flex-1 flex-col gap-1 px-2">
      {links.map((link) => {
        const isActive =
          link.href === ROUTES.dashboard
            ? pathname === link.href
            : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-primary-muted text-primary"
                : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ profile }: { profile: Profile }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(ROUTES.home);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 border-t border-border/60 px-3 py-4">
      <Avatar name={profile.fullName} src={profile.avatarUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{profile.fullName}</p>
        {profile.isPremium ? (
          <Badge variant="premium" className="mt-0.5">
            Premium
          </Badge>
        ) : (
          <p className="truncate text-xs text-muted-foreground">
            {profile.email}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Выйти"
        className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Sidebar({ profile }: { profile: Profile }) {
  const mounted = useMounted();
  const mobileOpen = useUIStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUIStore((state) => state.closeMobileSidebar);

  const sidebarContent = (
    <div className="flex h-full flex-col gap-6 py-6">
      <SidebarLogo />
      <SidebarNav onNavigate={closeMobileSidebar} showAdminLink={profile.role === "admin"} />
      <SidebarFooter profile={profile} />
    </div>
  );

  return (
    <>
      {/* Desktop — fixed column */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border/60 bg-surface/60 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile — slide-in drawer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <div className="fixed inset-0 z-[90] lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                  onClick={closeMobileSidebar}
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-0 h-full w-72 border-r border-border bg-surface-elevated shadow-card-hover"
                >
                  {sidebarContent}
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
