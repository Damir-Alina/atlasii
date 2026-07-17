"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "./theme-provider";

/**
 * Single composition point for all client-side providers.
 * Add new global providers (auth, query client, etc.) here as stages land,
 * rather than nesting them directly in the root layout.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
