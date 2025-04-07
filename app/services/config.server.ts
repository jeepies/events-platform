import 'dotenv/config';

interface Config {
  BCRYPT_COST: number;
}

const config: Config = {
  BCRYPT_COST: Number(process.env.BCRYPT_COST) || 10,
};

export default config;
