import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/forgot-password"],
        disallow: [
          "/dashboard",
          "/learn",
          "/map",
          "/profile",
          "/statistics",
          "/achievements",
          "/leaderboard",
          "/settings",
          "/pricing",
          "/admin",
          "/api",
          "/offline",
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
