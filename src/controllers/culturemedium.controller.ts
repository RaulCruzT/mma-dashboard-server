import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserModel, CultureMediumModel, ActinobacteriaModel } from '../models';
import { CultureMediumParamsInterface, CultureMediumBodyInterface, CultureMediumPaginationQueryInterface } from '../data/interfaces/culturemedium';
import { UserRoles } from '../data/enums/user.enum';
import mongoose from 'mongoose';
import { isNullOrEmpty, parseJwt } from '../utils';

export const CreateCultureMedium: RequestHandler<unknown, unknown, CultureMediumBodyInterface, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        name
    } = req.body;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            throw createHttpError(401, "You cannot create a culture medium");
        }

        const cultureMediumExists = await CultureMediumModel.findOne({ name });

        if (cultureMediumExists) {
            throw createHttpError(404, "A culture medium with that name already exists");
        }

        await CultureMediumModel.create({
            name: isNullOrEmpty(name) ? null: name,
            creator: authenticatedUser._id
        });

        res.status(200).json({ message: "Culture medium created successfully" });
    } catch (error) {
        next(error);
    }
};

export const GetCultureMediumById: RequestHandler<CultureMediumParamsInterface, unknown, unknown, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            throw createHttpError(401, "You cannot access the culture medium data");
        }

        const cultureMedium = await CultureMediumModel.findOne({ _id: id }).populate("creator");

        if (!cultureMedium) {
            throw createHttpError(404, "Culture medium not found");
        }

        res.status(200).json(cultureMedium);
    } catch (error) {
        next(error);
    }
};

export const GetCultureMediumPagination: RequestHandler<unknown, unknown, unknown, CultureMediumPaginationQueryInterface> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        _end,
        _order,
        _start,
        _sort,
        name_like = ""
    } = req.query;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            throw createHttpError(401, "You cannot access the culture medium data");
        }

        let query = {};

        if(name_like) {
            query = {...query, name: { $regex: name_like, $options: "i" }}
        }

        const cultureMedium = await CultureMediumModel.find(query)
            .limit(_end)
            .skip(_start)
            .collation({ locale: 'en', strength: 2 })
            .sort(_sort ? {[_sort]: _order} : {name: 1});

        const totalCount = await CultureMediumModel.find(query).countDocuments();

        res.append('X-Total-Count', totalCount.toString());
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');

        res.status(200).json(cultureMedium);
    } catch (error) {
        next(error);
    }
}

export const EditCultureMedium: RequestHandler<CultureMediumParamsInterface, unknown, CultureMediumBodyInterface, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const {
        name
    } = req.body;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            throw createHttpError(401, "You cannot edit this culture medium");
        }

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid culture medium Id");
        }

        const cultureMedium = await CultureMediumModel.findById(id);

        if (!cultureMedium) {
            throw createHttpError(404, "Culture medium not found");
        }

        const cultureMediumExists = await CultureMediumModel.findOne({name, _id : {$ne: cultureMedium._id}});

        if (cultureMediumExists) {
            throw createHttpError(404, "A culture medium with that name already exists");
        }

        await CultureMediumModel.findByIdAndUpdate(
            {
                _id: id
            },
            {
                name: isNullOrEmpty(name) ? null: name
            }
        );

        res.status(200).json({ message: "Culture medium updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const DeleteCultureMedium: RequestHandler<CultureMediumParamsInterface, unknown, unknown, unknown>  = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            throw createHttpError(401, "You cannot delete this culture medium");
        }

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid culture medium id");
        }

        const cultureMedium = await CultureMediumModel.findById(id);

        if (!cultureMedium) {
            throw createHttpError(404, "Culture medium not found");
        }

        const isReferenced1 = await ActinobacteriaModel.exists({ characterizationGrowingMedia: cultureMedium._id });
        const isReferenced2 = await ActinobacteriaModel.exists({ characterizationNotGrowingMedia: cultureMedium._id });

        const isReferenced = isReferenced1 || isReferenced2;

        if (isReferenced) {
            throw createHttpError(400, "You cannot delete a referenced culture medium");
        }

        await CultureMediumModel.deleteOne({_id: id});

        res.status(200).json({ message: "Culture medium deleted successfully" });
    } catch (error) {
        next(error);
    }
}