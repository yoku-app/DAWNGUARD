import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { UserProfile } from "../types/user.interface";

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
};
