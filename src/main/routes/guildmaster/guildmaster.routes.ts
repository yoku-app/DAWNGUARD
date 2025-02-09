import { FastifyInstance } from "fastify";
import { config } from "../../config";
import { generateRouteConfig } from "../../utils/utils";
import { guildmasterInvitesControllerRoutes } from "./invites";
import { guildmasterMemberControllerRoutes } from "./members";
import { guildmasterOrganisationControllerRoutes } from "./organisation";
import { guildmasterPositionControllerRoutes } from "./position";

const API_URL = config.guildmasterApiURL;

export const organisationManagementService = async (app: FastifyInstance) => {
    const config = generateRouteConfig(app, API_URL);
    guildmasterOrganisationControllerRoutes(config);
    guildmasterMemberControllerRoutes(config);
    guildmasterInvitesControllerRoutes(config);
    guildmasterPositionControllerRoutes(config);
};
