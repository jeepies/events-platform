import { Event } from '@prisma/client';
import { Card, CardContent, CardHeader } from './ui/card';
import { ArrowRight, Calendar, Pin } from 'lucide-react';
import { Link } from '@remix-run/react';
import { format, formatDuration, intervalToDuration } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export default function EventCard(props: Readonly<EventCardProps>) {
  const { title, description, start_time, end_time, id, location } = props.event;

  // may god forgive me for this atrocity
  const _start_time = format(start_time, 'hh:mm');
  const _end_time = format(end_time, 'hh:mm');

  const start_date = format(start_time, 'dd/MM/yyyy');
  const end_date = format(end_time, 'dd/MM/yy');

  const duration = formatDuration(
    intervalToDuration({
      start: start_time,
      end: end_time,
    })
  );

  const dateText =
    duration === '1 day' ?
      `${_start_time} - ${_end_time}, ${start_date}`
    : `${_start_time} ${start_date} - ${_end_time} ${end_date}`;

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="w-full h-8 bg-slate-300 rounded-t p-2" />
      </CardHeader>
      <CardContent className="p-2 truncate">
        <h1 className="text-xl inline-flex">{title}</h1>
        <p className="text-md my-2">{description}</p>
        <span className="text-muted-foreground text-sm inline-flex">
          <Pin size={20} className="mr-1" />
          {dateText}
        </span>
        <br />
        <span className="text-muted-foreground text-sm inline-flex">
          <Calendar size={20} className="mr-1" />
          {location}
        </span>
        <br />

        <Link
          className="float-right text-muted-foreground hover:animate-slide-right hover:text-secondary-foreground"
          to={`/dashboard/event/${id}`}
        >
          <ArrowRight />
        </Link>
      </CardContent>
    </Card>
  );
}
