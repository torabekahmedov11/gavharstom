"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
const bot_1 = require("./bot");
(0, bot_1.startBot)(prisma);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- Xavfsizlik bo'limi ---
// Kelajakda bu yerga JWT token tekshiruvi qo'shiladi.
// Oddiy test tizim ishlayotganini tekshirish uchun
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Stomatologiya CRM yadrosi ishlamoqda.' });
});
// Shifokorlarni ko'rish
app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            where: { isActive: true }
        });
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: 'Xatolik yuz berdi' });
    }
});
// Yangi shifokor qo'shish (Siz so'ragan funksiya)
app.post('/api/doctors', async (req, res) => {
    try {
        const { firstName, lastName, specialization } = req.body;
        const newDoctor = await prisma.doctor.create({
            data: {
                firstName,
                lastName,
                specialization
            }
        });
        res.status(201).json(newDoctor);
    }
    catch (error) {
        res.status(500).json({ error: 'Shifokor qo\'shishda xatolik yuz berdi' });
    }
});
// Xizmatlarni ko'rish
app.get('/api/services', async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ error: 'Xatolik yuz berdi' });
    }
});
// Xizmat qo'shish (test uchun)
app.post('/api/services', async (req, res) => {
    try {
        const { name, price, durationMinutes } = req.body;
        const newService = await prisma.service.create({
            data: { name, price, durationMinutes: Number(durationMinutes) }
        });
        res.status(201).json(newService);
    }
    catch (error) {
        res.status(500).json({ error: 'Xizmat qo\'shishda xatolik yuz berdi' });
    }
});
// Bo'sh slotlarni olish (juda oddiy variant)
app.get('/api/slots', async (req, res) => {
    const { doctorId, date } = req.query; // date formati: YYYY-MM-DD
    if (!doctorId || !date) {
        return res.status(400).json({ error: 'doctorId va date kerak' });
    }
    try {
        // 09:00 dan 18:00 gacha har 30 minutlik slotlar (tushlik: 13:00-14:00)
        const allSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
        ];
        // Tanlangan kundagi band qilingan navbatlarni topamiz
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: String(doctorId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: { not: 'CANCELLED' }
            }
        });
        // Band qilingan soatlarni ajratib olamiz
        const bookedTimes = appointments.map((app) => {
            const hours = app.startTime.getUTCHours().toString().padStart(2, '0');
            const minutes = app.startTime.getUTCMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        });
        // Bo'sh slotlarni filtrlash
        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
        res.json(availableSlots);
    }
    catch (error) {
        console.error('Slot xatosi:', error);
        res.status(500).json({ error: 'Slotlarni olishda xatolik' });
    }
});
// Navbatga yozilish
app.post('/api/appointments', async (req, res) => {
    try {
        const { telegramId, doctorId, serviceId, date, time } = req.body;
        // time formati: "14:30"
        // date formati: "YYYY-MM-DD"
        const patient = await prisma.patient.findUnique({
            where: { telegramId: String(telegramId) }
        });
        if (!patient) {
            return res.status(404).json({ error: 'Bemor topilmadi' });
        }
        const [hours, minutes] = time.split(':').map(Number);
        const appointmentDate = new Date(`${date}T00:00:00.000Z`);
        const startTime = new Date(appointmentDate);
        startTime.setUTCHours(hours, minutes, 0, 0);
        const endTime = new Date(startTime);
        // Hozircha default 30 min qo'shamiz (yoki xizmat duration'ini bazadan olish mumkin)
        endTime.setUTCMinutes(endTime.getUTCMinutes() + 30);
        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId,
                serviceId,
                date: appointmentDate,
                startTime,
                endTime,
                status: 'PENDING'
            }
        });
        res.status(201).json(newAppointment);
    }
    catch (error) {
        console.error('Navbat xatosi:', error);
        res.status(500).json({ error: 'Navbat yozishda xatolik yuz berdi' });
    }
});
// Barcha navbatlarni olish (Bugungi kun uchun)
app.get('/api/admin/appointments', async (req, res) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: { patient: true, doctor: true, service: true },
            orderBy: { startTime: 'asc' }
        });
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Xatolik yuz berdi' });
    }
});
// Jonli navbat qo'shish (Telefonsiz qariyalar uchun)
app.post('/api/admin/appointments', async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, doctorId, serviceId } = req.body;
        // Qariyalarni telefon raqami yoki shunchaki tasodifiy id bilan saqlaymiz
        const patient = await prisma.patient.create({
            data: {
                firstName,
                lastName,
                phoneNumber: phoneNumber || null,
                // telegramId yo'q
            }
        });
        const now = new Date();
        const endTime = new Date(now);
        endTime.setUTCMinutes(endTime.getUTCMinutes() + 30);
        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId,
                serviceId,
                date: now,
                startTime: now,
                endTime,
                status: 'PENDING',
                isLiveQueue: true
            },
            include: { patient: true, doctor: true }
        });
        res.status(201).json(newAppointment);
    }
    catch (error) {
        res.status(500).json({ error: 'Jonli navbat qo\'shishda xatolik yuz berdi' });
    }
});
// Bemor holatini o'zgartirish (Kirdi, Chiqdi)
app.put('/api/admin/appointments/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status },
            include: { patient: true }
        });
        res.json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: 'Holatni o\'zgartirishda xatolik yuz berdi' });
    }
});
// Kasallik tarixini saqlash (Bemor chiqqandan keyin Admin yozadi)
app.post('/api/admin/records', async (req, res) => {
    try {
        const { patientId, appointmentId, description, totalPrice } = req.body;
        const record = await prisma.medicalRecord.create({
            data: {
                patientId,
                appointmentId,
                description,
                totalPrice: Number(totalPrice)
            }
        });
        // Navbat holatini "COMPLETED" (Tugadi) ga o'tkazib qo'yamiz
        if (appointmentId) {
            await prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: 'COMPLETED' }
            });
        }
        res.status(201).json(record);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Kasallik tarixini saqlashda xatolik yuz berdi' });
    }
});
// ==========================================
// BEMORLAR UCHUN VEB-SAYT API (GAVHAR)
// ==========================================
// Xizmatlar ro'yxatini olish (sayt uchun)
app.get('/api/web/services', async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ error: 'Server xatosi' });
    }
});
// Saytdan navbatga yozilish (Ism va Telefon orqali)
app.post('/api/web/book', async (req, res) => {
    try {
        const { firstName, phoneNumber } = req.body;
        // Bemor bormi tekshiramiz (telefon raqam orqali, chunki vebda telegramId yo'q)
        let patient = await prisma.patient.findFirst({
            where: { phoneNumber }
        });
        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    telegramId: `web_${Date.now()}`, // Vaqtinchalik fake id
                    firstName,
                    phoneNumber
                }
            });
        }
        // Birinchi bo'sh shifokorni topamiz
        const firstDoctor = await prisma.doctor.findFirst();
        if (!firstDoctor) {
            return res.status(400).json({ error: 'Shifokor topilmadi' });
        }
        const now = new Date();
        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: firstDoctor.id,
                date: now,
                startTime: now,
                endTime: new Date(now.getTime() + 30 * 60000), // 30 mins later
                status: 'PENDING',
                isLiveQueue: true // Vebdan kelganini bildirish uchun (yoki isWebQueue qilsa ham bo'ladi)
            }
        });
        res.json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: 'Xatolik yuz berdi' });
    }
});
// ==========================================
// DIREKTOR VA SUPERADMIN API
// ==========================================
// Oddiy Login tizimi (Sodda qilib yozilgan)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Hozircha bazani tekshirmasdan sodda hardcode (Loyiha tezligi uchun)
        // Haqiqiy hayotda AdminUser bazasidan tekshiriladi
        if (username === 'admin' && password === '123') {
            return res.json({ role: 'ADMIN', token: 'admin_token_123' });
        }
        if (username === 'director' && password === '777') {
            return res.json({ role: 'DIRECTOR', token: 'director_token_777' });
        }
        return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
    }
    catch (error) {
        res.status(500).json({ error: 'Tizim xatosi' });
    }
});
// Direktor Statistikasi
app.get('/api/director/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // Bugungi tushum
        const todayRecords = await prisma.medicalRecord.findMany({
            where: { createdAt: { gte: today } }
        });
        const todayIncome = todayRecords.reduce((sum, r) => sum + r.totalPrice, 0);
        // Oylik tushum
        const monthRecords = await prisma.medicalRecord.findMany({
            where: { createdAt: { gte: firstDayOfMonth } }
        });
        const monthIncome = monthRecords.reduce((sum, r) => sum + r.totalPrice, 0);
        // Shifokorlar bo'yicha daromad (KPI)
        const doctors = await prisma.doctor.findMany();
        const doctorStats = await Promise.all(doctors.map(async (doc) => {
            // Shu shifokor bajargan barcha appointmentlarni topamiz
            const apps = await prisma.appointment.findMany({
                where: { doctorId: doc.id, status: 'COMPLETED' },
                include: { medicalRecord: true }
            });
            const docIncome = apps.reduce((sum, app) => sum + (app.medicalRecord?.totalPrice || 0), 0);
            return { id: doc.id, name: `${doc.firstName} ${doc.lastName}`, totalIncome: docIncome, patientsCount: apps.length };
        }));
        res.json({
            todayIncome,
            monthIncome,
            doctorStats
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Statistika xatosi' });
    }
});
// Xizmatlarni tahrirlash va o'chirish
app.put('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const srv = await prisma.service.update({ where: { id }, data: { name, price: Number(price) } });
    res.json(srv);
});
app.delete('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true });
});
// Faqat lokal muhitda serverni ishga tushirish (Vercel o'zi serverless ishlatadi)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server http://localhost:${port} portida ishga tushdi.`);
    });
}
// Vercel uchun app ni eksport qilamiz
module.exports = app;
//# sourceMappingURL=index.js.map