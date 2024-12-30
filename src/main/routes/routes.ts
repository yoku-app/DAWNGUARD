import { FastifyInstance } from "fastify";
import { validateUserAuthentication } from "../auth";
import { financialServiceController } from "./blackbriar";
import { coreDataManagementService } from "./colovia";
import { authServiceController } from "./dawnguard";
import { routeAuthenticationHook } from "./hook";
import { surveyDistributorServiceController } from "./ordinator";

export const routeInit = async (app: FastifyInstance) => {
    // Runs User authentication on protected endpoints
    const authenticationValidation = validateUserAuthentication(app);

    app.addHook("preHandler", async (request, reply) => {
        routeAuthenticationHook(authenticationValidation, request, reply);
    });

    // Reguster all the controllers
    app.register(authServiceController);
    app.register(financialServiceController);
    app.register(coreDataManagementService);
    app.register(surveyDistributorServiceController);
};
