import { Inter, Manrope, JetBrains_Mono } from "next/font/google";

/**
 * Body copy — Inter.
 * Chosen for its neutral, highly legible letterforms at small sizes,
 * which is where most of AtlasIQ's UI text (stats, labels, table data) lives.
 */
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Display / headings — Manrope.
 * A geometric grotesk with a slightly rounded, confident character —
 * gives headings a premium, modern-map-product feel without being generic.
 * (Originally Sora, but Sora has no Cyrillic subset on Google Fonts and
 * every heading in this app is Russian — Manrope covers Cyrillic while
 * keeping the same geometric-sans character.)
 */
export const sora = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sora",
  display: "swap",
});

/**
 * Numeric / data — JetBrains Mono.
 * Used for XP counters, coordinates, timers and stat figures where
 * tabular alignment matters.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`;
