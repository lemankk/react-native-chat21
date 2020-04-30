import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import { BehaviorSubject } from "rxjs";
import "rxjs/add/operator/map";
import { MessageModel } from "../models/message";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class ChatConversationHandler {
    private instance;
    private urlNodeFirebase;
    private urlNodeTypings;
    private recipientId;
    private recipientFullname;
    private tenant;
    private loggedUser;
    private senderId;
    conversationWith: string;
    messages: any[];
    messagesRef: FirebaseDatabaseTypes.Query;
    messagesRefTyping: FirebaseDatabaseTypes.Query;
    listSubsriptions: any[];
    attributes: any;
    CLIENT_BROWSER: string;
    obsAdded: BehaviorSubject<MessageModel>;
    listMembersInfo: any[];
    private setTimeoutWritingMessages;
    constructor(instance: ChatManagerInstance);
    /**
     * inizializzo conversation handler
     * @param recipientId
     * @param recipientFullName
     */
    initWithRecipient(recipientId: any, recipientFullName: any, loggedUser: any, tenant: any): void;
    setAttributes(): any;
    /**
     * mi connetto al nodo messages
     * recupero gli ultimi 100 messaggi
     * creo la reference
     * mi sottoscrivo a change, removed, added
     */
    connect(): void;
    private translateInfoSupportMessages;
    /**
     * arriorno lo stato del messaggio
     * questo stato indica che è stato consegnato al client e NON che è stato letto
     * se il messaggio NON è stato inviato da loggedUser AGGIORNO stato a 200
     * @param item
     * @param conversationWith
     */
    setStatusMessage(item: any, conversationWith: any): void;
    /**
     * controllo se il messaggio è stato inviato da loggerUser
     * richiamato dalla pagina elenco messaggi della conversazione
     * @param message
     */
    isSender(message: any, currentUser: any): boolean;
    /**
     * bonifico url in testo messaggio
     * recupero time attuale
     * recupero lingua app
     * recupero sender_fullname e recipient_fullname
     * aggiungo messaggio alla reference
     * @param msg
     * @param conversationWith
     * @param conversationWithDetailFullname
     */
    sendMessage(msg: any, type: any, metadata: any, conversationWith: any, conversationWithDetailFullname: any, channel_type: any): void;
    updateMetadataMessage(uid: any, metadata: any): void;
    /**
     *
     */
    initWritingMessages(): void;
    /**
     * check if agent writing
     */
    getWritingMessages(): void;
    /**
     *
     */
    setWritingMessages(str: string, channel_type?: string): void;
    /**
     * dispose reference della conversazione
     */
    dispose(): void;
    unsubscribe(key: any): void;
}
