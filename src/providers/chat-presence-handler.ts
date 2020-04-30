// firebase
import "rxjs/add/operator/map";
// utils
import { lastOnlineDbRef } from "../utils/utils";
// services
import { ChatManagerInstance } from "./chat-manager/instance";

export class ChatPresenceHandler {
  public urlNodeFirebase: string;
  // public deviceConnectionRef;
  public myConnectionsRef; // : firebase.database.Reference;
  public lastOnlineRef; // : firebase.database.Reference;

  constructor(public instance: ChatManagerInstance) {
    this.urlNodeFirebase = "/apps/" + this.instance.config.tenant;
  }

  /**
   * controlla se esiste una connessione per l'utente analizzato,
   * verificando se esiste un nodo in presence/uid/connections
   * mi sottosrivo al nodo
   * se non esiste pubblico utente offline
   * se esiste pubblico utente online
   * @param userid
   */
  userIsOnline(userid) {
    const { events, database } = this.instance;
    // this.lastOnlineForUser(userid);
    const myConnectionsRefURL =
      this.urlNodeFirebase + "/presence/" + userid + "/connections";
    const connectionsRef = database.ref().child(myConnectionsRefURL);
    console.log("userIsOnline", myConnectionsRefURL);
    connectionsRef.on("value", (child) => {
      console.log("statusUser:online-" + userid);
      if (child.val()) {
        events.emit("statusUser:online-" + userid, userid, true);
      } else {
        events.emit("statusUser:online-" + userid, userid, false);
        // that.events.publish('statusUser:offline-'+userid, userid,'offline');
      }
    });
  }

  /**
   * mi sottoscrivo al nodo presence/uid/lastOnline
   * e recupero la data dell'ultimo stato online
   * pubblico lastConnectionDate
   * @param userId
   */
  lastOnlineForUser(userId: string) {
    const { events, config, database } = this.instance;
    const { app } = config;
    const lastOnlineRefURL =
      this.urlNodeFirebase + lastOnlineDbRef(userId);
    console.log("lastOnlineForUser: ", lastOnlineRefURL);
    const lastOnlineRef = database.ref().child(lastOnlineRefURL);
    lastOnlineRef.on("value", (child) => {
      if (child.val()) {
        const lastConnectionDate = this.getTimeLastConnection(child.val());
        events.emit(
          "lastConnectionDate-" + userId,
          userId,
          lastConnectionDate
        );
      } else {
      }
    });
  }

  /**
   * calcolo tempo trascorso tra ora e timestamp passato
   * @param timestamp
   */
  getTimeLastConnection(timestamp: string) {
    // let timestampNumber = parseInt(timestamp)/1000;
    // let time = setLastDate(this.translate, timestamp);
    return `${timestamp}`;
  }

  /**
   * recupero la reference di lastOnline del currentUser
   * usata in setupMyPresence
   * @param userid
   */
  lastOnlineRefForUser(userid) {
    const { events, config, database } = this.instance;
    const { app } = config;
    const lastOnlineRefURL =
      this.urlNodeFirebase + "/presence/" + userid + "/lastOnline";
    const lastOnlineRef = database.ref().child(lastOnlineRefURL);
    return lastOnlineRef;
  }

  /**
   * recupero la reference di connections (online/offline) del currentUser
   * usata in setupMyPresence
   * @param userid
   */
  onlineRefForUser(userid) {
    const { events, config, database } = this.instance;
    const { app } = config;
    const myConnectionsRefURL =
      this.urlNodeFirebase + "/presence/" + userid + "/connections";
    const connectionsRef = database.ref().child(myConnectionsRefURL);
    return connectionsRef;
  }

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
  setupMyPresence(userid) {
    const { events, config, getDbRef } = this.instance;
    const { app } = config;
    this.myConnectionsRef = this.onlineRefForUser(userid);
    this.lastOnlineRef = this.lastOnlineRefForUser(userid);
    const connectedRefURL = "/.info/connected";
    const conn = getDbRef(connectedRefURL);
    conn.on("value", (dataSnapshot)   => {
      // console.log("KEY: ",dataSnapshot,that.deviceConnectionRef);
      if (dataSnapshot.val()) {
        console.log("self.deviceConnectionRef: ", this.myConnectionsRef);
        // if (!that.myConnectionsRef || that.myConnectionsRef==='undefined') {
        if (this.myConnectionsRef) {
          // this.deviceConnectionRef = myConnectionsRef.set(true);
          const conection = true;
          // that.deviceConnectionRef =
          const keyMyConnectionRef = this.myConnectionsRef.push(conection);
          // !!! quando faccio logout devo disconnettermi
          keyMyConnectionRef.onDisconnect().remove();
          // when I disconnect, update the last time I was seen online
          const now: Date = new Date();
          const timestamp = now.valueOf();
          this.lastOnlineRef.onDisconnect().set(timestamp);
        } else {
          console.log(
            "This is an error. self.deviceConnectionRef already set. Cannot be set again."
          );
        }
      }
    });
  }

  /**
   * rimuovo la references su lastOnline
   * rimuovo la references su connection
   */
  goOffline() {
    console.log("goOffline.", this.myConnectionsRef);
    // this.removeConnectionReference();
    this.removeLastOnlineReference();
  }

  // removeConnectionReference(){
  //   if(this.myConnectionsRef){
  //     this.myConnectionsRef.off();
  //     console.log("goOffline 1", this.myConnectionsRef)
  //     this.myConnectionsRef.remove();
  //     console.log("goOffline 2", this.myConnectionsRef)
  //   }
  //   this.myConnectionsRef = null;
  // }

  removeLastOnlineReference() {
    if (this.lastOnlineRef) {
      this.lastOnlineRef.off();
      this.lastOnlineRef.remove();
    }
    this.lastOnlineRef = null;
  }
}
