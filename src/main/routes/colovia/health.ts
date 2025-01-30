import { FastifyReply, FastifyRequest } from "fastify";
import { ControllerRouteConfig } from "../../types/interface";

export const coloviaHealthControllerRoutes = async (
    config: ControllerRouteConfig
): Promise<void> => {
    const { app, url } = config;

    app.get(
        "/api/p/core/health",
        {
            schema: {
                description: "Health Check",
                tags: ["Colovia"],
                summary:
                    "Will ping the Colovia service to check if it is responding to incoming requests",
                response: {
                    200: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(200).send({ message: "User Service is healthy" });
        }
    );
};
