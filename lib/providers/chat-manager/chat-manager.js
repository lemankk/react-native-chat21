import "rxjs/add/operator/map";
import { ChatConversationsHandler } from "../chat-conversations-handler";
import { ChatArchivedConversationsHandler } from "../chat-archived-conversations-handler";
import { ChatContactsSynchronizer } from "../chat-contacts-synchronizer";
import { ChatManagerInstance } from "./instance";
// utils
// import { isHostname } from '../../utils/utils';
/*
  Generated class for the ChatManagerProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
/**
 * CHAT MANAGER ...
 */
export class ChatManager {
    constructor(config) {
        this._instance = new ChatManagerInstance(config, this.goOffLine, this.goOnLine);
        this.init();
    }
    get instance() {
        return this._instance;
    }
    /**
     * inizializza chatmanager
     */
    init() {
        this._loggedUser = this.instance.auth.currentUser;
        this.handlers = [];
        this.openInfoConversation = true;
        console.log("************* init  ***", this.handlers);
        this.archivedConversationsHandler = new ChatArchivedConversationsHandler(this.instance);
        this.conversationsHandler = new ChatConversationsHandler(this.instance);
        this.chatContactsSynchronizer = new ChatContactsSynchronizer(this.instance);
    }
    /**
     * configura App: chiamato da app.component
     * setto tenant
     * setto loggedUser
     * @param app_id
     */
    configureWithAppId(app_id) {
        this._instance.appId = app_id;
        this._loggedUser = null;
        this.handlers = [];
    }
    // onOpenCloseInfoConversation(){
    //   this.openInfoConversation = !this.openInfoConversation;
    // }
    /**
     * return tenant
     */
    get appId() {
        return this.instance.appId;
    }
    getAppId() {
        return this.instance.appId;
    }
    get tenant() {
        return this.instance.tenant;
    }
    getTenant() {
        return this.instance.tenant;
    }
    on(eventType, listener) {
        return this.instance.events.addListener(eventType, listener);
    }
    addListener(eventType, listener) {
        return this.instance.events.addListener(eventType, listener);
    }
    off(eventType, listener) {
        return this.instance.events.removeListener(eventType, listener);
    }
    removeListener(eventType, listener) {
        return this.instance.events.removeListener(eventType, listener);
    }
    /**
     * return current user detail
     */
    get loggedUser() {
        return this._loggedUser;
    }
    getLoggedUser() {
        return this._loggedUser;
    }
    /**
     *
     */
    getOpenInfoConversation() {
        return this.openInfoConversation;
    }
    /**
     * dispose all references
     * dispose refereces messaggi di ogni conversazione
     * dispose reference conversazioni
     * dispose reference sincronizzazione contatti
     */
    dispose() {
        console.log(" 1 - setOffAllReferences");
        this.setOffAllReferences();
        console.log(" 2 - disposeConversationsHandler");
        if (this.conversationsHandler) {
            this.disposeConversationsHandler();
        }
        console.log(" 3 - disposeArchivedConversationsHandler");
        if (this.archivedConversationsHandler) {
            this.disposeConversationsHandler();
        }
        console.log(" 4 - disposeContactsSynchronizer");
        if (this.contactsSynchronizer) {
            this.disposeContactsSynchronizer();
        }
        console.log(" OKK ");
        this.conversationsHandler = null;
        this.contactsSynchronizer = null;
    }
    /**
     * invocato da user.ts al LOGIN:
     * LOGIN:
     * 1 - imposto lo stato di connessione utente
     * 2 - aggiungo il token
     * 3 - pubblico stato loggedUser come login
     */
    goOnLine(user) {
        this._loggedUser = user;
        this.instance.events.emit("loggedUser:login", this._loggedUser);
    }
    /**
     * invocato da user.ts al LOGOUT:
     * 1 - cancello tutte le references
     * 2 - pubblico stato loggedUser come logout
     */
    goOffLine() {
        this._loggedUser = null;
        console.log(" 1 - CANCELLO TUTTE LE REFERENCES DI FIREBASE");
        // console.log(" 2 - CANCELLO L'UTENTE DAL NODO PRESENZE");
        // this.chatPresenceHandler.goOffline();
        // console.log(" 3 - RIMUOVO IL TOKEN");
        // this.msgService.removeToken();
        this.dispose();
        console.log(" 4 - PUBBLICO STATO LOGGEDUSER: LOGOUT");
        this.instance.events.emit("loggedUser:logout", null);
    }
    /// START metodi gestione messaggi conversazione ////
    /**
     * aggiungo la conversazione all'array delle conversazioni
     * chiamato dall'inizialize di dettaglio-conversazione.ts
     * @param handler
     */
    addConversationHandler(handler) {
        console.log("CHAT MANAGER -----> addConversationHandler", handler);
        this.handlers.push(handler);
    }
    /**
     * rimuovo dall'array degli handlers delle conversazioni una conversazione
     * al momento non è utilizzato!!!
     * @param conversationId
     */
    removeConversationHandler(conversationId) {
        console.log(" -----> removeConversationHandler: ", conversationId);
        const index = this.handlers.findIndex(i => i.conversationWith === conversationId);
        this.handlers.splice(index, 1);
    }
    /**
     * cerco e ritorno una conversazione dall'array delle conversazioni
     * con conversationId coincidente con conversationId passato
     * chiamato dall'inizialize di dettaglio-conversazione.ts
     * @param conversationId
     */
    getConversationHandlerByConversationId(conversationId) {
        const resultArray = this.handlers.filter((handler) => {
            console.log("FILTRO::: ***", conversationId, handler.conversationWith);
            return handler.conversationWith == conversationId;
        });
        console.log("getConversationHandlerByConversationId ***", conversationId, resultArray, this.handlers);
        if (resultArray.length === 0) {
            return null;
        }
        return resultArray[0];
        // return this.handlers.find(item => item.conversationWith == conversationId);
    }
    /**
     * elimino tutti gli hendler presenti nell'array handlers
     * dopo aver cancellato la reference per ogni handlers
     */
    setOffAllReferences() {
        this.handlers.forEach((data) => {
            const item = data.messagesRef;
            item.ref.off();
        });
        this.handlers = [];
    }
    /// END metodi gestione messaggi conversazione ////
    /// START metodi gestione conversazioni ////
    /**
     * Salvo il CONVERSATIONS handler dopo averlo creato nella lista conversazioni
     * @param handler
     */
    setConversationsHandler(handler) {
        this.conversationsHandler = handler;
    }
    /**
     * elimino la reference dell'handler delle conversazioni
     */
    disposeConversationsHandler() {
        console.log(" 2 - this.conversationsHandler:: ", this.conversationsHandler);
        this.conversationsHandler.dispose();
    }
    /// END metodi gestione conversazioni ////
    /// START metodi sincronizzazione contatti ////
    /**
     * creo handler sincronizzazione contatti se ancora nn esiste
     * inizio la sincronizzazione
     */
    initContactsSynchronizer() {
        console.log(" initContactsSynchronizer:: ", this.contactsSynchronizer, this.tenant, this._loggedUser);
        if (!this.contactsSynchronizer) {
            this.contactsSynchronizer = this.chatContactsSynchronizer.initWithTenant(this.tenant, this._loggedUser);
            // this.contactsSynchronizer = this.createContactsSynchronizerForUser();
            this.contactsSynchronizer.startSynchro();
        }
        else {
            this.contactsSynchronizer.startSynchro();
        }
    }
    /**
     * elimino la reference dell'handler della sincronizzazione contatti
     */
    disposeContactsSynchronizer() {
        this.contactsSynchronizer.dispose();
    }
}
//# sourceMappingURL=chat-manager.js.map