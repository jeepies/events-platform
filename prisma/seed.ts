import bcrypt from 'bcryptjs';
import config from '~/services/config.server';
import { prisma } from '~/services/database.server';

async function seed() {
  const now = new Date();

  const testUser = await prisma.user.create({
    data: {
      email: 'test@events-platform.com',
      password: bcrypt.hashSync('eventsPlatformTester!123', config.BCRYPT_COST),
      display_name: 'eventer',
    },
  });

  const testStaffUser = await prisma.user.create({
    data: {
      email: 'admin@events-platform.com',
      password: bcrypt.hashSync('eventsPlatformStaff!123', config.BCRYPT_COST),
      display_name: 'admin1',
      is_staff: true,
    },
  });

  const firstEvent = await prisma.event.create({
    data: {
      title: 'The first event',
      description: 'This is the first ever event. like in the world. ever.',
      start_time: now,
      end_time: new Date(now.setDate(now.getDate() + 1)),
      location: 'The Core Theatre',
    },
  });

  await prisma.attendee.create({
    data: {
      eventId: firstEvent.id,
      userId: testUser.id,
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
