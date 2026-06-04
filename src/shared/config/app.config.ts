import { registerAs } from '@nestjs/config';
import { validate } from './env.validation';

export const appConfig = registerAs('app', () => {
  const envVars = validate(process.env);

  return envVars;
});
