import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { prisma } from '~/services/database.server';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { dateObjectToHMString, dateObjectToYMDString } from '~/lib/utils';
import { getSession, getUserBySession } from '~/services/session.server';
import { Calendar, ArrowRight } from 'lucide-react';

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

  return { event, user };
}

export default function Component() {
  const { event, user } = useLoaderData<typeof loader>();

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
