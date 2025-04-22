import { Event } from '@prisma/client';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, redirect, useLoaderData } from '@remix-run/react';
import { ArrowRight, Calendar, Plus } from 'lucide-react';
import { start } from 'repl';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { dateObjectToHMString, dateObjectToYMDString } from '~/lib/utils';
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
