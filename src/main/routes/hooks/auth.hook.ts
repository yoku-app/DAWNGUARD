import { User } from "@supabase/supabase-js";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationError } from "../../types/error.interface";

const PUBLIC_ROUTE_PATTERN: RegExp = /^\/api\/p\//;

export const routeAuthenticationHook = async (
    validation: (
        request: FastifyRequest,
        response: FastifyReply
    ) => Promise<User | undefined>,
    request: FastifyRequest,
    response: FastifyReply
): Promise<void> => {
    // Check if the route is public
    if (!PUBLIC_ROUTE_PATTERN.test(request.url)) {
        // Validate user through token located in authorization header
        const user: User | undefined = await validation(request, response);

        if (!user) {
            throw new AuthenticationError("Unauthorized");
        }

        //Append Current User to Request
        request.user = user;
    }
};
