export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      REDIS_DB_URL: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      NIRNROOT_API_KEY: string;
      COLOVIA_API_KEY: string;
      BLACKBRIAR_API_KEY: string;
      ORDINATOR_API_KEY: string;
    }
  }
}
