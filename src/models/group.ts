export interface IGroup {

    uid: string;
    createdOn: any;
    iconURL: string;
    members: any[];
    membersinfo: any[];
    name: string;
    owner: string;
}

export class GroupModel {
    constructor(
        public uid: string,
        public createdOn: any,
        public iconURL: string,
        public members: any[],
        public membersinfo: any[],
        public name: string,
        public owner: string
    ) { }
}