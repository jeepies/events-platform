import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { Plus } from 'lucide-react';
import EventCard from '~/components/event-card';
import Pagination, { PAGE_SIZE } from '~/components/pagination';
import { Button } from '~/components/ui/button';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user) return redirect('/');

  const url = new URL(request.url);

  const page = Number(url.searchParams.get('page')) || 1;
  const count = await prisma.event.count();

  const events = await prisma.event.findMany({
    orderBy: [{ createdAt: 'desc' }],
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return { events, user, count, page };
}

export default function Events() {
  const { events, user, count, page } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Events</h2>
        {user?.is_staff ?
          <Button asChild>
            <Link to="/admin/event/create">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Link>
          </Button>
        : <></>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {events.map((event) => (
          <EventCard event={event} isStaff={user.is_staff} />
        ))}
      </div>

      <Pagination path="/dashboard/events" currentPage={page} totalCount={count} />
    </>
  );
}
