import { JSONCodec } from 'nats';
import { NatsClient } from './utils/natsClient';

class CacheManager extends NatsClient {
  constructor() {
    super();
  }

  async init(): Promise<void> {
    const js = await this.getJetStreamClient();
    this.kv = (await js.views.kv('my_kv_store')) ?? null;
  }

  public async get<T>(key: string): Promise<T | null> {
    const entry = await this.kv?.get(key);
    if (!entry) {
      return null;
    }
    return JSONCodec<T>().decode(entry.value);
  }

  public set<T>(key: string, data: T) {
    const jc = JSONCodec<T>().encode(data);
    return this.kv?.put(key, jc);
  }
}

const cacheManager = new CacheManager();

export default cacheManager;
