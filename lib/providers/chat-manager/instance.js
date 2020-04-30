import axios from "axios";
import { EventEmitter } from "react-native";
export class ChatManagerInstance {
    constructor(_config, _onRequestOffline, _onRequestOnline) {
        this._config = _config;
        this._onRequestOffline = _onRequestOffline;
        this._onRequestOnline = _onRequestOnline;
        this._events = new EventEmitter();
    }
    get config() {
        return this._config;
    }
    get events() {
        return this._events;
    }
    get tenant() {
        return this.config.tenant || "default";
    }
    get appId() {
        return this.tenant;
    }
    set appId(val) {
        this.config.tenant = val;
    }
    get auth() {
        return this.config.app.auth();
    }
    get database() {
        return this.config.app.database();
    }
    get messaging() {
        return this.config.app.messaging();
    }
    getDbPath(path = "") {
        return "/app/" + this.appId + "/" + path;
    }
    getDbRef(path = "") {
        return this.database.ref(this.getDbPath(path));
    }
    getAppApiUrl(path = "") {
        return this.config.apiUrl + "/api/" + this.appId + "/" + path;
    }
    getImageUrlThumb(uid) {
        const imageurl = this.config.imageBaseUrl +
            "/o/profiles%2F" +
            uid +
            "%2Fthumb_photo.jpg?alt=media";
        return imageurl;
    }
    goOnline(user) {
        if (this._onRequestOnline) {
            this._onRequestOnline(user);
        }
    }
    goOffline() {
        if (this._onRequestOffline) {
            this._onRequestOffline();
        }
    }
    httpRequest(method, path, options = {}) {
        const baseURL = this.getAppApiUrl(path);
        return this.config.httpRequestor
            ? this.config.httpRequestor.request(method, baseURL, options)
            : axios(Object.assign({ method,
                baseURL }, options));
    }
}
//# sourceMappingURL=instance.js.map