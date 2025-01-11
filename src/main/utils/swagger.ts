import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { type OpenAPIV2 } from "openapi-types";
import { config } from "../config";

export const initSwagger = (app: FastifyInstance) => {
    // Register Swagger
    app.register(swagger, {
        swagger: {
            info: swaggerInfo,
            host: config.hostedURL,
            schemes: ["http", "https"],
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: swaggerTags,
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
            onRequest: (request, reply, next) => next(),
            preHandler: (request, reply, next) => next(),
        },
    });
};

const swaggerTags: OpenAPIV2.TagObject[] = [
    {
        name: "Transmute",
        description: "Image Transformation Service",
    },
    {
        name: "Dawnguard",
        description: "API Gateway / User Authentication + Privilege Service",
    },
    {
        name: "Colovia",
        description: "Core Application Data Management Service",
    },
    {
        name: "Ordinator",
        description: "Survey Distribution Service",
    },
    {
        name: "Blackbriar",
        description: "Financial Management Service",
    },
];

const swaggerInfo: OpenAPIV2.InfoObject = {
    title: "Yoku API Gateway Documentation",
    description:
        "API Endpoints for Yoku, All requests are proxied to the respective services",
    version: "1.0.0",
};
