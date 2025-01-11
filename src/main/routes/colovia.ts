import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { AuthenticationError } from "../types/error.interface";
// import { UserProfile } from "../types/user.interface";
import {type ProfileSchema} from '@yoku-app/shared-schemas/dist/profile.schema';

const API_URL = config.coloviaApiURL;

export const coreDataManagementService = async (app: FastifyInstance) => {
    app.get(
        "/api/p/core/health",
        async (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(200).send({ message: "User Service is healthy" });
        }
    );

    app.get(
        `/api/p/user/:userId`,
        async (
            request: FastifyRequest<{ Params: Pick<UserProfile, "userId"> }>,
            reply: FastifyReply
        ) => {
            const { userId } = request.params;

            const response = await axios.get(`${API_URL}user/${userId}`);
            reply.code(response.status).send(response.data);
        }
    );

    app.put(
        `/api/user/`,
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
