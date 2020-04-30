import { ChatManagerInstance } from "../chat-manager/instance";
export declare class TiledeskConversationProvider {
    private instance;
    /**
     * Contains the status of the conversation closing.
     *
     * When a new conversation is added from firebase, it will be added to the isConversationClosingMap with a false value.
     *
     * When an existing conversation is removed from firebase, it will be removed from the isConversationClosingMap.
     *
     * When an user clicks on a conversation to close it,
     * the conversation with conversationID will be set to true within the isConversationClosingMap.
     *
     * If an error occurs the conversation with conversationID will be set to false.
     *
     */
    private isConversationClosingMap;
    constructor(instance: ChatManagerInstance);
    deleteConversation(recipientId: string, callback: any): void;
    /**
     * Returns the status of the conversations with conversationId from isConversationClosingMap
     *
     * @param conversationId the conversation id
     * @returns true if the conversation is waiting to be closed, false otherwise
     */
    getClosingConversation(conversationId: any): any;
    /**
     * Add the conversation with conversationId to the isConversationClosingMap
     *
     * @param conversationId the id of the conversation of which it wants to save the state
     * @param status true if the conversation is waiting to be closed, false otherwise
     */
    setClosingConversation(conversationId: any, status: any): void;
    /**
     * Delete the conversation with conversationId from the isConversationClosingMap
     *
     * @param conversationId the id of the conversation of which is wants to delete
     */
    deleteClosingConversation(conversationId: any): void;
}
