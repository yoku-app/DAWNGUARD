import { FastifyInstance } from "fastify";
import { validateUserAuthentication } from "../auth";
import { routeAuthenticationHook } from "./hook";

export const routeInit = async (app: FastifyInstance) => {
    // Runs User authentication on protected endpoints
    const authenticationValidation = validateUserAuthentication(app);

    app.addHook("preHandler", async (request, reply) => {
        routeAuthenticationHook(authenticationValidation, request, reply);
    });
};
