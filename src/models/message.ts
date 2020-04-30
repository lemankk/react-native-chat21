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
    // projectid: string
}

export class MessageModel implements IMessage {
    constructor(
        public uid: string,
        public language: string,
        public recipient: string,
        public recipient_fullname: string,
        public sender: string,
        public sender_fullname: string,
        public status: string,
        public metadata: any,
        public text: string,
        public timestamp: any,
        public headerDate?: string,
        public type?: string,
        public attributes?: any,
        public channel_type?: string,
        public isSender?: boolean
        // public projectid: string
    ) { }
}