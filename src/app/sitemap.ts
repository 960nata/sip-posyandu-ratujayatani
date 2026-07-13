import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sipandu.lampungtimurkab.go.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/tujuan",
    "/kelembagaan",
    "/layanan",
    "/panduan",
    "/profil",
    "/kebijakan-privasi",
    "/syarat-ketentuan",
  ];
  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.8,
  }));
}
