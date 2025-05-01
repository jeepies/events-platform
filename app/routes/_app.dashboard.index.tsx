import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';
import EventCard from '~/components/event-card';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isNewHere = url.searchParams.get('ftx');

  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  const events = await prisma.event.findMany({ orderBy: [{ createdAt: 'desc' }], take: 9 });

  if (!user) return redirect('/');

  return { isNewHere, user, events };
}

export default function Dashboard() {
  const { isNewHere, user, events } = useLoaderData<typeof loader>();

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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Events</h2>
        {user?.is_staff ?
          <Button asChild>
            <Link to="/admin/event/create">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Link>
          </Button>
        : <></>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-4 gap-6 mb-8">
        {events.map((event) => (
          <EventCard event={event} isStaff={user.is_staff} />
        ))}
      </div>
    </>
  );
}
