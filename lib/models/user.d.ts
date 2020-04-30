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
export declare class UserModel implements IUser {
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
    constructor(uid: string, email?: string, firstname?: string, lastname?: string, fullname?: string, imageurl?: string, avatar?: string, color?: string, checked?: boolean, online?: boolean, decoded?: any);
}
