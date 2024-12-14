import { FastifyInstance } from "fastify";
import { config } from "../config";

const API_URL = config.nirnrootApiURL;

export const userServiceController = async (app: FastifyInstance) => {
    app.get("/api/p/user/health", async (request, reply) => {});
};
