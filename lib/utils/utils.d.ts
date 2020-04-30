/**
 * chiamata da ChatConversationsHandler
 * restituisce url '/conversations'
 * @param tenant
 */
export declare function conversationsPathForUserId(userId: string): string;
/**
 * chiamata da ChatConversationHandler
 * restituisce url '/messages'
 */
export declare function conversationMessagesRef(userId: string): string;
/**
 * chiamata da ChatContactsSynchronizer
 * restituisce url '/contacts'
 */
export declare function contactsRef(): string;
export declare function contactsUserRef(userId: string): string;
export declare function userGroupAttrRef(userId: string, groupId: string): string;
export declare function supportApiPath(groupId: any): string;
export declare function lastOnlineDbRef(userId: string): string;
/**
 * chiamata da ChatConversationsHandler
 * restituisce url '/conversations'
 * @param tenant
 */
export declare function nodeTypingsPath(conversationWith: string): string;
/**
 * restituiso indice item nell'array con uid == key
 * @param items
 * @param key
 */
export declare function searchIndexInArrayForUid(items: any, key: any): any;
/**
 * trasforma url contenuti nel testo passato in tag <a>
 */
export declare function urlify(text?: any, name?: any): any;
/**
 * rimuove il tag html dal testo
 * ATTUALMENTE NON USATA
 */
export declare function removeHtmlTags(text: any): any;
/**
 * calcolo il tempo trascorso tra due date
 * e lo formatto come segue:
 * gg/mm/aaaa;
 * oggi;
 * ieri;
 * giorno della settimana (lunedì, martedì, ecc)
 */
export declare function setHeaderDate_old(translate: any, timestamp: any, lastDate?: any): string;
export declare function setHeaderDate(translate: any, timestamp: any, lastDate?: any): string;
/**
 * calcolo il tempo trascorso tra la data passata e adesso
 * utilizzata per calcolare data ultimo accesso utente
 * @param timestamp
 */
export declare function setLastDate(translate: any, timestamp: any): string;
export declare function convertDayToString(translate: any, day: any): any;
export declare function compareValues(key: any, order?: string): (a: any, b: any) => number;
/** */
export declare function getNowTimestamp(): number;
export declare function getFormatData(timestamp: any): string;
export declare function getFromNow(timestamp: any): string;
export declare function getSizeImg(message: any, MAX_WIDTH_IMAGES: any): any;
export declare function popupUrl(html: any, title: any): void;
export declare function isPopupUrl(url: any): boolean;
export declare function strip_tags(html: any): any;
export declare function htmlEntities(str: any): string;
export declare function isExistInArray(members: any, currentUid: any): any;
export declare function isInArray(key: string, array: Array<string>): boolean;
export declare function createConfirm(translate: any, alertCtrl: any, events: any, title: any, message: any, action: any, onlyOkButton: any): any;
export declare function createLoading(loadinController: any, message: any): any;
export declare function convertMessageAndUrlify(messageText: any): any;
export declare function convertMessage(messageText: any): any;
export declare function replaceBr(text: any): any;
export declare function getColorBck(str: any): string;
export declare function avatarPlaceholder(conversation_with_fullname: any): string;
export declare function jsonToArray(json: any): any[];
export declare function validateEmail(email: any): boolean;
export declare function searchEmailOrUrlInString(item: string): any;
export declare function isURL(str: string): boolean;
export declare function getParameterByName(name: string): string;
