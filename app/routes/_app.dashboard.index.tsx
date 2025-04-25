import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ArrowRight, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { dateObjectToHMString, dateObjectToYMDString } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';
import { Event } from '@prisma/client';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isNewHere = url.searchParams.get('ftx');

  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  const events = await prisma.event.findMany({ orderBy: [{ createdAt: 'desc' }], take: 12 });

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
        {events.map(({ title, description, start_time, end_time, id }: Event) => {
          const startDate = dateObjectToYMDString(start_time);
          const endDate = dateObjectToYMDString(end_time);

          const isSingleDay = startDate === endDate;

          const startTime = dateObjectToHMString(start_time);
          const endTime = dateObjectToHMString(end_time);

          return (
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-36 bg-slate-300 rounded-t p-2" />
                <div className="px-2 pb-2">
                  <p className="my-2 text-xl font-bold truncate inline-flex">{title}</p>
                  <p className="text-md my-2 truncate">{description}</p>
                  <span className="text-muted-foreground text-sm inline-flex">
                    <Calendar size={20} className="mr-1" />
                    {isSingleDay ?
                      <>
                        {startTime} to {endTime}, {startDate}
                      </>
                    : <>
                        {startTime} {startDate} to {endTime} {endDate}
                      </>
                    }
                  </span>
                  <Link
                    className="float-right text-muted-foreground hover:animate-slide-right hover:text-secondary-foreground"
                    to={`/dashboard/event/${id}`}
                  >
                    <ArrowRight />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
