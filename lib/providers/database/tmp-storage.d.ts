export declare class TmpStorage implements Storage {
    private map;
    get length(): number;
    clear(): void;
    getItem(key: string): string;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
}
