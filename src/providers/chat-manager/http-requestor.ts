export interface ChatManagerHttpRequestor {
    request: (method: string, url: string, options: any) => Promise<any>;
}
