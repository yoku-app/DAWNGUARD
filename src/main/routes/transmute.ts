import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { ImageTransformRequest } from "../types/image.interface";

const API_URL = config.transmuteApiURL;

export const imageTransformationService = async (app: FastifyInstance) => {
    app.get("/api/p/image/health", async (request, reply) => {
        const response = await axios.get(`${API_URL}image/health`);
        reply.code(response.status).send(response.data);
    });

    app.post(
        "/api/image/transform",
        async (
            request: FastifyRequest<{ Body: ImageTransformRequest }>,
            reply: FastifyReply
        ) => {
            // try {
            // const response = await axios.post(`${API_URL}image/transform`, {
            //     image,
            //     transformation,
            // });
            // reply.code(response.status).send(response.data);
        }
    );
};
