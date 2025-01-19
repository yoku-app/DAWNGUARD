"use strict";

import Cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import Redis from "@fastify/redis";
import Fastify from "fastify";
import { config } from "./config";
import { handleError } from "./error";
import { routeInit } from "./routes/routes";
import { initSwagger } from "./utils/swagger";

const initServer = async () => {
    // Initialise Core Server Settings
    const app = Fastify();
    // Set Error Handler
    app.setErrorHandler(handleError);
    app.register(Cors, {
        origin: "*",
    });
    app.register(Redis, { host: config.redisHost, port: config.redisPort });
    app.register(fastifyMultipart, {
        attachFieldsToBody: true,
        // Set file size limit to 10MB
        limits: { fieldNameSize: 100, fileSize: 10 * 1024 * 1024 },
    });

    initSwagger(app);
    // Register Routes
    await routeInit(app);

    // Start Server

    app.listen(
        { port: Number(config.port), host: "0.0.0.0" },
        (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening on ${address}`);
        }
    );
};

initServer();
