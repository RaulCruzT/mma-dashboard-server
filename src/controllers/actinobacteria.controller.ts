import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserModel, ActinobacteriaModel, AssemblyModel, ProcessedDataModel } from '../models';
import { ActinobacteriaParamsInterface, ActinobacteriaPaginationQueryInterface, ActinobacteriaBodyInterface } from '../data/interfaces/actinobacteria';
import { parseJwt, isNullOrEmpty, isArrayEmpty } from '../utils';
import { CreatorOptions, UserRoles } from '../data/enums/user.enum';
import mongoose from 'mongoose';

export const CreateActinobacteria: RequestHandler<unknown, unknown, ActinobacteriaBodyInterface, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        identifierStrain,
        identifierSpecies,
        identifierMainPhoto,
        identifierPhotos,
        identifierLocalStorage,
        identifierInternationalStorage,
        identifierComments,
        geographyIsolationSite,
        geographyCoordinates,
        geographyIsolationSource,
        geographyAltitude,
        geographyComments,
        isolationMedium,
        isolationTemperature,
        isolationMethod,
        isolationResponsible,
        isolationThesisPaper,
        isolationThesisPaperLink,
        isolationComments,
        arnr16sSize,
        arnr16sSequenceFile,
        arnr16sMacrogenFile,
        arnr16sComments,
        enzymesComments,
        genomeRawData,
        genomeComments,
        bioactivityFile,
        bioactivityComments,
        metabolomicsMedinaFoundationReports,
        metabolomicsRawData,
        metabolomicsComments,
        identifierGenera,
        arnr16sCompleteness,
        characterizationGrowingMedia,
        characterizationNotGrowingMedia,
        enzymesNa,
        bioactivityYes,
        bioactivityNo,
        bioactivityNa,
        enzymesYes,
        enzymesNo,
        characterizationMycelial,
        characterizationColoniesDay,
        characterizationSporulationDay,
        characterizationBiomassDay,
        characterizationShape,
        characterizationBorder,
        characterizationElevation,
        characterizationSurface,
        characterizationColor,
        characterizationTransparency,
        characterizationBrightness,
        characterizationComments
    } = req.body;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const actinobacteriaExists = await ActinobacteriaModel.findOne({ identifierStrain });

        if (actinobacteriaExists) {
            throw createHttpError(404, "An actinobacteria with that strain already exists");
        }

        await ActinobacteriaModel.create({
            identifierStrain: isNullOrEmpty(identifierStrain) ? null : identifierStrain,
            identifierSpecies: isNullOrEmpty(identifierSpecies) ? null : identifierSpecies,
            identifierMainPhoto: isNullOrEmpty(identifierMainPhoto) ? null : identifierMainPhoto,
            identifierPhotos: isNullOrEmpty(identifierPhotos) ? null : identifierPhotos,
            identifierLocalStorage: isNullOrEmpty(identifierLocalStorage) ? null : identifierLocalStorage,
            identifierInternationalStorage: isNullOrEmpty(identifierInternationalStorage) ? null : identifierInternationalStorage,
            identifierComments: isNullOrEmpty(identifierComments) ? null : identifierComments,
            geographyIsolationSite: isNullOrEmpty(geographyIsolationSite) ? null : geographyIsolationSite,
            geographyCoordinates: isNullOrEmpty(geographyCoordinates) ? null : geographyCoordinates,
            geographyIsolationSource: isNullOrEmpty(geographyIsolationSource) ? null : geographyIsolationSource,
            geographyAltitude: geographyAltitude ? geographyAltitude : 0,
            geographyComments: isNullOrEmpty(geographyComments) ? null : geographyComments,
            isolationMedium: isNullOrEmpty(isolationMedium) ? null : isolationMedium,
            isolationTemperature: isolationTemperature ? isolationTemperature : 0,
            isolationMethod: isNullOrEmpty(isolationMethod) ? null : isolationMethod,
            isolationResponsible: isNullOrEmpty(isolationResponsible) ? null : isolationResponsible,
            isolationThesisPaper: isNullOrEmpty(isolationThesisPaper) ? null : isolationThesisPaper,
            isolationThesisPaperLink: isNullOrEmpty(isolationThesisPaperLink) ? null : isolationThesisPaperLink,
            isolationComments: isNullOrEmpty(isolationComments) ? null : isolationComments,
            arnr16sSize: arnr16sSize ? arnr16sSize : 0,
            arnr16sSequenceFile: isNullOrEmpty(arnr16sSequenceFile) ? null : arnr16sSequenceFile,
            arnr16sMacrogenFile: isNullOrEmpty(arnr16sMacrogenFile) ? null : arnr16sMacrogenFile,
            arnr16sComments: isNullOrEmpty(arnr16sComments) ? null : arnr16sComments,
            enzymesComments: isNullOrEmpty(enzymesComments) ? null : enzymesComments,
            genomeRawData: isNullOrEmpty(genomeRawData) ? null : genomeRawData,
            genomeComments: isNullOrEmpty(genomeComments) ? null : genomeComments,
            bioactivityFile: isNullOrEmpty(bioactivityFile) ? null : bioactivityFile,
            bioactivityComments: isNullOrEmpty(bioactivityComments) ? null : bioactivityComments,
            metabolomicsMedinaFoundationReports: isNullOrEmpty(metabolomicsMedinaFoundationReports) ? null : metabolomicsMedinaFoundationReports,
            metabolomicsRawData: isNullOrEmpty(metabolomicsRawData) ? null : metabolomicsRawData,
            metabolomicsComments: isNullOrEmpty(metabolomicsComments) ? null : metabolomicsComments,
            identifierGenera: isNullOrEmpty(identifierGenera) ? null : identifierGenera,
            arnr16sCompleteness: isNullOrEmpty(arnr16sCompleteness) ? null : arnr16sCompleteness,
            characterizationGrowingMedia: isArrayEmpty(characterizationGrowingMedia) ? [] : characterizationGrowingMedia,
            characterizationNotGrowingMedia: isArrayEmpty(characterizationNotGrowingMedia) ? [] : characterizationNotGrowingMedia,
            enzymesNa: isArrayEmpty(enzymesNa) ? [] : enzymesNa,
            bioactivityYes: isArrayEmpty(bioactivityYes) ? [] : bioactivityYes,
            bioactivityNo: isArrayEmpty(bioactivityNo) ? [] : bioactivityNo,
            bioactivityNa: isArrayEmpty(bioactivityNa) ? [] : bioactivityNa,
            enzymesYes: isArrayEmpty(enzymesYes) ? [] : enzymesYes,
            enzymesNo: isArrayEmpty(enzymesNo) ? [] : enzymesNo,
            characterizationMycelial: isNullOrEmpty(characterizationMycelial) ? null : characterizationMycelial,
            characterizationColoniesDay: characterizationColoniesDay ? characterizationColoniesDay : 0,
            characterizationSporulationDay: characterizationSporulationDay ? characterizationSporulationDay : 0,
            characterizationBiomassDay: characterizationBiomassDay ? characterizationBiomassDay : 0,
            characterizationShape: isNullOrEmpty(characterizationShape) ? null : characterizationShape,
            characterizationBorder: isNullOrEmpty(characterizationBorder) ? null : characterizationBorder,
            characterizationElevation: isNullOrEmpty(characterizationElevation) ? null : characterizationElevation,
            characterizationSurface: isNullOrEmpty(characterizationSurface) ? null : characterizationSurface,
            characterizationColor: isNullOrEmpty(characterizationColor) ? null : characterizationColor,
            characterizationTransparency: isNullOrEmpty(characterizationTransparency) ? null : characterizationTransparency,
            characterizationBrightness: isNullOrEmpty(characterizationBrightness) ? null : characterizationBrightness,
            characterizationComments: isNullOrEmpty(characterizationComments) ? null : characterizationComments,
            creator: authenticatedUser._id
        }).catch(err => console.log(err));

        res.status(200).json({ message: "Actinobacteria created successfully" });
    } catch (error) {
        next(error);
    }
};

