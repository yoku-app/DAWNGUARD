import { OrganisationDTO } from "@yoku-app/shared-schemas/dist/types/organisation/dto/organisation-dto";

import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { schemaMappings } from "../../swagger/swagger.references";
import { AuthenticationError } from "../../types/error.interface";
import { ControllerRouteConfig } from "../../types/interface";

export const guildmasterOrganisationControllerRoutes = (
    config: ControllerRouteConfig
) => {
    const { app, url } = config;

    app.get(
        `/api/p/organisation/id/:id`,
        {
            schema: {
                tags: ["Guildmaster"],
                summary: "Fetches an Organisation by its associated Id",
                response: {
                    200: {
                        $ref: schemaMappings["OrganisationDTO"],
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<OrganisationDTO, "id"> }>,
            reply: FastifyReply
        ) => {
            const { id } = request.params;
            console.log(id);

            const response = await axios.get(`${url}organisation/id/${id}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/p/organisation/name/:name`,
        {
            schema: {
                tags: ["Guildmaster"],
                summary:
                    "Fetches an Organisation by its associated display name",
                response: {
                    200: {
                        $ref: schemaMappings["OrganisationDTO"],
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<OrganisationDTO, "name"> }>,
            reply: FastifyReply
        ) => {
            const { name } = request.params;

            const response = await axios.get(`${url}organisation/name/${name}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.put(
        `/api/organisation/`,
        {
            schema: {
                description:
                    "Update an organisation, requires user authentication and correct internal organisation permissions to allow organisation editing capabilities",
                tags: ["Guildmaster"],
                summary:
                    "Updates an organisation's details granted correct permissions",
                body: {
                    $ref: schemaMappings["OrganisationDTO"],
                },
                response: {
                    200: {
                        $ref: schemaMappings["OrganisationDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Body: OrganisationDTO }>,
            reply: FastifyReply
        ) => {
            if (!request.user) {
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );
            }

            const { id } = request.user;
            const { body } = request;

            const response = await axios.put(`${url}organisation/${id}`, body);
            reply.code(response.status).send(response.data);
        }
    );

    app.post(
        `/api/organisation/`,
        {
            schema: {
                description:
                    "Create a new organisation, requires user authentication, and a valid supporting Industry and User Profile to create the organisation",
                tags: ["Guildmaster"],
                summary: "Creates a new organisation",
                body: {
                    $ref: schemaMappings["OrganisationDTO"],
                },
                response: {
                    200: {
                        $ref: schemaMappings["OrganisationDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Body: OrganisationDTO }>,
            reply: FastifyReply
        ) => {
            if (!request.user) {
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );
            }

            const { body } = request;

            const response = await axios.post(`${url}organisation/`, body);
            reply.code(response.status).send(response.data);
        }
    );

    app.delete(
        `/api/organisation/:id`,
        {
            schema: {
                description:
                    "Delete an organisation, requires user authentication and correct internal organisation permissions to allow organisation deletion capabilities",
                tags: ["Guildmaster"],
                summary: "Deletes an organisation granted correct permissions",
                response: {
                    204: { type: "null" },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<OrganisationDTO, "id"> }>,
            reply: FastifyReply
        ) => {
            if (!request.user) {
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );
            }

            const { id } = request.params;

            const response = await axios.delete(
                `${url}organisation/${id}/user/${request.user.id}`
            );
            reply.code(response.status).send(response.data);
        }
    );
};
