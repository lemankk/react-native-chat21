export class TmpStorage {
    constructor() {
        this.map = new Map();
    }
    get length() {
        return this.map.size;
    }
    clear() {
        this.map.clear();
        throw new Error("Method not implemented.");
    }
    getItem(key) {
        return this.map.get(key);
    }
    key(index) {
        const keys = this.map.keys();
        let _index = 0;
        while (_index < this.map.size) {
            const result = keys.next();
            if (index === _index) {
                return result.value;
            }
            _index++;
        }
        throw new Error("Method not implemented.");
    }
    removeItem(key) {
        this.map.delete(key);
    }
    setItem(key, value) {
        this.map.set(key, value);
    }
}
//# sourceMappingURL=tmp-storage.js.map