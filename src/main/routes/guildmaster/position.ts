import { OrgMemberDTO } from "@yoku-app/shared-schemas/dist/types/organisation/dto/member-dto";
import { OrganisationDTO } from "@yoku-app/shared-schemas/dist/types/organisation/dto/organisation-dto";
import { OrgPositionDTO } from "@yoku-app/shared-schemas/dist/types/organisation/dto/position-dto";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { schemaMappings } from "../../swagger/swagger.references";
import { ControllerRouteConfig } from "../../types/interface";
import { getRequestUserOrThrow, validateUUID } from "../../utils/utils";

export const guildmasterPositionControllerRoutes = (
    config: ControllerRouteConfig
) => {
    const { app, url } = config;

    app.get(
        "/api/position/organisation/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                },
                tags: ["Guildmaster"],
                summary: "Fetches all positions of an organisation",
                response: {
                    200: {
                        type: "array",
                        items: {
                            $ref: schemaMappings["OrgPositionDTO"],
                        },
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<OrganisationDTO, "id"> }>,
            reply: FastifyReply
        ) => {
            const { id } = request.params;
            validateUUID(id);
            const response = await axios.get(
                `${url}position/organisation/${id}`
            );
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        "/api/position/member/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                },
                tags: ["Guildmaster"],
                summary:
                    "Fetch all members of a particular position within an organisation",
                response: {
                    200: {
                        type: "array",
                        items: {
                            $ref: schemaMappings["OrgMemberDTO"],
                        },
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<OrgPositionDTO, "id"> }>,
            reply: FastifyReply
        ) => {
            const { id } = request.params;
            validateUUID(id);
            const response = await axios.get(`${url}position/member/${id}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        "/api/position/user/:userId/organisation/:organisationId",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            format: "uuid",
                        },
                        organisationId: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                },
                tags: ["Guildmaster"],
                summary: `Fetches the position and all associated permissions 
                    of a user within a specific organisation`,
                response: {
                    200: {
                        $ref: schemaMappings["OrgPositionDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { userId: string; organisationId: string };
            }>,
            reply: FastifyReply
        ) => {
            const { userId, organisationId } = request.params;

            validateUUID(userId);
            validateUUID(organisationId);

            const response = await axios.get(
                `${url}position/user/${userId}/organisation/${organisationId}`
            );
            reply.code(response.status).send(response.data);
        }
    );

    app.post(
        "/api/position/",
        {
            schema: {
                tags: ["Guildmaster"],
                summary: "Creates a new position in an organisation",
                body: {
                    $ref: schemaMappings["OrgPositionDTO"],
                },
                response: {
                    201: {
                        $ref: schemaMappings["OrgPositionDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Body: OrgPositionDTO }>,
            reply: FastifyReply
        ) => {
            const { id } = getRequestUserOrThrow(request);
            const position: OrgPositionDTO = request.body;
            const response = await axios.post(`${url}position/`, position, {
                headers: {
                    "X-User-Id": id,
                },
            });
            reply.code(response.status).send(response.data);
        }
    );

    app.put(
        "/api/position/",
        {
            schema: {
                tags: ["Guildmaster"],
                summary: "Updates a position within an organisation",
                body: {
                    $ref: schemaMappings["OrgPositionDTO"],
                },
                response: {
                    201: {
                        $ref: schemaMappings["OrgPositionDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Body: OrgPositionDTO }>,
            reply: FastifyReply
        ) => {
            const { id } = getRequestUserOrThrow(request);
            const position: OrgPositionDTO = request.body;

            const response = await axios.put(`${url}position/`, position, {
                headers: {
                    "X-User-Id": id,
                },
            });
            reply.code(response.status).send(response.data);
        }
    );

    app.delete(
        `/api/position/:id/newPosition/:newPositionId`,
        {
            schema: {
                tags: ["Guildmaster"],
                summary: `Deletes a position wihin an organisation specified
                by id, and will migrate all current members of that position to
                a new specified position 
                `,
                params: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                        newPositionId: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { id: string; newPositionId: string };
            }>,
            reply: FastifyReply
        ) => {
            const { id, newPositionId } = request.params;
            const { id: userId } = getRequestUserOrThrow(request);

            validateUUID(id);
            validateUUID(newPositionId);

            const response = await axios.delete(
                `${url}position/${id}/newPosition/${newPositionId}`,
                {
                    headers: {
                        "X-User-Id": userId,
                    },
                }
            );
            reply.code(response.status).send(response.data);
        }
    );

    app.put(
        `/api/position/member/toPosition/:id`,
        {
            schema: {
                tags: ["Guildmaster"],
                summary: `Moves a member to a new position within an organisation`,
                params: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                        },
                    },
                },
                body: {
                    $ref: schemaMappings["OrgMemberDTO"],
                },
                response: {
                    201: {
                        $ref: schemaMappings["OrgMemberDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{
                Params: { id: string };
                Body: OrgMemberDTO;
            }>,
            reply: FastifyReply
        ) => {
            const { id } = request.params;
            const member: OrgMemberDTO = request.body;
            const { id: userId } = getRequestUserOrThrow(request);

            validateUUID(id);
            validateUUID(userId);

            const response = await axios.put(
                `${url}position/member/toPosition/${id}`,
                member,
                {
                    headers: {
                        "X-User-Id": userId,
                    },
                }
            );
            reply.code(response.status).send(response.data);
        }
    );
};
