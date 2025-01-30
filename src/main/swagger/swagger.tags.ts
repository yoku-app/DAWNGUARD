import { OpenAPIV2 } from "openapi-types";

export const swaggerTags: OpenAPIV2.TagObject[] = [
    {
        name: "Colovia",
        description: "Core Application Data Management Service",
    },
    {
        name: "Guildmaster",
        description: "Organisation Management Service",
    },
    {
        name: "Ordinator",
        description: "Survey Distribution Service",
    },
    {
        name: "Blackbriar",
        description: "Financial Management Service",
    },

    {
        name: "Transmute",
        description: "Image Transformation Service",
    },
    {
        name: "Dawnguard",
        description: "API Gateway / User Authentication + Privilege Service",
    },
];
