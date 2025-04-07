import { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO This should validate the user has a valid session, and return them to landing page/login page if not
  return null;
}
