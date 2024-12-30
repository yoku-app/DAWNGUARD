import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";

const API_URL = config.blackbriarApiURL;

export const financialServiceController = async (app: FastifyInstance) => {
    app.get(
        "/api/p/finance/health",
        async (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(200).send({ message: "User Service is healthy" });
        }
    );
};
