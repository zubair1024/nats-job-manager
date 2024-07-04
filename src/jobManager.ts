import { AckPolicy, JSONCodec, JsMsg, NatsError } from 'nats';
import { NatsClient } from './utils/natsClient';

class JobManager extends NatsClient {
  constructor() {
    super();
  }

  async createJobStream(streamName: string, subj: string[]) {
    const jsm = await this.getJetStreamManager();
    await jsm.streams.add({
      name: streamName,
      subjects: subj,
      //   retention: RetentionPolicy.Workqueue,
    });
  }

  async forkExclusiveConsumer<T>(
    queueName: string,
    callback: (msg: T) => Promise<void>,
    opts?: {
      ackPolicy?: AckPolicy;
    },
  ): Promise<void> {
    const jsm = await this.getJetStreamManager();
    try {
      const info = await jsm?.consumers.info('JOBS', queueName);
      console.log('Consumer already exists:', info);
    } catch (err) {
      if (err instanceof NatsError && err.code === '404') {
        console.log('Consumer does not exist, creating...');
      } else {
        console.error('Error checking consumer info:', err);
        return;
      }
    }

    try {
      await jsm.consumers.add(queueName, {
        durable_name: queueName,
        ack_policy: opts?.ackPolicy ?? AckPolicy.Explicit,
      });
    } catch (err) {
      if (err instanceof NatsError && err.code === '404') {
        console.log('Stream does not exist, creating...');
        await this.createJobStream(queueName, [queueName]);
        return this.forkExclusiveConsumer(queueName, callback, opts);
      } else {
        throw err;
      }
    }

    const js = await this.getJetStreamClient();

    const consumer = await js.consumers.get(queueName, queueName);
    void consumer.consume({
      callback: async (m: JsMsg) => {
        try {
          //   const msg = JSONCodec<T>().decode(m.data);
          //   await callback(msg);
        } catch (err) {
          console.error('Error processing message:', err);
        }
        console.log(`Consumed message ${m.seq}`);
        // ack the message either way to prevent redelivery
        // m.ack();
        await this.jsm?.streams.deleteMessage(queueName, m.seq);
      },
    });

    console.log(`Subscribed to ${queueName}`);
  }
}

const jobManager = new JobManager();

export default jobManager;
