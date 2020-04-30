import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import "rxjs/add/operator/map";
// models
import { IUser, UserModel } from "../models";
import { ChatPresenceHandler } from "./chat-presence-handler";
import { MessagingService } from "./messaging-service";
import { LABEL_NOICON, SYSTEM, URL_NO_IMAGE } from "../utils/constants";
// utils
import { getNowTimestamp, contactsUserRef } from "../utils/utils";
import { ChatManagerInstance } from "./chat-manager/instance";

export class UserService {
  public currentUserDetails: IUser;
  public urlNodeContacts: string;
  public uidLastOpenConversation: string;
  public token: string;
  public userUid: string;

  constructor(
    private instance: ChatManagerInstance,
    public chatPresenceHandler: ChatPresenceHandler,
    public msgService: MessagingService
  ) {
    this.urlNodeContacts = this.instance.getAppApiUrl("contacts/");
    /**
     * 1 - controllo se l'utente è autenticato e rimango in ascolto
     * 2 - recupero tenant e impoto url contatti
     */

    // TODO:
    // platform.ready().then(() => {
    //   const tenant = this.chatManager.getTenant();
    //   this.urlNodeContacts = '/apps/'+tenant+'/contacts/';
    //   this.onAuthStateChanged();
    // });
  }

  // setUserDetail(uid): any {
  //   // controllo se il nodo esiste prima di restituire il risultato
  //   //// DA FARE ////
  //   const urlNodeFirebase = this.urlNodeContacts+uid;
  //   const userFirebase = firebase.database().ref(urlNodeFirebase);
  //   return userFirebase;
  // }

  saveCurrentUserDetail(
    uid: string,
    email: string,
    firstname: string,
    lastname: string
  ) {
    const timestamp = getNowTimestamp();
    console.log(
      "saveCurrentUserDetail: ",
      this.urlNodeContacts,
      uid,
      firstname,
      lastname
    );
    return this.instance.getDbRef(this.urlNodeContacts).child(uid).set({
      uid: uid,
      email: email,
      firstname: firstname,
      lastname: lastname,
      timestamp: timestamp,
      imageurl: "",
    });
  }

  // setCurrentUserDetails(uid, email) {
  //   const urlNodeFirebase = this.urlNodeContacts+uid;
  //   const userFirebase = firebase.database().ref(urlNodeFirebase);
  //   userFirebase.on('value', function(snapshot) {
  //     if (snapshot.val()){
  //       const user = snapshot.val();
  //       const fullname = user.firstname+" "+user.lastname;
  //       this.currentUserDetails = new UserModel(user.uid, user.email, user.firstname, user.lastname, fullname, '');
  //     }
  //     else {
  //       this.currentUserDetails = new UserModel(uid, email, '', '', uid, '');
  //       // aggiorno user nel nodo firebase contacts
  //       this.saveCurrentUserDetail(uid, email, '', '');
  //     }
  //     // salvo dettaglio currentUser nel singlelton
  //     this.applicationContext.setCurrentUserDetail(this.currentUserDetails);
  //   });
  //   // salvo reference e dettaglio currentUser nel singlelton
  //   this.applicationContext.setRef(userFirebase, 'contact');
  // }

  // getCurrentUserDetails(){
  //   console.log("getCurrentUserDetails: ", this.currentUserDetails);
  //   if (this.currentUserDetails){
  //     return this.currentUserDetails;
  //   }
  //   return;
  // }

  /**
   * RECUPERO DETTAGLIO UTENTE
   * @param uid
   * 1 - leggo nodo contacts con uid passato
   * 2 - creo un model userDetails vouto e rimango in attesa
   * 3 - recupero il dettaglio utente se esiste
   * 4 - pubblico dettaglio utente (subscribe in profile.ts)
   */
  loadUserDetail(uid) {
    console.log("loadUserDetail: ", uid);
    const userFirebase = this.initUserDetails(uid);
    return userFirebase.once("value");
    // userFirebase.on("value", function(snapshot) {
    //     let userDetail = new UserModel(snapshot.key, '', '', snapshot.key, '', '');
    //     if (snapshot.val()){
    //       const user = snapshot.val();
    //       const fullname = user.firstname+" "+user.lastname;
    //       userDetail = new UserModel(
    //         snapshot.key,
    //         user.email,
    //         user.firstname,
    //         user.lastname,
    //         fullname.trim(),
    //         user.imageurl
    //       );
    //     }
    //     console.log("loadUserDetail: ", userDetail);
    //     this.events.publish('loadUserDetail:complete', userDetail);
    //   });
  }

  getUserDetail(uid: string): Promise<FirebaseDatabaseTypes.DataSnapshot> {
    const { getDbRef } = this.instance;
    const ref = getDbRef(contactsUserRef(uid)).once("value");
    return ref;
  }

  // getSenderDetail(conversationWith): any {
  //   const tenant = this.chatManager.getTenant();
  //   const urlNodeAttributes = '/apps/' + tenant + '/groups/' + conversationWith;
  //   var ref =  firebase.database().ref(urlNodeAttributes).once('value');
  //   console.log("urlNodeAttributes::getSenderDetail::ref:", urlNodeAttributes);
  //   return ref;
  // }

