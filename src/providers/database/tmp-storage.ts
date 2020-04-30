export class TmpStorage implements Storage {
  private map: Map<string, string> = new Map();

  public get length(): number {
    return this.map.size;
  }
  public clear(): void {
    this.map.clear();
    throw new Error("Method not implemented.");
  }
  public getItem(key: string): string {
    return this.map.get(key);
  }
  public key(index: number): string {
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
  public removeItem(key: string): void {
    this.map.delete(key);
  }
  public setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}
