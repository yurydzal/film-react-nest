import {ConfigModule} from "@nestjs/config";

export const configProvider = {
<<<<<<< Updated upstream
    imports: [ConfigModule.forRoot()],
    provide: 'CONFIG',
    useValue: < AppConfig> {
        //TODO прочесть переменнные среды
=======
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: process.env.DATABASE_DRIVER || 'postgres' || 'mongodb',
      url:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/film-db' ||
        'mongodb://localhost:27017/film-db',
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      name: process.env.DATABASE_NAME || 'film-db',
>>>>>>> Stashed changes
    },
}

export interface AppConfig {
    database: AppConfigDatabase
}

export interface AppConfigDatabase {
<<<<<<< Updated upstream
    driver: string
    url: string
=======
  driver: string;
  url: string;
  username: string;
  password: string;
  host: string;
  port: number;
  name: string;
>>>>>>> Stashed changes
}
