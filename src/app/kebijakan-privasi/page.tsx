import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi SIPANDU — bagaimana data Posyandu, kader, dan masyarakat Kabupaten Lampung Timur dikumpulkan, digunakan, dan dilindungi.",
  alternates: { canonical: "/kebijakan-privasi" },
};

const sections: LegalSection[] = [
  {
    title: "Pendahuluan",
    paras: [
      "SIPANDU (Sistem Informasi Posyandu) adalah platform digital milik Pemerintah Kabupaten Lampung Timur untuk pengelolaan data pelayanan Posyandu lintas 6 Bidang Standar Pelayanan Minimal (SPM).",
      "Kebijakan privasi ini menjelaskan jenis data yang kami kumpulkan, cara kami menggunakannya, serta langkah-langkah yang kami lakukan untuk melindunginya. Dengan menggunakan SIPANDU, Anda dianggap telah membaca dan menyetujui kebijakan ini.",
    ],
  },
  {
    title: "Data yang Kami Kumpulkan",
    paras: ["Dalam menjalankan fungsinya, SIPANDU mengumpulkan dan mengelola beberapa kategori data berikut:"],
    bullets: [
      "Data akun pengguna: nama lengkap, jabatan/peran (kader, petugas, admin), nomor kontak, dan alamat email yang digunakan untuk login.",
      "Data pelayanan Posyandu: hasil penimbangan, imunisasi, kunjungan rumah, serta catatan layanan 6 Bidang SPM (Pendidikan, Kesehatan, Pekerjaan Umum, Perumahan Rakyat, Trantibum Linmas, dan Sosial).",
      "Data sasaran layanan: informasi ibu, bayi, balita, remaja, dan lansia yang menerima pelayanan Posyandu, sesuai formulir baku pencatatan Posyandu.",
      "Data teknis: alamat IP, jenis perangkat, dan aktivitas penggunaan sistem untuk keperluan keamanan dan audit.",
    ],
  },
  {
    title: "Penggunaan Data",
    paras: ["Data yang terkumpul digunakan semata-mata untuk penyelenggaraan pelayanan publik, meliputi:"],
    bullets: [
      "Monitoring dan pelaporan berjenjang dari desa, kecamatan, kabupaten, provinsi, hingga pusat sesuai Permendagri No. 13 Tahun 2024.",
      "Perencanaan program dan pengambilan kebijakan berbasis data di Kabupaten Lampung Timur.",
      "Deteksi dini permasalahan kesehatan dan sosial di tingkat desa/kelurahan.",
      "Peningkatan kualitas layanan Posyandu dan pembinaan kader.",
    ],
  },
  {
    title: "Penyimpanan & Keamanan Data",
    paras: [
      "Seluruh data disimpan pada infrastruktur yang dikelola sesuai standar keamanan sistem pemerintahan berbasis elektronik (SPBE).",
      "Kami menerapkan kontrol akses berbasis peran (role-based access), enkripsi pada jalur komunikasi, serta pencatatan aktivitas (audit log) untuk mencegah akses yang tidak sah. Akses terhadap data individual dibatasi hanya untuk petugas yang berwenang.",
    ],
  },
  {
    title: "Pembagian Data kepada Pihak Lain",
    paras: [
      "Data SIPANDU tidak diperjualbelikan atau dibagikan kepada pihak komersial mana pun.",
      "Pembagian data hanya dilakukan kepada instansi pemerintah yang berwenang (antara lain Dinas Kesehatan, Dinas PMD, dan kementerian terkait) dalam rangka pelaporan resmi, serta dalam bentuk agregat/anonim untuk publikasi data publik seperti statistik pada halaman utama.",
    ],
  },
  {
    title: "Hak Anda atas Data",
    paras: ["Sebagai pengguna atau subjek data, Anda memiliki hak-hak berikut:"],
    bullets: [
      "Meminta akses dan salinan atas data pribadi Anda yang tercatat di SIPANDU.",
      "Meminta perbaikan data yang tidak akurat melalui kader atau petugas Posyandu setempat.",
      "Meminta penghapusan data pribadi sepanjang tidak bertentangan dengan kewajiban pencatatan yang diatur peraturan perundang-undangan.",
      "Mengajukan pertanyaan atau keberatan terkait pemrosesan data melalui kontak resmi kami.",
    ],
  },
  {
    title: "Cookie & Teknologi Serupa",
    paras: [
      "SIPANDU menggunakan cookie yang diperlukan untuk menjaga sesi login dan preferensi tampilan. Kami tidak menggunakan cookie pelacakan iklan pihak ketiga.",
      "Anda dapat mengatur atau menghapus cookie melalui pengaturan peramban, namun sebagian fitur (seperti sesi login) mungkin tidak berfungsi tanpa cookie tersebut.",
    ],
  },
  {
    title: "Perubahan Kebijakan",
    paras: [
      "Kebijakan privasi ini dapat diperbarui sewaktu-waktu mengikuti perkembangan regulasi dan layanan. Setiap perubahan akan dipublikasikan pada halaman ini beserta tanggal pembaruan terakhir.",
      "Kami menyarankan Anda meninjau halaman ini secara berkala.",
    ],
  },
  {
    title: "Kontak",
    paras: [
      "Untuk pertanyaan, permintaan, atau keberatan terkait kebijakan privasi ini, silakan hubungi pengelola SIPANDU melalui email info@sipandu-lamtim.id atau kantor Pemerintah Kabupaten Lampung Timur di Sukadana.",
    ],
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Kebijakan Privasi"
      subtitle="Komitmen kami dalam melindungi data Posyandu, kader, dan masyarakat Kabupaten Lampung Timur."
      updated="11 Juli 2026"
      sections={sections}
    />
  );
}
