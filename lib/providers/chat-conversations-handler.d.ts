import "rxjs/add/operator/map";
import { ConversationModel } from "../models/conversation";
import { IUser } from "../models/user";
import { DatabaseProvider } from "../providers/database/database";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class ChatConversationsHandler {
    instance: ChatManagerInstance;
    conversations: ConversationModel[];
    uidConvSelected: String;
    private tenant;
    private loggedUser;
    private userId;
    private ref;
    audio: any;
    private setTimeoutSound;
    private tiledeskConversationsProvider;
    databaseProvider: DatabaseProvider;
    constructor(instance: ChatManagerInstance);
    /**
     * inizializzo conversations handler
     * @param tenant
     * @param user
     */
    initWithTenant(tenant: string, loggedUser: IUser): ChatConversationsHandler;
    /**
     *
     */
    getConversationsFromStorage(): void;
    /**
     * mi connetto al nodo conversations
     * creo la reference
     * mi sottoscrivo a change, removed, added
     */
    connect(): void;
    /**
     * 1 - aggiungo alla pos 0 la nuova conversazione all'array di conversazioni
     * 2 - pubblico conversations:update
     * @param childSnapshot
     */
    added(childSnapshot: any): void;
    /**
     * 1 - cerco indice conversazione nell'array conversation
     * 2 - sostituisco conversazione
     * 3 - pubblico conversations:update
     * @param childSnapshot
     */
    changed(childSnapshot: any): void;
    /**
     * 1 - cerco indice conversazione da eliminare
     * 2 - elimino conversazione da array conversations
     * 3 - pubblico conversations:update
     * @param childSnapshot
     */
    removed(childSnapshot: any): void;
    /**
     *
     * @param conv
     */
    /**
     * Completo conversazione aggiungendo:
     * 1 - imposto selected == true se è la conversazione selezionata
     * 2 - imposto fullname del sender concatenando nome e cognome e
     *   - aggiungo 'tu:' se il sender coincide con il loggedUser
     * 3 - imposto il tempo trascorso dell'invio dell'ultimo messaggio
     * @param conv
     */
    completeConversation(conv: any): ConversationModel;
    getImageUrlThumb(uid: string): string;
    setConversationRead(conversationUid: any): void;
    getConversationByUid(conversationUid: any): ConversationModel;
    setStatusConversation(sender: any, uid: any): string;
    /**
     * carico url immagine profilo passando id utente
     */
    /**
     * calcolo il tempo trascorso da ora al timestamp passato
     * @param timestamp
     */
    getTimeLastMessage(timestamp: string): string;
    /**
     * 1 - deseleziono tutte le conversazioni (setto tutti su on selected FALSE)
     * 2 - evidezio la conversazione selezionata (setto selected TRUE)
     * @param uid
     */
    /**
     * dispose reference di conversations
     */
    dispose(): void;
    removeByUid(uid: any): void;
    addConversationListener(uidUser: any, conversationId: any): void;
    private isValidConversation;
    private isValidField;
    /**
     *
     */
    countIsNew(): number;
    soundMessage(): void;
}
