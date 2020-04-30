// ====== [BEGIN chat21]
import { ChatManagerInstance } from "../chat-manager/instance";

// ====== [END chat21]

export class TiledeskConversationProvider {

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
  private isConversationClosingMap: Map<string, boolean>;

  constructor(private instance: ChatManagerInstance) {
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

  public deleteConversation(recipientId: string, callback) {
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
        .then ( response => callback(response))
        .catch( error => {
          callback(null, error);
        });

        // const options = new RequestOptions({ headers: headers });
        // this.http
        //   .delete(url, options)
        //   .map((response: Response) => {
        //     callback(response, null);
        //   }).subscribe();
      })
      .catch( (error) => {
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
  public getClosingConversation(conversationId) {
    return this.isConversationClosingMap[conversationId];
  }

  /**
   * Add the conversation with conversationId to the isConversationClosingMap
   *
   * @param conversationId the id of the conversation of which it wants to save the state
   * @param status true if the conversation is waiting to be closed, false otherwise
   */
  public setClosingConversation(conversationId, status) {
    this.isConversationClosingMap[conversationId] = status;
  }

  /**
   * Delete the conversation with conversationId from the isConversationClosingMap
   *
   * @param conversationId the id of the conversation of which is wants to delete
   */
  public deleteClosingConversation(conversationId) {
    this.isConversationClosingMap.delete(conversationId);
  }
}
