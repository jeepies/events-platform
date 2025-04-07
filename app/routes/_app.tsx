import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { useRouteLoaderData } from '@remix-run/react';
import { destroySession, getSession, getUserBySession } from '~/services/session.server';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dashboard | Events Platform',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('userID')) return redirect('/');

  const user = await getUserBySession(session);

  if (user === null)
    return redirect('/', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });

  return { user };
}