import { Link } from '@remix-run/react';
import { Button } from './ui/button';
import { User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { DropdownMenuGroup } from './ui/dropdown-menu';

interface NavbarProps {
  User: User | null;
}

export default function Navbar(props: Readonly<NavbarProps>) {
  const { User } = props;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto flex h-14 items-center">
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <span className="font-bold">Events Platform</span>
          </Link>
        </div>
        {!User ?
          <div className="grid grid-cols-2">
            <Link to="/register">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        : <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${User.display_name}`}
                    alt={User.display_name}
                  />
                  <AvatarFallback>{User.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded bg-card drop-shadow-md p-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/logout">Log out</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      </div>
    </header>
  );
}
