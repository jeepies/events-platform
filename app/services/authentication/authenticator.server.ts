import { Authenticator } from 'remix-auth';
import formStrategy from './strategies/form-strategy.server';

export const authenticator = new Authenticator<{
  data: { [k: string]: string | object };
  form: string[];
  field: { [k: string]: string[] | undefined };
  hasErrored: boolean;
}>();

authenticator.use(formStrategy);
