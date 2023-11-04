import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserModel, TypeStrainModel, ActinobacteriaModel } from '../models';
import { TypeStrainParamsInterface, TypeStrainBodyInterface, TypeStrainPaginationQueryInterface } from '../data/interfaces/typestrain';
import { UserRoles } from '../data/enums/user.enum';
import mongoose from 'mongoose';
import { isNullOrEmpty, parseJwt } from '../utils';

export const CreateTypeStrain: RequestHandler<unknown, unknown, TypeStrainBodyInterface, unknown> = async (req, res, next) => {
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
            throw createHttpError(401, "You cannot create a type strain");
        }

        const typeStrainExists = await TypeStrainModel.findOne({ name });

        if (typeStrainExists) {
            throw createHttpError(404, "A type strain with that name already exists");
        }

        await TypeStrainModel.create({
            name: isNullOrEmpty(name) ? null: name,
            creator: authenticatedUser._id
        });

        res.status(200).json({ message: "Type strain created successfully" });
    } catch (error) {
        next(error);
    }
};

export const GetTypeStrainById: RequestHandler<TypeStrainParamsInterface, unknown, unknown, unknown> = async (req, res, next) => {
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
            throw createHttpError(401, "You cannot access the type strain data");
        }

        const typeStrain = await TypeStrainModel.findOne({ _id: id }).populate("creator");

        if (!typeStrain) {
            throw createHttpError(404, "Type strain not found");
        }

        res.status(200).json(typeStrain);
    } catch (error) {
        next(error);
    }
};

export const GetTypeStrainPagination: RequestHandler<unknown, unknown, unknown, TypeStrainPaginationQueryInterface> = async (req, res, next) => {
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
            throw createHttpError(401, "You cannot access the type strain data");
        }

        let query = {};

        if(name_like) {
            query = {...query, name: { $regex: name_like, $options: "i" }}
        }

        const typeStrain = await TypeStrainModel.find(query)
            .limit(_end)
            .skip(_start)
            .collation({ locale: 'en', strength: 2 })
            .sort(_sort ? {[_sort]: _order} : {name: 1});

        const totalCount = await TypeStrainModel.find(query).countDocuments();

        res.append('X-Total-Count', totalCount.toString());
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');

        res.status(200).json(typeStrain);
    } catch (error) {
        next(error);
    }
}

export const EditTypeStrain: RequestHandler<TypeStrainParamsInterface, unknown, TypeStrainBodyInterface, unknown> = async (req, res, next) => {
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
            throw createHttpError(401, "You cannot edit this type strain");
        }

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid type strain Id");
        }

        const typeStrain = await TypeStrainModel.findById(id);

        if (!typeStrain) {
            throw createHttpError(404, "Types strain not found");
        }

        const typeStrainExists = await TypeStrainModel.findOne({name, _id : {$ne: typeStrain._id}});

        if (typeStrainExists) {
            throw createHttpError(404, "A type strain with that name already exists");
        }

        await TypeStrainModel.findByIdAndUpdate(
            {
                _id: id
            },
            {
                name: isNullOrEmpty(name) ? null: name
            }
        );

        res.status(200).json({ message: "Type strain updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const DeleteTypeStrain: RequestHandler<TypeStrainParamsInterface, unknown, unknown, unknown>  = async (req, res, next) => {
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
            throw createHttpError(401, "You cannot delete this type strain");
        }

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid type strain id");
        }

        const typeStrain = await TypeStrainModel.findById(id);

        if (!typeStrain) {
            throw createHttpError(404, "Type strain not found");
        }

        const isReferenced1 = await ActinobacteriaModel.exists({ bioactivityYes: typeStrain._id });
        const isReferenced2 = await ActinobacteriaModel.exists({ bioactivityNo: typeStrain._id });
        const isReferenced3 = await ActinobacteriaModel.exists({ bioactivityNa: typeStrain._id });

        const isReferenced = isReferenced1 || isReferenced2 || isReferenced3;

        if (isReferenced) {
            throw createHttpError(400, "You cannot delete a referenced type strain");
        }

        await TypeStrainModel.deleteOne({_id: id});

        res.status(200).json({ message: "Type strain deleted successfully" });
    } catch (error) {
        next(error);
    }
}