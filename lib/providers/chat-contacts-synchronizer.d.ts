import { ChatManagerInstance } from "./chat-manager/instance";
export declare class ChatContactsSynchronizer {
    private tenant;
    private loggeduser;
    private ref;
    private databaseProvider;
    private _instance;
    constructor(instance: ChatManagerInstance);
    /**
     * inizializzo contacts synchronizer
     * @param tenant
     * @param user
     */
    initWithTenant(tenant: any, user: any): this;
    /**
     * recupero dal db locale la data dell'ultimo aggiornamento
     * sincronizzo i contatti dal nodo firebase 'contacts'
     */
    startSynchro(): void;
    /**
     * creo una reference al nodo contacts
     * filtro per data successiva a ultimo aggiornamento
     * mi sottoscrivo a change, removed, added
     * ref: https://firebase.google.com/docs/reference/js/firebase.database.Query
     * https://stackoverflow.com/questions/41721134/firebase-angularfire2-listening-on-queried-list-child-added
     * https://firebase.google.com/docs/database/web/lists-of-data
     */
    loadFirebaseContactsData(lastUpdate: any): void;
    /**
     * completo profilo user con fullname
     * salvo data ultimo aggiornamento nel DB
     * aggiungo oppure aggiorno (sovrascrivo) un utente al DB
     * @param child
     */
    addContact(child: any): void;
    /**
     * salvo data ultimo aggiornamento nel DB
     * elimino utente dal DB
     * @param child
     */
    removeContact(child: any): void;
    /**
     * dispose reference di contacts synchronizer
     */
    dispose(): void;
}
