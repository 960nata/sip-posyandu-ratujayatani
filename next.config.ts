import type { NextConfig } from "next";

const securityHeaders = [
  // Cegah situs lain menampilkan aplikasi ini di dalam iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Cegah browser menebak-nebak MIME type (sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Batasi informasi referrer yang dikirim ke situs eksternal
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Matikan akses API browser sensitif yang tidak dipakai aplikasi
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Paksa HTTPS selama 1 tahun (berlaku saat diakses via HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
