export interface IMessage {
    uid: string;
    language: string;
    recipient: string;
    recipient_fullname: string;
    sender: string;
    sender_fullname: string;
    status: string;
    metadata: any;
    text: string;
    timestamp: any;
    headerDate?: string;
    type?: string;
    attributes?: any;
    channel_type?: string;
    isSender?: boolean;
}
export declare class MessageModel implements IMessage {
    uid: string;
    language: string;
    recipient: string;
    recipient_fullname: string;
    sender: string;
    sender_fullname: string;
    status: string;
    metadata: any;
    text: string;
    timestamp: any;
    headerDate?: string;
    type?: string;
    attributes?: any;
    channel_type?: string;
    isSender?: boolean;
    constructor(uid: string, language: string, recipient: string, recipient_fullname: string, sender: string, sender_fullname: string, status: string, metadata: any, text: string, timestamp: any, headerDate?: string, type?: string, attributes?: any, channel_type?: string, isSender?: boolean);
}
