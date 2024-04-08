export interface CacheData {
  key: string;
  value: any;
}

export interface CacheProvider {
  get(key: string): Promise<any>;
  set(data: CacheData, expiry?: number): Promise<void>;
  del(key: string): Promise<void>;
}
