import UserProfileSchema from '@yoku-app/shared-schemas/dist/schemas/user/profile.schema.json';
import { FastifyInstance } from "fastify";

export const initSwaggerSchemas = (app: FastifyInstance) => {
    app.addSchema({
        $id: 'UserProfile',
        ...UserProfileSchema,
    })

};