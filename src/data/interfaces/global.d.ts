import mongoose from "mongoose";

export interface PaginationQueryInterface {
    _start: number;
    _end: number;
    _sort: string;
    _order: mongoose.SortOrder;
}