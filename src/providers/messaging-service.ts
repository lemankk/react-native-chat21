import "rxjs/add/operator/map";
import { ChatManagerInstance } from "./chat-manager/instance";

export class MessagingService {
  // private afAuth: AngularFireAuth;
  private connectionsRefinstancesId: string;
  // private deviceConnectionRef;
  public token: string;
  public BUILD_VERSION: string;

  constructor(private instance: ChatManagerInstance) {}

  /**
   *
   */
  getPermission() {
    const { messaging, events } = this.instance;
    try {
      console.log("Notification getPermission.");
      // Request permission and get token.....
      messaging
        .requestPermission()
        .then((token) => {
          console.log("Notification permission granted.");
          // TODO(developer): Retrieve an Instance ID token for use with FCM.
          // this.token = token;
          console.log("NOTIFICA PERMESSO token.", token);
          // callback PERMESSO NOTIFICA OK
          events.emit("requestPermission", true);
          // this.updateToken(token);
        })
        .catch(() => {
          events.emit("requestPermission", false);
          console.log("Unable to get permission to notify.");
        });
    } catch (err) {
      console.log("error getPermission firebase messaging system", err);
    }

    // navigator.serviceWorker.register('./firebase-messaging-sw.js')
    // .then((registration) => {
    //     this.messaging.useServiceWorker(registration);
    //     console.log('useServiceWorker.', registration);
    //     // Request permission and get token.....
    //     this.messaging.requestPermission()
    //     .then(token => {
    //         console.log('Notification permission granted.');
    //         // TODO(developer): Retrieve an Instance ID token for use with FCM.
    //         this.token = token;
    //         console.log('NOTIFICA PERMESSO token.', token);
    //         //this.updateToken(token);
    //     })
    //     .catch(function(err) {
    //         console.log('Unable to get permission to notify.', err);
    //     });
    // });

    // .then(() => {
    //     console.log('Notification permission granted.');
    //     firebase.auth().currentUser.getToken(/* forceRefresh */ true)
    //     .then(function(idToken) {
    //         // Send token to your backend via HTTPS
    //         this.token = idToken;
    //     })
    //     .catch(function(error) {
    //         // Handle error
    //         console.log('NON POSSO RECUPERARE IL TOKEN.', error);
    //     });
    //     //return this.messaging.getToken();
    // })
    // .then(token => {
    //     this.token = token;
    //     console.log(token);
    //     console.log('NOTIFICA PERMESSO token.', token);
    //     //this.updateToken(token);
    // })
    // .catch((err) => {
    //     console.log('NON DISPONIBILE IL PERMESSO DI NOTIFICA.', err);
    // });
  }

  getToken() {
    const { messaging, events } = this.instance;
    try {
      // Get Instance ID token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      // firebase.messaging().getToken()
      messaging
        .getToken()
        .then((currentToken) => {
          console.log("currentToken: ", currentToken);
          if (currentToken) {
            // sendTokenToServer(currentToken);
            this.token = currentToken;
            // updateUIForPushEnabled(currentToken);
            // this.updateToken(user);
            events.emit("eventGetToken", currentToken);
            // this.updateToken(user);
          } else {
            // Show permission request.
            console.log(
              "No Instance ID token available. Request permission to generate one."
            );
            // Show permission UI.
            // updateUIForPushPermissionRequired();
            // setTokenSentToServer(false);
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // showToken('Error retrieving Instance ID token. ', err);
          // setTokenSentToServer(false);
        });
    } catch (err) {
      console.log("error gettting token firebase messaging system", err);
    }
  }

  // returnToken(): string {
  //     return this.token;
  // }

  updateToken(userUid, token) {
    const { database, getDbPath } = this.instance;
    console.log("***********************", token);
    // this.afAuth.authState.take(1).subscribe(user => {
    if (!userUid || !token) return;
    console.log("aggiorno token nel db");
    // aggiorno token nel db
    // let connectionsRef: firebase.database.Reference = this.referenceToUserListToken(user.uid);
    const conection = token;
    const updates = {};
    this.connectionsRefinstancesId = getDbPath(
      "users/" + userUid + "/instances/"
    );
    const device_model = {
      device_model: navigator.userAgent,
      language: navigator.language,
      platform: "ionic",
      platform_version: this.BUILD_VERSION,
    };
    updates[this.connectionsRefinstancesId + conection] = device_model;

    // else{
    // this.connectionsRefinstancesId = this.urlNodeFirebase+"/users/"+user.uid+"/instanceId/";
    // updates[this.connectionsRefinstancesId] = conection;
    // }
    console.log("Aggiorno token ------------>", updates);
    database.ref().update(updates);

    // this.deviceConnectionRef = connectionsRef.push(conection);
    // this.tokenId = conection;//this.deviceConnectionRef.key;
    // console.log("--------->rimuovo token nel db", this.deviceConnectionRef.key);
    // !!! solo quando faccio logout devo rimuovere il token inserito
    // this.deviceConnectionRef.onDisconnect().remove();
  }

  removeToken() {
    const { database } = this.instance;
    console.log("rimuovo token nel db", this.token);
    // this.connectionsRefinstancesId = this.urlNodeFirebase+"/users/"+userUid+"/instances/";
    let connectionsRefURL = "";
    if (this.connectionsRefinstancesId) {
      connectionsRefURL = this.connectionsRefinstancesId + "/" + this.token;
      const connectionsRef = database.ref().child(connectionsRefURL);
      connectionsRef.remove();
    }
  }

  referenceToUserListToken(userid) {
    const { database, getDbPath } = this.instance;
    this.connectionsRefinstancesId = getDbPath(
      "users/" + userid + "/instances/"
    );
    // else{
    // this.connectionsRefinstancesId = this.urlNodeFirebase+"/users/"+userid+"/instanceId/";
    // }
    const connectionsRef = database
      .ref()
      .child(this.connectionsRefinstancesId);
    console.log("referenceToUserListToken ------------>", connectionsRef);
    return connectionsRef;
  }

  receiveMessage() {
    const { messaging } = this.instance;
    try {
      messaging.onMessage((payload) => {
        console.log("OKKKK -------------> Mess∏age received. ", payload);
        // this.currentMessage.next(payload)
      });
    } catch (err) {
      console.log("error receviving message", err);
    }
  }

  returnToken() {
    console.log("returnToken -------------> ", this.token);
    return this.token;
  }
}
