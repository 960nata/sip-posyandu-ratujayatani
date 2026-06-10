import { PrismaClient, RoleEnum, StrataEnum, StatusBangunanEnum } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const regionData = [
  {
    "name": "Bandar Sribhawono",
    "kode": "18.07.15",
    "desas": ["Bandar Agung", "Mekar Jaya", "Sadar Sriwijaya", "Sribhawono", "Sri Menanti", "Sri Pendowo", "Waringin Jaya"]
  },
  {
    "name": "Batanghari",
    "kode": "18.07.06",
    "desas": ["Adi Warno", "Balai Kencono", "Bale Rejo", "Banarjoyo", "Banjarrejo", "Batangharjo", "Buana Sakti", "Bumiharjo", "Bumi Mas", "Nampi Rejo", "Purwodadi Mekar", "Rejoagung", "Selorejo", "Sri Basuki", "Sumber Agung", "Sumber Rejo", "Telogorejo"]
  },
  {
    "name": "Batanghari Nuban",
    "kode": "18.07.13",
    "desas": ["Bumi Jawa", "Cempaka Nuban", "Gedung Dalem", "Gunung Tiga", "Kedaton", "Kedaton I", "Kedaton II", "Purwosari", "Negara Ratu", "Sukacari", "Sukaraja Nuban", "Trisnomulyo", "Tulung Balak"]
  },
  {
    "name": "Braja Slebah",
    "kode": "18.07.22",
    "desas": ["Braja Gemilang", "Braja Harjosari", "Braja Indah", "Braja Kencana", "Braja Luhur", "Braja Mulya", "Braja Yekti"]
  },
  {
    "name": "Bumi Agung",
    "kode": "18.07.14",
    "desas": ["Bumi Tinggi", "Catur Swako", "Donomulyo", "Lehan", "Marga Mulya", "Mulyo Asri", "Nyampir"]
  },
  {
    "name": "Gunung Pelindung",
    "kode": "18.07.18",
    "desas": ["Nibung", "Negeri Agung", "Pelindung Jaya", "Pempen", "Way Mili"]
  },
  {
    "name": "Jabung",
    "kode": "18.07.03",
    "desas": ["Adiluhur", "Adirejo", "Asahan", "Belimbing Sari", "Benteng Sari", "Gunung Mekar", "Gunung Sugih Kecil", "Jabung", "Mekarjaya", "Mumbang Jaya", "Negara Batin", "Negara Saka", "Pematang Tahalo", "Sambirejo", "Tanjungsari"]
  },
  {
    "name": "Labuhan Maringgai",
    "kode": "18.07.02",
    "desas": ["Bandar Negeri", "Karang Anyar", "Karya Makmur", "Karya Tani", "Labuhan Maringgai", "Margasari", "Maringgai", "Muara Gading Mas", "Srigading", "Sri Minosari", "Sukorahayu"]
  },
  {
    "name": "Labuhan Ratu",
    "kode": "18.07.21",
    "desas": ["Labuhan Ratu", "Labuhan Ratu III", "Labuhan Ratu IV", "Labuhan Ratu V", "Labuhan Ratu VI", "Labuhan Ratu VII", "Labuhan Ratu VIII", "Labuhan Ratu IX", "Rajabasa Lama", "Rajabasa Lama I", "Rajabasa Lama II"]
  },
  {
    "name": "Marga Sekampung",
    "kode": "18.07.24",
    "desas": ["Peniangan", "Gunung Raya", "Batu Badak", "Giri Mulyo", "Bungkuk", "Gunung Mas", "Purwosari", "Bukit Raya"]
  },
  {
    "name": "Marga Tiga",
    "kode": "18.07.11",
    "desas": ["Gedung Wani", "Gedungwani Timur", "Jaya Guna", "Nabang Baru", "Negeri Jemanten", "Negeri Katon", "Negeri Agung", "Negeri Tua", "Sukadana Baru", "Sukaraja Tiga", "Surya Mataram", "Tanjung Harapan", "Trisinar"]
  },
  {
    "name": "Mataram Baru",
    "kode": "18.07.16",
    "desas": ["Kebon Damar", "Mataram Baru", "Mandala Sari", "Rajabasa Baru", "Teluk Dalem", "Tulung Pasik", "Way Areng"]
  },
  {
    "name": "Melinting",
    "kode": "18.07.17",
    "desas": ["Itik Renday", "Sido Makmur", "Sumber Hadi", "Tanjung Aji", "Tebing", "Wana"]
  },
  {
    "name": "Metro Kibang",
    "kode": "18.07.10",
    "desas": ["Kibang", "Jaya Asri", "Marga Jaya", "Margasari", "Margototo", "Purbosembodo", "Sumber Agung"]
  },
  {
    "name": "Pasir Sakti",
    "kode": "18.07.19",
    "desas": ["Kedung Ringin", "Labuhan Ratu", "Mekar Sari", "Mulyo Sari", "Pasir Sakti", "Purworejo", "Rejo Mulyo", "Sumur Kucing"]
  },
  {
    "name": "Pekalongan",
    "kode": "18.07.04",
    "desas": ["Adijaya", "Adirejo", "Ganti Warno", "Gantimulyo", "Gondangrejo", "Jojog", "Kalibening", "Pekalongan", "Sidodadi", "Siraman", "Tulusrejo", "Wonosari"]
  },
  {
    "name": "Purbolinggo",
    "kode": "18.07.08",
    "desas": ["Taman Asri", "Taman Bogo", "Taman Cari", "Taman Dadi", "Taman Endah", "Taman Fajar", "Tegal Gondo", "Toto Harjo", "Tanjung Inten", "Tegal Yoso", "Tanjung Kesuma", "Tambah Luhur"]
  },
  {
    "name": "Raman Utara",
    "kode": "18.07.09",
    "desas": ["Kota Raman", "Rama Puja", "Raman Aji", "Raman Endra", "Raman Fajar", "Rantau Fajar", "Ratna Daya", "Rejo Binangun", "Rejo Katon", "Restu Rahayu", "Rukti Sedyo"]
  },
  {
    "name": "Sekampung",
    "kode": "18.07.05",
    "desas": ["Girikarto", "Giriklopomulyo", "Hargomulyo", "Jadimulyo", "Karyamukti", "Mekarmukti", "Mekar Mulyo", "Mekar Sari", "Sambikarto", "Sidodadi", "Sidomukti", "Sidomulyo", "Sukoharjo", "Sumbergede", "Sumbersari", "Trimulyo", "Wonokarto"]
  },
  {
    "name": "Sekampung Udik",
    "kode": "18.07.12",
    "desas": ["Banjar Agung", "Bauh Gunung Sari", "Bojong", "Brawijaya", "Bumi Mulyo", "Gunung Agung", "Gunung Mulyo", "Gunung Pasir Jaya", "Gunung Sugih Besar", "Mengandung Sari", "Pugung Raharjo", "Purwokencono", "Sidorejo", "Sindang Anom", "Toba"]
  },
  {
    "name": "Sukadana",
    "kode": "18.07.01",
    "desas": ["Bumi Ayu", "Bumi Nabung Udik", "Mataram Marga", "Muara Jaya", "Negara Nabung", "Pakuan Aji", "Pasar Sukadana", "Putra Aji I", "Putra Aji II", "Rajabasa Batanghari", "Rantau Jaya Udik", "Rantau Jaya Udik II", "Sukadana", "Sukadana Ilir", "Sukadana Jaya", "Sukadana Selatan", "Sukadana Tengah", "Sukadana Timur", "Sukadana Udik", "Terbangi Marga"]
  },
  {
    "name": "Way Bungur",
    "kode": "18.07.23",
    "desas": ["Kali Pasir", "Taman Negeri", "Tambah Subur", "Tanjung Qencono", "Tanjung Tirto", "Tegal Ombo", "Toto Mulyo", "Toto Projo"]
  },
  {
    "name": "Waway Karya",
    "kode": "18.07.20",
    "desas": ["Jembrana", "Karang Anom", "Karya Basuki", "Marga Batin", "Mekar Karya", "Ngesti Karya", "Sido Rahayu", "Sumber Jaya", "Sumber Rejo", "Tanjung Wangi", "Tri Tunggal"]
  },
  {
    "name": "Way Jepara",
    "kode": "18.07.07",
    "desas": ["Braja Asri", "Braja Caka", "Braja Dewa", "Braja Emas", "Braja Fajar", "Braja Sakti", "Jepara", "Labuhan Ratu I", "Labuhan Ratu II", "Labuhan Ratu Baru", "Labuhan Ratu Danau", "Sri Rejosari", "Sri Wangi", "Sumberejo", "Sumber Marga", "Sumur Bandung"]
  }
]

