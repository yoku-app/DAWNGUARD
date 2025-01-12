import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { swaggerInfo } from '../swagger/swagger.info';

import { config } from "../config";
import { initSwaggerSchemas } from "../swagger/swagger.schema";
import { swaggerTags } from "../swagger/swagger.tags";

export const initSwagger = (app: FastifyInstance) => {
    // Register Swagger
    app.register(swagger, {

        openapi: {
            openapi: "3.0.0",
            info: swaggerInfo,
            servers: [
                {
                    url: config.hostedURL,
                    description: "Production Server"
                },
                {
                    url: "http://localhost:8080",
                    description: "Local Server"
                }
            ],
            tags: swaggerTags,
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here'
              }
        },
    });

    // Register Swagger UI
    app.register(swaggerUI, {
        routePrefix: "/api/p/swagger", // Swagger UI endpoint
        staticCSP: true,
        transformStaticCSP: (header) => header,
        uiConfig: {
            docExpansion: "none", // Collapse the documentation by default
            deepLinking: false,
        },
        uiHooks: {
            onRequest: (_, _2, next) => next(),
            preHandler: (_, _2, next) => next(),
        },
    });

    // Add Reference to all Schemas for swagger documentation
    initSwaggerSchemas(app);
};




