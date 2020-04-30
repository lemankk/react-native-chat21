import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import "rxjs/add/operator/map";
import { IUser } from "../models";
import { ChatPresenceHandler } from "./chat-presence-handler";
import { MessagingService } from "./messaging-service";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class UserService {
    private instance;
    chatPresenceHandler: ChatPresenceHandler;
    msgService: MessagingService;
    currentUserDetails: IUser;
    urlNodeContacts: string;
    uidLastOpenConversation: string;
    token: string;
    userUid: string;
    constructor(instance: ChatManagerInstance, chatPresenceHandler: ChatPresenceHandler, msgService: MessagingService);
    saveCurrentUserDetail(uid: string, email: string, firstname: string, lastname: string): Promise<void>;
    /**
     * RECUPERO DETTAGLIO UTENTE
     * @param uid
     * 1 - leggo nodo contacts con uid passato
     * 2 - creo un model userDetails vouto e rimango in attesa
     * 3 - recupero il dettaglio utente se esiste
     * 4 - pubblico dettaglio utente (subscribe in profile.ts)
     */
    loadUserDetail(uid: any): Promise<FirebaseDatabaseTypes.DataSnapshot>;
    getUserDetail(uid: string): Promise<FirebaseDatabaseTypes.DataSnapshot>;
    getListMembers(members: any[]): IUser[];
    /**
     * CONTROLLO SE L'UTENTE E' AUTENTICATO
     * rimango in ascolto sul login logout
     * LOGOUT:
     * 1 - cancello utente dal nodo presenze
     * 2 - rimuovo il token
     * 3 - passo lo stato offline al chatmanager
     * LOGIN:
     * 1 - imposto stato di connessione utente
     * 2 - aggiorno il token
     * 3 - carico il dettaglio utente (o ne creo uno nuovo)
     * 4 - passo lo stato online al chatmanager
     */
    onAuthStateChanged(): void;
    callbackGetToken: any;
    returnToken(): string;
    /**
     * IMPOSTO FIREBASE REFERENCE
     * imposto la reference al nodo di firebase dettaglio utente uid
     * @param uid
     */
    initUserDetails(uid: any): FirebaseDatabaseTypes.Reference;
    initGroupDetails(uidUser: any, uidGroup: any): FirebaseDatabaseTypes.Reference;
    getUidLastOpenConversation(): string;
    /**
     * LOGUOT FIREBASE
     * al logout vado in automatico su onAuthStateChanged
     */
    logoutUser(): Promise<void>;
}
