import { Link } from '@remix-run/react';
import { ArrowRight, Calendar } from 'lucide-react';
import {
  breakSecondsIntoComponents,
  calculateSecondsUntil,
  convertDateToComfyLocalTime,
  turnComponentsIntoString,
} from '~/lib/utils';
import { Card, CardContent } from './ui/card';

interface EventCardProps {
  Event: {
    Identifier: string;
    Title: string;
    Description: string;
    Start: Date;
    End: Date;
    Tags: string[];
  };
}

export default function EventCard({ Event }: Readonly<EventCardProps>) {
  const secondsUntilEventStarts = calculateSecondsUntil(Event.Start);
  const secondsAsComponents = breakSecondsIntoComponents(secondsUntilEventStarts);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="w-full h-36 bg-slate-300 rounded-t p-2" />
        <div className="px-2 pb-2">
          <p className="my-2 text-xl font-bold truncate inline-flex">{Event.Title}</p>
          <p className="text-md my-2 truncate">{Event.Description}</p>
          <span className="text-muted-foreground text-sm inline-flex">
            <Calendar size={20} className="mr-1" />
            {secondsUntilEventStarts <= 604800 ?
              <>{turnComponentsIntoString(secondsAsComponents)}</>
            : <>
                {convertDateToComfyLocalTime(Event.Start)} to {convertDateToComfyLocalTime(Event.End)}
              </>
            }
          </span>
          {/* <div className="grid gap-1 grid-cols-3">
            {Event.Tags.map((tag) => (
              <Badge className="text-sm">{tag}</Badge>
            ))}
          </div> */}
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
