import { FormStrategy } from 'remix-auth-form';
import * as schemas from '../schemas';
import * as usersModel from '../../models/user.server';

// I'd like to apologise in advance - This 'abuses' passing objects by reference, and is NOT pretty

const formStrategy = new FormStrategy(async ({ form, request }) => {
  const payload = Object.fromEntries(form);

  // This seems long-winded, but it works
  const type = (payload.type as string).toLowerCase();

  const returnable = {
    data: {},
    form: [],
    field: {},
    hasErrored: false,
  };

  if (type === 'register') await registerHandler({ form: payload, request, returnable });
  else if (type === 'login') await loginHandler({ form: payload, request, returnable });
  else throw new Error(`Passed invalid type - got ${type}`);

  if (returnable.form.length !== 0 || Object.entries(returnable.field).length !== 0) returnable.hasErrored = true;

  return returnable;
});

async function registerHandler(parameters: HandlerParameters) {
  const { form, returnable } = parameters;

  const payload = schemas.registerSchema.safeParse(form);

  // I assumed that having duplicate clause here was not necessary, but Zod thinks otherwise
  if (!payload.success && payload.error) {
    const error = payload.error.flatten();
    returnable.form = error.formErrors;
    returnable.field = error.fieldErrors;
    return;
  }

  const { email, password } = payload.data;

  const isEmailTaken = await usersModel.isEmailTaken(email);
  if (isEmailTaken) {
    returnable.field.email = ['This email already exists. Are you trying to login?'];
    return;
  }

  const user = {
    email: email,
    password: password,
  };

  returnable.data.user = await usersModel.createUser(user);
}

async function loginHandler(parameters: HandlerParameters) {
  const { form, returnable } = parameters;

  const payload = schemas.registerSchema.safeParse(form);

  if (!payload.success && payload.error) {
    const error = payload.error.flatten();
    returnable.form = error.formErrors;
    returnable.field = error.fieldErrors;
    return;
  }

  // TODO Implement logic for login
}

interface HandlerParameters {
  form: { [k: string]: FormDataEntryValue };
  request: Request;
  returnable: {
    data: { [k: string]: string | object };
    form: string[];
    field: { [k: string]: string[] | undefined };
  };
}

export default formStrategy;
