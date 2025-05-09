import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { ActionFunctionArgs } from '@remix-run/node';
import { redirect, useActionData, useSubmit } from '@remix-run/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { authenticator } from '~/services/authentication/authenticator.server';
import { RegisterForm, registerSchema } from '~/services/authentication/schemas';
import { commitSession, getSession } from '~/services/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const auth = await authenticator.authenticate('form', request);

  if (!auth.hasErrored && auth.data['user']) {
    const user = auth.data.user as User;
    const session = await getSession(request.headers.get('Cookie'));
    session.set('userID', user.id);
    return redirect('/dashboard/index?ftx=true', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return auth;
}

export default function Register() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      type: 'register',
    },
  });

  async function onSubmit(data: any) {
    try {
      setIsLoading(true);
      await new Promise((r) => {
        setTimeout(r, 1200);
        submit(data, { method: 'POST', encType: 'multipart/form-data' });
        setTimeout(r, 5000);
      });
    }finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-muted-foreground">Let's get booking!</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@email.com" {...field} />
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
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="type"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="hidden">
                    <Input value={'register'} readOnly />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an Account
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm mt-2">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:text-primary/90">
          Login
        </a>
      </div>
    </div>
  );
}
