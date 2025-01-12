import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

export const parseAxiosHeaders = (
    headers: AxiosResponseHeaders | Partial<RawAxiosResponseHeaders>
) => {
    // Transform Axios headers to match Fastify's expected type
    return Object.entries(headers).reduce((acc, [key, value]) => {
        if (typeof value === "string" || Array.isArray(value)) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string | string[]>);
};
