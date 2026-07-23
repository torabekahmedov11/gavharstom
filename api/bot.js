"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBot = exports.tgBot = void 0;
const grammy_1 = require("grammy");
exports.tgBot = null;
const startBot = (prisma) => {
    const token = process.env.BOT_TOKEN;
    if (!token) {
        console.error('BOT_TOKEN topilmadi! Bot ishga tushmaydi.');
        return;
    }
    const bot = new grammy_1.Bot(token);
    exports.tgBot = bot;
    // Botning boshlang'ich buyrug'i
    bot.command('start', async (ctx) => {
        const telegramId = ctx.from?.id.toString();
        const firstName = ctx.from?.first_name || 'Bemor';
        const lastName = ctx.from?.last_name || null;
        if (!telegramId)
            return;
        // Bazadan bemorni tekshiramiz
        const patient = await prisma.patient.findUnique({
            where: { telegramId },
        });
        if (!patient || !patient.phoneNumber) {
            // Agar bemor bo'lmasa yoki nomeri bo'lmasa, raqam so'raymiz
            const contactKeyboard = new grammy_1.Keyboard()
                .requestContact('📱 Telefon raqamni yuborish')
                .resized()
                .oneTime();
            await ctx.reply(`Assalomu alaykum, ${firstName}!\n\nKlinikamizga xush kelibsiz. Navbat olish uchun iltimos, pastdagi tugmani bosib telefon raqamingizni yuboring. Bu ma'lumot administratorimiz siz bilan bog'lanishi va navbatni 100% tasdiqlashi uchun zarur.`, { reply_markup: contactKeyboard });
        }
        else {
            // Bemor oldin ro'yxatdan o'tgan bo'lsa
            showWebAppButton(ctx);
        }
    });
    // Kontakt yuborilganda
    bot.on('message:contact', async (ctx) => {
        const contact = ctx.message.contact;
        const telegramId = ctx.from.id.toString();
        const firstName = ctx.from.first_name || 'Bemor';
        const lastName = ctx.from.last_name || null;
        // Telefon raqamni tozalash (masalan, + belgisini olib tashlash mumkin, yoki o'zini qoldiramiz)
        let phoneNumber = contact.phone_number;
        if (!phoneNumber.startsWith('+')) {
            phoneNumber = '+' + phoneNumber;
        }
        try {
            // XAVFSIZLIK: Telefon raqam bo'yicha avtomatik birlashtirish (auto-merge) O'CHIRILDI.
            // Sababi: O'zbekistonda ishlatilmay qolgan sim-kartalar boshqa birovga sotib yuborilishi mumkin.
            // Agar yangi egasi botga kirsa, oldingi bemorning ma'lumotlari (tibbiy sirlari) ochilib qolishi mumkin.
            // Shuning uchun, har bir Telegram profil alohida Bemor hisoblanadi.
            await prisma.patient.upsert({
                where: { telegramId },
                update: {
                    phoneNumber,
                    firstName,
                    lastName,
                },
                create: {
                    telegramId,
                    phoneNumber,
                    firstName,
                    lastName,
                },
            });
            await ctx.reply('✅ Rahmat! Telefon raqamingiz muvaffaqiyatli saqlandi.');
            showWebAppButton(ctx);
        }
        catch (error) {
            console.error('Bemor saqlashda xatolik:', error);
            await ctx.reply('Kechirasiz, xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
        }
    });
    bot.start({
        onStart: (botInfo) => {
            console.log(`Bot ishga tushdi: @${botInfo.username}`);
        },
    });
};
exports.startBot = startBot;
function showWebAppButton(ctx) {
    // Web app URL keyinroq .env ga olinadi, hozircha ngrok yoki localhost bo'ladi.
    const webAppUrl = process.env.WEBAPP_URL || 'https://google.com'; // O'zgartiriladi
    ctx.reply('Endi onlayn navbat olishingiz mumkin 👇', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🗓 Navbat olish', web_app: { url: webAppUrl } }
                ]
            ]
        }
    });
}
//# sourceMappingURL=bot.js.map