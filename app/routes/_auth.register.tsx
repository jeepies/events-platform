import { ActionFunctionArgs } from '@remix-run/node';
import { act, useState } from 'react';
import { useActionData, useSubmit } from '@remix-run/react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { authenticator } from '~/services/authentication/authenticator.server';
import { Button } from '~/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterForm } from '~/services/authentication/schemas';

export async function action({ request }: ActionFunctionArgs) {
  const auth = await authenticator.authenticate('form', request);

  console.log(auth);

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
      submit(data, { method: 'POST', encType: 'multipart/form-data' });
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      // TODO Display errors to the user instead of to the console
      console.log(`Error while registering - ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-muted-foreground">You'll always be welcome here!</p>
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

          <Button type="submit" className="w-full t-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an Account
          </Button>
        </form>
      </Form>
    </div>
  );
}