import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: process.env.DATABASE_DRIVER || 'mongodb',
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/film-db',
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
