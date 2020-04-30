import "rxjs/add/operator/map";
import { IUser } from "../../models/user";
import { ChatManagerInstance } from "../chat-manager/instance";
export declare class DatabaseProvider {
    instance: ChatManagerInstance;
    tenant: string;
    storageSettings: Storage;
    storageContacts: Storage;
    storageConversations: Storage;
    loggedUser: IUser;
    constructor(instance: ChatManagerInstance);
    initialize(loggedUser: IUser, tenant: string): void;
    /**
     * inizializzo databaseprovider
     * creo un nuovo storage
     * chiamato nell'init di chat-manager
     * @param tenant
     */
    configStorage(storeName: string): Storage;
    /**
     * ritorno data ultimo aggiornamento salvata nel DB locale
     */
    getTimestamp(): any;
    /**
     * salvo data ultimo aggiornamento nel DB locale
     */
    setTimestamp(): void;
    /**
     * ritorno uid ultima conversazione aperta salvata nel DB locale
     */
    getUidLastOpenConversation(): any;
    /**
     * salvo uid ultima conversazione aperta nel DB
     * @param uid
     */
    setUidLastOpenConversation(uid: any): void;
    /**
     * ritorno contatti salvati nel DB locale
     * da verificare!!!
     * @param limit
     */
    getContactsLimit(limit?: any): any;
    /**
     * aggiungo un nuovo contatto o sovrascrivo uno già esistente al DB locale
     * @param uid
     * @param email
     * @param firstname
     * @param lastname
     * @param fullname
     * @param imageurl
     */
    addContact(uid: any, email: any, firstname: any, lastname: any, fullname: any, imageurl: any): void;
    /**
     * rimuovo un contatto dal DB locale
     * @param uid
     */
    removeContact(uid: any): void;
    /**
     *
     */
    getConversations(): any;
    /** */
    setConversation(conversation: any): any;
    /** */
    removeConversation(uid: string): void;
}