export const GetActinobacteriaById: RequestHandler<ActinobacteriaParamsInterface, unknown, unknown, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const actinobacteria = await ActinobacteriaModel.findOne({ _id: id })
            . populate({
                path:'identifierGenera',
                select:'name'
            })
            .populate({
                path: 'characterizationGrowingMedia',
                select: 'name'
            })
            .populate({
                path: 'characterizationNotGrowingMedia',
                select: 'name'
            })
            .populate({
                path: 'bioactivityYes',
                select: 'name'
            })
            .populate({
                path: 'bioactivityNo',
                select: 'name'
            })
            .populate({
                path: 'bioactivityNa',
                select: 'name'
            })
            .populate({
                path: 'enzymesYes',
                select: 'name'
            })
            .populate({
                path: 'enzymesNo',
                select: 'name'
            })
            .populate({
                path: 'enzymesNa',
                select: 'name'
            })
            .populate({
                path: 'creator',
                select: 'name email'
            }).exec().catch(err => console.log(err));

        if (!actinobacteria) {
            throw createHttpError(404, "Actinobacteria not found");
        }

        res.status(200).json(actinobacteria);
    } catch (error) {
        next(error);
    }
};

export const GetActinobacteriaPagination: RequestHandler<unknown, unknown, unknown, ActinobacteriaPaginationQueryInterface> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        _end,
        _order,
        _start,
        _sort,
        identifierStrain_like = "",
        identifierSpecies_like = "",
        arnr16sCompleteness_like = "",
        person,
    } = req.query;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        let query = {};

        if(identifierStrain_like) {
            query = {...query, identifierStrain: { $regex: identifierStrain_like, $options: "i" }}
        }

        if(identifierSpecies_like) {
            query = {...query, identifierSpecies: { $regex: identifierSpecies_like, $options: "i" }}
        }

        if(arnr16sCompleteness_like) {
            query = {...query, arnr16sCompleteness: { $regex: arnr16sCompleteness_like, $options: "i" }}
        }

        if (person) {
            if (person === CreatorOptions.Me) {
                query = {...query, creator: { $eq: authenticatedUser._id } }
            }

            if (person === CreatorOptions.Other) {
                query = {...query, creator: { $ne: authenticatedUser._id } }
            }
        }

        const actinobacteria = await ActinobacteriaModel.find(query)
            .skip(_start)
            .limit(_end)
            .collation({ locale: 'en', strength: 2 })
            .sort(_sort ? {[_sort]: _order} : {identifierStrain: 1})
            . populate({
                path:'identifierGenera',
                select:'name'
            })
            .populate({
                path: 'creator',
                select: 'name email'
            }).exec();

        const totalCount = await ActinobacteriaModel.find(query).countDocuments();

        res.append('X-Total-Count', totalCount.toString());
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');

        res.status(200).json(actinobacteria);
    } catch (error) {
        next(error);
    }
}

