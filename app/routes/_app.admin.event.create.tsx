import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useActionData, useSubmit } from '@remix-run/react';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { createEvent } from '~/services/models/event.server';
import { createEventSchema, CreateEventSchema } from '~/services/schemas';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verify the user is an admin. This should be done higher up when there are more admin routes
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserBySession(session);

  if (!user || !user.is_staff) return redirect('/dashboard/index');

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  // this should probably have been sent to a handler >.>
  // verify data server-side LOL
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const json = JSON.parse(payload.time_range.toString());

  // as form data is a string, cast it and re-bind it. yum :3

  delete payload.time_range;

  const time_range = {
    from: new Date(json.from),
    to: new Date(json.to),
  };

  const result = createEventSchema.safeParse({ ...payload, time_range: { ...time_range } });

  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  const event = await createEvent(result.data, time_range);

  if (!event.id)
    return {
      payload,
      formErrors: 'Failed to create event. Please try again later.',
      fieldErrors: [],
    };
  // lets send a parameter back so we can make a notification :3
  return redirect(`/dashboard/event/${event.id}?ec=true`);
}

export default function CreateEvent() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [isLoading, setIsLoading] = useState(false);

  console.log(actionData);

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      time_range: {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
      location: '',
    },
  });

  async function onSubmit(data: any) {
    try {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 200));
      data.time_range = JSON.stringify(data.time_range);
      submit(data, { method: 'POST', encType: 'multipart/form-data' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My first event" {...field} id="event" />
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
                <Input placeholder="This event will be super fun!" {...field} id="description" />
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
                <Input placeholder="The Pentagon" {...field} id="location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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
                      !field.value.from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value.from ?
                      field.value.to ?
                        <>
                          {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                        </>
                      : format(field.value.from, 'LLL dd, y')
                    : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from}
                    selected={{
                      from: field.value.from!,
                      to: field.value.to,
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

        <Button type="submit" className="float-right mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Event
        </Button>
      </form>
    </Form>
  );
}
