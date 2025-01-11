export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            NODE_ENV: "development" | "production" | "test";
            HOSTED_API_URL: string;
            PORT: string;
            REDIS_DB_HOST: string;
            REDIS_DB_PORT: string;
            SUPABASE_URL: string;
            SUPABASE_ANON_KEY: string;
            COLOVIA_API_KEY: string;
            BLACKBRIAR_API_KEY: string;
            ORDINATOR_API_KEY: string;
            TRANSMUTE_API_KEY: string;
        }
    }
}