export const EditActinobacteria: RequestHandler<ActinobacteriaParamsInterface, unknown, ActinobacteriaBodyInterface, unknown> = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const {
        identifierStrain,
        identifierSpecies,
        identifierMainPhoto,
        identifierPhotos,
        identifierLocalStorage,
        identifierInternationalStorage,
        identifierComments,
        geographyIsolationSite,
        geographyCoordinates,
        geographyIsolationSource,
        geographyAltitude,
        geographyComments,
        isolationMedium,
        isolationTemperature,
        isolationMethod,
        isolationResponsible,
        isolationThesisPaper,
        isolationThesisPaperLink,
        isolationComments,
        arnr16sSize,
        arnr16sSequenceFile,
        arnr16sMacrogenFile,
        arnr16sComments,
        enzymesComments,
        genomeRawData,
        genomeComments,
        bioactivityFile,
        bioactivityComments,
        metabolomicsMedinaFoundationReports,
        metabolomicsRawData,
        metabolomicsComments,
        identifierGenera,
        arnr16sCompleteness,
        characterizationGrowingMedia,
        characterizationNotGrowingMedia,
        enzymesNa,
        bioactivityYes,
        bioactivityNo,
        bioactivityNa,
        enzymesYes,
        enzymesNo,
        characterizationMycelial,
        characterizationColoniesDay,
        characterizationSporulationDay,
        characterizationBiomassDay,
        characterizationShape,
        characterizationBorder,
        characterizationElevation,
        characterizationSurface,
        characterizationColor,
        characterizationTransparency,
        characterizationBrightness,
        characterizationComments
    } = req.body;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid actinobacteria id");
        }

        const actinobacteria = await ActinobacteriaModel.findById(id);

        if (!actinobacteria) {
            throw createHttpError(404, "Actinobacteria not found");
        }

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole) && authenticatedUser._id !== actinobacteria.creator) {
            throw createHttpError(401, "You cannot update this actinobacteria");
        }

        await ActinobacteriaModel.findByIdAndUpdate(
            {
                _id: id
            },
            {
                identifierStrain: isNullOrEmpty(identifierStrain) ? null : identifierStrain,
                identifierSpecies: isNullOrEmpty(identifierSpecies) ? null : identifierSpecies,
                identifierMainPhoto: isNullOrEmpty(identifierMainPhoto) ? null : identifierMainPhoto,
                identifierPhotos: isNullOrEmpty(identifierPhotos) ? null : identifierPhotos,
                identifierLocalStorage: isNullOrEmpty(identifierLocalStorage) ? null : identifierLocalStorage,
                identifierInternationalStorage: isNullOrEmpty(identifierInternationalStorage) ? null : identifierInternationalStorage,
                identifierComments: isNullOrEmpty(identifierComments) ? null : identifierComments,
                geographyIsolationSite: isNullOrEmpty(geographyIsolationSite) ? null : geographyIsolationSite,
                geographyCoordinates: isNullOrEmpty(geographyCoordinates) ? null : geographyCoordinates,
                geographyIsolationSource: isNullOrEmpty(geographyIsolationSource) ? null : geographyIsolationSource,
                geographyAltitude: geographyAltitude ? geographyAltitude : 0,
                geographyComments: isNullOrEmpty(geographyComments) ? null : geographyComments,
                isolationMedium: isNullOrEmpty(isolationMedium) ? null : isolationMedium,
                isolationTemperature: isolationTemperature ? isolationTemperature : 0,
                isolationMethod: isNullOrEmpty(isolationMethod) ? null : isolationMethod,
                isolationResponsible: isNullOrEmpty(isolationResponsible) ? null : isolationResponsible,
                isolationThesisPaper: isNullOrEmpty(isolationThesisPaper) ? null : isolationThesisPaper,
                isolationThesisPaperLink: isNullOrEmpty(isolationThesisPaperLink) ? null : isolationThesisPaperLink,
                isolationComments: isNullOrEmpty(isolationComments) ? null : isolationComments,
                arnr16sSize: arnr16sSize ? arnr16sSize : 0,
                arnr16sSequenceFile: isNullOrEmpty(arnr16sSequenceFile) ? null : arnr16sSequenceFile,
                arnr16sMacrogenFile: isNullOrEmpty(arnr16sMacrogenFile) ? null : arnr16sMacrogenFile,
                arnr16sComments: isNullOrEmpty(arnr16sComments) ? null : arnr16sComments,
                enzymesComments: isNullOrEmpty(enzymesComments) ? null : enzymesComments,
                genomeRawData: isNullOrEmpty(genomeRawData) ? null : genomeRawData,
                genomeComments: isNullOrEmpty(genomeComments) ? null : genomeComments,
                bioactivityFile: isNullOrEmpty(bioactivityFile) ? null : bioactivityFile,
                bioactivityComments: isNullOrEmpty(bioactivityComments) ? null : bioactivityComments,
                metabolomicsMedinaFoundationReports: isNullOrEmpty(metabolomicsMedinaFoundationReports) ? null : metabolomicsMedinaFoundationReports,
                metabolomicsRawData: isNullOrEmpty(metabolomicsRawData) ? null : metabolomicsRawData,
                metabolomicsComments: isNullOrEmpty(metabolomicsComments) ? null : metabolomicsComments,
                identifierGenera: isNullOrEmpty(identifierGenera) ? null : identifierGenera,
                arnr16sCompleteness: isNullOrEmpty(arnr16sCompleteness) ? null : arnr16sCompleteness,
                characterizationGrowingMedia: isArrayEmpty(characterizationGrowingMedia) ? [] : characterizationGrowingMedia,
                characterizationNotGrowingMedia: isArrayEmpty(characterizationNotGrowingMedia) ? [] : characterizationNotGrowingMedia,
                enzymesNa: isArrayEmpty(enzymesNa) ? [] : enzymesNa,
                bioactivityYes: isArrayEmpty(bioactivityYes) ? [] : bioactivityYes,
                bioactivityNo: isArrayEmpty(bioactivityNo) ? [] : bioactivityNo,
                bioactivityNa: isArrayEmpty(bioactivityNa) ? [] : bioactivityNa,
                enzymesYes: isArrayEmpty(enzymesYes) ? [] : enzymesYes,
                enzymesNo: isArrayEmpty(enzymesNo) ? [] : enzymesNo,
                characterizationMycelial: isNullOrEmpty(characterizationMycelial) ? null : characterizationMycelial,
                characterizationColoniesDay: characterizationColoniesDay ? characterizationColoniesDay : 0,
                characterizationSporulationDay: characterizationSporulationDay ? characterizationSporulationDay : 0,
                characterizationBiomassDay: characterizationBiomassDay ? characterizationBiomassDay : 0,
                characterizationShape: isNullOrEmpty(characterizationShape) ? null : characterizationShape,
                characterizationBorder: isNullOrEmpty(characterizationBorder) ? null : characterizationBorder,
                characterizationElevation: isNullOrEmpty(characterizationElevation) ? null : characterizationElevation,
                characterizationSurface: isNullOrEmpty(characterizationSurface) ? null : characterizationSurface,
                characterizationColor: isNullOrEmpty(characterizationColor) ? null : characterizationColor,
                characterizationTransparency: isNullOrEmpty(characterizationTransparency) ? null : characterizationTransparency,
                characterizationBrightness: isNullOrEmpty(characterizationBrightness) ? null : characterizationBrightness,
                characterizationComments: isNullOrEmpty(characterizationComments) ? null : characterizationComments
            }
        );

        res.status(200).json({ message: "Actinobacteria updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const DeleteActinobacteria: RequestHandler<ActinobacteriaParamsInterface, unknown, unknown, unknown>  = async (req, res, next) => {
    const token = req.headers.authorization;
    const { id } = req.params;
    const authenticatedUserEmail = parseJwt(token as string).email;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid actinobacteria id");
        }

        const actinobacteria = await ActinobacteriaModel.findById(id);

        if (!actinobacteria) {
            throw createHttpError(404, "Actinobacteria not found");
        }

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole) && authenticatedUser._id !== actinobacteria.creator) {
            throw createHttpError(401, "You cannot delete this actinobacteria");
        }

        await AssemblyModel.deleteMany({actinobacteria: actinobacteria._id}).session(session);
        await ProcessedDataModel.deleteMany({actinobacteria: actinobacteria._id}).session(session);

        await ActinobacteriaModel.deleteOne({_id: id}).session(session);

        await session.commitTransaction();

        res.status(200).json({ message: "Actinobacteria deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    }
}
