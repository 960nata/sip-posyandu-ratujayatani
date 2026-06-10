import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding SIP 6 & SIP 7 data...')

  // Find some posyandus to attach data to
  const posyandus = await prisma.posyandu.findMany({ take: 15 })
  
  for (const posyandu of posyandus) {
    console.log(`Seeding data for ${posyandu.nama}`)
    
    // Seed 12 months for 2025 and 2026
    for (const tahun of [2025, 2026]) {
      for (let bulan = 1; bulan <= 12; bulan++) {
        // base values that vary slightly by month
        const modifier = (bulan % 3) * 2 + (tahun === 2026 ? 5 : 0)
        
        await prisma.sip6Bulanan.upsert({
          where: {
            posyanduId_tahun_bulan: {
              posyanduId: posyandu.id,
              tahun,
              bulan
            }
          },
          update: {},
          create: {
            posyanduId: posyandu.id,
            tahun,
            bulan,
            bayiBaruL: 2 + modifier,
            bayiBaruP: 3 + modifier,
            bayiLamaL: 20 + modifier,
            bayiLamaP: 18 + modifier,
            balitaBaruL: 5 + modifier,
            balitaBaruP: 4 + modifier,
            balitaLamaL: 60 + modifier,
            balitaLamaP: 58 + modifier,
            lansiaBaruL: 8 + modifier,
            lansiaBaruP: 10 + modifier,
            lansiaLamaL: 40 + modifier,
            lansiaLamaP: 42 + modifier,
            pus: 110 + modifier,
            ibuHamil: 20 + modifier,
            ibuMenyusui: 15 + modifier,
            kaderL: 2,
            kaderP: 5,
            plkbL: 1,
            plkbP: 1,
            medisL: 1,
            medisP: 2,
            lahirL: 1,
            lahirP: 0,
            meninggalL: 0,
            meninggalP: 0,
          }
        })

        await prisma.sip7Bulanan.upsert({
          where: {
            posyanduId_tahun_bulan: {
              posyanduId: posyandu.id,
              tahun,
              bulan
            }
          },
          update: {},
          create: {
            posyanduId: posyandu.id,
            tahun,
            bulan,
            jmlBumil: 20 + modifier,
            bumilDiperiksa: 18 + modifier,
            bumilFeTab: 18 + modifier,
            jmlBusui: 15 + modifier,
            kbKondom: 5 + modifier,
            kbPil: 40 + modifier,
            kbImplant: 30 + modifier,
            kbMOP: 0,
            kbMOW: 1,
            kbIUD: 2,
            kbSuntik: 98 + modifier,
            kbLainnya: 0,
            balitaS_L: 108 + modifier,
            balitaS_P: 108 + modifier,
            balitaK_L: 108 + modifier,
            balitaK_P: 108 + modifier,
            balitaD_L: 80 + modifier,
            balitaD_P: 92 + modifier,
            balitaN_L: 76 + modifier,
            balitaN_P: 60 + modifier,
            vitA_L: 50 + modifier,
            vitA_P: 50 + modifier,
            pmt_L: 108 + modifier,
            pmt_P: 108 + modifier,
            imTT: 2,
            imBCG_L: 2,
            imBCG_P: 2,
          }
        })
      }
    }
  }

  console.log('SIP 6 & SIP 7 seeding complete!')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
