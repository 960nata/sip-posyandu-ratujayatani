# Daftar Akun & Kredensial Pengguna SIP Posyandu

Dokumen ini berisi daftar pola pembuatan akun dan kredensial default hasil *seeding* database untuk lingkungan pengembangan (*development*) dan produksi (*production*).

---

## 🔑 Informasi Kredensial Utama (Password Default)

| Peran (Role) | Password Default |
| :--- | :--- |
| **SUPERADMIN** | `superadmin123` |
| **ADMIN_KECAMATAN** | `kecamatan123` |
| **OPERATOR_DESA** | `desa123` |
| **OPERATOR_POSYANDU** | `posyandu123` |

---

## 📌 1. Akun Tingkat Superadmin

| Nama Akun | Email | Role | Password |
| :--- | :--- | :--- | :--- |
| Super Admin | `admin@siplamtim.id` | `SUPERADMIN` | `superadmin123` |

---

## 📌 2. Pola Penamaan Akun & Email (Templat Dinamis)

Karena sistem memuat **24 Kecamatan**, **264 Desa**, dan **792 Posyandu** di Kabupaten Lampung Timur, pembuatan akun menggunakan aturan otomatis sebagai berikut:

### A. Tingkat Kecamatan (`ADMIN_KECAMATAN`)
*   **Nama**: `Admin Kec [Nama Kecamatan]`
*   **Email**: `[nama_kecamatan_tanpa_spasi_huruf_kecil]@siplamtim.id`
*   *Contoh*:
    *   Kecamatan *Bandar Sribhawono* ➔ `bandarsribhawono@siplamtim.id`
    *   Kecamatan *Labuhan Maringgai* ➔ `labuhanmaringgai@siplamtim.id`

### B. Tingkat Desa (`OPERATOR_DESA`)
*   **Nama**: `Admin Desa [Nama Desa]`
*   **Email**: `desa.[nama_desa_tanpa_spasi_huruf_kecil]@siplamtim.id`
*   *Contoh*:
    *   Desa *Bandar Agung* ➔ `desa.bandaragung@siplamtim.id`
    *   Desa *Rajabasa Lama* ➔ `desa.rajabasalama@siplamtim.id`

### C. Tingkat Posyandu (`OPERATOR_POSYANDU`)
Setiap desa otomatis memiliki **3 Posyandu** (bernomor `1`, `2`, dan `3`).
*   **Nama Posyandu**: `Posyandu [Nama Desa] [Nomor]`
*   **Nama Akun**: `Admin Posyandu [Nama Desa] [Nomor]`
*   **Email**: `posyandu.[nama_desa_tanpa_spasi_huruf_kecil].[Nomor]@siplamtim.id`
*   *Contoh*:
    *   Posyandu 1 di Bandar Agung ➔ `posyandu.bandaragung.1@siplamtim.id`
    *   Posyandu 3 di Waringin Jaya ➔ `posyandu.waringinjaya.3@siplamtim.id`

---

## 📋 3. Contoh Daftar Akun Lengkap (Kecamatan Contoh)

Berikut adalah daftar lengkap akun siap pakai untuk beberapa wilayah sampel:

### 🌟 Sampel Wilayah 1: Kecamatan Bandar Sribhawono
*   **Kecamatan Email**: `bandarsribhawono@siplamtim.id` | Password: `kecamatan123`

| Desa | Nama Posyandu | Akun Operator Desa (Password: `desa123`) | Akun Operator Posyandu (Password: `posyandu123`) |
| :--- | :--- | :--- | :--- |
| **Bandar Agung** | Posyandu Bandar Agung 1<br>Posyandu Bandar Agung 2<br>Posyandu Bandar Agung 3 | `desa.bandaragung@siplamtim.id` | `posyandu.bandaragung.1@siplamtim.id`<br>`posyandu.bandaragung.2@siplamtim.id`<br>`posyandu.bandaragung.3@siplamtim.id` |
| **Mekar Jaya** | Posyandu Mekar Jaya 1<br>Posyandu Mekar Jaya 2<br>Posyandu Mekar Jaya 3 | `desa.mekarjaya@siplamtim.id` | `posyandu.mekarjaya.1@siplamtim.id`<br>`posyandu.mekarjaya.2@siplamtim.id`<br>`posyandu.mekarjaya.3@siplamtim.id` |
| **Sadar Sriwijaya** | Posyandu Sadar Sriwijaya 1<br>Posyandu Sadar Sriwijaya 2<br>Posyandu Sadar Sriwijaya 3 | `desa.sadarsriwijaya@siplamtim.id` | `posyandu.sadarsriwijaya.1@siplamtim.id`<br>`posyandu.sadarsriwijaya.2@siplamtim.id`<br>`posyandu.sadarsriwijaya.3@siplamtim.id` |
| **Waringin Jaya** | Posyandu Waringin Jaya 1<br>Posyandu Waringin Jaya 2<br>Posyandu Waringin Jaya 3 | `desa.waringinjaya@siplamtim.id` | `posyandu.waringinjaya.1@siplamtim.id`<br>`posyandu.waringinjaya.2@siplamtim.id`<br>`posyandu.waringinjaya.3@siplamtim.id` |

### 🌟 Sampel Wilayah 2: Kecamatan Sukadana
*   **Kecamatan Email**: `sukadana@siplamtim.id` | Password: `kecamatan123`

| Desa | Nama Posyandu | Akun Operator Desa (Password: `desa123`) | Akun Operator Posyandu (Password: `posyandu123`) |
| :--- | :--- | :--- | :--- |
| **Bumi Ayu** | Posyandu Bumi Ayu 1<br>Posyandu Bumi Ayu 2<br>Posyandu Bumi Ayu 3 | `desa.bumiayu@siplamtim.id` | `posyandu.bumiayu.1@siplamtim.id`<br>`posyandu.bumiayu.2@siplamtim.id`<br>`posyandu.bumiayu.3@siplamtim.id` |
| **Pasar Sukadana** | Posyandu Pasar Sukadana 1<br>Posyandu Pasar Sukadana 2<br>Posyandu Pasar Sukadana 3 | `desa.pasarsukadana@siplamtim.id` | `posyandu.pasarsukadana.1@siplamtim.id`<br>`posyandu.pasarsukadana.2@siplamtim.id`<br>`posyandu.pasarsukadana.3@siplamtim.id` |
| **Rantau Jaya Udik** | Posyandu Rantau Jaya Udik 1<br>Posyandu Rantau Jaya Udik 2<br>Posyandu Rantau Jaya Udik 3 | `desa.rantaujayaudik@siplamtim.id` | `posyandu.rantaujayaudik.1@siplamtim.id`<br>`posyandu.rantaujayaudik.2@siplamtim.id`<br>`posyandu.rantaujayaudik.3@siplamtim.id` |
| **Sukadana** | Posyandu Sukadana 1<br>Posyandu Sukadana 2<br>Posyandu Sukadana 3 | `desa.sukadana@siplamtim.id` | `posyandu.sukadana.1@siplamtim.id`<br>`posyandu.sukadana.2@siplamtim.id`<br>`posyandu.sukadana.3@siplamtim.id` |

---

## 🛠️ Cara Melakukan Seeding Ulang (Jika Diperlukan)
Untuk memuat ulang data di atas ke database PostgreSQL lokal/produksi, jalankan perintah berikut:
```bash
npx prisma db seed
```
atau menggunakan skrip migrasi lengkap:
```bash
npx prisma migrate dev
```
