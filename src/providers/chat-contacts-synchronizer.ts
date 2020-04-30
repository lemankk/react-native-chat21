
// providers
import { DatabaseProvider } from "./database/database";
// models
import { UserModel } from "../models/user";
// firebase
import database, { FirebaseDatabaseTypes } from "@react-native-firebase/database";
// utils
import { ChatManagerConfig } from "./chat-manager/config";
import { ChatManagerInstance } from "./chat-manager/instance";

export class ChatContactsSynchronizer {
    private tenant: string;
    private loggeduser: UserModel;
    private ref: FirebaseDatabaseTypes.Query;
    private databaseProvider: DatabaseProvider;

    private _instance: ChatManagerInstance;

    constructor(
        instance: ChatManagerInstance,
    ) {
        this._instance = instance;
    }
    /**
     * inizializzo contacts synchronizer
     * @param tenant
     * @param user
     */
    initWithTenant(tenant, user) {
        this.tenant = tenant;
        this.loggeduser = user;
        this.databaseProvider.initialize(this.loggeduser, this.tenant);
        return this;
    }
    /**
     * recupero dal db locale la data dell'ultimo aggiornamento
     * sincronizzo i contatti dal nodo firebase 'contacts'
     */
    startSynchro() {
        console.log("startSynchro: ");
        this.databaseProvider.getTimestamp()
        .then((lastUpdate) => {
            console.log("lastUpdate: ", lastUpdate);
            this.loadFirebaseContactsData(lastUpdate);
        });
    }
    /**
     * creo una reference al nodo contacts
     * filtro per data successiva a ultimo aggiornamento
     * mi sottoscrivo a change, removed, added
     * ref: https://firebase.google.com/docs/reference/js/firebase.database.Query
     * https://stackoverflow.com/questions/41721134/firebase-angularfire2-listening-on-queried-list-child-added
     * https://firebase.google.com/docs/database/web/lists-of-data
     */
    loadFirebaseContactsData(lastUpdate) {
        const { getDbRef } = this._instance;
        console.log("lastUpdate:" + lastUpdate, this.tenant);
        this.ref = getDbRef("contacts/");
        this.ref.orderByChild("timestamp").startAt(lastUpdate);
        this.ref.on("child_changed", (childSnapshot) => {
            const childData = childSnapshot.val();
            this.addContact(childData);
        });
        this.ref.on("child_removed", (childSnapshot) => {
            const childData = childSnapshot.val();
            this.removeContact(childData);
        });
        this.ref.on("child_added", (childSnapshot) => {
            const childData = childSnapshot.val();
            this.addContact(childData);
        });
    }
    /**
     * completo profilo user con fullname
     * salvo data ultimo aggiornamento nel DB
     * aggiungo oppure aggiorno (sovrascrivo) un utente al DB
     * @param child
     */
    addContact(child) {
        // console.log("child_added", child);
        const user: UserModel = child;
        let fullname = "";
        if (user["firstname"] && user["firstname"] != undefined) {
            fullname += user["firstname"] + " ";
        }
        if (user["lastname"] && user["lastname"] != undefined) {
            fullname += user["lastname"];
        }
        user.fullname = fullname;
        // console.log("fullname:",fullname);
        this.databaseProvider.setTimestamp();
        this.databaseProvider.addContact(user.uid, user.email, user.firstname, user.lastname, user.fullname, user.imageurl);
    }
    /**
     * salvo data ultimo aggiornamento nel DB
     * elimino utente dal DB
     * @param child
     */
    removeContact(child) {
        // console.log("removeContact", child);
        this.databaseProvider.setTimestamp();
        const user = child;
        this.databaseProvider.removeContact(user.uid);
    }
    /**
     * dispose reference di contacts synchronizer
     */
    dispose() {
        this.ref.off();
    }
}