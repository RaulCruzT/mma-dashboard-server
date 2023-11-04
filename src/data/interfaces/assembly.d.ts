import { PaginationQueryInterface } from "./global";

export interface AssemblyParamsInterface {
    id: string;
}

export interface AssemblyBodyInterface {
    actinobacteria: string;
    date: string;
    bgcs: string;
    softwareTrimming: string;
    softwareAssembly: string;
    parametersAssembly: string;
    qualityFinal: string;
    comments: string;
    link: string;
    sequencingTechnology: string;
    accessionNumber: string;
    paper: string;
}

export interface AssemblyPaginationQueryInterface extends PaginationQueryInterface {
    softwareTrimming_like: string;
    softwareAssembly_like: string;
    parametersAssembly_like: string;
    actinobacteria: string;
    person: string;
}