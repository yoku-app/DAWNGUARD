import { FastifyInstance } from "fastify";
import { validateUserAuthentication } from "../auth";
import { financialServiceController } from "./blackbriar";
import { coreDataManagementService } from "./colovia/colovia.routes";
import { authServiceController } from "./dawnguard";
import { organisationManagementService } from "./guildmaster/guildmaster.routes";
import { routeAuthenticationHook } from "./hooks/auth.hook";
import { surveyDistributorServiceController } from "./ordinator";
import { imageTransformationService } from "./transmute";

export const routeInit = async (app: FastifyInstance) => {
    app;

    // Runs User authentication on protected endpoints
    app.addHook("preHandler", async (request, reply) => {
        await routeAuthenticationHook(
            validateUserAuthentication(app),
            request,
            reply
        );
    });

    // Reguster all the controllers
    app.register(authServiceController);
    app.register(financialServiceController);
    app.register(coreDataManagementService);
    app.register(surveyDistributorServiceController);
    app.register(imageTransformationService);
    app.register(organisationManagementService);
};
