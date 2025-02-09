import { OrganisationDTO } from "@yoku-app/shared-schemas/dist/types/organisation/dto/organisation-dto";
import { UserProfile } from "@yoku-app/shared-schemas/dist/types/user/profile";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { schemaMappings } from "../../swagger/swagger.references";
import { AuthenticationError } from "../../types/error.interface";
import { ControllerRouteConfig } from "../../types/interface";
import { validateUUID } from "../../utils/utils";

export const guildmasterMemberControllerRoutes = (
    config: ControllerRouteConfig
) => {
    const { app, url } = config;

    app.get(
        `/api/p/member/organisation/:id`,
        {
            schema: {
                tags: ["Guildmaster"],
                summary:
                    "Fetches all members of an organisation by its associated Id",
                response: {
                    200: {
                        type: "array",
                        items: {
                            $ref: schemaMappings["OrgMemberDTO"],
                        },
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<OrganisationDTO, "id"> }>,
            reply: FastifyReply
        ) => {
            const { id } = request.params;
            validateUUID(id);
            const response = await axios.get(`${url}member/organisation/${id}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/p/member/user/:userId`,
        {
            schema: {
                tags: ["Guildmaster"],
                summary:
                    "Fetches all organisations of a user by its associated Id",
                response: {
                    200: {
                        type: "array",
                        items: {
                            $ref: schemaMappings["OrgMemberDTO"],
                        },
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<UserProfile, "userId"> }>,
            reply: FastifyReply
        ) => {
            const { userId } = request.params;
            validateUUID(userId);

            const response = await axios.get(`${url}member/user/${userId}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.delete(
        `/api/member/user/:userId/organisation/:organisationId`,
        {
            schema: {
                description:
                    "Removes a user from an organisaiton (voluntarily or forced removal). \n" +
                    "requires user authentication and correct internal organisation permissions to allow organisation deletion capabilities",
                tags: ["Guildmaster"],
                summary: "Deletes an organisation granted correct permissions",
                response: {
                    204: { type: "null" },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { organisationId: string; userId: string };
            }>,
            reply: FastifyReply
        ) => {
            if (!request.user) {
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );
            }

            const { organisationId, userId } = request.params;
            validateUUID(organisationId);
            validateUUID(userId);

            const response = await axios.delete(
                `${url}member/user/${userId}/organisation/${organisationId}`,
                {
                    headers: {
                        "X-User-Id": request.user.id,
                    },
                }
            );

            reply.code(response.status).send(response.data);
        }
    );
};
