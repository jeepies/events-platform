import { Separator } from '@radix-ui/react-separator';
import { Link } from '@remix-run/react';
import { Calendar, Cog, Home, LogOut, Tickets } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('pb-12 w-64 relative bg-primary-foreground', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Events Platform
          </h2>
          <Separator className="my-4" />
          <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/dashboard/index">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
          {/* <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/dashboard/events">
                <Tickets className="mr-2 h-4 w-4" />
                Events
              </Link>
            </Button>
          </div> */}
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="space-y-1">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start hover:bg-red-700 hover:text-white text-gray-900 dark:text-gray-100"
          >
            <Link to="/logout">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
