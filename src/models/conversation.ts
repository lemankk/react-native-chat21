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
export class ConversationModel implements IConversation {
  constructor(
    public uid: string,
    public attributes: any,
    public channel_type: string,
    public conversation_with_fullname: string,
    public recipient: string,
    public recipient_fullname: string,
    public image: string,
    public is_new: boolean,
    public last_message_text: string,
    public sender: string,
    public senderAuthInfo: any,
    public sender_fullname: string,
    public status: string,
    public timestamp: string,
    public time_last_message: string,
    public selected: boolean,
    public color: string,
    public avatar: string
  ) { }
}
