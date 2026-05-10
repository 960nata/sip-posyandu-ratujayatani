-- CreateEnum
CREATE TYPE "StrataEnum" AS ENUM ('PRATAMA', 'MADYA', 'PURNAMA', 'MANDIRI');

-- CreateEnum
CREATE TYPE "StatusBangunanEnum" AS ENUM ('MILIK_SENDIRI', 'MENUMPANG');

-- CreateEnum
CREATE TYPE "JKEnum" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('SUPERADMIN', 'ADMIN_KECAMATAN', 'OPERATOR_DESA', 'VIEWER');

-- CreateEnum
CREATE TYPE "StatusLapEnum" AS ENUM ('TL', 'BTL', 'PROSES');

-- CreateEnum
CREATE TYPE "BidangEnum" AS ENUM ('POSYANDU', 'KES_SIP6', 'KES_SIP7', 'PENDIDIKAN', 'PU', 'PR', 'TRANTIB', 'SOSIAL');

-- CreateEnum
CREATE TYPE "KategoriSasaranEnum" AS ENUM ('IBU_HAMIL', 'BAYI_BALITA', 'REMAJA', 'LANSIA');

-- CreateTable
CREATE TABLE "Kabupaten" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL DEFAULT 'Lampung Timur',
    "kode" TEXT NOT NULL,

    CONSTRAINT "Kabupaten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kecamatan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "kabupatenId" TEXT NOT NULL,

    CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "kecamatanId" TEXT NOT NULL,

    CONSTRAINT "Desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posyandu" (
    "id" TEXT NOT NULL,
    "desaId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hariBuka" TEXT NOT NULL,
    "strata" "StrataEnum" NOT NULL,
    "jumlahRumah" INTEGER NOT NULL DEFAULT 0,
    "jumlahKK" INTEGER NOT NULL DEFAULT 0,
    "jumlahPenduduk" INTEGER NOT NULL DEFAULT 0,
    "jumlahAnak05" INTEGER NOT NULL DEFAULT 0,
    "jumlahRemaja" INTEGER NOT NULL DEFAULT 0,
    "jumlahProduktif" INTEGER NOT NULL DEFAULT 0,
    "jumlahLansia" INTEGER NOT NULL DEFAULT 0,
    "jumlahDisabilitas" INTEGER NOT NULL DEFAULT 0,
    "statusBangunan" "StatusBangunanEnum" NOT NULL,
    "danaSehatter" BOOLEAN NOT NULL DEFAULT false,
    "jumlahKader" INTEGER NOT NULL DEFAULT 0,
    "kegiatanIntegrasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sip6Bulanan" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "bayiBaruL" INTEGER NOT NULL DEFAULT 0,
    "bayiBaruP" INTEGER NOT NULL DEFAULT 0,
    "bayiLamaL" INTEGER NOT NULL DEFAULT 0,
    "bayiLamaP" INTEGER NOT NULL DEFAULT 0,
    "balitaBaruL" INTEGER NOT NULL DEFAULT 0,
    "balitaBaruP" INTEGER NOT NULL DEFAULT 0,
    "balitaLamaL" INTEGER NOT NULL DEFAULT 0,
    "balitaLamaP" INTEGER NOT NULL DEFAULT 0,
    "anakBaruL" INTEGER NOT NULL DEFAULT 0,
    "anakBaruP" INTEGER NOT NULL DEFAULT 0,
    "anakLamaL" INTEGER NOT NULL DEFAULT 0,
    "anakLamaP" INTEGER NOT NULL DEFAULT 0,
    "prodBaruL" INTEGER NOT NULL DEFAULT 0,
    "prodBaruP" INTEGER NOT NULL DEFAULT 0,
    "prodLamaL" INTEGER NOT NULL DEFAULT 0,
    "prodLamaP" INTEGER NOT NULL DEFAULT 0,
    "lansiaBaruL" INTEGER NOT NULL DEFAULT 0,
    "lansiaBaruP" INTEGER NOT NULL DEFAULT 0,
    "lansiaLamaL" INTEGER NOT NULL DEFAULT 0,
    "lansiaLamaP" INTEGER NOT NULL DEFAULT 0,
    "pus" INTEGER NOT NULL DEFAULT 0,
    "ibuHamil" INTEGER NOT NULL DEFAULT 0,
    "ibuMenyusui" INTEGER NOT NULL DEFAULT 0,
    "kaderL" INTEGER NOT NULL DEFAULT 0,
    "kaderP" INTEGER NOT NULL DEFAULT 0,
    "plkbL" INTEGER NOT NULL DEFAULT 0,
    "plkbP" INTEGER NOT NULL DEFAULT 0,
    "medisL" INTEGER NOT NULL DEFAULT 0,
    "medisP" INTEGER NOT NULL DEFAULT 0,
    "lahirL" INTEGER NOT NULL DEFAULT 0,
    "lahirP" INTEGER NOT NULL DEFAULT 0,
    "meninggalL" INTEGER NOT NULL DEFAULT 0,
    "meninggalP" INTEGER NOT NULL DEFAULT 0,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sip6Bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SasaranIndividu" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "kategori" "KategoriSasaranEnum" NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JKEnum",
    "tanggalLahir" TIMESTAMP(3),
    "namaIbu" TEXT,
    "namaAyah" TEXT,
    "namaSuami" TEXT,
    "namaBayi" TEXT,
    "tahun" INTEGER NOT NULL,
    "jan" BOOLEAN NOT NULL DEFAULT false,
    "feb" BOOLEAN NOT NULL DEFAULT false,
    "mar" BOOLEAN NOT NULL DEFAULT false,
    "apr" BOOLEAN NOT NULL DEFAULT false,
    "mei" BOOLEAN NOT NULL DEFAULT false,
    "jun" BOOLEAN NOT NULL DEFAULT false,
    "jul" BOOLEAN NOT NULL DEFAULT false,
    "agu" BOOLEAN NOT NULL DEFAULT false,
    "sep" BOOLEAN NOT NULL DEFAULT false,
    "okt" BOOLEAN NOT NULL DEFAULT false,
    "nov" BOOLEAN NOT NULL DEFAULT false,
    "des" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SasaranIndividu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sip7Bulanan" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "jmlBumil" INTEGER NOT NULL DEFAULT 0,
    "bumilDiperiksa" INTEGER NOT NULL DEFAULT 0,
    "bumilFeTab" INTEGER NOT NULL DEFAULT 0,
    "jmlBusui" INTEGER NOT NULL DEFAULT 0,
    "kbKondom" INTEGER NOT NULL DEFAULT 0,
    "kbPil" INTEGER NOT NULL DEFAULT 0,
    "kbImplant" INTEGER NOT NULL DEFAULT 0,
    "kbMOP" INTEGER NOT NULL DEFAULT 0,
    "kbMOW" INTEGER NOT NULL DEFAULT 0,
    "kbIUD" INTEGER NOT NULL DEFAULT 0,
    "kbSuntik" INTEGER NOT NULL DEFAULT 0,
    "kbLainnya" INTEGER NOT NULL DEFAULT 0,
    "balitaS_L" INTEGER NOT NULL DEFAULT 0,
    "balitaS_P" INTEGER NOT NULL DEFAULT 0,
    "balitaK_L" INTEGER NOT NULL DEFAULT 0,
    "balitaK_P" INTEGER NOT NULL DEFAULT 0,
    "balitaD_L" INTEGER NOT NULL DEFAULT 0,
    "balitaD_P" INTEGER NOT NULL DEFAULT 0,
    "balitaN_L" INTEGER NOT NULL DEFAULT 0,
    "balitaN_P" INTEGER NOT NULL DEFAULT 0,
    "vitA_L" INTEGER NOT NULL DEFAULT 0,
    "vitA_P" INTEGER NOT NULL DEFAULT 0,
    "pmt_L" INTEGER NOT NULL DEFAULT 0,
    "pmt_P" INTEGER NOT NULL DEFAULT 0,
    "imTT" INTEGER NOT NULL DEFAULT 0,
    "imBCG_L" INTEGER NOT NULL DEFAULT 0,
    "imBCG_P" INTEGER NOT NULL DEFAULT 0,
    "imDPT1_L" INTEGER NOT NULL DEFAULT 0,
    "imDPT1_P" INTEGER NOT NULL DEFAULT 0,
    "imDPT2_L" INTEGER NOT NULL DEFAULT 0,
    "imDPT2_P" INTEGER NOT NULL DEFAULT 0,
    "imDPT3_L" INTEGER NOT NULL DEFAULT 0,
    "imDPT3_P" INTEGER NOT NULL DEFAULT 0,
    "imPolio1_L" INTEGER NOT NULL DEFAULT 0,
    "imPolio1_P" INTEGER NOT NULL DEFAULT 0,
    "imPolio2_L" INTEGER NOT NULL DEFAULT 0,
    "imPolio2_P" INTEGER NOT NULL DEFAULT 0,
    "imPolio3_L" INTEGER NOT NULL DEFAULT 0,
    "imPolio3_P" INTEGER NOT NULL DEFAULT 0,
    "imPolio4_L" INTEGER NOT NULL DEFAULT 0,
    "imPolio4_P" INTEGER NOT NULL DEFAULT 0,
    "imCampak_L" INTEGER NOT NULL DEFAULT 0,
    "imCampak_P" INTEGER NOT NULL DEFAULT 0,
    "imHepB1_L" INTEGER NOT NULL DEFAULT 0,
    "imHepB1_P" INTEGER NOT NULL DEFAULT 0,
    "imHepB2_L" INTEGER NOT NULL DEFAULT 0,
    "imHepB2_P" INTEGER NOT NULL DEFAULT 0,
    "imHepB3_L" INTEGER NOT NULL DEFAULT 0,
    "imHepB3_P" INTEGER NOT NULL DEFAULT 0,
    "diareJml_L" INTEGER NOT NULL DEFAULT 0,
    "diareJml_P" INTEGER NOT NULL DEFAULT 0,
    "diareOralit_L" INTEGER NOT NULL DEFAULT 0,
    "diareOralit_P" INTEGER NOT NULL DEFAULT 0,
    "rekapBumil" JSONB,
    "rekapBalita" JSONB,
    "rekapRemaja" JSONB,
    "rekapLansia" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sip7Bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanPengaduan" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "bidang" "BidangEnum" NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "nik" TEXT,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "halPengaduan" TEXT NOT NULL,
    "keteranganTL" TEXT,
    "keteranganBTL" TEXT,
    "status" "StatusLapEnum" NOT NULL DEFAULT 'BTL',
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaporanPengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanPR" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT,
    "alamat" TEXT,
    "keteranganPermohonan" TEXT,
    "fcKK" BOOLEAN NOT NULL DEFAULT false,
    "fcKTP" BOOLEAN NOT NULL DEFAULT false,
    "suratPermohonan" BOOLEAN NOT NULL DEFAULT false,
    "suketPenghasilan" BOOLEAN NOT NULL DEFAULT false,
    "fotoKondisiRumah" BOOLEAN NOT NULL DEFAULT false,
    "keteranganTL" TEXT,
    "keteranganBTL" TEXT,
    "status" "StatusLapEnum" NOT NULL DEFAULT 'BTL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaporanPR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataDukung" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT,
    "laporanId" TEXT,
    "laporanPRId" TEXT,
    "bidang" "BidangEnum" NOT NULL,
    "kategori" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "thumbnail" TEXT,
    "keterangan" TEXT,
    "periode" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataDukung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL,
    "desaId" TEXT,
    "kecamatanId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kabupaten_kode_key" ON "Kabupaten"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Kecamatan_kode_key" ON "Kecamatan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Desa_kode_key" ON "Desa"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Sip6Bulanan_posyanduId_tahun_bulan_key" ON "Sip6Bulanan"("posyanduId", "tahun", "bulan");

-- CreateIndex
CREATE UNIQUE INDEX "Sip7Bulanan_posyanduId_tahun_bulan_key" ON "Sip7Bulanan"("posyanduId", "tahun", "bulan");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Kecamatan" ADD CONSTRAINT "Kecamatan_kabupatenId_fkey" FOREIGN KEY ("kabupatenId") REFERENCES "Kabupaten"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Desa" ADD CONSTRAINT "Desa_kecamatanId_fkey" FOREIGN KEY ("kecamatanId") REFERENCES "Kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posyandu" ADD CONSTRAINT "Posyandu_desaId_fkey" FOREIGN KEY ("desaId") REFERENCES "Desa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sip6Bulanan" ADD CONSTRAINT "Sip6Bulanan_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sip7Bulanan" ADD CONSTRAINT "Sip7Bulanan_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanPengaduan" ADD CONSTRAINT "LaporanPengaduan_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanPR" ADD CONSTRAINT "LaporanPR_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDukung" ADD CONSTRAINT "DataDukung_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDukung" ADD CONSTRAINT "DataDukung_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanPengaduan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDukung" ADD CONSTRAINT "DataDukung_laporanPRId_fkey" FOREIGN KEY ("laporanPRId") REFERENCES "LaporanPR"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_desaId_fkey" FOREIGN KEY ("desaId") REFERENCES "Desa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
