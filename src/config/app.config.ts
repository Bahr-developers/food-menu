declare interface AppConfigOptions {
  port: number;
  host: string;
}

export const appConfig: AppConfigOptions = {
  port: parseInt(process.env.APP_PORT, 10) || 4000,
  host: process.env.APP_HOST,
};
