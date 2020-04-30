import "rxjs/add/operator/map";
import { GroupModel } from "../models/group";
import { ChatManager } from "./chat-manager/chat-manager";
import { UserService } from "./user-service";
import { MessagingService } from "./messaging-service";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class GroupService {
    private instance;
    msgService: MessagingService;
    chatManager: ChatManager;
    userService: UserService;
    groupDetail: GroupModel;
    private observable;
    arrayMembers: any;
    listRefMembersInfo: any[];
    refLoadGroupDetail: any;
    constructor(instance: ChatManagerInstance, msgService: MessagingService, chatManager: ChatManager, userService: UserService);
    loadGroupDetail(uidUser: string, uidGroup: string, key: string): void;
    /**
     *
     */
    leaveAGroup(uidGroup: string, uidUser: string, callback: any): void;
    closeGroup(uidGroup: string, callback: any): void;
    getUidMembers(members: any): string[];
    isSupportGroup(uid: any): boolean;
    /** */
    /** */
    loadMembersInfo(uidGroup: any, tenant: any, uidUser: any): void;
    onDisconnectMembersInfo(): void;
    /** */
    onDisconnectLoadGroupDetail(): void;
}
