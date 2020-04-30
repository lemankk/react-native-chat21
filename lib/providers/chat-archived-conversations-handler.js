import "rxjs/add/operator/map";
import { TYPE_GROUP } from "../utils/constants";
import { avatarPlaceholder, compareValues, getColorBck, getFromNow, searchIndexInArrayForUid, } from "../utils/utils";
export class ChatArchivedConversationsHandler {
    constructor(instance) {
        this.instance = instance;
        this.conversations = [];
        this.uidConvSelected = "";
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
        return this;
    }
    /**
     * mi connetto al nodo conversations
     * creo la reference
     * mi sottoscrivo a change, removed, added
     */
    connect() {
        const urlNodeFirebase = "/apps/" +
            this.tenant +
            "/users/" +
            this.loggedUser.uid +
            "/archived_conversations";
        console.log("url conversations: ", urlNodeFirebase);
        this.ref = this.instance.config.app
            .database()
            .ref(urlNodeFirebase)
            .orderByChild("timestamp")
            .limitToLast(400);
        this.ref.on("child_added", (childSnapshot) => {
            this.onSnapshotAdded(childSnapshot);
        });
        this.ref.on("child_changed", (childSnapshot) => {
            this.onSnapshotChanged(childSnapshot);
        });
        this.ref.on("child_removed", (childSnapshot) => {
            this.onSnapshotRemoved(childSnapshot);
        });
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    /**
     * 1 - aggiungo alla pos 0 la nuova conversazione all'array di conversazioni
     * 2 - pubblico conversations:update
     * @param snapshot
     */
    onSnapshotAdded(snapshot) {
        const childData = snapshot.val();
        childData.uid = snapshot.key;
        const conversation = this.completeConversation(childData);
        if (this.isValidConversation(snapshot.key, conversation)) {
            const index = searchIndexInArrayForUid(this.conversations, conversation.uid);
            if (index > -1) {
                this.conversations.splice(index, 1, conversation);
            }
            else {
                this.conversations.splice(0, 0, conversation);
            }
            this.conversations.sort(compareValues("timestamp", "desc"));
            this.instance.events.emit("archivedConversationsChanged", this.conversations);
        }
        else {
            console.error("ChatArchivedConversationsHandler::added::conversations with conversationId: ", snapshot.key, "is not valid");
        }
    }
    /**
     * 1 - cerco indice conversazione nell'array conversation
     * 2 - sostituisco conversazione
     * 3 - pubblico conversations:update
     * @param snapshot
     */
    onSnapshotChanged(snapshot) {
        // console.log("ChatArchivedConversationsHandler::onSnapshotChanged::snapshot:", snapshot)
        const childData = snapshot.val();
        childData.uid = snapshot.key;
        const conversation = this.completeConversation(childData);
        if (this.isValidConversation(snapshot.key, conversation)) {
            // conversation = this.isConversationSelected(conversation, '1');
            const index = searchIndexInArrayForUid(this.conversations, conversation.uid);
            this.conversations.splice(index, 1, conversation);
            this.conversations.sort(compareValues("timestamp", "desc"));
            this.instance.events.emit("archivedConversationsChanged", this.conversations);
        }
        else {
            console.error("ChatArchivedConversationsHandler::changed::conversations with conversationId: ", snapshot.key, "is not valid");
        }
    }
    /**
     * 1 - cerco indice conversazione da eliminare
     * 2 - elimino conversazione da array conversations
     * 3 - pubblico conversations:update
     * @param childSnapshot
     */
    onSnapshotRemoved(childSnapshot) {
        // console.log("ChatArchivedConversationsHandler::onSnapshotRemoved::childSnapshot:", childSnapshot)
        console.log("ChatArchivedConversationsHandler::onSnapshotRemoved::conversation:", childSnapshot.key);
        const index = searchIndexInArrayForUid(this.conversations, childSnapshot.key);
        if (index > -1) {
            this.conversations.splice(index, 1);
            this.conversations.sort(compareValues("timestamp", "desc"));
            this.instance.events.emit("archivedConversationsChanged", this.conversations);
        }
    }
    /**
     * Completo conversazione aggiungendo:
     * 1 - imposto selected == true se è la conversazione selezionata
     * 2 - imposto fullname del sender concatenando nome e cognome e
     *   - aggiungo 'tu:' se il sender coincide con il loggedUser
     * 3 - imposto il tempo trascorso dell'invio dell'ultimo messaggio
     * @param conv
     */
    completeConversation(conv) {
        // debugger;
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
        // NOTA: le immagini le devo ricaricare solo quando entro nel dettaglio di una conversazione!!!!!
        if (conv.image === "no-image") {
            console.log("no-image", conv);
            const conversationRef = this.ref.ref.child(conv.uid);
            conversationRef.child("image").remove();
            console.log("no-image conversationRef", conversationRef);
        }
        const time_last_message = this.getTimeLastMessage(conv.timestamp);
        conv.time_last_message = time_last_message;
        conv.avatar = avatarPlaceholder(conversation_with_fullname);
        conv.color = getColorBck(conversation_with_fullname);
        return conv;
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
     * calcolo il tempo trascorso da ora al timestamp passato
     * @param timestamp
     */
    getTimeLastMessage(timestamp) {
        const timestampNumber = parseInt(timestamp) / 1000;
        const time = getFromNow(timestampNumber);
        return time;
    }
    /**
     * dispose reference di conversations
     */
    dispose() {
        this.ref.off();
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
    getConversationByUid(conversationUid) {
        const index = searchIndexInArrayForUid(this.conversations, conversationUid);
        return this.conversations[index];
    }
}
//# sourceMappingURL=chat-archived-conversations-handler.js.map