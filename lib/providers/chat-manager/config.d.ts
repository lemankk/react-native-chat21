import { ReactNativeFirebase } from "@react-native-firebase/app";
import { ChatManagerStorageFactory } from "./storage-factory";
import { ChatManagerHttpRequestor } from "./http-requestor";
export interface ChatManagerConfig {
    app: ReactNativeFirebase.FirebaseApp;
    apiUrl: string;
    imageBaseUrl: string;
    tenant?: string;
    httpRequestor?: ChatManagerHttpRequestor;
    storageFactory?: ChatManagerStorageFactory;
}
