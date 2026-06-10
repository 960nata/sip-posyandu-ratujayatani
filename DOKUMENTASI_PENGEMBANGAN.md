# Dokumentasi Pengembangan & Pembaruan Sistem Informasi Posyandu (SIP)

Dokumen ini menjelaskan seluruh pembaruan, peningkatan visual, sistem otorisasi, dan perbaikan konfigurasi yang telah diimplementasikan pada platform SIP Posyandu.

---

## 1. Galeri Kegiatan Landing Page (Double Marquee)
Peningkatan interaksi visual pada halaman utama (landing page) menggunakan efek scrolling ganda yang interaktif.
*   **Berkas terkait**: [src/app/page.tsx](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/app/page.tsx)
*   **Fitur**:
    *   **Marquee Ganda (Double Marquee)**: Dua baris berjalan dengan arah berlawanan untuk memberikan kesan dinamis (Baris pertama bergerak ke kiri `animate-marquee-left`, baris kedua bergerak ke kanan `animate-marquee-right`).
    *   **Pause on Hover**: Ketika pengguna mengarahkan kursor ke atas gambar, guliran otomatis akan terjeda sementara agar foto dapat dilihat dengan jelas.
    *   **Aset Riil**: Menggunakan koleksi foto kegiatan posyandu riil untuk representasi yang otentik.

---

## 2. Dual SK & Sistem Otorisasi API
Restrukturisasi tata kelola SK Kepengurusan menjadi dua tipe: **SK Desa** (`SK_DESA`) dan **SK Pengelola** (`SK_PENGELOLA`).
*   **Berkas terkait**:
    *   [prisma/schema.prisma](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/prisma/schema.prisma) (Kolom `tipe` ditambahkan ke model `SkKepengurusan` dengan default `SK_PENGELOLA`)
    *   [src/app/api/sk-kepengurusan/route.ts](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/app/api/sk-kepengurusan/route.ts)
    *   [src/app/api/sk-kepengurusan/[id]/route.ts](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/app/api/sk-kepengurusan/[id]/route.ts)
*   **Penerapan Keamanan API**:
    *   `OPERATOR_DESA`: Hanya dapat melakukan `POST` / `PUT` / `DELETE` untuk SK bertipe `SK_DESA` pada Posyandu yang terdaftar di dalam desanya.
    *   `OPERATOR_POSYANDU`: Hanya dapat melakukan `POST` / `PUT` / `DELETE` untuk SK bertipe `SK_PENGELOLA` pada Posyandu miliknya sendiri.
    *   Validasi kepemilikan wilayah (desa & posyandu) diterapkan secara ketat sebelum data disimpan ke database.

---

## 3. UI Control & Fitur Filter Dashboard SK
Halaman manajemen SK telah diperbarui agar adaptif terhadap hak akses pengguna.
*   **Berkas terkait**: [src/app/dashboard/sk-kepengurusan/page.tsx](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/app/dashboard/sk-kepengurusan/page.tsx)
*   **Pembaruan UI**:
    *   **Filter Jenis SK**: Menambahkan pilihan filter untuk menyaring daftar berdasarkan *Semua Jenis SK*, *SK Desa*, dan *SK Pengelola*.
    *   **Badge Indikator**: Setiap kartu SK dilengkapi badge visual berwarna (Hijau/Emerald untuk SK Desa dan Ungu/Purple untuk SK Pengelola).
    *   **Dropdown Pemilihan Posyandu**: Saat membuat SK baru, `OPERATOR_DESA` dapat memilih posyandu target melalui dropdown dinamis yang hanya menampilkan posyandu dalam cakupan desanya.
    *   **Otorisasi Tindakan (Read-Only State)**: Tombol Edit/Hapus dikontrol secara dinamis menggunakan helper `canModifySK(sk)` sehingga user tidak dapat memodifikasi SK yang bukan hak akses perannya (misal: Operator Desa tidak bisa mengedit SK Pengelola milik posyandu).

---

## 4. Keamanan & Kredensial Akun (Seeding Database)
Pembaruan pola sandi (password) default berdasarkan peran (role) untuk pengujian lingkungan lokal dan produksi yang lebih terstruktur.
*   **Berkas terkait**: [prisma/seed.ts](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/prisma/seed.ts)
*   **Daftar Password Default Baru**:
    *   `SUPERADMIN` ➔ `superadmin123`
    *   `ADMIN_KECAMATAN` ➔ `kecamatan123`
    *   `OPERATOR_DESA` ➔ `desa123`
    *   `OPERATOR_POSYANDU` ➔ `posyandu123`

---

## 5. Perbaikan Tata Letak (Layout & Grid CSS)
*   **Halaman Kelembagaan** ([src/app/kelembagaan/page.tsx](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/app/kelembagaan/page.tsx)):
    *   Kartu "Apresiasi Kader" disesuaikan menggunakan `grid-cols-2 md:grid-cols-4` agar tampil rapi dengan format grid 2x2 saat diakses menggunakan perangkat mobile.
    *   Memperbaiki kesalahan penulisan kelas pembungkus (`max-width-7xl` menjadi `max-w-7xl`).
*   **Halaman Panduan** ([src/app/panduan/page.tsx](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/app/panduan/page.tsx)):
    *   Menyusun ulang pembungkus elemen sehingga blok latar belakang abu-abu dapat merentang penuh selebar viewport layar (*full width*).

---

## 6. Solusi Server Configuration Error (NextAuth v5)
Mengatasi masalah crash server ("Server error / There is a problem with the server configuration") yang disebabkan oleh spesifikasi modul otentikasi.
*   **Berkas terkait**:
    *   [.env](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/.env)
    *   [src/auth.ts](file:///Users/indragandi/Developer/SIP%20SISTEM%20INFORMASI%20POSYANDU/web/src/auth.ts)
*   **Solusi**:
    *   NextAuth v5 membutuhkan variabel lingkungan `AUTH_SECRET` secara eksplisit. Kami menambahkan `AUTH_SECRET` di dalam berkas `.env`.
    *   Menambahkan fallback parameter `secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET` pada objek inisialisasi `NextAuth` di `src/auth.ts` untuk memastikan kestabilan otentikasi pada lingkungan hosting apa pun.

---

## 7. Status Pengujian & Kompilasi
Seluruh perubahan di atas telah melalui proses verifikasi otomatis:
1.  **TypeScript Check**: `npx tsc --noEmit` berhasil lulus 100% tanpa kesalahan kompilasi.
2.  **Production Build**: `npm run build` berhasil melakukan kompilasi bundel produksi Next.js dengan sukses tanpa hambatan.
3.  **Dev Server**: Berjalan lancar di port `:3002`.
