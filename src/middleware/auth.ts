import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { getToken } from '../utils';

export const requiresAuth: RequestHandler = (req, res, next) => {
    const token = getToken(req);
    if (token) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
}