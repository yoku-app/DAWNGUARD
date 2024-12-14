import { User } from "@supabase/supabase-js";
import { FastifyReply, FastifyRequest } from "fastify";

const PUBLIC_ROUTE_PATTERN: RegExp = /^\/api\/p\//;

export const routeAuthenticationHook = async (
    validation: (
        request: FastifyRequest,
        response: FastifyReply
    ) => Promise<User | undefined>,
    request: FastifyRequest,
    response: FastifyReply
) => {
    // Check if the route is public
    if (!PUBLIC_ROUTE_PATTERN.test(request.url)) {
        // Validate user through token located in authorization header
        const user: User | undefined = await validation(request, response);

        if (!user) {
            response.status(401).send({ message: "Unauthorized" });
        }

        //Append Current User to Request
        request.user = user;
    }
};
