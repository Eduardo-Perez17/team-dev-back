// node.JS.ProcessEnv

declare namespace NodeJS {
  interface ProcessEnv {
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_USERNAME: string;
    DB_PORT: string;
    DB_HOST: string;
    JWT_SECRET: string;
    APP_PORT: string;
  }
}
