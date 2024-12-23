import { FastifyInstance } from "fastify";
import { validateUserAuthentication } from "../auth";
import { financialServiceController } from "./blackbriar";
import { surveyManagementServiceController } from "./colovia";
import { authServiceController } from "./dawnguard";
import { routeAuthenticationHook } from "./hook";
import { userServiceController } from "./nirnroot";
import { surveyDistributorServiceController } from "./ordinator";

export const routeInit = async (app: FastifyInstance) => {
    // Runs User authentication on protected endpoints
    const authenticationValidation = validateUserAuthentication(app);

    app.addHook("preHandler", async (request, reply) => {
        routeAuthenticationHook(authenticationValidation, request, reply);
    });

    // Reguster all the controllers
    app.register(userServiceController);
    app.register(authServiceController);
    app.register(financialServiceController);
    app.register(surveyManagementServiceController);
    app.register(surveyDistributorServiceController);
};
