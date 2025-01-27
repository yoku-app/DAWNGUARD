import { type UserProfile } from "@yoku-app/shared-schemas/dist/types/user/profile.schema";
import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { AuthenticationError } from "../types/error.interface";

const API_URL = config.coloviaApiURL;

export const coreDataManagementService = async (app: FastifyInstance) => {
    app.get(
        "/api/p/core/health",
        {
            schema: {
                description: "Health Check",
                tags: ["Colovia"],
                summary:
                    "Will ping the Colovia service to check if it is responding to incoming requests",
                response: {
                    200: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(200).send({ message: "User Service is healthy" });
        }
    );

    app.get(
        `/api/p/user/id/:userId`,
        {
            schema: {
                description: "Fetches a User's Profile",
                tags: ["Colovia"],
                summary:
                    "Fetches a User's Profile from the provided User Id, linking from its protected User object",
                response: {
                    200: {
                        $ref: "UserProfile",
                    },
                },
            },
        },

        async (
            request: FastifyRequest<{ Params: Pick<UserProfile, "userId"> }>,
            reply: FastifyReply
        ) => {
            const { userId } = request.params;

            const response = await axios.get(`${API_URL}user/id/${userId}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.get(
        `/api/p/user/email/:email`,
        {
            schema: {
                description: "Fetches a User's Profile",
                tags: ["Colovia"],
                summary:
                    "Fetches a User's Profile from the provided User email, linking from its protected User object",
                response: {
                    200: {
                        $ref: "UserProfile",
                    },
                },
            },
        },

        async (
            request: FastifyRequest<{ Params: Pick<UserProfile, "email"> }>,
            reply: FastifyReply
        ) => {
            const { email } = request.params;

            const response = await axios.get(`${API_URL}user/email/${email}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.put(
        `/api/user/`,
        {
            schema: {
                description: "Updates a User's Profile",
                tags: ["Colovia"],
                summary: `Updates a User's Profile, with new values provided in the request body 
                to be saved over the current version of the user profile`,
                body: {
                    $ref: "UserProfile",
                },
                response: {
                    200: {
                        $ref: "UserProfile",
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

            const response = await axios.put(`${API_URL}user/`, user);
            reply.code(response.status).send(response.data);
        }
    );
};