async function main() {
  console.log('Seeding database...')

  const hashedSuperadmin = await bcrypt.hash('superadmin123', 10)
  const hashedKecamatan = await bcrypt.hash('kecamatan123', 10)
  const hashedDesa = await bcrypt.hash('desa123', 10)
  const hashedPosyandu = await bcrypt.hash('posyandu123', 10)

  // 1. Create Kabupaten
  const kab = await prisma.kabupaten.upsert({
    where: { kode: '18.07' },
    update: {},
    create: {
      nama: 'Lampung Timur',
      kode: '18.07',
    },
  })

  // Create Default Superadmin
  await prisma.user.upsert({
    where: { email: 'admin@siplamtim.id' },
    update: { password: hashedSuperadmin },
    create: {
      nama: 'Super Admin',
      email: 'admin@siplamtim.id',
      password: hashedSuperadmin,
      role: RoleEnum.SUPERADMIN,
    },
  })

  for (const kec of regionData) {
    console.log(`Processing Kecamatan: ${kec.name}`)
    
    const kecamatan = await prisma.kecamatan.upsert({
      where: { kode: kec.kode },
      update: {},
      create: {
        nama: kec.name,
        kode: kec.kode,
        kabupatenId: kab.id,
      },
    })

    // Create Admin Kecamatan
    const kecEmail = `${kec.name.toLowerCase().replace(/\s+/g, '')}@siplamtim.id`
    await prisma.user.upsert({
      where: { email: kecEmail },
      update: { password: hashedKecamatan },
      create: {
        nama: `Admin Kec ${kec.name}`,
        email: kecEmail,
        password: hashedKecamatan,
        role: RoleEnum.ADMIN_KECAMATAN,
        kecamatanId: kecamatan.id,
      },
    })

    for (let i = 0; i < kec.desas.length; i++) {
      const desaName = kec.desas[i]
      const desaKode = `${kec.kode}.${String(i + 1).padStart(2, '0')}`
      
      const desa = await prisma.desa.upsert({
        where: { kode: desaKode },
        update: {},
        create: {
          nama: desaName,
          kode: desaKode,
          kecamatanId: kecamatan.id,
        },
      })
      // Create Account for this Desa
      const desaEmail = `desa.${desaName.toLowerCase().replace(/\s+/g, '')}@siplamtim.id`
      await prisma.user.upsert({
        where: { email: desaEmail },
        update: { password: hashedDesa },
        create: {
          nama: `Admin Desa ${desaName}`,
          email: desaEmail,
          password: hashedDesa,
          role: RoleEnum.OPERATOR_DESA,
          desaId: desa.id,
        } as any,
      })

      // Create 3 Posyandus for each Desa
      for (let p = 1; p <= 3; p++) {
        const posyanduName = `Posyandu ${desaName} ${p}`
        const posyanduId = `posyandu-${desaKode}-${p}`
        
        await prisma.posyandu.upsert({
          where: { id: posyanduId },
          update: {},
          create: {
            id: posyanduId,
            desaId: desa.id,
            nama: posyanduName,
            hariBuka: 'Tgl 10',
            strata: StrataEnum.MANDIRI,
            statusBangunan: StatusBangunanEnum.MILIK_SENDIRI,
          },
        })

        // Create Account for this Posyandu
        const posyanduEmail = `posyandu.${desaName.toLowerCase().replace(/\s+/g, '')}.${p}@siplamtim.id`
        await prisma.user.upsert({
          where: { email: posyanduEmail },
          update: { password: hashedPosyandu },
          create: {
            nama: `Admin ${posyanduName}`,
            email: posyanduEmail,
            password: hashedPosyandu,
            role: "OPERATOR_POSYANDU",
            posyanduId: posyanduId,
          } as any,
        })
      }
    }
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
