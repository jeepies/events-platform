import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verify the user is an admin. This should be done higher up when there are more admin routes
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user || !user.is_staff) return redirect('/dashboard/index');

  return null;
}

export default function Component() {
  return <>Event Creator</>;
}
