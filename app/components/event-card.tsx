import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Link } from '@remix-run/react';
import { convertDateToComfyLocalTime } from '~/lib/utils';

interface EventCardProps {
  Event: {
    Identifier: string;
    Title: string;
    Description: string;
    Start: Date;
    End: Date;
  };
}

export default function EventCard({ Event }: Readonly<EventCardProps>) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="w-full h-36 bg-slate-300 rounded-t" />
        <div className="px-2 pb-2">
          <p className="my-2 text-xl font-bold truncate">{Event.Title}</p>
          <p className="text-md my-2 truncate">{Event.Description}</p>
          <span className="text-muted-foreground text-sm inline-flex">
            <Calendar size={20} className="mr-1" />
            {convertDateToComfyLocalTime(Event.Start)} to {convertDateToComfyLocalTime(Event.End)}
          </span>
          <Link
            className="float-right text-muted-foreground hover:animate-slide-right hover:text-secondary-foreground"
            to={`/event/${Event.Identifier}`}
          >
            <ArrowRight />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
