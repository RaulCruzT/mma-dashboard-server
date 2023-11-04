import { PaginationQueryInterface } from "./global";

export interface EnzymeParamsInterface {
    id: string;
}

export interface EnzymeBodyInterface {
    name: string;
}

export interface EnzymePaginationQueryInterface extends PaginationQueryInterface {
    name_like: string;
}