import { UserPartialDTO } from "@yoku-app/shared-schemas/dist/types/organisation/dto/organisation-dto";
import { OrganisationInvite } from "@yoku-app/shared-schemas/dist/types/organisation/invite";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { schemaMappings } from "../../swagger/swagger.references";
import { BadRequestError } from "../../types/error.interface";
import { ControllerRouteConfig } from "../../types/interface";
import { getRequestUserOrThrow, validateUUID } from "../../utils/utils";

export const guildmasterInvitesControllerRoutes = (
    config: ControllerRouteConfig
) => {
    const { app, url } = config;

    app.post(
        `/api/invite/organisation/:organisationId/email/:email`,
        {
            schema: {
                description: `Creates an active invitation for a user to join an organisation,
                     the invitation is unique to the users email, and will be sent to the given address. 
                     Requires Authentication, and appropriate organisational permissions to add new users`,
                tags: ["Guildmaster"],
                body: {
                    $ref: schemaMappings["UserPartialDTO"],
                },
                params: {
                    type: "object",
                    properties: {
                        organisationId: {
                            type: "string",
                            format: "uuid",
                            description:
                                "The ID of the organisation to invite the user to",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description:
                                "The email address of the user being invited",
                        },
                    },
                    required: ["organisationId", "email"],
                },
                summary: "Invite a user to an organisation by email",
                response: {
                    200: {
                        $ref: schemaMappings["OrgInviteDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { organisationId: string; email: string };
                Body?: { user?: UserPartialDTO };
            }>,
            reply: FastifyReply
        ) => {
            const { organisationId, email } = request.params;

            // Get Id of the Invitations creator (ie. the user who made this request)
            const { id: creatorId } = getRequestUserOrThrow(request);

            validateUUID(organisationId);

            const response = await axios.post(
                `${url}invite/organisation/${organisationId}/email/${email}`,
                request.body,
                {
                    headers: {
                        "X-User-Id": creatorId,
                    },
                }
            );

            reply.code(response.status).send(response.data);
        }
    );

    app.post(
        `/api/invite/accept/:token`,
        {
            schema: {
                description: `Acceptance of invitation to join an organisation. 
                     Requires the unique token generated from the invitation`,
                tags: ["Guildmaster"],
                params: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            description:
                                "The unique token associated with the invitation",
                        },
                    },
                    required: ["token"],
                },
                security: [{ BearerAuth: [] }],
                summary:
                    "Accept an invitation to join an organisation by email",
                response: {
                    200: {
                        $ref: schemaMappings["OrgMemberDTO"],
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{
                Params: Pick<OrganisationInvite, "token">;
            }>,
            reply: FastifyReply
        ) => {
            const { email } = getRequestUserOrThrow(request);

            if (!email)
                throw new BadRequestError(
                    "Email is required to accept an invitation"
                );

            const { token } = request.params;

            const response = await axios.post(
                `${url}invite/accept/${token}/email/${email}`
            );

            reply.code(response.status).send(response.data);
        }
    );

    app.post(
        `/api/invite/reject/:token`,
        {
            schema: {
                description:
                    "Rejection of invitation to join an organisation. Requires the unique token generated from the invitation",
                tags: ["Guildmaster"],
                params: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            description:
                                "The unique token associated with the invitation",
                        },
                    },
                    required: ["token"],
                },
                security: [{ BearerAuth: [] }],
                summary:
                    "Accept an invitation to join an organisation by email",
                response: {
                    204: {
                        type: "null",
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{
                Params: Pick<OrganisationInvite, "token">;
            }>,
            reply: FastifyReply
        ) => {
            const { email } = getRequestUserOrThrow(request);

            if (!email)
                throw new BadRequestError(
                    "Email is required to accept an invitation"
                );

            const { token } = request.params;

            const response = await axios.post(
                `${url}invite/reject/${token}/email/${email}`
            );

            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/invite/organisation/:organisationId`,
        {
            schema: {
                description:
                    "Retrieves all outgoing invites for an organisation",
                tags: ["Guildmaster"],
                querystring: {
                    type: "object",
                    properties: {
                        inviteStatus: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "ACCEPTED",
                                "REJECTED",
                                "EXPIRED",
                            ],
                            description: "Filter invites by status",
                        },
                    },
                    required: [],
                },
                params: {
                    type: "object",
                    properties: {
                        organisationId: {
                            type: "string",
                            format: "uuid",
                            description:
                                "The ID of the organisation to get invites for",
                        },
                    },
                    required: ["organisationId"],
                },
                summary: "Get all invites for an organisation",
                response: {
                    200: {
                        type: "array",
                        items: {
                            $ref: schemaMappings["OrgInviteDTO"],
                        },
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { organisationId: string };
                Querystring: Partial<Pick<OrganisationInvite, "inviteStatus">>;
            }>,
            reply: FastifyReply
        ) => {
            const { organisationId } = request.params;
            const { inviteStatus } = request.query;

            validateUUID(organisationId);

            const response = await axios.get(
                `${url}invite/organisation/${organisationId}`,
                { params: { inviteStatus } }
            );

            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/invite/user/:userId`,
        {
            schema: {
                description: "Retrieves all incoming invites for a user",
                tags: ["Guildmaster"],
                querystring: {
                    type: "object",
                    properties: {
                        inviteStatus: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "ACCEPTED",
                                "REJECTED",
                                "EXPIRED",
                            ],
                            description: "Filter invites by status",
                        },
                    },
                    required: [],
                },
                params: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            format: "uuid",
                            description:
                                "The ID of the user to get invites for",
                        },
                    },
                    required: ["userId"],
                },
                summary: "Get all invites for a user",
                response: {
                    200: {
                        type: "array",
                        items: {
                            $ref: schemaMappings["OrgInviteDTO"],
                        },
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { userId: string };
                Querystring: Partial<Pick<OrganisationInvite, "inviteStatus">>;
            }>,
            reply: FastifyReply
        ) => {
            const { userId } = request.params;
            const { inviteStatus } = request.query;

            validateUUID(userId);

            const response = await axios.get(`${url}invite/user/${userId}`, {
                params: { inviteStatus },
            });

            reply.code(response.status).send(response.data);
        }
    );

    app.delete(
        `/api/invite/organisation/:organisationId/email/:email`,
        {
            schema: {
                description: `Revokes an active invitation for a user to join an organisation, 
                    Requires an invitation that is currently pending to exist, 
                    Requires Authentication, and appropriate organisational permissions to remove invites`,
                tags: ["Guildmaster"],
                params: {
                    type: "object",
                    properties: {
                        organisationId: {
                            type: "string",
                            format: "uuid",
                            description:
                                "The ID of the organisation to remove the invite from",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description:
                                "The email address of the user being invited",
                        },
                    },
                    required: ["organisationId", "email"],
                },
                summary:
                    "Revokes a currently pending invitation for a user to join an organisation",
                response: {
                    204: {
                        type: "null",
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { organisationId: string; email: string };
            }>,
            reply: FastifyReply
        ) => {
            const { organisationId, email } = request.params;

            validateUUID(organisationId);

            const response = await axios.delete(
                `${url}invite/organisation/${organisationId}/email/${email}`
            );

            reply.code(response.status).send(response.data);
        }
    );
};
