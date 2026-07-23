const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doc1 = await prisma.doctor.create({
    data: { firstName: 'Ali', lastName: 'Aliyev', specialization: 'Stomatolog-Terapevt' }
  });
  
  const doc2 = await prisma.doctor.create({
    data: { firstName: 'Vali', lastName: 'Valiyev', specialization: 'Ortoped' }
  });

  // Direktor (o'zi ham shifokor)
  const doc3 = await prisma.doctor.create({
    data: { firstName: 'Shavkat', lastName: 'Olimov', specialization: 'Bosh Shifokor' }
  });

  await prisma.service.create({
    data: { name: 'Tish yulish', price: 150000, durationMinutes: 30 }
  });

  await prisma.service.create({
    data: { name: 'Kariyes plomba', price: 250000, durationMinutes: 45 }
  });

  await prisma.service.create({
    data: { name: 'Rentgen', price: 50000, durationMinutes: 10 }
  });

  console.log('Baza muvaffaqiyatli to\'ldirildi!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
