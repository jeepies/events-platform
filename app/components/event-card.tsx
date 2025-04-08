import { Link } from '@remix-run/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { breakSecondsIntoComponents, calculateSecondsUntil, convertDateToComfyLocalTime, turnComponentsIntoString } from '~/lib/utils';
import { Card, CardContent } from './ui/card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Button } from './ui/button';

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

  console.log(secondsAsComponents);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="w-full h-36 bg-slate-300 rounded-t p-2">
          {secondsUntilEventStarts <= 0 ?
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full float-right bg-red-300">
                    <div className="w-3 h-3 m-0.5 rounded-full float-right bg-red-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white rounded p-2 opacity-60">
                  <p>Live now!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          : <></>}
        </div>
        <div className="px-2 pb-2">
          <p className="my-2 text-xl font-bold truncate inline-flex">{Event.Title}</p>
          <p className="text-md my-2 truncate">{Event.Description}</p>
          <span className="text-muted-foreground text-sm inline-flex">
            <Calendar size={20} className="mr-1" />
            {secondsUntilEventStarts <= 604800 ?
              <>
              {turnComponentsIntoString(secondsAsComponents)}
              </>
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
