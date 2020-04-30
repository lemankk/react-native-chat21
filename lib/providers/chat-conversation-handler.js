import { BehaviorSubject } from "rxjs";
import "rxjs/add/operator/map";
// models
import { MessageModel } from "../models/message";
// services
// utils
import { MSG_STATUS_RECEIVED, TYPE_GROUP } from "../utils/constants";
import { compareValues, htmlEntities, nodeTypingsPath, searchIndexInArrayForUid, } from "../utils/utils";
export class ChatConversationHandler {
    constructor(instance) {
        this.instance = instance;
        this.listSubsriptions = [];
        this.obsAdded = new BehaviorSubject(null);
    }
    /**
     * inizializzo conversation handler
     * @param recipientId
     * @param recipientFullName
     */
    initWithRecipient(recipientId, recipientFullName, loggedUser, tenant) {
        this.loggedUser = loggedUser;
        this.tenant = tenant;
        this.recipientId = recipientId;
        this.recipientFullname = recipientFullName;
        this.senderId = this.loggedUser.uid;
        this.conversationWith = recipientId;
        this.messages = [];
        this.attributes = this.setAttributes();
    }
    setAttributes() {
        let attributes = JSON.parse(sessionStorage.getItem("attributes"));
        if (!attributes || attributes === "undefined") {
            attributes = {
                client: "",
                sourcePage: "",
                userEmail: "",
                userFullname: "",
            };
            console.log(">>>>>>>>>>>>>> setAttributes: ", JSON.stringify(attributes));
            sessionStorage.setItem("attributes", JSON.stringify(attributes));
        }
        return attributes;
    }
    /**
     * mi connetto al nodo messages
     * recupero gli ultimi 100 messaggi
     * creo la reference
     * mi sottoscrivo a change, removed, added
     */
    connect() {
        const { events, getDbRef, getDbPath } = this.instance;
        this.urlNodeFirebase = getDbPath(`users/${this.loggedUser.uid}/messages/`);
        this.urlNodeFirebase = this.urlNodeFirebase + this.conversationWith;
        console.log("urlNodeFirebase *****", this.urlNodeFirebase);
        const firebaseMessages = getDbRef(this.urlNodeFirebase);
        this.messagesRef = firebaseMessages
            .orderByChild("timestamp")
            .limitToLast(100);
        //// AGGIUNTA MESSAGGIO ////
        this.messagesRef.on("child_added", (childSnapshot) => {
            const itemMsg = childSnapshot.val();
            // imposto il giorno del messaggio per visualizzare o nascondere l'header data
            // TODO: Convert date from timestamp
            //   let calcolaData = setHeaderDate(this.translate, itemMsg['timestamp'], lastDate);
            //   if (calcolaData != null) {
            //     lastDate = calcolaData;
            //   }
            // controllo fatto per i gruppi da rifattorizzare
            !itemMsg.sender_fullname || itemMsg.sender_fullname == "undefined"
                ? (itemMsg.sender_fullname = itemMsg.sender)
                : itemMsg.sender_fullname;
            // bonifico messaggio da url
            // let messageText = replaceBr(itemMsg['text']);
            let messageText = itemMsg["text"];
            if (itemMsg["type"] == "text") {
                // messageText = urlify(itemMsg['text']);
                messageText = htmlEntities(itemMsg["text"]);
            }
            if (itemMsg["metadata"]) {
                const index = searchIndexInArrayForUid(this.messages, itemMsg["metadata"].uid);
                if (index > -1) {
                    this.messages.splice(index, 1);
                }
            }
            // creo oggetto messaggio e lo aggiungo all'array dei messaggi
            const msg = new MessageModel(childSnapshot.key, itemMsg["language"], itemMsg["recipient"], itemMsg["recipient_fullname"], itemMsg["sender"], itemMsg["sender_fullname"], itemMsg["status"], itemMsg["metadata"], messageText, itemMsg["timestamp"], itemMsg["timestamp"], itemMsg["type"], itemMsg["attributes"], itemMsg["channel_type"], false);
            // console.log("child_added *****", itemMsg['timestamp'], this.messages, msg);
            this.isSender(msg, this.loggedUser);
            if (msg.attributes &&
                msg.attributes.subtype &&
                (msg.attributes.subtype === "info" ||
                    msg.attributes.subtype === "info/support")) {
                this.translateInfoSupportMessages(msg);
            }
            this.messages.push(msg);
            this.messages.sort(compareValues("timestamp", "asc"));
            // aggiorno stato messaggio
            // questo stato indica che è stato consegnato al client e NON che è stato letto
            this.setStatusMessage(childSnapshot, this.conversationWith);
            console.log("msg.sender ***** " +
                msg.sender +
                " this.loggedUser.uid:::" +
                this.loggedUser.uid);
            if (msg.sender === this.loggedUser.uid) {
                events.emit("doScroll");
            }
            this.obsAdded.next(msg);
            // pubblico messaggio - sottoscritto in dettaglio conversazione
            // console.log("publish:: ", 'listMessages:added-'+this.conversationWith, this.events);
            // this.events.publish('listMessages:added-'+this.conversationWith, this.conversationWith, msg);
        });
        //// SUBSRIBE CHANGE ////
        this.messagesRef.on("child_changed", (childSnapshot) => {
            const itemMsg = childSnapshot.val();
            // imposto il giorno del messaggio per visualizzare o nascondere l'header data
            const calcolaData = itemMsg["timestamp"];
            // TODO: Convert date from timestamp
            //   const calcolaData = setHeaderDate(this.translate, itemMsg['timestamp'], lastDate);
            //   if (calcolaData != null) {
            //     lastDate = calcolaData;
            //   }
            // controllo fatto per i gruppi da rifattorizzare
            !itemMsg.sender_fullname || itemMsg.sender_fullname == "undefined"
                ? (itemMsg.sender_fullname = itemMsg.sender)
                : itemMsg.sender_fullname;
            // bonifico messaggio da url
            // let messageText = replaceBr(itemMsg['text']);
            let messageText = itemMsg["text"];
            if (itemMsg["type"] == "text") {
                // messageText = urlify(itemMsg['text']);
                messageText = htmlEntities(itemMsg["text"]);
            }
            // creo oggetto messaggio e lo aggiungo all'array dei messaggi
            const msg = new MessageModel(childSnapshot.key, itemMsg["language"], itemMsg["recipient"], itemMsg["recipient_fullname"], itemMsg["sender"], itemMsg["sender_fullname"], itemMsg["status"], itemMsg["metadata"], messageText, itemMsg["timestamp"], calcolaData, itemMsg["type"], itemMsg["attributes"], itemMsg["channel_type"], false);
            const index = searchIndexInArrayForUid(this.messages, childSnapshot.key);
            if (msg.attributes &&
                msg.attributes.subtype &&
                (msg.attributes.subtype === "info" ||
                    msg.attributes.subtype === "info/support")) {
                this.translateInfoSupportMessages(msg);
            }
            this.messages.splice(index, 1, msg);
            // aggiorno stato messaggio
            // questo stato indica che è stato consegnato al client e NON che è stato letto
            this.setStatusMessage(childSnapshot, this.conversationWith);
            if (this.isSender(msg, this.loggedUser)) {
                events.emit("doScroll");
            }
            // pubblico messaggio - sottoscritto in dettaglio conversazione
            // this.events.publish('listMessages:changed-'+this.conversationWith, this.conversationWith, this.messages);
            // this.events.publish('listMessages:changed-'+this.conversationWith, this.conversationWith, msg);
        });
        this.messagesRef.on("child_removed", (childSnapshot) => {
            // al momento non previsto!!!
            const index = searchIndexInArrayForUid(this.messages, childSnapshot.key);
            // controllo superfluo sarà sempre maggiore
            if (index > -1) {
                this.messages.splice(index, 1);
                // this.events.publish('conversations:update-'+this.conversationWith, this.messages);
            }
            // if(!this.isSender(msg)){
            //   this.events.publish('doScroll');
            // }
        });
    }
    translateInfoSupportMessages(message) {
        // console.log("ChatConversationHandler::translateInfoSupportMessages::message:", message);
        // check if the message has attributes, attributes.subtype and these values
        if (message.attributes &&
            message.attributes.subtype &&
            (message.attributes.subtype === "info" ||
                message.attributes.subtype === "info/support")) {
            // check if the message attributes has parameters and it is of the "MEMBER_JOINED_GROUP" type
            // [BEGIN MEMBER_JOINED_GROUP]
            if (message.attributes.messagelabel &&
                message.attributes.messagelabel.parameters &&
                message.attributes.messagelabel.key === "MEMBER_JOINED_GROUP") {
                if (message.attributes.messagelabel.parameters.member_id ===
                    this.loggedUser.uid) {
                    // logged user has been added to the group
                    //   subject = this.translate.get("INFO_SUPPORT_USER_ADDED_SUBJECT")[
                    //     "value"
                    //   ];
                    //   verb = this.translate.get("INFO_SUPPORT_USER_ADDED_YOU_VERB")[
                    //     "value"
                    //   ];
                    //   complement = this.translate.get("INFO_SUPPORT_USER_ADDED_COMPLEMENT")[
                    //     "value"
                    //   ];
                }
                else {
                    if (message.attributes.messagelabel.parameters.fullname) {
                        // other user has been added to the group (and he has a fullname)
                        // subject = message.attributes.messagelabel.parameters.fullname;
                        // verb = this.translate.get("INFO_SUPPORT_USER_ADDED_VERB")["value"];
                        // complement = this.translate.get(
                        //   "INFO_SUPPORT_USER_ADDED_COMPLEMENT"
                        // )["value"];
                    }
                    else {
                        // other user has been added to the group (and he has not a fullname, so use hes useruid)
                        // subject = message.attributes.messagelabel.parameters.member_id;
                        // verb = this.translate.get("INFO_SUPPORT_USER_ADDED_VERB")["value"];
                        // complement = this.translate.get(
                        //   "INFO_SUPPORT_USER_ADDED_COMPLEMENT"
                        // )["value"];
                    }
                }
                // perform translation
                // this.translate
                //   .get("INFO_SUPPORT_USER_ADDED_MESSAGE", {
                //     subject: subject,
                //     verb: verb,
                //     complement: complement,
                //   })
                //   .subscribe((res: string) => {
                //     message.text = res;
                //   });
            } // [END MEMBER_JOINED_GROUP]
            // [END CHAT_REOPENED]
            else if (message.attributes.messagelabel &&
                message.attributes.messagelabel.key === "CHAT_REOPENED") {
                // message.text = this.translate.get("INFO_SUPPORT_CHAT_REOPENED")[
                //   "value"
                // ];
            }
            // [END CHAT_REOPENED]
            // [END CHAT_CLOSED]
            else if (message.attributes.messagelabel &&
                message.attributes.messagelabel.key === "CHAT_CLOSED") {
                // message.text = this.translate.get("INFO_SUPPORT_CHAT_CLOSED")["value"];
            }
            // [END CHAT_CLOSED]
        }
    }
    /**
     * arriorno lo stato del messaggio
     * questo stato indica che è stato consegnato al client e NON che è stato letto
     * se il messaggio NON è stato inviato da loggedUser AGGIORNO stato a 200
     * @param item
     * @param conversationWith
     */
    setStatusMessage(item, conversationWith) {
        const { getDbRef } = this.instance;
        if (item.val()["status"] < MSG_STATUS_RECEIVED) {
            // const tenant = this.chatManager.getTenant();
            // const loggedUser = this.chatManager.getLoggedUser();
            const msg = item.val();
            if (msg.sender != this.loggedUser.uid &&
                msg.status < MSG_STATUS_RECEIVED) {
                getDbRef(`users/${this.loggedUser.uid}/messages/${conversationWith}/${item.key}`).update({ status: MSG_STATUS_RECEIVED });
            }
        }
    }
    /**
     * controllo se il messaggio è stato inviato da loggerUser
     * richiamato dalla pagina elenco messaggi della conversazione
     * @param message
     */
    isSender(message, currentUser) {
        // const currentUser = this.loggedUser;//this.chatManager.getLoggedUser();
        console.log("isSender::::: ", message.sender, currentUser.uid);
        if (currentUser) {
            if (message.sender == currentUser.uid) {
                message.isSender = true;
                return true;
            }
            else {
                message.isSender = false;
                return false;
            }
        }
        else {
            message.isSender = false;
            return false;
        }
    }
    /**
     * bonifico url in testo messaggio
     * recupero time attuale
     * recupero lingua app
     * recupero sender_fullname e recipient_fullname
     * aggiungo messaggio alla reference
     * @param msg
     * @param conversationWith
     * @param conversationWithDetailFullname
     */
    sendMessage(msg, type, metadata, conversationWith, conversationWithDetailFullname, channel_type) {
        const { events, config, getDbRef } = this.instance;
        !channel_type || channel_type == "undefined"
            ? (channel_type = "direct")
            : channel_type;
        console.log("messages: ", this.messages);
        console.log("SEND MESSAGE: ", msg, channel_type);
        const now = new Date();
        // const timestamp = now.valueOf();
        const timestamp = Date.now();
        console.log("timestamp: ", timestamp);
        const language = document.documentElement.lang;
        const sender_fullname = this.loggedUser.fullname;
        const recipient_fullname = conversationWithDetailFullname;
        const dateSendingMessage = `${timestamp}`;
        // const dateSendingMessage = setHeaderDate(this.translate, timestamp);
        const firebaseMessagesCustomUid = getDbRef(this.urlNodeFirebase);
        const message = new MessageModel("", language, conversationWith, recipient_fullname, this.loggedUser.uid, sender_fullname, "", metadata, msg, timestamp, dateSendingMessage, type, this.attributes, channel_type, false);
        console.log("messaggio **************", message);
        // firebaseMessages.push(message);
        const messageRef = firebaseMessagesCustomUid.push();
        const key = messageRef.key;
        message.uid = key;
        console.log("messageRef: ", messageRef, key);
        messageRef.set(message, (error) => {
            // Callback comes here
            if (error) {
                // cambio lo stato in rosso: invio nn riuscito!!!
                message.status = "-100";
                console.log("ERRORE", error);
            }
            else {
                // this.checkWritingMessages();
                message.status = "150";
                console.log("OK MSG INVIATO CON SUCCESSO AL SERVER", message);
            }
            console.log("****** changed *****", this.messages);
        });
    }
    updateMetadataMessage(uid, metadata) {
        const { config, getDbRef } = this.instance;
        metadata.status = true;
        const message = {
            metadata: metadata,
        };
        const firebaseMessages = getDbRef(this.urlNodeFirebase + uid);
        firebaseMessages.set(message);
    }
    // BEGIN TYPING FUNCTIONS
    /**
     *
     */
    initWritingMessages() {
        this.urlNodeTypings = nodeTypingsPath(this.conversationWith);
        console.log("checkWritingMessages", this.urlNodeTypings);
    }
    /**
     * check if agent writing
     */
    getWritingMessages() {
        const { events, config, getDbRef } = this.instance;
        this.messagesRefTyping = getDbRef(this.urlNodeTypings)
            .orderByChild("timestamp")
            .limitToLast(1);
        this.messagesRefTyping.on("child_changed", (childSnapshot) => {
            // this.changedTypings(childSnapshot);
            // console.log('child_changed key', childSnapshot.key);
            // console.log('child_changed val', childSnapshot.val());
            events.emit("isTypings-" + this.conversationWith, childSnapshot, this.conversationWith);
        });
    }
    /**
     *
     */
    setWritingMessages(str, channel_type) {
        const { getDbPath, getDbRef } = this.instance;
        // clearTimeout(this.setTimeoutWritingMessages);
        this.setTimeoutWritingMessages = setTimeout(() => {
            let readUrlNodeTypings = nodeTypingsPath(this.loggedUser.uid);
            // let readUrlNodeTypings = this.urlNodeTypings;
            if (channel_type === TYPE_GROUP) {
                console.log("GRUPPO");
                readUrlNodeTypings = getDbPath(`${readUrlNodeTypings}/${this.loggedUser.uid}`);
            }
            console.log("setWritingMessages:", readUrlNodeTypings);
            const timestamp = Date.now();
            const precence = {
                timestamp,
                message: str,
            };
            getDbRef(readUrlNodeTypings).set(precence, (error) => {
                if (error) {
                    console.log("ERRORE", error);
                }
                else {
                    console.log("OK update typing");
                }
            });
        }, 500);
    }
    // END TYPING FUNCTIONS
    // // se è una immagine e la ha inviata l'utente corrente
    // if (type == TYPE_MSG_IMAGE) {
    //   const index = this.messages.findIndex(i => i.uid === metadata.uid);
    //   console.log("trovato mesg", this.messages[index].uid, metadata.uid);
    //   if(index>-1){
    //     this.messages.splice(index, 1);
    //   }
    // }
    /**
     * dispose reference della conversazione
     */
    dispose() {
        console.log("dispose");
        this.messagesRef.off();
        this.messagesRefTyping.off();
    }
    unsubscribe(key) {
        console.log("unsubscribe: ", key);
        this.listSubsriptions.forEach((sub) => {
            console.log("unsubscribe: ", sub.uid, key);
            if (sub.uid === key) {
                console.log("unsubscribe: ", sub.uid, key);
                sub.unsubscribe(key, null);
                return;
            }
        });
    }
}
//# sourceMappingURL=chat-conversation-handler.js.map