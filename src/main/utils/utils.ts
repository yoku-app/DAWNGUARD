import { FastifyInstance } from "fastify";
import { validate } from "uuid";
import { BadRequestError } from "../types/error.interface";
import { ControllerRouteConfig } from "../types/interface";

export const validateUUID = (uuid: string) => {
    if (!validate(uuid)) {
        throw new BadRequestError("Invalid UUID");
    }
};

export const generateRouteConfig = (
    app: FastifyInstance,
    url: string
): ControllerRouteConfig => {
    return { app, url };
};
