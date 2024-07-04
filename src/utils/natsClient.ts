import { JetStreamManager, KV, NatsConnection, connect } from 'nats';

export class NatsClient {
  client: NatsConnection | null = null;
  jsm: JetStreamManager | null = null;
  kv: KV | null = null;

  constructor() {}

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = await connect({
        servers: ['nats://localhost:4222'],
      });
    }
  }

  async init(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.drain();
      await this.client.close();
    }
  }
}

const natsClient = new NatsClient();

export default natsClient;
