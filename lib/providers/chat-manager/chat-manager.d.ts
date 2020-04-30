import "rxjs/add/operator/map";
import { IUser } from "../../models/user";
import { ChatConversationHandler } from "../chat-conversation-handler";
import { ChatConversationsHandler } from "../chat-conversations-handler";
import { ChatArchivedConversationsHandler } from "../chat-archived-conversations-handler";
import { ChatContactsSynchronizer } from "../chat-contacts-synchronizer";
import { ChatManagerConfig } from "./config";
import { ChatManagerInstance } from "./instance";
/**
 * CHAT MANAGER ...
 */
export declare class ChatManager {
    handlers: ChatConversationHandler[];
    private _loggedUser;
    conversationsHandler: ChatConversationsHandler;
    archivedConversationsHandler: ChatArchivedConversationsHandler;
    contactsSynchronizer: ChatContactsSynchronizer;
    openInfoConversation: boolean;
    chatContactsSynchronizer: ChatContactsSynchronizer;
    private _instance;
    get instance(): ChatManagerInstance;
    constructor(config: ChatManagerConfig);
    /**
     * inizializza chatmanager
     */
    init(): void;
    /**
     * configura App: chiamato da app.component
     * setto tenant
     * setto loggedUser
     * @param app_id
     */
    configureWithAppId(app_id: string): void;
    /**
     * return tenant
     */
    get appId(): string;
    getAppId(): string;
    get tenant(): string;
    getTenant(): string;
    on(eventType: string, listener: any): import("react-native").EmitterSubscription;
    addListener(eventType: string, listener: any): import("react-native").EmitterSubscription;
    off(eventType: string, listener: any): void;
    removeListener(eventType: string, listener: any): void;
    /**
     * return current user detail
     */
    get loggedUser(): IUser;
    getLoggedUser(): IUser;
    /**
     *
     */
    getOpenInfoConversation(): boolean;
    /**
     * dispose all references
     * dispose refereces messaggi di ogni conversazione
     * dispose reference conversazioni
     * dispose reference sincronizzazione contatti
     */
    dispose(): void;
    /**
     * invocato da user.ts al LOGIN:
     * LOGIN:
     * 1 - imposto lo stato di connessione utente
     * 2 - aggiungo il token
     * 3 - pubblico stato loggedUser come login
     */
    goOnLine(user: IUser): void;
    /**
     * invocato da user.ts al LOGOUT:
     * 1 - cancello tutte le references
     * 2 - pubblico stato loggedUser come logout
     */
    goOffLine(): void;
    /**
     * aggiungo la conversazione all'array delle conversazioni
     * chiamato dall'inizialize di dettaglio-conversazione.ts
     * @param handler
     */
    addConversationHandler(handler: any): void;
    /**
     * rimuovo dall'array degli handlers delle conversazioni una conversazione
     * al momento non è utilizzato!!!
     * @param conversationId
     */
    removeConversationHandler(conversationId: any): void;
    /**
     * cerco e ritorno una conversazione dall'array delle conversazioni
     * con conversationId coincidente con conversationId passato
     * chiamato dall'inizialize di dettaglio-conversazione.ts
     * @param conversationId
     */
    getConversationHandlerByConversationId(conversationId: any): any;
    /**
     * elimino tutti gli hendler presenti nell'array handlers
     * dopo aver cancellato la reference per ogni handlers
     */
    setOffAllReferences(): void;
    /**
     * Salvo il CONVERSATIONS handler dopo averlo creato nella lista conversazioni
     * @param handler
     */
    setConversationsHandler(handler: any): void;
    /**
     * elimino la reference dell'handler delle conversazioni
     */
    disposeConversationsHandler(): void;
    /**
     * creo handler sincronizzazione contatti se ancora nn esiste
     * inizio la sincronizzazione
     */
    initContactsSynchronizer(): void;
    /**
     * elimino la reference dell'handler della sincronizzazione contatti
     */
    disposeContactsSynchronizer(): void;
}
