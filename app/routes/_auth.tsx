import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { getSession } from '~/services/session.server';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Authorization | Events Platform',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (session.has('userID')) return redirect('/dashboard/index');
  return null;
}

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
