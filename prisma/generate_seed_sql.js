const { createId } = (() => {
  // Simple cuid-like ID generator
  let counter = 0
  return {
    createId: () => {
      counter++
      return 'seed' + Date.now().toString(36) + counter.toString(36).padStart(4, '0')
    }
  }
})()

const regionData = [
  { name: "Bandar Sribhawono", kode: "18.07.15", desas: ["Bandar Agung","Mekar Jaya","Sadar Sriwijaya","Sribhawono","Sri Menanti","Sri Pendowo","Waringin Jaya"] },
  { name: "Batanghari", kode: "18.07.06", desas: ["Adi Warno","Balai Kencono","Bale Rejo","Banarjoyo","Banjarrejo","Batangharjo","Buana Sakti","Bumiharjo","Bumi Mas","Nampi Rejo","Purwodadi Mekar","Rejoagung","Selorejo","Sri Basuki","Sumber Agung","Sumber Rejo","Telogorejo"] },
  { name: "Batanghari Nuban", kode: "18.07.13", desas: ["Bumi Jawa","Cempaka Nuban","Gedung Dalem","Gunung Tiga","Kedaton","Kedaton I","Kedaton II","Purwosari","Negara Ratu","Sukacari","Sukaraja Nuban","Trisnomulyo","Tulung Balak"] },
  { name: "Braja Slebah", kode: "18.07.22", desas: ["Braja Gemilang","Braja Harjosari","Braja Indah","Braja Kencana","Braja Luhur","Braja Mulya","Braja Yekti"] },
  { name: "Bumi Agung", kode: "18.07.14", desas: ["Bumi Tinggi","Catur Swako","Donomulyo","Lehan","Marga Mulya","Mulyo Asri","Nyampir"] },
  { name: "Gunung Pelindung", kode: "18.07.18", desas: ["Nibung","Negeri Agung","Pelindung Jaya","Pempen","Way Mili"] },
  { name: "Jabung", kode: "18.07.03", desas: ["Adiluhur","Adirejo","Asahan","Belimbing Sari","Benteng Sari","Gunung Mekar","Gunung Sugih Kecil","Jabung","Mekarjaya","Mumbang Jaya","Negara Batin","Negara Saka","Pematang Tahalo","Sambirejo","Tanjungsari"] },
  { name: "Labuhan Maringgai", kode: "18.07.02", desas: ["Bandar Negeri","Karang Anyar","Karya Makmur","Karya Tani","Labuhan Maringgai","Margasari","Maringgai","Muara Gading Mas","Srigading","Sri Minosari","Sukorahayu"] },
  { name: "Labuhan Ratu", kode: "18.07.21", desas: ["Labuhan Ratu","Labuhan Ratu III","Labuhan Ratu IV","Labuhan Ratu V","Labuhan Ratu VI","Labuhan Ratu VII","Labuhan Ratu VIII","Labuhan Ratu IX","Rajabasa Lama","Rajabasa Lama I","Rajabasa Lama II"] },
  { name: "Marga Sekampung", kode: "18.07.24", desas: ["Peniangan","Gunung Raya","Batu Badak","Giri Mulyo","Bungkuk","Gunung Mas","Purwosari","Bukit Raya"] },
  { name: "Marga Tiga", kode: "18.07.11", desas: ["Gedung Wani","Gedungwani Timur","Jaya Guna","Nabang Baru","Negeri Jemanten","Negeri Katon","Negeri Agung","Negeri Tua","Sukadana Baru","Sukaraja Tiga","Surya Mataram","Tanjung Harapan","Trisinar"] },
  { name: "Mataram Baru", kode: "18.07.16", desas: ["Kebon Damar","Mataram Baru","Mandala Sari","Rajabasa Baru","Teluk Dalem","Tulung Pasik","Way Areng"] },
  { name: "Melinting", kode: "18.07.17", desas: ["Itik Renday","Sido Makmur","Sumber Hadi","Tanjung Aji","Tebing","Wana"] },
  { name: "Metro Kibang", kode: "18.07.10", desas: ["Kibang","Jaya Asri","Marga Jaya","Margasari","Margototo","Purbosembodo","Sumber Agung"] },
  { name: "Pasir Sakti", kode: "18.07.19", desas: ["Kedung Ringin","Labuhan Ratu","Mekar Sari","Mulyo Sari","Pasir Sakti","Purworejo","Rejo Mulyo","Sumur Kucing"] },
  { name: "Pekalongan", kode: "18.07.04", desas: ["Adijaya","Adirejo","Ganti Warno","Gantimulyo","Gondangrejo","Jojog","Kalibening","Pekalongan","Sidodadi","Siraman","Tulusrejo","Wonosari"] },
  { name: "Purbolinggo", kode: "18.07.08", desas: ["Taman Asri","Taman Bogo","Taman Cari","Taman Dadi","Taman Endah","Taman Fajar","Tegal Gondo","Toto Harjo","Tanjung Inten","Tegal Yoso","Tanjung Kesuma","Tambah Luhur"] },
  { name: "Raman Utara", kode: "18.07.09", desas: ["Kota Raman","Rama Puja","Raman Aji","Raman Endra","Raman Fajar","Rantau Fajar","Ratna Daya","Rejo Binangun","Rejo Katon","Restu Rahayu","Rukti Sedyo"] },
  { name: "Sekampung", kode: "18.07.05", desas: ["Girikarto","Giriklopomulyo","Hargomulyo","Jadimulyo","Karyamukti","Mekarmukti","Mekar Mulyo","Mekar Sari","Sambikarto","Sidodadi","Sidomukti","Sidomulyo","Sukoharjo","Sumbergede","Sumbersari","Trimulyo","Wonokarto"] },
  { name: "Sekampung Udik", kode: "18.07.12", desas: ["Banjar Agung","Bauh Gunung Sari","Bojong","Brawijaya","Bumi Mulyo","Gunung Agung","Gunung Mulyo","Gunung Pasir Jaya","Gunung Sugih Besar","Mengandung Sari","Pugung Raharjo","Purwokencono","Sidorejo","Sindang Anom","Toba"] },
  { name: "Sukadana", kode: "18.07.01", desas: ["Bumi Ayu","Bumi Nabung Udik","Mataram Marga","Muara Jaya","Negara Nabung","Pakuan Aji","Pasar Sukadana","Putra Aji I","Putra Aji II","Rajabasa Batanghari","Rantau Jaya Udik","Rantau Jaya Udik II","Sukadana","Sukadana Ilir","Sukadana Jaya","Sukadana Selatan","Sukadana Tengah","Sukadana Timur","Sukadana Udik","Terbangi Marga"] },
  { name: "Way Bungur", kode: "18.07.23", desas: ["Kali Pasir","Taman Negeri","Tambah Subur","Tanjung Qencono","Tanjung Tirto","Tegal Ombo","Toto Mulyo","Toto Projo"] },
  { name: "Waway Karya", kode: "18.07.20", desas: ["Jembrana","Karang Anom","Karya Basuki","Marga Batin","Mekar Karya","Ngesti Karya","Sido Rahayu","Sumber Jaya","Sumber Rejo","Tanjung Wangi","Tri Tunggal"] },
  { name: "Way Jepara", kode: "18.07.07", desas: ["Braja Asri","Braja Caka","Braja Dewa","Braja Emas","Braja Fajar","Braja Sakti","Jepara","Labuhan Ratu I","Labuhan Ratu II","Labuhan Ratu Baru","Labuhan Ratu Danau","Sri Rejosari","Sri Wangi","Sumberejo","Sumber Marga","Sumur Bandung"] }
]

