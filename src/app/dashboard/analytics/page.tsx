import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";

export const metadata = {
  title: "Analisis & Peta Akses",
};

export default async function AnalyticsPage() {
  const session = await auth();

  // Restrict access to SUPERADMIN and ADMIN_KECAMATAN only
  if (!session?.user || !["SUPERADMIN", "ADMIN_KECAMATAN"].includes((session.user as any).role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analisis & Pemetaan Akses</h1>
        <p className="text-slate-500 mt-1">
          Laporan penggunaan aplikasi, lokasi akses (Desa), dan statistik Google Analytics.
        </p>
      </div>

      <AnalyticsClient />
    </div>
  );
}
