export interface ChatManagerStorageFactory {
    getStorage(name: string): Storage;
}
