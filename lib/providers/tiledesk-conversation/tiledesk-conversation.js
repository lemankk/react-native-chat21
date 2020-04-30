// ====== [END chat21]
export class TiledeskConversationProvider {
    constructor(instance) {
        this.instance = instance;
        this.isConversationClosingMap = new Map();
    }
    // public test() : void {
    //   console.log("TiledeskConversationProvider::test::", "ALL OK!");
    // }
    // Service available at https://github.com/chat21/chat21-cloud-functions/blob/master/docs/api.md#delete-a-conversation
    // Syntax:
    // curl  -X DELETE \
    //       -H 'Content-Type: application/json' \
    //       -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
    //       https://us-central1-<FIREBASE_PROJECT_ID>.cloudfunctions.net/api/<APP_ID>/conversations/<RECIPIENT_ID>
    deleteConversation(recipientId, callback) {
        // const token = this.userService.returnToken(); // retrieve the user auth token
        const { auth, httpRequest } = this.instance;
        auth
            .currentUser.getIdToken(/* forceRefresh */ true)
            .then((token) => {
            console.log("idToken.", token);
            // create the header of the request
            const headers = new Headers();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + token);
            const path = ("conversations/" + recipientId);
            console.log("deleteConversation. URL:", path);
            httpRequest("DELETE", path, { headers })
                .then(response => callback(response))
                .catch(error => {
                callback(null, error);
            });
            // const options = new RequestOptions({ headers: headers });
            // this.http
            //   .delete(url, options)
            //   .map((response: Response) => {
            //     callback(response, null);
            //   }).subscribe();
        })
            .catch((error) => {
            // Handle error
            console.log("idToken error: ", error);
            callback(null, error);
        });
    }
    /**
     * Returns the status of the conversations with conversationId from isConversationClosingMap
     *
     * @param conversationId the conversation id
     * @returns true if the conversation is waiting to be closed, false otherwise
     */
    getClosingConversation(conversationId) {
        return this.isConversationClosingMap[conversationId];
    }
    /**
     * Add the conversation with conversationId to the isConversationClosingMap
     *
     * @param conversationId the id of the conversation of which it wants to save the state
     * @param status true if the conversation is waiting to be closed, false otherwise
     */
    setClosingConversation(conversationId, status) {
        this.isConversationClosingMap[conversationId] = status;
    }
    /**
     * Delete the conversation with conversationId from the isConversationClosingMap
     *
     * @param conversationId the id of the conversation of which is wants to delete
     */
    deleteClosingConversation(conversationId) {
        this.isConversationClosingMap.delete(conversationId);
    }
}
//# sourceMappingURL=tiledesk-conversation.js.map