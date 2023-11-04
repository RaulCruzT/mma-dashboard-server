import { Request } from "express";

export default function getToken(req: Request): string | null {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split(" ")[1];
    } 
    return null;
}