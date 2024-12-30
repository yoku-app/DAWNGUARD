import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const authServiceController = async (app: FastifyInstance) => {
    app.get(
        "/api/p/health",
        async (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(200).send({ message: "Auth Service is healthy" });
        }
    );
};
