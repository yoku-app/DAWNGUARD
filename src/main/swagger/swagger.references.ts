import fs from "fs";
import yaml from "js-yaml";
import path from "path";

class SchemaMappingsSingleton {
    private static instance: SchemaMappingsSingleton;
    private schemaMappings: Record<string, string>;

    private constructor() {
        // Load and parse the YAML file
        this.schemaMappings = yaml.load(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    "..",
                    "..",
                    "..",
                    "node_modules",
                    "@yoku-app",
                    "shared-schemas",
                    "dist",
                    "schema-map.yaml"
                ),
                "utf8"
            )
        ) as Record<string, string>;
    }

    public static getInstance(): SchemaMappingsSingleton {
        if (!SchemaMappingsSingleton.instance) {
            SchemaMappingsSingleton.instance = new SchemaMappingsSingleton();
        }
        return SchemaMappingsSingleton.instance;
    }

    public getSchemaMappings(): Record<string, string> {
        return this.schemaMappings;
    }
}

// Export a constant that references the parsed mappings
export const schemaMappings =
    SchemaMappingsSingleton.getInstance().getSchemaMappings();
