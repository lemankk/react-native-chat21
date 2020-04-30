import "rxjs/add/operator/map";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class MessagingService {
    private instance;
    private connectionsRefinstancesId;
    token: string;
    BUILD_VERSION: string;
    constructor(instance: ChatManagerInstance);
    /**
     *
     */
    getPermission(): void;
    getToken(): void;
    updateToken(userUid: any, token: any): void;
    removeToken(): void;
    referenceToUserListToken(userid: any): import("@react-native-firebase/database").FirebaseDatabaseTypes.Reference;
    receiveMessage(): void;
    returnToken(): string;
}
