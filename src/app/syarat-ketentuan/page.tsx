import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan SIPANDU — Sistem Informasi Posyandu Kabupaten Lampung Timur untuk kader, petugas, dan masyarakat.",
  alternates: { canonical: "/syarat-ketentuan" },
};

const sections: LegalSection[] = [
  {
    title: "Penerimaan Ketentuan",
    paras: [
      "Dengan mengakses dan menggunakan SIPANDU (Sistem Informasi Posyandu) Kabupaten Lampung Timur, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku pada halaman ini.",
      "Apabila Anda tidak menyetujui sebagian atau seluruh ketentuan, mohon untuk tidak menggunakan layanan ini.",
    ],
  },
  {
    title: "Definisi Layanan",
    paras: [
      "SIPANDU adalah platform digital resmi milik Pemerintah Kabupaten Lampung Timur untuk monitoring, pencatatan, dan pelaporan pelayanan Posyandu yang mencakup 6 Bidang Standar Pelayanan Minimal (SPM): Pendidikan, Kesehatan, Pekerjaan Umum, Perumahan Rakyat, Trantibum Linmas, dan Sosial.",
      "Layanan ini terdiri dari halaman publik (informasi dan statistik agregat) serta dashboard internal yang hanya dapat diakses oleh pengguna terdaftar.",
    ],
  },
  {
    title: "Akun & Akses Pengguna",
    paras: ["Akses dashboard SIPANDU diberikan secara terbatas dengan ketentuan berikut:"],
    bullets: [
      "Akun diberikan kepada kader, petugas, dan admin yang ditunjuk secara resmi oleh instansi berwenang.",
      "Anda bertanggung jawab menjaga kerahasiaan kredensial (username dan password) akun Anda.",
      "Segala aktivitas yang terjadi melalui akun Anda menjadi tanggung jawab pemilik akun.",
      "Pengelola berhak menonaktifkan akun yang terindikasi disalahgunakan atau tidak lagi berwenang.",
    ],
  },
  {
    title: "Kewajiban Pengguna",
    paras: ["Setiap pengguna SIPANDU wajib:"],
    bullets: [
      "Memasukkan data yang benar, akurat, dan dapat dipertanggungjawabkan sesuai kondisi lapangan.",
      "Menggunakan data hanya untuk kepentingan pelayanan publik dan pelaporan resmi.",
      "Menjaga kerahasiaan data pribadi masyarakat yang tercatat dalam sistem.",
      "Mematuhi peraturan perundang-undangan yang berlaku, termasuk ketentuan perlindungan data pribadi.",
    ],
  },
  {
    title: "Larangan Penggunaan",
    paras: ["Pengguna dilarang keras melakukan hal-hal berikut:"],
    bullets: [
      "Mengakses, mengubah, atau menghapus data tanpa kewenangan yang sah.",
      "Menyebarluaskan data pribadi masyarakat kepada pihak yang tidak berhak.",
      "Melakukan upaya peretasan, pengujian keamanan tanpa izin, atau tindakan yang mengganggu ketersediaan sistem.",
      "Menggunakan layanan untuk kepentingan komersial, politik praktis, atau tujuan lain di luar fungsi Posyandu.",
    ],
  },
  {
    title: "Hak Kekayaan Intelektual",
    paras: [
      "Seluruh konten, logo, desain, dan perangkat lunak SIPANDU merupakan milik Pemerintah Kabupaten Lampung Timur dan/atau mitra pengembangnya.",
      "Data statistik agregat pada halaman publik dapat dikutip untuk kepentingan non-komersial dengan mencantumkan SIPANDU sebagai sumber.",
    ],
  },
  {
    title: "Ketersediaan & Perubahan Layanan",
    paras: [
      "Kami berupaya menjaga layanan tetap tersedia, namun tidak menjamin sistem bebas dari gangguan, pemeliharaan terjadwal, atau kendala teknis lainnya.",
      "Pengelola berhak menambah, mengubah, atau menghentikan sebagian fitur layanan sewaktu-waktu dengan atau tanpa pemberitahuan sebelumnya.",
    ],
  },
  {
    title: "Batasan Tanggung Jawab",
    paras: [
      "SIPANDU disediakan sebagaimana adanya (as is). Pengelola tidak bertanggung jawab atas kerugian yang timbul akibat penyalahgunaan akun oleh pengguna, kesalahan input data oleh pihak lain, maupun gangguan yang berada di luar kendali wajar pengelola.",
      "Keputusan yang diambil pihak lain berdasarkan data publik SIPANDU sepenuhnya menjadi tanggung jawab pihak tersebut.",
    ],
  },
  {
    title: "Hukum yang Berlaku",
    paras: [
      "Syarat dan ketentuan ini tunduk pada hukum Negara Republik Indonesia, termasuk namun tidak terbatas pada UU No. 6 Tahun 2014 tentang Desa, PP No. 43 Tahun 2014, Permendagri No. 13 Tahun 2024, serta peraturan perlindungan data pribadi yang berlaku.",
      "Sengketa yang timbul akan diupayakan penyelesaiannya secara musyawarah sebelum menempuh jalur hukum.",
    ],
  },
  {
    title: "Kontak",
    paras: [
      "Pertanyaan mengenai syarat dan ketentuan ini dapat disampaikan melalui email info@sipandu-lamtim.id atau kantor Pemerintah Kabupaten Lampung Timur di Sukadana.",
    ],
  },
];

export default function SyaratKetentuanPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Syarat & Ketentuan"
      subtitle="Ketentuan penggunaan layanan SIPANDU bagi kader, petugas, dan masyarakat Kabupaten Lampung Timur."
      updated="11 Juli 2026"
      sections={sections}
    />
  );
}
