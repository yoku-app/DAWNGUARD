import { UserProfile } from "@yoku-app/shared-schemas/dist/types/user/profile";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { schemaMappings } from "../../swagger/swagger.references";
import { AuthenticationError } from "../../types/error.interface";
import { ControllerRouteConfig } from "../../types/interface";

export const coloviaUserControllerRoutes = async (
    config: ControllerRouteConfig
): Promise<void> => {
    const { app, url } = config;
    app.get(
        `/api/p/user/id/:userId`,
        {
            schema: {
                tags: ["Colovia"],
                summary:
                    "Fetches a User's Profile from the provided User Id, linking from its protected User object",
                response: {
                    200: {
                        $ref: schemaMappings["UserProfile"],
                    },
                },
            },
        },

        async (
            request: FastifyRequest<{ Params: Pick<UserProfile, "userId"> }>,
            reply: FastifyReply
        ) => {
            const { userId } = request.params;

            const response = await axios.get(`${url}user/id/${userId}`);
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
                        $ref: schemaMappings["UserProfile"],
                    },
                },
            },
        },

        async (
            request: FastifyRequest<{ Params: Pick<UserProfile, "email"> }>,
            reply: FastifyReply
        ) => {
            const { email } = request.params;

            const response = await axios.get(`${url}user/email/${email}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/user/current/`,
        {
            schema: {
                tags: ["Colovia"],
                summary:
                    "Fetches the current User's Profile from the JWT token provided in the request",
                response: {
                    200: {
                        $ref: schemaMappings["UserProfile"],
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

            const { id } = request.user;
            const response = await axios.get(`${url}user/id/${id}`);
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
                    $ref: schemaMappings["UserProfile"],
                },
                response: {
                    200: {
                        $ref: schemaMappings["UserProfile"],
                    },
                },
                security: [{ BearerAuth: [] }],
            },
        },
        async (
            request: FastifyRequest<{ Body: UserProfile }>,
            reply: FastifyReply
        ) => {
            //todo: Look into organisation/application roles to enable cross user updates
            // For now, only the user can update their own profile

            if (!request.user)
                throw new AuthenticationError(
                    "Authentication required to perform this action"
                );

            // Retrieve the ID of the user making the request
            const { id } = request.user;
            const user: UserProfile = request.body;

            if (id !== user.userId)
                throw new AuthenticationError(
                    "You are not authorised to edit another user"
                );

            const response = await axios.put(`${url}user/`, user);
            reply.code(response.status).send(response.data);
        }
    );
};
