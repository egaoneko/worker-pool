import { uid } from './shared/utils';
import { serialize } from './shared/transfer';

export default class WorkerPool {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(workerPool.workerUrl);
    this.worker.addEventListener('message', (e: any) => this.receive(e), false);
    this.send('WorkerSource:run', uid(), { msg : 'Hello, world!'})
  }

  private send(type: string, id: string, data?: any): void {
    this.worker.postMessage({
      type,
      id,
      data: serialize(data),
    });
  }

  private receive(message: any): void {
    console.log(message.data);
  }
}