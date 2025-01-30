import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";

export const initSwaggerSchemas = (app: FastifyInstance) => {
    const schemasDir = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "node_modules",
        "@yoku-app",
        "shared-schemas",
        "dist",
        "schemas"
    ); // Path to your package's schemas directory

    const loadSchemas = (dir: string) => {
        // Read all files and directories in the current directory
        const files = fs.readdirSync(dir);

        files.forEach((file) => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // If it's a directory, recursively load schemas from it
                loadSchemas(fullPath);
            } else if (file.endsWith(".json")) {
                // If it's a JSON file, require and add the schema
                const schema = require(fullPath);
                app.addSchema({
                    $id: schema.title,
                    ...schema,
                });
            }
        });
    };

    // Start loading schemas from the schemas directory in your package
    loadSchemas(schemasDir);
};
