import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require('./src/generated/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Testing User Upsert...');

    const userData = {
        id: "demo-user",
        name: "Demo Learner",
        email: "demo@example.com",
        role: "student",
        dailyGoal: 10,
        language: "vi",
        streak: 0,
        xp: 0,
        lastSessionAt: null,
        notificationTime: "20:00"
    };

    try {
        const user = await prisma.user.upsert({
            where: { id: userData.id },
            update: userData,
            create: userData
        });
        console.log('User upserted:', user);
    } catch (e) {
        console.error('Upsert failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
