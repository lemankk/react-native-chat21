export interface IUploadFile {
  $key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date;
}

export class UploadModel implements IUploadFile {
  $key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date = new Date();
  constructor(file: File) {
    this.file = file;
  }
}
