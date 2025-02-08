import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config({ path: '.env' });

// check the .env file

if (!fs.existsSync(path.resolve('.env'))) {
  throw new Error('The .env file does not exist');
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRATION: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_EXPIRATION: string;
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
});
const e = validateSync(configServer);

if (e.length > 0) {
  console.log('Invalid environment variables');
  const error = e.map((err) => {
    return {
      property: err.property,
      constraints: err.constraints,
      value: err.value,
    };
  });
  throw new Error(`Invalid environment variables: ${error.join(', ')}`);
}

const envConfig = configServer;

export default envConfig;
