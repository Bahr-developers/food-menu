declare interface AppConfigOptions {
  port: number;
  host: string;
}

export const appConfig: AppConfigOptions = {
  port: Number(process.env.APP_PORT) || 4000,
  host: process.env.APP_HOST,
};
