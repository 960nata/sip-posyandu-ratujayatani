-- CreateEnum
CREATE TYPE "JabatanSKEnum" AS ENUM ('KETUA', 'SEKRETARIS', 'BENDAHARA', 'KETUA_BIDANG', 'KADER');

-- CreateTable
CREATE TABLE "SkKepengurusan" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "nomorSK" TEXT NOT NULL,
    "tanggalPenetapan" TIMESTAMP(3) NOT NULL,
    "pejabatPenetap" TEXT NOT NULL,
    "periodeAwal" TIMESTAMP(3) NOT NULL,
    "periodeAkhir" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkKepengurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnggotaSK" (
    "id" TEXT NOT NULL,
    "skId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" "JabatanSKEnum" NOT NULL,
    "bidang" TEXT,
    "nikNip" TEXT,
    "alamat" TEXT,
    "noHP" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnggotaSK_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkKepengurusan" ADD CONSTRAINT "SkKepengurusan_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaSK" ADD CONSTRAINT "AnggotaSK_skId_fkey" FOREIGN KEY ("skId") REFERENCES "SkKepengurusan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
