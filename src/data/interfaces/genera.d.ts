import { PaginationQueryInterface } from "./global";

export interface GeneraParamsInterface {
    id: string;
}

export interface GeneraBodyInterface {
    name: string;
}

export interface GeneraPaginationQueryInterface extends PaginationQueryInterface {
    name_like: string;
}