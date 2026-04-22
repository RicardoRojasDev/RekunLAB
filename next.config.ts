import type { NextConfig } from "next";

type PatronesImagenesRemotas = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>;

const urlSupabasePublica = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

const patronesImagenesRemotas: PatronesImagenesRemotas = (() => {
  if (!urlSupabasePublica) {
    return [];
  }

  try {
    const url = new URL(urlSupabasePublica);

    return [
      {
        protocol: url.protocol === "http:" ? "http" : "https",
        hostname: url.hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
})();

const configuracionNext: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    remotePatterns: patronesImagenesRemotas,
  },
};

export default configuracionNext;
