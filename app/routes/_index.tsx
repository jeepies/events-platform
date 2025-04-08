import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Navbar from '~/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  let user = null;
  let events = {};

  const session = await getSession(request.headers.get('Cookie'));
  if (session.has('userID')) user = await getUserBySession(session);

  // load events

  return { user };
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <Navbar User={user} />
      <div className="relative mx-auto container px-3">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Upcoming events</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-rows-0">
            You have no upcoming events
          </CardContent>
        </Card>

        {user ?
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Suggestions from your events</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-rows-0">
              There are no suggestions for you
            </CardContent>
          </Card>
        : <></>}

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>All events</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-rows-0">
            There are no events
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
