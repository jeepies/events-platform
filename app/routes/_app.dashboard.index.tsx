import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
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
    </>
  );
}
