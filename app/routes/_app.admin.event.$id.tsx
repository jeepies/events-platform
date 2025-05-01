import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData, useSubmit } from '@remix-run/react';
import { format } from 'date-fns';
import { BanknoteX, CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { updateEventSchema, UpdateEventSchema } from '~/services/schemas';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user || !user.is_staff) return redirect('/dashboard/events');

  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!event) return redirect('/dashboard/events');

  const stats = {
    attendees: await prisma.attendee.count({ where: { eventId: params.id } }),
  };

  const url = new URL(request.url);
  const isFromUpdate = url.searchParams.get('updated');

  const query = url.searchParams.get('query');

  if (query) {
    switch (query) {
      case 'delete':
        await prisma.attendee.deleteMany({ where: { eventId: event.id } });
        await prisma.event.delete({ where: { id: event.id } });
        return redirect('/dashboard/events');
      case 'unregister':
        await prisma.attendee.deleteMany({ where: { eventId: event.id } });
        return redirect(`/admin/event/${event.id}`);
    }
  }

  return { event, user, stats, isFromUpdate };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const json = JSON.parse(payload.time_range.toString());
  delete payload.time_range;
  const time_range = {
    from: new Date(json.from),
    to: new Date(json.to),
  };

  const result = updateEventSchema.safeParse({ ...payload, time_range: { ...time_range } });

  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  const data = { ...result.data, start_time: result.data.time_range?.from, end_time: result.data.time_range?.to };
  delete data.time_range;

  const event = await prisma.event.count({ where: { id: data.id } });

  if (!event) return redirect('/dashboard/events');

  await prisma.event.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
    },
  });

  return redirect(`/admin/event/${data.id}?updated=true`);
}

export default function EventAdmin() {
  const { event, stats, isFromUpdate } = useLoaderData<typeof loader>();

  if (isFromUpdate) toast.success('Updated event');

  const submit = useSubmit();
  const [isDoingWork, setIsDoingWork] = useState(false);

  const editDetailForm = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      time_range: {
        from: event.start_time,
        to: event.end_time,
      },
      location: event.location,
      id: event.id,
    },
  });

  async function onUpdateEventFormSubmit(data: any) {
    try {
      setIsDoingWork(true);
      await new Promise((r) => {
        data.time_range = JSON.stringify(data.time_range);
        submit(data, { method: 'POST', encType: 'multipart/form-data' });
        setTimeout(r, 1200);
      });
    } finally {
      setIsDoingWork(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.id}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(event.updatedAt, 'hh:mm dd/MM/yyyy')}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...editDetailForm}>
            <form onSubmit={editDetailForm.handleSubmit(onUpdateEventFormSubmit)}>
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} id="event" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} id="description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} id="location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editDetailForm.control}
                name="time_range"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start and End Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value!.from && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value!.from ?
                            field.value!.to ?
                              <>
                                {format(field.value!.from, 'LLL dd, y')} - {format(field.value!.to, 'LLL dd, y')}
                              </>
                            : format(field.value!.from, 'LLL dd, y')
                          : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value!.from}
                          selected={{
                            from: field.value!.from!,
                            to: field.value!.to,
                          }}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-2 w-full" disabled={isDoingWork}>
                {isDoingWork && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Destructive Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 mt-4">
            <Link to={'?query=unregister'}>
              <Button variant="destructive" className="w-full">
                <BanknoteX className="mr-2 h-4 w-4" />
                Unregister all attendees
              </Button>
            </Link>
            <Link to={'?query=delete'}>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
