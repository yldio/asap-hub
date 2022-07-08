export interface CacheClient<T> {
  set(key: string, element: T): void;
  get(key: string): T | null;
  purge(): void;
}

export class MemoryCacheClient<T> implements CacheClient<T> {
  private elements = new Map<string, T>();

  set(key: string, element: T): void {
    this.elements.set(key, element);
  }
  get(key: string): T | null {
    return this.elements.get(key) || null;
  }

  purge(): void {
    this.elements.clear();
  }
}
