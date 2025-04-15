import bcrypt from 'bcryptjs';
import config from '~/services/config.server';
import { prisma } from '~/services/database.server';

async function seed() {
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: bcrypt.hashSync('eventsPlatformTester!123', config.BCRYPT_COST),
      display_name: 'eventer',
    },
  });

  const firstEvent = await prisma.event.create({
    data: {
      title: 'The first event',
      description: 'This is the first ever event. like in the world. ever.',
      time: new Date(),
      location: "The Core Theatre",
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
