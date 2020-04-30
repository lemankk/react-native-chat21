export interface IConversation {
    uid: string;
    attributes: any;
    channel_type: string;
    conversation_with_fullname: string;
    recipient: string;
    recipient_fullname: string;
    image: string;
    is_new: boolean;
    last_message_text: string;
    sender: string;
    senderAuthInfo: any;
    sender_fullname: string;
    status: string;
    timestamp: string;
    time_last_message: string;
    selected: boolean;
    color: string;
    avatar: string;
}
export declare class ConversationModel implements IConversation {
    uid: string;
    attributes: any;
    channel_type: string;
    conversation_with_fullname: string;
    recipient: string;
    recipient_fullname: string;
    image: string;
    is_new: boolean;
    last_message_text: string;
    sender: string;
    senderAuthInfo: any;
    sender_fullname: string;
    status: string;
    timestamp: string;
    time_last_message: string;
    selected: boolean;
    color: string;
    avatar: string;
    constructor(uid: string, attributes: any, channel_type: string, conversation_with_fullname: string, recipient: string, recipient_fullname: string, image: string, is_new: boolean, last_message_text: string, sender: string, senderAuthInfo: any, sender_fullname: string, status: string, timestamp: string, time_last_message: string, selected: boolean, color: string, avatar: string);
}
