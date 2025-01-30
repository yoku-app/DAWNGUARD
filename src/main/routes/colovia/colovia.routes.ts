import { FastifyInstance } from "fastify";
import { config } from "../../config";
import { generateRouteConfig } from "../../utils/utils";
import { coloviaHealthControllerRoutes } from "./health";
import { coloviaUserControllerRoutes } from "./users";

const API_URL = config.coloviaApiURL;

export const coreDataManagementService = async (app: FastifyInstance) => {
    const config = generateRouteConfig(app, API_URL);
    coloviaUserControllerRoutes(config);
    coloviaHealthControllerRoutes(config);
};
