import { Event } from '@prisma/client';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user) return redirect('/');

  const events = await prisma.event.findMany({ orderBy: [{ createdAt: 'desc' }] });

  return { events, user };
}

export default function Events() {
  const { events, user } = useLoaderData<typeof loader>();

  console.log(user);

  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {events.map((e: Event) => (
          <Card>
            <CardHeader>
              <CardTitle>{e.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {e.description}

              <Link
                className="float-right text-muted-foreground hover:animate-slide-right hover:text-secondary-foreground"
                to={`/event/${e.id}`}
              >
                <ArrowRight />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
