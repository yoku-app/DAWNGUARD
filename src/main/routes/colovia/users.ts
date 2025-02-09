import { UserDTO } from "@yoku-app/shared-schemas/dist/types/user/dto/user-dto";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { schemaMappings } from "../../swagger/swagger.references";
import {
    AuthenticationError,
    BadRequestError,
} from "../../types/error.interface";
import { ControllerRouteConfig } from "../../types/interface";
import {
    findInvalidUUids,
    getRequestUserOrThrow,
    validateUUID,
} from "../../utils/utils";

export const coloviaUserControllerRoutes = async (
    config: ControllerRouteConfig
): Promise<void> => {
    const { app, url } = config;
    app.get(
        `/api/user/session/`,
        {
            schema: {
                tags: ["Colovia"],
                summary:
                    "Fetches the current User's Profile from the JWT token provided in the request",
                response: {
                    200: {
                        $ref: schemaMappings["UserDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            if (!request.user)
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );

            const { id } = getRequestUserOrThrow(request);
            validateUUID(id);
            const response = await axios.get(`${url}user/session`, {
                headers: {
                    "X-User-Id": id,
                },
            });
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/p/user/display/id/:id`,
        {
            schema: {
                tags: ["Colovia"],
                summary:
                    "Fetches a User's Profile from the provided User Id, linking from its protected User object",
                response: {
                    200: {
                        $ref: schemaMappings["UserPartialDTO"],
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<UserDTO, "id"> }>,
            reply: FastifyReply
        ) => {
            const { id } = request.params;
            validateUUID(id);
            const response = await axios.get(`${url}user/display/id/${id}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/p/user/display/batch`,
        {
            schema: {
                tags: ["Colovia"],
                summary:
                    "Fetches a list of User Profiles from the provided User Ids, linking from its protected User object",
                querystring: {
                    type: "object",
                    properties: {
                        userIds: {
                            type: "string",
                            description:
                                "A list of User Ids separated by commas",
                        },
                        maxResults: {
                            type: "number",
                            description:
                                "The maximum number of User Ids that can be provided",
                        },
                    },
                    required: ["userIds"],
                },
                response: {
                    200: {
                        type: "object", // Response is a map with UUID keys and nullable UserPartialDTO values
                        additionalProperties: {
                            type: "object",
                            $ref: schemaMappings["UserPartialDTO"], // Ensure UserPartialDTO schema is defined in schemaMappings
                        },
                        description:
                            "A map of User IDs to UserPartialDTO, with possible null values",
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{
                Querystring: { userIds: string; maxResults?: number };
            }>,
            reply: FastifyReply
        ) => {
            // Convert into a list of unique user IDs, filter any potential falsy values
            const userIds = Array.from(
                new Set(request.query.userIds.split(",").filter(Boolean))
            );

            // todo: Look into handling big batch request with maximum value capabilities
            const maxResults = request.query.maxResults || 50;

            if (userIds.length === 0) {
                throw new BadRequestError("No userIds provided");
            }

            if (userIds.length > maxResults) {
                throw new BadRequestError(
                    `Too many userIds provided. Maximum of ${maxResults} allowed`
                );
            }

            // Locate any invalid User UUIDs provided
            const invalidIds = findInvalidUUids(Array.from(userIds));

            if (invalidIds.length > 0) {
                throw new BadRequestError(
                    `Invalid UUIDs: ${invalidIds.join(", ")}`
                );
            }

            const response = await axios.get(`${url}user/display/ids`, {
                params: {
                    userIds: userIds.join(","),
                },
            });
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/p/user/email/:email`,
        {
            schema: {
                tags: ["Colovia"],
                summary:
                    "Fetches a User's Profile from the provided User email, linking from its protected User object",
                response: {
                    200: {
                        $ref: schemaMappings["UserPartialDTO"],
                    },
                },
            },
        },
        async (
            request: FastifyRequest<{ Params: Pick<UserDTO, "email"> }>,
            reply: FastifyReply
        ) => {
            const { email } = request.params;

            const response = await axios.get(`${url}user/email/${email}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.put(
        `/api/user/`,
        {
            schema: {
                tags: ["Colovia"],
                summary: `Updates a User's Profile, with new values provided in the request body
                to be saved over the current version of the user profile`,
                body: {
                    $ref: schemaMappings["UserDTO"],
                },
                response: {
                    200: {
                        $ref: schemaMappings["UserDTO"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Body: UserDTO }>,
            reply: FastifyReply
        ) => {
            if (!request.user)
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );

            // Retrieve the ID of the user making the request
            const { id } = request.user;
            const user: UserDTO = request.body;

            if (id !== user.id)
                throw new AuthenticationError(
                    "You are not authorised to edit another user"
                );

            const response = await axios.put(`${url}user/`, user);
            reply.code(response.status).send(response.data);
        }
    );
};
