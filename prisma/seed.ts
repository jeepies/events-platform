import { prisma } from '~/services/database.server';

async function seed() {
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'test',
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
