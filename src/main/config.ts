import dotenv from "dotenv";

dotenv.config();

export const config = {
    enviroment: process.env.NODE_ENV || "development",
    hostedURL: process.env.HOSTED_API_URL || "http://localhost:8080",
    port: Number(process.env.PORT) || 3000,
    redisHost: process.env.REDIS_DB_HOST || "localhost",
    redisPort: Number(process.env.REDIS_DB_PORT) || 6379,
    supabaseURL: process.env.SUPABASE_URL || "",
    supabaseKey: process.env.SUPABASE_ANON_KEY || "",
    coloviaApiURL: process.env.COLOVIA_API_KEY || "http://localhost:8082/api/",
    guildmasterApiURL:
        process.env.GUILDMASTER_API_KEY || "http://localhost:8085/api/",
    blackbriarApiURL:
        process.env.BLACKBRIAR_API_KEY || "http://localhost:8083/api/",
    ordinatorApiURL:
        process.env.ORDINATOR_API_KEY || "http://localhost:8084/api/",
    transmuteApiURL:
        process.env.TRANSMUTE_API_KEY || "http://localhost:8069/api/",
};
