import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { useActionData, useSubmit } from '@remix-run/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { authenticator } from '~/services/authentication/authenticator.server';
import { LoginForm, loginSchema } from '~/services/authentication/schemas';
import { commitSession, getSession } from '~/services/session.server';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

export async function action({ request }: ActionFunctionArgs) {
  const auth = await authenticator.authenticate('form', request);

  if (!auth.hasErrored && auth.data['user']) {
    const user = auth.data.user as User;
    const session = await getSession(request.headers.get('Cookie'));
    session.set('userID', user.id);
    return redirect('/dashboard/index', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return auth;
}

export default function Login() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      type: 'login',
    },
  });

  async function onSubmit(data: any) {
    try {
      setIsLoading(true);
      submit(data, { method: 'POST', encType: 'multipart/form-data' });
      await new Promise((r) => setTimeout(r, 1000));
    } finally {
      setIsLoading(false);
    }
  }

  function testerDetails() {
    submit(
      {
        email: 'test@example.com',
        password: 'eventsPlatformTester!123',
        rememberMe: false,
        type: 'login',
      },
      { method: 'POST', encType: 'multipart/form-data' }
    );
  }

  return (
    <div>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-muted-foreground">Back for more!</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@email.com" {...field} id="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {actionData?.field.email ?
            <Label className="text-destructive">{actionData.field.email}</Label>
          : <></>}

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="password" placeholder="Enter your password" {...field} id="password" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {actionData?.field.password ?
            <Label className="text-destructive">{actionData.field.password}</Label>
          : <></>}

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 mt-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="type"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="hidden">
                    <Input value={'login'} readOnly />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Let's go!
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm mt-2">
        New here?
        <a href="/register" className="text-primary hover:text-primary/90">
          {' '}
          Register
        </a>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="w-full mt-2" variant="outline" onClick={testerDetails}>
              I'm here to test
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-black">
            <p>This will log you into a shared account, accessible to everybody</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
