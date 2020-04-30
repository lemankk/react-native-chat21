import "rxjs/add/operator/map";
import { ChatManagerInstance } from "./chat-manager/instance";
export declare class ChatPresenceHandler {
    instance: ChatManagerInstance;
    urlNodeFirebase: string;
    myConnectionsRef: any;
    lastOnlineRef: any;
    constructor(instance: ChatManagerInstance);
    /**
     * controlla se esiste una connessione per l'utente analizzato,
     * verificando se esiste un nodo in presence/uid/connections
     * mi sottosrivo al nodo
     * se non esiste pubblico utente offline
     * se esiste pubblico utente online
     * @param userid
     */
    userIsOnline(userid: any): void;
    /**
     * mi sottoscrivo al nodo presence/uid/lastOnline
     * e recupero la data dell'ultimo stato online
     * pubblico lastConnectionDate
     * @param userId
     */
    lastOnlineForUser(userId: string): void;
    /**
     * calcolo tempo trascorso tra ora e timestamp passato
     * @param timestamp
     */
    getTimeLastConnection(timestamp: string): string;
    /**
     * recupero la reference di lastOnline del currentUser
     * usata in setupMyPresence
     * @param userid
     */
    lastOnlineRefForUser(userid: any): import("@react-native-firebase/database").FirebaseDatabaseTypes.Reference;
    /**
     * recupero la reference di connections (online/offline) del currentUser
     * usata in setupMyPresence
     * @param userid
     */
    onlineRefForUser(userid: any): import("@react-native-firebase/database").FirebaseDatabaseTypes.Reference;
    /**
     * 1 - imposto reference online/offline
     * 2 - imposto reference lastConnection
     * 3 - mi sincronizzo con /.info/connected
     * 4 - se il valore esiste l'utente è online
     * 5 - aggiungo nodo a connection (true)
     * 6 - aggiungo job su onDisconnect di deviceConnectionRef che rimuove nodo connection
     * 7 - aggiungo job su onDisconnect di lastOnlineRef che imposta timestamp
     * 8 - salvo reference connected nel singlelton !!!!! DA FARE
     * @param userid
     */
    setupMyPresence(userid: any): void;
    /**
     * rimuovo la references su lastOnline
     * rimuovo la references su connection
     */
    goOffline(): void;
    removeLastOnlineReference(): void;
}
