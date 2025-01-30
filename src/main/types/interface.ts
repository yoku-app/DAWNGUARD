import { FastifyInstance } from "fastify";

export interface ControllerRouteConfig {
    app: FastifyInstance;
    url: string;
}
