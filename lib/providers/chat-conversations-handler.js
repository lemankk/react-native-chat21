import "rxjs/add/operator/map";
// utils
// FIREBASESTORAGE_BASE_URL_IMAGE,
import { TYPE_GROUP } from "../utils/constants";
import { avatarPlaceholder, compareValues, conversationsPathForUserId, getColorBck, getFromNow, searchIndexInArrayForUid, } from "../utils/utils";
export class ChatConversationsHandler {
    constructor(instance) {
        this.instance = instance;
        this.conversations = [];
        this.uidConvSelected = "";
        // this.FIREBASESTORAGE_BASE_URL_IMAGE = this.appConfig.getConfig().storageBucket;
    }
    /**
     * inizializzo conversations handler
     * @param tenant
     * @param user
     */
    initWithTenant(tenant, loggedUser) {
        this.tenant = tenant;
        this.loggedUser = loggedUser;
        this.userId = loggedUser.uid;
        this.conversations = [];
        this.databaseProvider.initialize(this.loggedUser, this.tenant);
        return this;
    }
    /**
     *
     */
    getConversationsFromStorage() {
        const { events, config } = this.instance;
        const { app } = config;
        this.databaseProvider
            .getConversations()
            .then((conversations) => {
            events.emit("loadedConversationsStorage", conversations);
        })
            .catch((error) => {
            console.log("error::: getConversations:: ", error);
        });
    }
    /**
     * mi connetto al nodo conversations
     * creo la reference
     * mi sottoscrivo a change, removed, added
     */
    connect() {
        const { config, getDbRef } = this.instance;
        const { app } = config;
        const urlNodeFirebase = conversationsPathForUserId(this.userId);
        console.log("connect ------->", urlNodeFirebase);
        // const urlNodeFirebase = '/apps/'+tenant+'/users/'+this.loggedUser.uid+'/conversations';
        this.ref = getDbRef(urlNodeFirebase)
            .orderByChild("timestamp")
            .limitToLast(200);
        this.ref.on("child_changed", (childSnapshot) => {
            this.changed(childSnapshot);
        });
        this.ref.on("child_removed", (childSnapshot) => {
            this.removed(childSnapshot);
        });
        this.ref.on("child_added", (childSnapshot) => {
            this.added(childSnapshot);
        });
        // SET AUDIO
        this.audio = new Audio();
        this.audio.src = "assets/pling.mp3";
        this.audio.load();
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    /**
     * 1 - aggiungo alla pos 0 la nuova conversazione all'array di conversazioni
     * 2 - pubblico conversations:update
     * @param childSnapshot
     */
    added(childSnapshot) {
        const { events, config } = this.instance;
        const { app } = config;
        const childData = childSnapshot.val();
        childData.uid = childSnapshot.key;
        console.log("child_added conversationS", childSnapshot.val());
        const conversation = this.completeConversation(childData);
        if (this.isValidConversation(childSnapshot.key, conversation)) {
            // add the conversation from the isConversationClosingMap
            this.tiledeskConversationsProvider.setClosingConversation(childSnapshot.key, false);
            const index = searchIndexInArrayForUid(this.conversations, conversation.uid);
            if (index > -1) {
                this.conversations.splice(index, 1, conversation);
            }
            else {
                this.conversations.splice(0, 0, conversation);
                this.databaseProvider.setConversation(conversation);
            }
            this.conversations.sort(compareValues("timestamp", "desc"));
            events.emit("conversationsChanged", this.conversations);
        }
        else {
            console.error("ChatConversationsHandler::added::conversations with conversationId: ", childSnapshot.key, "is not valid");
        }
        if (conversation.is_new) {
            // this.soundMessage();
        }
    }
    /**
     * 1 - cerco indice conversazione nell'array conversation
     * 2 - sostituisco conversazione
     * 3 - pubblico conversations:update
     * @param childSnapshot
     */
    changed(childSnapshot) {
        const { events, config } = this.instance;
        const { app } = config;
        const childData = childSnapshot.val();
        childData.uid = childSnapshot.key;
        const conversation = this.completeConversation(childData);
        if (this.isValidConversation(childSnapshot.key, conversation)) {
            // conversation = this.isConversationSelected(conversation, '1');
            const index = searchIndexInArrayForUid(this.conversations, conversation.uid);
            this.conversations.splice(index, 1, conversation);
            this.conversations.sort(compareValues("timestamp", "desc"));
            this.databaseProvider.setConversation(conversation);
            events.emit("conversationsChanged", this.conversations);
        }
        else {
            console.error("ChatConversationsHandler::changed::conversations with conversationId: ", childSnapshot.key, "is not valid");
        }
        if (conversation.is_new) {
            this.soundMessage();
        }
    }
    /**
     * 1 - cerco indice conversazione da eliminare
     * 2 - elimino conversazione da array conversations
     * 3 - pubblico conversations:update
     * @param childSnapshot
     */
    removed(childSnapshot) {
        const { events, config } = this.instance;
        const { app } = config;
        console.log("ChatConversationsHandler::onSnapshotRemoved::conversation:", childSnapshot.key);
        const index = searchIndexInArrayForUid(this.conversations, childSnapshot.key);
        if (index > -1) {
            this.conversations.splice(index, 1);
            this.conversations.sort(compareValues("timestamp", "desc"));
            this.databaseProvider.removeConversation(childSnapshot.key);
            events.emit("conversationsChanged", this.conversations);
        }
        // remove the conversation from the isConversationClosingMap
        this.tiledeskConversationsProvider.deleteClosingConversation(childSnapshot.key);
        // // sort the array without the removed item and update the conversations list
        // this.conversations = this.sort(this.conversations);
        // var sortedCopy = this.sort(this.conversations);
        // for (var i = 0; i < sortedCopy.length; i++) {
        //     var item: ConversationModel = sortedCopy[i];
        //     console.log(i + ") ChatConversationsHandler::removed::item", item, item.timestamp);
        // }
        // this.conversations = sortedCopy;
        // this.events.publish('conversations:removed');
    }
    /**
     *
     * @param conv
     */
    // isConversationSelected(conv, status){
    //     conv.status = status;
    //     if(conv.uid == this.uidConvSelected){
    //         conv.selected = true;
    //         conv.status = '0';
    //     }
    //     return conv;
    // }
    /**
     * Completo conversazione aggiungendo:
     * 1 - imposto selected == true se è la conversazione selezionata
     * 2 - imposto fullname del sender concatenando nome e cognome e
     *   - aggiungo 'tu:' se il sender coincide con il loggedUser
     * 3 - imposto il tempo trascorso dell'invio dell'ultimo messaggio
     * @param conv
     */
    completeConversation(conv) {
        console.log("completeConversation", conv);
        // var LABEL_TU = this.translate.get('LABEL_TU')['value'];
        conv.selected = false;
        if (!conv.sender_fullname ||
            conv.sender_fullname === "undefined" ||
            conv.sender_fullname.trim() === "") {
            conv.sender_fullname = conv.sender;
        }
        if (!conv.recipient_fullname ||
            conv.recipient_fullname === "undefined" ||
            conv.recipient_fullname.trim() === "") {
            conv.recipient_fullname = conv.recipient;
        }
        let conversation_with_fullname = conv.sender_fullname;
        let conversation_with = conv.sender;
        if (conv.sender === this.loggedUser.uid) {
            conversation_with = conv.recipient;
            conversation_with_fullname = conv.recipient_fullname;
            conv.last_message_text = conv.last_message_text;
        }
        else if (conv.channel_type === TYPE_GROUP) {
            conversation_with = conv.recipient;
            conversation_with_fullname = conv.recipient_fullname;
            conv.last_message_text = conv.last_message_text;
        }
        conv.conversation_with_fullname = conversation_with_fullname;
        conv.status = this.setStatusConversation(conv.sender, conv.uid);
        conv.time_last_message = this.getTimeLastMessage(conv.timestamp);
        conv.avatar = avatarPlaceholder(conversation_with_fullname);
        conv.color = getColorBck(conversation_with_fullname);
        conv.image = this.getImageUrlThumb(conversation_with);
        return conv;
    }
    getImageUrlThumb(uid) {
        const { events, config } = this.instance;
        const { app } = config;
        // let imageurl = FIREBASESTORAGE_BASE_URL_IMAGE+'profiles%2F'+uid+'%2Fthumb_photo.jpg?alt=media';
        const imageurl = config.imageBaseUrl +
            "/o/profiles%2F" +
            uid +
            "%2Fthumb_photo.jpg?alt=media";
        return imageurl;
    }
    // set the remote conversation as read
    setConversationRead(conversationUid) {
        const conversationRef = this.ref.ref.child(conversationUid);
        conversationRef.update({ is_new: false });
    }
    getConversationByUid(conversationUid) {
        const index = searchIndexInArrayForUid(this.conversations, conversationUid);
        return this.conversations[index];
    }
    setStatusConversation(sender, uid) {
        let status = "0"; // letto
        if (sender === this.loggedUser.uid || uid === this.uidConvSelected) {
            status = "0";
        }
        else {
            status = "1"; // non letto
        }
        return status;
    }
    /**
     * carico url immagine profilo passando id utente
     */
    // setImageConversation(conv, conversation_with){
    //     console.log("********** displayImage uidContact::: ", that.ref.ref.child(conv.uid));
    //     var conversationRef = that.ref.ref.child(conv.uid);
    //     if(conversation_with){
    //         this.upSvc.display(conversation_with, 'thumb')
    //         .then(onResolve, onReject);
    //     }
    //     function onResolve(foundURL) {
    //         console.log('foundURL', conv, foundURL);
    //         conv.image = foundURL;
    //         // salvo in cache e sul DB!!!
    //         conversationRef.update({"image" : foundURL});
    //         that.databaseProvider.setConversation(conv);
    //     }
    //     function onReject(error){
    //         console.log('error.code', error.code);
    //         conversationRef.child('image').remove();
    //         conv.image = '';
    //     }
    // }
    /**
     * calcolo il tempo trascorso da ora al timestamp passato
     * @param timestamp
     */
    getTimeLastMessage(timestamp) {
        const timestampNumber = parseInt(timestamp) / 1000;
        const time = getFromNow(timestampNumber);
        return time;
    }
    /**
     * 1 - deseleziono tutte le conversazioni (setto tutti su on selected FALSE)
     * 2 - evidezio la conversazione selezionata (setto selected TRUE)
     * @param uid
     */
    // setConversationSelected(uid): ConversationModel[]{
    //     this.conversations.forEach(function(element) {
    //         element.selected = false;
    //     });
    //     this.conversations.filter(function(item){
    //         if(item.uid == uid){
    //         item.selected = true;
    //         return;
    //         }
    //     });
    //     return this.conversations;
    // }
    /**
     * dispose reference di conversations
     */
    dispose() {
        this.conversations = [];
        this.uidConvSelected = "";
        this.ref.off();
        this.ref.off("child_changed");
        this.ref.off("child_removed");
        this.ref.off("child_added");
        console.log("DISPOSE::: ", this.ref);
    }
    // private clone(convs: ConversationModel[]): ConversationModel[] {
    //     var copy = [];
    //     for (var i = 0; i < convs.length; i++) {
    //         var item: ConversationModel = convs[i];
    //         copy.push(item);
    //     }
    //     return copy;
    // }
    // private sort(convs: ConversationModel[]): ConversationModel[] {
    //     return this.clone(convs).sort(this.compare);
    // }
    // private compare(a: ConversationModel, b: ConversationModel) : number {
    //     return (a.timestamp < b.timestamp) ? 1 : ((b.timestamp < a.timestamp) ? -1 : 0);
    // }
    // private existsInArray(convs: ConversationModel[], item: ConversationModel) : boolean{
    //     return convs.some( (el) => {
    //         return el.uid === item.uid
    //     }); //true
    // }
    removeByUid(uid) {
        const { events, config } = this.instance;
        const { app } = config;
        const index = searchIndexInArrayForUid(this.conversations, uid);
        if (index > -1) {
            this.conversations.splice(index, 1);
            events.emit("conversationsChanged", this.conversations);
        }
    }
    addConversationListener(uidUser, conversationId) {
        const { events, config } = this.instance;
        const { app } = config;
        const url = "/apps/" +
            this.tenant +
            "/users/" +
            uidUser +
            "/conversations/" +
            conversationId;
        const reference = app.database().ref(url);
        console.log("ChatConversationsHandler::addConversationListener::reference:", url, reference.toString());
        reference.on("value", (snapshot) => {
            setTimeout(() => {
                events.emit(conversationId + "-listener", snapshot);
            }, 100);
        });
    }
    // check if the conversations is valid or not
    isValidConversation(convToCheckId, convToCheck) {
        // console.log("[BEGIN] ChatConversationsHandler:: convToCheck with uid: ", convToCheckId);
        if (!this.isValidField(convToCheck.uid)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'uid is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.is_new)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'is_new is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.last_message_text)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'last_message_text is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.recipient)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'recipient is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.recipient_fullname)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'recipient_fullname is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.sender)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'sender is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.sender_fullname)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'sender_fullname is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.status)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'status is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.timestamp)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'timestamp is not valid' ");
            return false;
        }
        if (!this.isValidField(convToCheck.channel_type)) {
            // console.error("ChatConversationsHandler::isValidConversation:: 'channel_type is not valid' ");
            return false;
        }
        // console.log("[END] ChatConversationsHandler:: convToCheck with uid: ", convToCheckId);
        // any other case
        return true;
    }
    // checks if a conversation's field is valid or not
    isValidField(field) {
        return field === null || field === undefined ? false : true;
    }
    // private getColorBck(str){
    //     var arrayBckColor = ['#fba76f', '#80d066', '#73cdd0', '#ecd074', '#6fb1e4', '#f98bae'];
    //     var num = 0;
    //     if(str){
    //         var code = str.charCodeAt((str.length-1));
    //         num = Math.round(code%arrayBckColor.length);
    //         console.log('************** code',str.length, code, arrayBckColor.length, num);
    //     }
    //     return arrayBckColor[num];
    // }
    // private avatarPlaceholder(conversation_with_fullname) {
    //     var initials = '';
    //     if(conversation_with_fullname){
    //         var arrayName = conversation_with_fullname.split(" ");
    //         arrayName.forEach(member => {
    //             if(member.trim().length > 1 && initials.length < 3){
    //                 initials += member.substring(0,1).toUpperCase();
    //             }
    //         });
    //     }
    //     return initials;
    // }
    /**
     *
     */
    countIsNew() {
        let num = 0;
        this.conversations.forEach((element) => {
            if (element.is_new === true) {
                num++;
            }
        });
        return num;
    }
    soundMessage() {
        console.log("****** soundMessage *****", this.audio);
        // this.audio = new Audio();
        // this.audio.src = 'assets/pling.mp3';
        // this.audio.load();
        this.audio.pause();
        this.audio.currentTime = 0;
        clearTimeout(this.setTimeoutSound);
        this.setTimeoutSound = setTimeout(() => {
            // setTimeout(function() {
            this.audio
                .play()
                .then(() => {
                // console.log('****** then *****');
            })
                .catch(() => {
                // console.log('***//tiledesk-dashboard/chat*');
            });
        }, 1000);
    }
}
//# sourceMappingURL=chat-conversations-handler.js.map