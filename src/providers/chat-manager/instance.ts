import axios, { Method, AxiosRequestConfig } from "axios";
import { EventEmitter } from "react-native";
import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { ChatManagerConfig } from "./config";
import { IUser } from "../../models";

export type RequestOfflineCallback = () => void;
export type RequestOnlineCallback = (userId: IUser) => void;

export class ChatManagerInstance {
  private _events: EventEmitter;

  constructor(
    private _config: ChatManagerConfig,
    private _onRequestOffline: RequestOfflineCallback,
    private _onRequestOnline: RequestOnlineCallback,
  ) {
    this._events = new EventEmitter();
  }

  public get config(): ChatManagerConfig {
    return this._config;
  }
  public get events(): EventEmitter {
    return this._events;
  }

  public get tenant(): string {
    return this.config.tenant || "default";
  }

  public get appId(): string {
    return this.tenant;
  }

  public set appId(val: string) {
    this.config.tenant = val;
  }

  public get auth(): FirebaseAuthTypes.Module {
    return this.config.app.auth();
  }

  public get database(): FirebaseDatabaseTypes.Module {
    return this.config.app.database();
  }

  public get messaging(): FirebaseMessagingTypes.Module {
    return this.config.app.messaging();
  }

  public getDbPath(path: string = ""): string {
    return "/app/" + this.appId + "/" + path;
  }

  public getDbRef(path: string = ""): FirebaseDatabaseTypes.Reference {
    return this.database.ref(this.getDbPath(path));
  }

  public getAppApiUrl(path: string = ""): string {
    return this.config.apiUrl + "/api/" + this.appId + "/" + path;
  }

  public getImageUrlThumb(uid: string) {
    const imageurl =
      this.config.imageBaseUrl +
      "/o/profiles%2F" +
      uid +
      "%2Fthumb_photo.jpg?alt=media";
    return imageurl;
  }
  public goOnline(user: IUser) {
    if (this._onRequestOnline) {
      this._onRequestOnline(user);
    }
  }

  public goOffline() {
    if (this._onRequestOffline) {
      this._onRequestOffline();
    }
  }

  public httpRequest(
    method: Method,
    path: string,
    options: any = {},
  ): Promise<any> {
    const baseURL = this.getAppApiUrl(path);
    return this.config.httpRequestor
      ? this.config.httpRequestor.request(method, baseURL, options)
      : axios({
          method,
          baseURL,
          ...options,
        });
  }
}
