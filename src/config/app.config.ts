declare interface AppConfigOptions {
  port: number;
  host: string;
}

export const appConfig: AppConfigOptions = {
  port: parseInt(process.env.APP_PORT, 10) || 1011,
  host: process.env.APP_HOST,
};
