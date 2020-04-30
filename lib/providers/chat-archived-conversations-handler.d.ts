import "rxjs/add/operator/map";
import { IConversation, IUser } from "../models";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class ChatArchivedConversationsHandler {
    private instance;
    private tenant;
    private loggedUser;
    private userId;
    private ref;
    conversations: IConversation[];
    uidConvSelected: String;
    constructor(instance: ChatManagerInstance);
    /**
     * inizializzo conversations handler
     * @param tenant
     * @param user
     */
    initWithTenant(tenant: string, loggedUser: IUser): ChatArchivedConversationsHandler;
    /**
     * mi connetto al nodo conversations
     * creo la reference
     * mi sottoscrivo a change, removed, added
     */
    connect(): void;
    /**
     * 1 - aggiungo alla pos 0 la nuova conversazione all'array di conversazioni
     * 2 - pubblico conversations:update
     * @param snapshot
     */
    private onSnapshotAdded;
    /**
     * 1 - cerco indice conversazione nell'array conversation
     * 2 - sostituisco conversazione
     * 3 - pubblico conversations:update
     * @param snapshot
     */
    private onSnapshotChanged;
    /**
     * 1 - cerco indice conversazione da eliminare
     * 2 - elimino conversazione da array conversations
     * 3 - pubblico conversations:update
     * @param childSnapshot
     */
    private onSnapshotRemoved;
    /**
     * Completo conversazione aggiungendo:
     * 1 - imposto selected == true se è la conversazione selezionata
     * 2 - imposto fullname del sender concatenando nome e cognome e
     *   - aggiungo 'tu:' se il sender coincide con il loggedUser
     * 3 - imposto il tempo trascorso dell'invio dell'ultimo messaggio
     * @param conv
     */
    private completeConversation;
    private setStatusConversation;
    /**
     * calcolo il tempo trascorso da ora al timestamp passato
     * @param timestamp
     */
    private getTimeLastMessage;
    /**
     * dispose reference di conversations
     */
    dispose(): void;
    private isValidConversation;
    private isValidField;
    getConversationByUid(conversationUid: any): IConversation;
}
