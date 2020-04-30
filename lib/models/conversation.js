export class ConversationModel {
    constructor(uid, attributes, channel_type, conversation_with_fullname, recipient, recipient_fullname, image, is_new, last_message_text, sender, senderAuthInfo, sender_fullname, status, timestamp, time_last_message, selected, color, avatar) {
        this.uid = uid;
        this.attributes = attributes;
        this.channel_type = channel_type;
        this.conversation_with_fullname = conversation_with_fullname;
        this.recipient = recipient;
        this.recipient_fullname = recipient_fullname;
        this.image = image;
        this.is_new = is_new;
        this.last_message_text = last_message_text;
        this.sender = sender;
        this.senderAuthInfo = senderAuthInfo;
        this.sender_fullname = sender_fullname;
        this.status = status;
        this.timestamp = timestamp;
        this.time_last_message = time_last_message;
        this.selected = selected;
        this.color = color;
        this.avatar = avatar;
    }
}
//# sourceMappingURL=conversation.js.map