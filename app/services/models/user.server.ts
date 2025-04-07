import bcrypt from 'bcryptjs';
import { prisma } from '../database.server';
import { User } from '@prisma/client';
import config from '../config.server';

export async function isEmailTaken(email: string): Promise<boolean> {
  return (await prisma.user.count({ where: { email: email } })) === 1;
}

export async function createUser(user: { email: string; password: string }): Promise<User> {
  const hashedPassword = bcrypt.hashSync(user.password, config.BCRYPT_COST);
  return await prisma.user.create({
    data: {
      email: user.email,
      password: hashedPassword,
    },
  });
}

export async function doesPasswordMatchForEmail(email: string, password: string): Promise<boolean> {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    },
  });

  return await bcrypt.compare(password, user.password);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}
