import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { dateObjectToHMString, dateObjectToYMDString } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

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
  const isRegistered = url.searchParams.get('registered');

  const attendee = await prisma.attendee.findFirst({
    where: {
      userId: user.id,
      eventId: event.id,
    },
  });

  const eventsStats = {
    attending: (await prisma.attendee.findMany({ where: { eventId: event.id } })).length,
  };

  if (user.is_staff) return { isNewEvent, event, user, attendee, eventsStats };

  return { isNewEvent, event, user, attendee, isRegistered };
}

export async function action({ request }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData());

  if (!data.user_id || !data.event_id) return redirect(`/dashboard/event/${data.event_id as string}?registered=false`);

  await prisma.attendee.create({
    data: {
      userId: data.user_id as string,
      eventId: data.event_id as string,
    },
  });

  return redirect(`/dashboard/event/${data.event_id as string}?registered=true`);
}

export default function Event() {
  const { isNewEvent, event, user, attendee, eventsStats, isRegistered } = useLoaderData<typeof loader>();

  if (isNewEvent) toast.success(`Successfully created '${event.title}'!`);

  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();

  const _start_time = format(event.start_time, 'hh:mm');
  const _end_time = format(event.end_time, 'hh:mm');

  const start_date = format(event.start_time, 'dd/MM/yyyy');
  const end_date = format(event.end_time, 'dd/MM/yyyy');

  const duration =
    formatDuration(
      intervalToDuration({
        start: event.start_time,
        end: event.end_time,
      })
    ) || '0 seconds';

  const dateText =
    duration === '1 day' ?
      `${_start_time} - ${_end_time}, ${start_date}`
    : `${_start_time} ${start_date} - ${_end_time} ${end_date}`;

  async function registerForEvent() {
    try {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 200));
      submit(
        {
          event_id: event.id,
          user_id: user.id,
        },
        { method: 'POST', encType: 'multipart/form-data' }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="text-xl">{event.title}</CardHeader>
        <CardContent>
          <label className="text-muted-foreground text-sm">Description</label>
          <br />
          <label>{event.description}</label>
          <br />
          <label className="text-muted-foreground text-sm">Location</label>
          <br />
          <label>{event.location}</label>
          <br />
          <label className="text-muted-foreground text-sm">Date</label>
          <br />
          <label>
            {dateText} ({duration})
          </label>
          <br />
          {!attendee ?
            <>
              <Button disabled={isLoading} onClick={registerForEvent}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register for event
              </Button>
            </>
          : <>
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
            </>
          }
          <br />
        </CardContent>
      </Card>
    </>
  );
}
