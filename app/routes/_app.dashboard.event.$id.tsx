import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { dateObjectToHMString, dateObjectToYMDString } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user) return redirect('/');

  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!event) return redirect('/dashboard/events');

  const url = new URL(request.url);
  const isNewEvent = url.searchParams.get('ec');

  return { isNewEvent, event, user };
}

export default function Component() {
  const { isNewEvent, event, user } = useLoaderData<typeof loader>();

  if (isNewEvent) toast.success(`Successfully created '${event.title}'!`);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {event.description}
          Hosted at: {event.location}
          <AddToCalendarButton
            name={event.title}
            options={['Google']}
            location={event.location}
            description={event.description}
            startDate={dateObjectToYMDString(event.start_time)}
            endDate={dateObjectToYMDString(event.end_time)}
            startTime={dateObjectToHMString(event.start_time)}
            endTime={dateObjectToHMString(event.end_time)}
            timeZone="currentBrowser"
            hideCheckmark
          />
        </CardContent>
      </Card>
    </>
  );
}
