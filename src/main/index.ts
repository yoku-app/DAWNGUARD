"use strict";

import Fastify from "fastify";
import Cors from "fastify-cors";
import Redis from "fastify-redis";
import { config } from "./config";
import { routeInit } from "./routes/routes";

const initServer = async () => {
    // Initialise Core Server Settings
    const app = Fastify();
    app.register(Cors, { origin: "*" });
    app.register(Redis, { host: config.redisURL });

    // Register Routes
    await routeInit(app);
    // Start Server
    try {
        await app.listen({ port: Number(config.port), host: "0.0.0.0" });
        console.log(`Server running on port ${config.port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
