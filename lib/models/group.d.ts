export interface IGroup {
    uid: string;
    createdOn: any;
    iconURL: string;
    members: any[];
    membersinfo: any[];
    name: string;
    owner: string;
}
export declare class GroupModel {
    uid: string;
    createdOn: any;
    iconURL: string;
    members: any[];
    membersinfo: any[];
    name: string;
    owner: string;
    constructor(uid: string, createdOn: any, iconURL: string, members: any[], membersinfo: any[], name: string, owner: string);
}
