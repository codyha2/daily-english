import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Prisma initialized successfully');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
