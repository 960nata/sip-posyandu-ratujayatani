// Sumber tunggal daftar tahun untuk seluruh aplikasi.
// Rentang: TAHUN_MULAI s/d (tahun berjalan + 1) — agar data tahun depan
// bisa diinput lebih awal. Otomatis bertambah tiap pergantian tahun,
// TANPA perlu ubah kode.
export const TAHUN_MULAI = 2024

export function getTahunList(): number[] {
  const akhir = new Date().getFullYear() + 1
  const mulai = Math.min(TAHUN_MULAI, akhir)
  const list: number[] = []
  for (let y = mulai; y <= akhir; y++) list.push(y)
  return list
}

// Tahun aktif default: tahun berjalan (dipakai bila belum ada pilihan tersimpan)
export function getTahunDefault(): number {
  return new Date().getFullYear()
}
