import axios from "axios";
import { type FastifyReply } from "fastify";

/**
 * Handles an error response that has been returned from a Service.
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
export const handleServiceResponseError = (
    error: unknown,
    reply: FastifyReply
): void => {
    if (!axios.isAxiosError(error)) {
        reply.code(500).send({ message: "Internal Server Error" });
        return;
    }

    reply.code(error.response?.status ?? 500).send(error.response?.data);
};
