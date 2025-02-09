import { User } from "@supabase/supabase-js";
import { FastifyInstance, FastifyRequest } from "fastify";
import { validate } from "uuid";
import { AuthenticationError, BadRequestError } from "../types/error.interface";
import { ControllerRouteConfig } from "../types/interface";

export const validateUUID = (uuid: string) => {
    if (!validate(uuid)) {
        throw new BadRequestError("Invalid UUID");
    }
};

/**
 * Function to find any potential invalid UUIDs in a list of UUIDs,
 * returning them to appropriately throw an error.
 *
 * @param {string[]} uuids      - The list of UUIDs to check for validity.
 * @returns {string[]}          - The list of invalid UUIDs.
 */
export const findInvalidUUids = (uuids: string[]): string[] => {
    return uuids.filter((uuid) => !validate(uuid));
};

export const nullIfEmpty = (value?: string): string | null => {
    return value ? value : null;
};

export const getRequestUserOrThrow = (
    request: FastifyRequest
): NonNullable<User> => {
    if (!request.user) {
        throw new AuthenticationError(
            "Authentication required to perform this action"
        );
    }

    return request.user;
};

export const generateRouteConfig = (
    app: FastifyInstance,
    url: string
): ControllerRouteConfig => {
    return { app, url };
};
