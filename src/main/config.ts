import dotenv from "dotenv";

dotenv.config();

export const config = {
    enviroment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    redisURL: process.env.REDIS_DB_URL || "localhost:6379",
    supabaseURL: process.env.SUPABASE_URL || "",
    supabaseKey: process.env.SUPABASE_ANON_KEY || "",
    nirnrootApiURL:
        process.env.NIRNROOT_API_KEY || "http://localhost:8081/api/",
    coloviaApiURL: process.env.COLOVIA_API_KEY || "http://localhost:8082/api/",
    blackbriarApiURL:
        process.env.BLACKBRIAR_API_KEY || "http://localhost:8083/api/",
    ordinatorApiURL:
        process.env.ORDINATOR_API_KEY || "http://localhost:8084/api/",
};
