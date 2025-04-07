import { createCookieSessionStorage, Session } from '@remix-run/node';
import { prisma } from '~/services/database.server';
import config from './config.server';

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [config.SESSION_SECRET],
    secure: config.ENVIRONMENT === 'production',
  },
});

export async function getUserBySession(session: Session) {
  // TODO Add SELECT clause to this, otherwise (hashed) password and other secrets down the line will be leaked to client
  return await prisma.user.findUnique({
    where: { id: session.get('userID') },
  });
}

export const { getSession, commitSession, destroySession } = sessionStorage;
