import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { UserModel, ActinobacteriaModel } from '../models';
import { ActinobacteriaPaginationQueryInterface } from '../data/interfaces/actinobacteria';
import { parseJwt } from '../utils';
import { UserRoles } from '../data/enums/user.enum';

export const GetMyActinobacteriaPagination: RequestHandler<unknown, unknown, unknown, ActinobacteriaPaginationQueryInterface> = async (req, res, next) => {
    const token = req.headers.authorization;
    const {
        _end,
        _order,
        _start,
        _sort,
        identifierStrain_like = "",
        identifierSpecies_like = "",
        arnr16sCompleteness_like = ""
    } = req.query;
    const authenticatedUserEmail = parseJwt(token as string).email;

    try {
        const authenticatedUser = await UserModel.findOne({'email': authenticatedUserEmail});

        if (!authenticatedUser) {
            throw createHttpError(404, "User not found");
        }

        const authenticatedUserRole = authenticatedUser.role as string;

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

        if (![UserRoles.Manager as string, UserRoles.Admin as string].includes(authenticatedUserRole)) {
            query = {...query, creator: authenticatedUser._id }
        }

        const actinobacteria = await ActinobacteriaModel.find(query)
            .skip(_start)
            .limit(_end)
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
