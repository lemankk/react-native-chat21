import "rxjs/add/operator/map";
import { BehaviorSubject } from "rxjs";

// models
import { GroupModel } from "../models/group";

// utils
import { TYPE_SUPPORT_GROUP } from "../utils/constants";
// services
import { ChatManager } from "./chat-manager/chat-manager";
import { UserService } from "./user-service";
import { MessagingService } from "./messaging-service";
import { ChatManagerInstance } from "./chat-manager/instance";
import { userGroupAttrRef, supportApiPath } from "../utils/utils";

export class GroupService {
  public groupDetail: GroupModel;
  private observable: BehaviorSubject<boolean>;
  public arrayMembers;
  public listRefMembersInfo = [];
  refLoadGroupDetail;

  constructor(
    private instance: ChatManagerInstance,
    public msgService: MessagingService,
    public chatManager: ChatManager,
    public userService: UserService,
  ) {
    this.observable = new BehaviorSubject<boolean>(null);
  }

  // /** */
  // initGroupDetails(uidUser, uidGroup) {
  //   const tenant = this.chatManager.getTenant();
  //   const urlNodeContacts = '/apps/' + tenant + '/users/' + uidUser + '/groups/' + uidGroup;
  //   console.log("urlNodeContacts", urlNodeContacts);
  //   return firebase.database().ref(urlNodeContacts);
  // }

  // /** */
  // loadGroupDetail(uidUser, uidGroup) {
  //   console.log("GroupService::loadGroudDetail::uidUser:", uidUser, "uidGroup:", uidGroup);
  //   const reference = this.initGroupDetails(uidUser, uidGroup);
  //   // console.log("GroupService::loadGroudDetail::reference:", reference.toString());
  //   reference.on('value', (snapshot) => {
  //     console.log("GroupService::loadGroudDetail::snapshot:", snapshot.val());
  //     events.emit(uidGroup + '-details', snapshot);
  //   });
  // }

  loadGroupDetail(uidUser: string, uidGroup: string, key: string) {
    const { events, getAppApiUrl, getDbRef } = this.instance;
    const urlNode = getAppApiUrl("users/" + uidUser + "/groups/" + uidGroup);
    console.log("url groups: ", urlNode);
    this.refLoadGroupDetail = getDbRef(urlNode);
    this.refLoadGroupDetail.on("value", (snapshot) => {
      console.log("on value: ", key, snapshot);
      events.emit(key, snapshot);
      events.emit("conversationGroupDetails", snapshot);
    });
  }

  /**
   *
   */
  leaveAGroup(uidGroup: string, uidUser: string, callback) {
    const { auth, appId, getAppApiUrl, httpRequest } = this.instance;
    // const token = this.userService.returnToken();
    auth.currentUser
      .getIdToken(/* forceRefresh */ true)
      .then((token) => {
        console.log("token: ", token);
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + token);

        // const options = new RequestOptions({ headers: headers });

        const path = "groups/" + uidGroup + "/members/" + uidUser;
        console.log("urpathl: ", path);
        console.log("token: ", token);
        const body = {
          app_id: appId,
        };
        const options = {
          body,
          headers,
        };
        httpRequest("DELETE", path, options)
          .then((response) => callback(response))
          .catch((error) => callback(null, error));
        // this.http
        //   .delete(url, options)
        //   .map((res) => {
        //     callback(res, null);
        //   }).subscribe();
      })
      .catch((error) => {
        // Handle error
        console.log("idToken error: ", error);
        callback(null, error);
      });
  }

  closeGroup(uidGroup: string, callback) {
    const { auth, getAppApiUrl, httpRequest } = this.instance;
    // const token = this.userService.returnToken();
    auth.currentUser
      .getIdToken(/* forceRefresh */ true)
      .then((token) => {
        console.log("idToken.", token);
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + token);

        // const options = new RequestOptions({ headers: headers });
        const path = supportApiPath(uidGroup);
        const body = {};
        console.log("---------------> 1 - path: ", path);
        const options = {
          headers,
        };
        httpRequest("PUT", path, options)
          .then((response) => callback(response))
          .catch((error) => callback(null, callback));

        // console.log('---------------> 2 - options: ', options);
        // console.log('------------------> this.http: ', this.http);
        // this.http
        //   .put(url, body, options)
        //   .map((res) => {
        //     callback(res, null);
        //   }).subscribe();
      })
      .catch((error) => {
        // Handle error
        console.log("idToken error: ", error);
        callback(null, error);
      });
  }

  getUidMembers(members): string[] {
    this.arrayMembers = [];
    const memberStr = JSON.stringify(members);
    JSON.parse(memberStr, (key, _value) => {
      this.arrayMembers.push(key);
    });
    return this.arrayMembers;
  }

  isSupportGroup(uid) {
    if (uid.indexOf(TYPE_SUPPORT_GROUP) === 0) {
      return true;
    }
    return false;
  }

  // ========= begin:: subscribe MembersInfo ============//
  /** */

  // getMembersInfo(uidGroup, tenant, uidUser, uidMember){
  // const { appId, events, getDbPath, getDbRef } = this.instance;
  //   const urlNodeContacts ='users/'+uidUser+'/groups/'+uidGroup+'/membersinfo/'+uidMember;
  //   console.log("getMembersInfo: ",urlNodeContacts);
  //   var ref =  getDbRef(urlNodeContacts).once('value');
  //   return ref;
  // }

  /** */
  // loadMembersInfo(uidGroup, tenant, uidUser) {
  // const { appId, events, getDbPath } = this.instance;
  //   const urlNodeContacts = 'users/' + uidUser + '/groups/' + uidGroup + '/membersinfo';
  //   console.log("initMembersInfo: ", urlNodeContacts);
  //   var ref = getDbRef(urlNodeContacts);
  //   ref.on('value', (snapshot) => {
  //     console.log("VALUE: ", snapshot.val());
  //     events.emit('callbackCheckVerifiedMembers-'+uidUser, snapshot);
  //   });
  //   this.listRefMembersInfo.push(ref);
  // }

  loadMembersInfo(uidGroup, tenant, uidUser) {
    const { events, getDbPath, getDbRef } = this.instance;
    // const urlNodeContacts = '/apps/tilechat/groups/support-group-LRmSLsFn5aI3E_5IkiQ/attributes';
    const urlNodeContacts = userGroupAttrRef(uidUser, uidGroup);
    console.log("initMembersInfo1: ", urlNodeContacts);
    const ref = getDbRef(urlNodeContacts);
    ref.on("value", (snapshot) => {
      console.log("VALUE1: ", snapshot.val());
      events.emit("callbackCheckVerifiedMembers-" + uidUser, snapshot);
    });
    this.listRefMembersInfo.push(ref);
  }
  // reference.on("child_changed", function(childSnapshot) {
  //   this.onChangedMembersInfo(childSnapshot);
  // });
  // reference.on("child_removed", function(childSnapshot) {
  //   this.onRemovedMembersInfo(childSnapshot);
  // });
  // reference.on("child_added", function(childSnapshot) {
  //   this.onAddedMembersInfo(childSnapshot);
  // })

  onDisconnectMembersInfo() {
    this.listRefMembersInfo.forEach((ref) => {
      console.log("onDisconnectMembersInfo: ", ref);
      ref.off();
    });
    this.listRefMembersInfo = [];
  }

  /** */
  onDisconnectLoadGroupDetail() {
    if (this.refLoadGroupDetail) {
      this.refLoadGroupDetail.off();
    }
  }

  // ========= end:: subscribe MembersInfo ==============//
}
