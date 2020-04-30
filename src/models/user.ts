export interface IUser {
  uid: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  imageurl?: string;
  avatar?: string;
  color?: string;
  checked?: boolean;
  online?: boolean;
  decoded?: any;
}

export class UserModel implements IUser {
  constructor(
    public uid: string,
    public email?: string,
    public firstname?: string,
    public lastname?: string,
    public fullname?: string,
    public imageurl?: string,
    public avatar?: string,
    public color?: string,
    public checked?: boolean,
    public online?: boolean,
    public decoded?: any
  ) {}
}
