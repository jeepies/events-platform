import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Outlet, useRouteLoaderData } from '@remix-run/react';
import { Sidebar } from '~/components/sidebar';
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

  return user;
}

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="border-r" />
      <div className="flex-grow rounded w-full h-full overflow-auto">
        <div className="flex h-screen">
          <main className="flex-1 p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}