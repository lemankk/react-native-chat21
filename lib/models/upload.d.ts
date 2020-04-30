export interface IUploadFile {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date;
}
export declare class UploadModel implements IUploadFile {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date;
    constructor(file: File);
}
