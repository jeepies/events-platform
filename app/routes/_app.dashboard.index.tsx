import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { toast } from 'sonner';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isNewHere = url.searchParams.get('ftx');

  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user) return redirect('/');

  return { isNewHere, user };
}

export default function Dashboard() {
  const { isNewHere, user } = useLoaderData<typeof loader>();

  if (isNewHere) toast.success('Your account has been created!');

  return (
    <>
      <h1 className="text-2xl font-bold py-2">
        Welcome, <span className="text-primary">{user.display_name}</span>!
      </h1>

      {isNewHere ?
        <span className="text-muted-foreground text-sm inline-flex">
          Not fond of being called {user.display_name}? Tell us what to call you in
          <Link className="text-blue-500 pl-1" to={'/dashboard/settings'}>
            Settings
          </Link>
        </span>
      : <></>}
    </>
  );
}
