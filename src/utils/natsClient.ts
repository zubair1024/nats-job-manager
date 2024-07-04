import { JetStreamClient, JetStreamManager, KV, NatsConnection, connect } from 'nats';

export class NatsClient {
  client: NatsConnection | null = null;
  jsm: JetStreamManager | null = null;
  public js: JetStreamClient | null = null;
  kv: KV | null = null;

  constructor() {}

  private async connect(): Promise<NatsConnection> {
    if (!this.client) {
      this.client = await connect({
        servers: ['nats://localhost:4222', 'nats://localhost:4223', 'nats://localhost:4224'],
        user: 'user',
        pass: 'password',
      });
    }
    return this.client;
  }

  private async createJetStream() {
    const conn = await this.getConnection();
    this.jsm = await conn.jetstreamManager();
    this.js = conn.jetstream();
    return { jsm: this.jsm, js: this.js };
  }

  async getConnection(): Promise<NatsConnection> {
    if (this.client) return this.client;
    else return await this.connect();
  }

  async getJetStreamClient() {
    if (this.js) return this.js;
    const { js } = await this.createJetStream();
    return js;
  }

  async getJetStreamManager() {
    if (this.jsm) return this.jsm;
    const { jsm } = await this.createJetStream();
    return jsm;
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
