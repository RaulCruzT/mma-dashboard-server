import { PaginationQueryInterface } from "./global";

export interface TypeStrainParamsInterface {
    id: string;
}

export interface TypeStrainBodyInterface {
    name: string;
}

export interface TypeStrainPaginationQueryInterface extends PaginationQueryInterface {
    name_like: string;
}