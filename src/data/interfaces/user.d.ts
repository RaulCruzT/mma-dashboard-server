import { UserRoles } from "../enums/user.enum";
import { PaginationQueryInterface } from "./global";

export interface UserParamsInterface {
    id: string;
}

export interface UserBodyInterface {
    name: string;
    email: string;
    avatar: string;
    role: UserRoles;
}

export interface UserPaginationQueryInterface extends PaginationQueryInterface {
    name_like: string;
    email_like: string;
}