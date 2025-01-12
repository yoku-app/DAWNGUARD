import { AuthError } from "@supabase/supabase-js";
import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import { ErrorResponse } from "./types/error.interface";

/**
 * Global Error handler that will deal with all errors thrown (both from internal functionality, and external services)
 *
 * The services have been set up to throw specific Error objects that contain
 * the code, and a common set of properties in the data object that are useful
 * for the client to know about.
 *
 * We also deal with other potential errors that might be thrown that we can
 * not be ascertain can be accessed in the same manner
 *
 * @param {unknown} error - The error object that has been thrown
 * @param {FastifyReply} reply - The reply reference used to send a response to the client
 */
export const handleError = (
    error: unknown,
    _: FastifyRequest,
    reply: FastifyReply
): void => {
    console.error(error);
    // If Error is returned from a response sent to a seperate service, return its associated error
    if (axios.isAxiosError(error)) {
        reply.code(error.response?.status ?? 500).send(error.response?.data);
        return;
    }

    // If Error is thrown from Supabase, return associated error with relevant details
    if (isAuthClientError(error)) {
        reply.code(error.status ?? 401).send(error.message);
        return;
    }

    // If Error is thrown internally, return associated error with relevant details
    if (isCustomError(error)) {
        reply.code(error.getStatus()).send(error.message);
        return;
    }

    // If Error is thrown from an unknown source, return a generic error
    reply.code(500).send("An unexpected error occurred");
};

const isCustomError = (error: unknown): error is ErrorResponse => {
    return error instanceof ErrorResponse;
};

const isAuthClientError = (error: unknown): error is AuthError => {
    return error instanceof AuthError;
};
