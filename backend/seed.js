import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // Shifokorlarni qo'shish
    const doc1 = await prisma.doctor.create({
        data: { firstName: 'Ali', lastName: 'Aliyev', specialization: 'Stomatolog-Terapevt' }
    });
    const doc2 = await prisma.doctor.create({
        data: { firstName: 'Vali', lastName: 'Valiyev', specialization: 'Ortoped' }
    });
    // Xizmatlarni qo'shish
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
