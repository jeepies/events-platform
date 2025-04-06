import 'dotenv/config';

interface Config {
  PASSWORD_SALT: string;
}

const config: Config = {
  PASSWORD_SALT: process.env.PASSWORD_SALT || 'super_secret_salty_boi',
};

export default config;
