import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Authorization | Events Platform',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO This should check if a user has a valid session, and redirect them to the dashboard if so
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
