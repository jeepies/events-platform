import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { toast } from 'sonner';
import EventCard from '~/components/event-card';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { getUpcomingEventsForUserFromID } from '~/services/models/event.server';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isNewHere = url.searchParams.get('ftx');

  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user) return redirect('/');

  const events = await getUpcomingEventsForUserFromID(user.id);

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
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Upcoming events</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-rows-0">
          {events.length === 0 ?
            'No events'
          : events.map((event) => {
              let _event = {
                Identifier: event.eventId,
                Title: event.event.title,
                Description: event.event.description,
                Start: event.event.start,
                End: event.event.end,
                Tags: event.event.tags
              };
              return <EventCard Event={_event} />;
            })
          }
        </CardContent>
      </Card>
    </>
  );
}
