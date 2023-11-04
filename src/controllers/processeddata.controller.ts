import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserModel, ProcessedDataModel } from '../models';
import { ProcessedDataBodyInterface, ProcessedDataPaginationQueryInterface, ProcessedDataParamsInterface } from '../data/interfaces/processeddata';
import { CreatorOptions, UserRoles } from '../data/enums/user.enum';
import mongoose from 'mongoose';
import { isNullOrEmpty, parseJwt } from '../utils';

export const CreateProcessedData: RequestHandler<unknown, unknown, ProcessedDataBodyInterface, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        actinobacteria,
        massDetection,
        chromatogramBuilder,
        deconvolution,
        isotope,
        filtered,
        identification,
        alignment,
        gapFilling,
        comments,
        dataSource,
        equipment,
        fileName,
        massIVEID,
        link
    } = req.body;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        await ProcessedDataModel.create({
            actinobacteria: isNullOrEmpty(actinobacteria) ? null : actinobacteria,
            massDetection: isNullOrEmpty(massDetection) ? null : massDetection,
            chromatogramBuilder: isNullOrEmpty(chromatogramBuilder) ? null : chromatogramBuilder,
            deconvolution: isNullOrEmpty(deconvolution) ? null : deconvolution,
            isotope: isNullOrEmpty(isotope) ? null : isotope,
            filtered: isNullOrEmpty(filtered) ? null : filtered,
            identification: isNullOrEmpty(identification) ? null : identification,
            alignment: isNullOrEmpty(alignment) ? null : alignment,
            gapFilling: isNullOrEmpty(gapFilling) ? null : gapFilling,
            comments: isNullOrEmpty(comments) ? null: comments,
            dataSource: isNullOrEmpty(dataSource) ? null : dataSource,
            equipment: isNullOrEmpty(equipment) ? null : equipment,
            fileName: isNullOrEmpty(fileName) ? null : fileName,
            massIVEID: isNullOrEmpty(massIVEID) ? null : massIVEID,
            link: isNullOrEmpty(link) ? null : link,
            creator: authenticatedUser._id
        }).catch(err => console.log(err))

        res.status(200).json({ message: "Processed data created successfully" });
    } catch (error) {
        next(error);
    }
};

export const GetProcessedDataById: RequestHandler<ProcessedDataParamsInterface, unknown, unknown, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const actinobacteria = await ProcessedDataModel.findOne({ _id: id })
            . populate({
                path:'actinobacteria',
                select:'identifierStrain'
            })
            .populate({
                path: 'creator',
                select: 'name email'
            }).exec();

        if (!actinobacteria) {
            throw createHttpError(404, "Processed data not found");
        }

        res.status(200).json(actinobacteria);
    } catch (error) {
        next(error);
    }
};

export const GetProcessedDataPagination: RequestHandler<unknown, unknown, unknown, ProcessedDataPaginationQueryInterface> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        _end,
        _order,
        _start,
        _sort,
        dataSource_like = "",
        equipment_like = "",
        fileName_like = "",
        actinobacteria = "",
        person,
    } = req.query;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        let query = {};

        if(dataSource_like) {
            query = {...query, dataSource: { $regex: dataSource_like, $options: "i" }}
        }

        if(equipment_like) {
            query = {...query, equipment: { $regex: equipment_like, $options: "i" }}
        }

        if(fileName_like) {
            query = {...query, fileName: { $regex: fileName_like, $options: "i" }}
        }


        if(actinobacteria) {
            query = {...query, actinobacteria: new mongoose.Types.ObjectId(actinobacteria) }
        }

        if (person) {
            if (person === CreatorOptions.Me) {
                query = {...query, creator: { $eq: authenticatedUser._id } }
            }

            if (person === CreatorOptions.Other) {
                query = {...query, creator: { $ne: authenticatedUser._id } }
            }
        }

        const processeddata = await ProcessedDataModel.find(query)
            .skip(_start)
            .limit(_end)
            .collation({ locale: 'en', strength: 2 })
            .sort(_sort ? {[_sort]: _order} : {dataSource: 1})
            .populate({
                path: 'actinobacteria',
                select: 'identifierStrain'
            })
            .populate({
                path: 'creator',
                select: 'name email'
            }).exec();

        const totalCount = await ProcessedDataModel.find(query).countDocuments();

        res.append('X-Total-Count', totalCount.toString());
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');

        res.status(200).json(processeddata);
    } catch (error) {
        next(error);
    }
}

export const EditProcessedData: RequestHandler<ProcessedDataParamsInterface, unknown, ProcessedDataBodyInterface, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const {
        actinobacteria,
        massDetection,
        chromatogramBuilder,
        deconvolution,
        isotope,
        filtered,
        identification,
        alignment,
        gapFilling,
        comments,
        dataSource,
        equipment,
        fileName,
        massIVEID,
        link
    } = req.body;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            throw createHttpError(401, "You cannot edit this processed data");
        }

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid processed data Id");
        }

        const processedData = await ProcessedDataModel.findById(id);

        if (!processedData) {
            throw createHttpError(404, "Processed data not found");
        }

        await ProcessedDataModel.findByIdAndUpdate(
            {
                _id: id
            },
            {
                actinobacteria: isNullOrEmpty(actinobacteria) ? null : actinobacteria,
                massDetection: isNullOrEmpty(massDetection) ? null : massDetection,
                chromatogramBuilder: isNullOrEmpty(chromatogramBuilder) ? null : chromatogramBuilder,
                deconvolution: isNullOrEmpty(deconvolution) ? null : deconvolution,
                isotope: isNullOrEmpty(isotope) ? null : isotope,
                filtered: isNullOrEmpty(filtered) ? null : filtered,
                identification: isNullOrEmpty(identification) ? null : identification,
                alignment: isNullOrEmpty(alignment) ? null : alignment,
                gapFilling: isNullOrEmpty(gapFilling) ? null : gapFilling,
                comments: isNullOrEmpty(comments) ? null: comments,
                dataSource: isNullOrEmpty(dataSource) ? null : dataSource,
                equipment: isNullOrEmpty(equipment) ? null : equipment,
                fileName: isNullOrEmpty(fileName) ? null : fileName,
                massIVEID: isNullOrEmpty(massIVEID) ? null : massIVEID,
                link: isNullOrEmpty(link) ? null : link,
            }
        );

        res.status(200).json({ message: "Processed data updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const DeleteProcessedData: RequestHandler<ProcessedDataParamsInterface, unknown, unknown, unknown>  = async (req, res, next) => {
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
            throw createHttpError(401, "You cannot delete this processed data");
        }

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid processed data id");
        }

        const processedData = await ProcessedDataModel.findById(id);

        if (!processedData) {
            throw createHttpError(404, "Processed data not found");
        }

        await ProcessedDataModel.deleteOne({_id: id});

        res.status(200).json({ message: "Processed data deleted successfully" });
    } catch (error) {
        next(error);
    }
}