  getListMembers(members: any[]): IUser[] {
    const arrayMembers = [];
    members.forEach((member) => {
      console.log("loadUserDetail: ", member);
      let userDetail = new UserModel(member, "", "", member, "", URL_NO_IMAGE);
      if (member.trim() !== "" && member.trim() !== SYSTEM) {
        this.getUserDetail(member)
          .then((snapshot) => {
            if (snapshot.val()) {
              const user = snapshot.val();
              const fullname = user.firstname + " " + user.lastname;
              let imageUrl = URL_NO_IMAGE;
              if (user.imageurl && user.imageurl !== LABEL_NOICON) {
                imageUrl = user.imageurl;
              }
              userDetail = new UserModel(
                snapshot.key,
                user.email,
                user.firstname,
                user.lastname,
                fullname.trim(),
                imageUrl
              );
              console.log("userDetail: ", userDetail);
            }
            console.log("---------------> : ", member);
            arrayMembers.push(userDetail);
          })
          .catch((err) => {
            console.log("Unable to get permission to notify.", err);
          });
      }
    });
    return arrayMembers;
  }

  // loadGroupDetail(uidUser, uidGroup){
  //   console.log("loadGroudDetail: ", uidGroup);
  //   const userFirebase = this.initGroupDetails(uidUser, uidGroup);
  //   userFirebase.on("value", function(snapshot) {
  //       let groupDetail = new GroupModel(snapshot.key, 0, '', [], '', '');
  //       if (snapshot.val()){
  //         const group = snapshot.val();
  //         groupDetail = new GroupModel(
  //           snapshot.key,
  //           group.createdOn,
  //           group.iconURL,
  //           group.members,
  //           group.name,
  //           group.owner
  //         );
  //       }
  //       console.log("loadGroupDetail: ", groupDetail);
  //       this.events.publish('loadGroupDetail:complete', groupDetail);
  //     });
  // }

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
  onAuthStateChanged() {
    const { events, goOffline, auth, goOnline } = this.instance;
    console.log("UserService::onAuthStateChanged");

    auth.onAuthStateChanged((user) => {
      console.log("UserService::onAuthStateChanged::user:", user);

      if (!user) {
        console.log(" 3 - PASSO OFFLINE AL CHAT MANAGER");
        goOffline();
      } else {
        this.userUid = user.uid;
        console.log(" 1 - IMPOSTO STATO CONNESSO UTENTE ");
        this.chatPresenceHandler.setupMyPresence(user.uid);
        console.log(" 2 - AGGIORNO IL TOKEN ::: ", user);
        const keySubscription = "eventGetToken";
        events.addListener(keySubscription, this.callbackGetToken);
        // this.addSubscription(keySubscription);
        // this.msgService.getToken();

        this.msgService.getToken(); // this.getToken(); // perchè???
        console.log(" 3 - CARICO IL DETTAGLIO UTENTE ::: ");

        const userFirebase = this.initUserDetails(user.uid);
        userFirebase.on("value", (snapshot) => {
          if (snapshot.val()) {
            const user = snapshot.val();
            const fullname = user.firstname + " " + user.lastname;
            this.currentUserDetails = new UserModel(
              user.uid,
              user.email,
              user.firstname,
              user.lastname,
              fullname,
              user.imageurl
            );
          } else {
            this.currentUserDetails = new UserModel(
              user.uid,
              user.email,
              "",
              "",
              user.uid,
              ""
            );
            this.saveCurrentUserDetail(user.uid, user.email, "", "");
          }
          console.log(" 4 - PASS ONLINE AL CHAT MANAGER");
          goOnline(this.currentUserDetails);
        });
      }
    });
  }

  callbackGetToken: any = (token) => {
    console.log(" 4 - callbackGetToken");
    this.msgService.updateToken(this.userUid, token);
    this.token = token;
  };

  // getToken() {
  //   // https://firebase.google.com/docs/auth/admin/verify-id-tokens
  //   console.log('getToken. firebase.auth().currentUser: ', firebase.auth().currentUser);
  //   if(firebase.auth().currentUser){
  //     firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
  //     .then(function(idToken) {
  //         this.token = idToken;
  //         console.log('idToken.', idToken);
  //         this.msgService.updateToken(this.userUid, idToken);
  //     }).catch(function(error) {
  //       // Handle error
  //       console.log('error idToken.', error);
  //     });
  //   }

  // }

  returnToken(): string {
    return this.token;
  }

  /**
   * IMPOSTO FIREBASE REFERENCE
   * imposto la reference al nodo di firebase dettaglio utente uid
   * @param uid
   */
  initUserDetails(uid) {
    const urlNodeFirebase = this.urlNodeContacts + uid;
    return this.instance.getDbRef(urlNodeFirebase);
  }

  initGroupDetails(uidUser, uidGroup) {
    const { getDbRef } = this.instance;
    return getDbRef("users/" + uidUser + "/groups/" + uidGroup);
  }

  getUidLastOpenConversation(): string {
    return this.uidLastOpenConversation;
  }

  /**
   * LOGUOT FIREBASE
   * al logout vado in automatico su onAuthStateChanged
   */
  logoutUser() {
    console.log("UserService::logoutUser");
    console.log(" 1 - CANCELLO L'UTENTE DAL NODO PRESENZE");
    this.chatPresenceHandler.goOffline();
    console.log(" 2 - RIMUOVO IL TOKEN");
    this.msgService.removeToken();
    return this.instance.auth.signOut();
  }
}
