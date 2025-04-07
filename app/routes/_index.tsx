import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link to="/login">
        <Button className="m-2">Login</Button>
      </Link>
      <Link to="/register">
      <Button className="m-2">Register</Button>
      </Link>
    </div>
  );
}