// bcrypt hashes of different passwords for each role — pre-computed
const HASH_SUPERADMIN = '$2b$10$snoQqPGp1ad3h.Ube/0c8OesbmWNajJwB8IQJgUOD1Xf7107Xag9q' // superadmin123
const HASH_KECAMATAN = '$2b$10$uhlk9V.Z/SYqaUKUHQUB/e9BMBKL93GAFFhKNDOJCIaIyrFK6OGoa' // kecamatan123
const HASH_DESA = '$2b$10$ILTP3l1dk57o9jTq3gOkEOMFTPt489g9KbgardEYQO3S26lbzvCUS' // desa123
const HASH_POSYANDU = '$2b$10$fTRnn92sdJnyxe84psiih.1mPpiqS5wTZJcCw6FpxzuyvybOMGYTy' // posyandu123

function esc(s) {
  return s.replace(/'/g, "''")
}

const lines = []
const migrations = [] // to keep backward compatibility
lines.push('BEGIN;')
lines.push('')

// Kabupaten
const kabId = createId()
lines.push(`INSERT INTO "Kabupaten" (id, nama, kode) VALUES ('${kabId}', 'Lampung Timur', '18.07') ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;`)
lines.push('')

// Superadmin
lines.push(`INSERT INTO "User" (id, nama, email, password, role, "isActive", "createdAt") VALUES ('${createId()}', 'Super Admin', 'admin@siplamtim.id', '${HASH_SUPERADMIN}', 'SUPERADMIN', true, NOW()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`)
lines.push('')

for (const kec of regionData) {
  const kecId = createId()
  lines.push(`-- Kecamatan: ${kec.name}`)
  lines.push(`INSERT INTO "Kecamatan" (id, nama, kode, "kabupatenId") VALUES ('${kecId}', '${esc(kec.name)}', '${kec.kode}', (SELECT id FROM "Kabupaten" WHERE kode = '18.07' LIMIT 1)) ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;`)

  // Admin kecamatan
  const kecEmail = `${kec.name.toLowerCase().replace(/\s+/g, '')}@siplamtim.id`
  lines.push(`INSERT INTO "User" (id, nama, email, password, role, "kecamatanId", "isActive", "createdAt") VALUES ('${createId()}', 'Admin Kec ${esc(kec.name)}', '${kecEmail}', '${HASH_KECAMATAN}', 'ADMIN_KECAMATAN', '${kecId}', true, NOW()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`)

  for (let i = 0; i < kec.desas.length; i++) {
    const desaName = kec.desas[i]
    const desaKode = `${kec.kode}.${String(i + 1).padStart(2, '0')}`
    const desaId = createId()

    lines.push(`INSERT INTO "Desa" (id, nama, kode, "kecamatanId") VALUES ('${desaId}', '${esc(desaName)}', '${desaKode}', '${kecId}') ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;`)

    // Operator desa
    const desaEmail = `desa.${desaName.toLowerCase().replace(/\s+/g, '')}@siplamtim.id`
    lines.push(`INSERT INTO "User" (id, nama, email, password, role, "desaId", "isActive", "createdAt") VALUES ('${createId()}', 'Admin Desa ${esc(desaName)}', '${desaEmail}', '${HASH_DESA}', 'OPERATOR_DESA', '${desaId}', true, NOW()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`)

    for (let p = 1; p <= 3; p++) {
      const posyanduName = `Posyandu ${desaName} ${p}`
      const posyanduId = `posyandu-${desaKode}-${p}`

      lines.push(`INSERT INTO "Posyandu" (id, "desaId", nama, "hariBuka", strata, "statusBangunan", "jumlahRumah", "jumlahKK", "jumlahPenduduk", "jumlahAnak05", "jumlahRemaja", "jumlahProduktif", "jumlahLansia", "jumlahDisabilitas", "danaSehatter", "jumlahKader", "createdAt", "updatedAt") VALUES ('${posyanduId}', '${desaId}', '${esc(posyanduName)}', 'Tgl 10', 'MANDIRI', 'MILIK_SENDIRI', 0, 0, 0, 0, 0, 0, 0, 0, false, 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;`)

      // Operator posyandu
      const posyanduEmail = `posyandu.${desaName.toLowerCase().replace(/\s+/g, '')}.${p}@siplamtim.id`
      lines.push(`INSERT INTO "User" (id, nama, email, password, role, "posyanduId", "isActive", "createdAt") VALUES ('${createId()}', 'Admin ${esc(posyanduName)}', '${posyanduEmail}', '${HASH_POSYANDU}', 'OPERATOR_POSYANDU', '${posyanduId}', true, NOW()) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;`)
    }
  }
  lines.push('')
}

lines.push('COMMIT;')

process.stdout.write(lines.join('\n'))
