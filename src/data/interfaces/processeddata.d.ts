import { PaginationQueryInterface } from "./global";

export interface ProcessedDataParamsInterface {
    id: string;
}

export interface ProcessedDataBodyInterface {
    actinobacteria: string;
    massDetection: string;
    chromatogramBuilder: string;
    deconvolution: string;
    isotope: string;
    filtered: string;
    identification: string;
    alignment: string;
    gapFilling: string;
    comments: string;
    dataSource: string;
    equipment: string;
    fileName: string;
    massIVEID: string;
    link: string;
}

export interface ProcessedDataPaginationQueryInterface extends PaginationQueryInterface {
    dataSource_like: string;
    equipment_like: string;
    fileName_like: string;
    actinobacteria: string;
    person: string;
}