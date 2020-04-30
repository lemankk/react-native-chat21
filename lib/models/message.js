export class MessageModel {
    constructor(uid, language, recipient, recipient_fullname, sender, sender_fullname, status, metadata, text, timestamp, headerDate, type, attributes, channel_type, isSender
    // public projectid: string
    ) {
        this.uid = uid;
        this.language = language;
        this.recipient = recipient;
        this.recipient_fullname = recipient_fullname;
        this.sender = sender;
        this.sender_fullname = sender_fullname;
        this.status = status;
        this.metadata = metadata;
        this.text = text;
        this.timestamp = timestamp;
        this.headerDate = headerDate;
        this.type = type;
        this.attributes = attributes;
        this.channel_type = channel_type;
        this.isSender = isSender;
    }
}
//# sourceMappingURL=message.js.map