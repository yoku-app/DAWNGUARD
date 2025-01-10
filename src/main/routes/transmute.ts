import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { parseAxiosHeaders } from "../utils/request";

const API_URL = config.transmuteApiURL;

export const imageTransformationService = async (app: FastifyInstance) => {
    app.get("/api/p/image/health", async (request, reply) => {
        const response = await axios.get(`${API_URL}image/health`);
        reply.code(response.status).send(response.data);
    });

    app.post(
        "/api/image/transform",
        async (request: FastifyRequest, reply: FastifyReply) => {
            const formData = await request.formData();

            const response = await axios.post(
                `${API_URL}image/transform`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    responseType: "arraybuffer",
                }
            );

            const headers = parseAxiosHeaders(response.headers);

            // Send Returned Image back to client
            reply.code(response.status).headers(headers).send(response.data);
        }
    );
};
