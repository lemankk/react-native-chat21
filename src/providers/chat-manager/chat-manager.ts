import "rxjs/add/operator/map";

import { EventEmitter } from "react-native";

// models
import { UserModel, IUser } from "../../models/user";

// handlers
import { ChatConversationHandler } from "../chat-conversation-handler";
import { ChatConversationsHandler } from "../chat-conversations-handler";
import { ChatArchivedConversationsHandler } from "../chat-archived-conversations-handler";
import { ChatContactsSynchronizer } from "../chat-contacts-synchronizer";
import { ChatManagerConfig } from "./config";
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
  public handlers: ChatConversationHandler[];
  private _loggedUser: UserModel;
  public conversationsHandler: ChatConversationsHandler;
  public archivedConversationsHandler: ChatArchivedConversationsHandler;
  public contactsSynchronizer: ChatContactsSynchronizer;
  public openInfoConversation: boolean;
  public chatContactsSynchronizer: ChatContactsSynchronizer;

  private _instance: ChatManagerInstance;
  public get instance(): ChatManagerInstance {
    return this._instance;
  }

  constructor(
    config: ChatManagerConfig,
  ) {
    this._instance = new ChatManagerInstance(config, this.goOffLine, this.goOnLine);
    this.init();
  }
  /**
   * inizializza chatmanager
   */
  public init(
  ) {
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
  public configureWithAppId(app_id: string) {
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
  public get appId(): string {
    return this.instance.appId;
  }
  public getAppId(): string {
    return this.instance.appId;
  }
  public get tenant(): string {
    return this.instance.tenant;
  }
  public getTenant(): string {
    return this.instance.tenant;
  }
  public on(eventType: string, listener: any) {
    return this.instance.events.addListener(eventType, listener);
  }
  public addListener(eventType: string, listener: any) {
    return this.instance.events.addListener(eventType, listener);
  }
  public off(eventType: string, listener: any) {
    return this.instance.events.removeListener(eventType, listener);
  }
  public removeListener(eventType: string, listener: any) {
    return this.instance.events.removeListener(eventType, listener);
  }
  /**
   * return current user detail
   */
  public get loggedUser(): IUser {
    return this._loggedUser;
  }
  public getLoggedUser(): IUser {
    return this._loggedUser;
  }

  /**
   *
   */
  public getOpenInfoConversation(): boolean {
    return this.openInfoConversation;
  }
  /**
   * dispose all references
   * dispose refereces messaggi di ogni conversazione
   * dispose reference conversazioni
   * dispose reference sincronizzazione contatti
   */
  public dispose() {
    console.log(" 1 - setOffAllReferences");
    this.setOffAllReferences();
    console.log(" 2 - disposeConversationsHandler");
    if (this.conversationsHandler) { this.disposeConversationsHandler(); }
    console.log(" 3 - disposeArchivedConversationsHandler");
    if (this.archivedConversationsHandler) { this.disposeConversationsHandler(); }
    console.log(" 4 - disposeContactsSynchronizer");
    if (this.contactsSynchronizer) { this.disposeContactsSynchronizer(); }
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
  public goOnLine(user: IUser) {
    this._loggedUser = user;
    this.instance.events.emit("loggedUser:login", this._loggedUser);
  }


  /**
   * invocato da user.ts al LOGOUT:
   * 1 - cancello tutte le references
   * 2 - pubblico stato loggedUser come logout
   */
  public goOffLine() {
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
  public addConversationHandler(handler) {
    console.log("CHAT MANAGER -----> addConversationHandler", handler);
    this.handlers.push(handler);
  }
  /**
   * rimuovo dall'array degli handlers delle conversazioni una conversazione
   * al momento non è utilizzato!!!
   * @param conversationId
   */
  public removeConversationHandler(conversationId) {
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
  public getConversationHandlerByConversationId(conversationId): any {
    const resultArray = this.handlers.filter( (handler) => {
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
  public setOffAllReferences() {
    this.handlers.forEach( (data) => {
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
  public setConversationsHandler(handler) {
    this.conversationsHandler = handler;
  }
  /**
   * elimino la reference dell'handler delle conversazioni
   */
  public disposeConversationsHandler() {
    console.log(" 2 - this.conversationsHandler:: ", this.conversationsHandler);
    this.conversationsHandler.dispose();
  }
  /// END metodi gestione conversazioni ////

  /// START metodi sincronizzazione contatti ////
  /**
   * creo handler sincronizzazione contatti se ancora nn esiste
   * inizio la sincronizzazione
   */
  public initContactsSynchronizer() {
    console.log(" initContactsSynchronizer:: ", this.contactsSynchronizer, this.tenant, this._loggedUser);
    if (!this.contactsSynchronizer) {
      this.contactsSynchronizer = this.chatContactsSynchronizer.initWithTenant(this.tenant, this._loggedUser);
      // this.contactsSynchronizer = this.createContactsSynchronizerForUser();
      this.contactsSynchronizer.startSynchro();
    } else {
      this.contactsSynchronizer.startSynchro();
    }
  }
  /**
   * elimino la reference dell'handler della sincronizzazione contatti
   */
  public disposeContactsSynchronizer() {
    this.contactsSynchronizer.dispose();
  }
  /// END metodi sincronizzazione contatti ////



}
