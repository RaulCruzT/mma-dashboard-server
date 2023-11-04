import { PaginationQueryInterface } from "./global";

export interface CultureMediumParamsInterface {
    id: string;
}

export interface CultureMediumBodyInterface {
    name: string;
}

export interface CultureMediumPaginationQueryInterface extends PaginationQueryInterface {
    name_like: string;
}