import { env } from 'process';

export const isProduction = () => {
  const { ENV } = env;
  return ENV === 'production';
};
