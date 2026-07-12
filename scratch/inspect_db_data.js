const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const desa = await prisma.desa.findFirst({
    where: { nama: { contains: 'Tulusrejo', mode: 'insensitive' } },
    include: {
      posyandus: {
        include: {
          sip6s: { orderBy: { bulan: 'asc' } },
          sip7s: { orderBy: { bulan: 'asc' } }
        }
      }
    }
  });

  if (!desa) {
    console.log('Desa Tulus Rejo not found.');
    return;
  }

  console.log(`Desa: ${desa.nama} (ID: ${desa.id})`);
  console.log(`Posyandus count: ${desa.posyandus.length}`);
  
  desa.posyandus.forEach(p => {
    console.log(`\nPosyandu: ${p.nama} (ID: ${p.id})`);
    console.log(`SIP6 Records count: ${p.sip6s.length}`);
    p.sip6s.forEach(r => {
      console.log(`  Month ${r.bulan}/${r.tahun}: BayiBaruL=${r.bayiBaruL}, BayiBaruP=${r.bayiBaruP}, BayiLamaL=${r.bayiLamaL}, BayiLamaP=${r.bayiLamaP}, BalitaBaruL=${r.balitaBaruL}, BalitaBaruP=${r.balitaBaruP}`);
    });
    
    console.log(`SIP7 Records count: ${p.sip7s.length}`);
    p.sip7s.forEach(r => {
      console.log(`  Month ${r.bulan}/${r.tahun}: Bumil=${r.jmlBumil}, BumilDiperiksa=${r.bumilDiperiksa}, BumilFe=${r.bumilFeTab}, Busui=${r.jmlBusui}`);
    });
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
