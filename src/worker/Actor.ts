import { deserialize, serialize } from '../shared/transfer';

export default class Actor {
  private target: any;
  private parent: any;
  
  constructor(target: any, parent: any) {
    this.target = target;
    this.parent = parent;
    this.target.addEventListener('message', this.receive.bind(this), false);
  }

  private send(id: string, type: string, data: any, callback?: Function): void {
    const buffers: any = [];
    this.target.postMessage({
      type,
      id: String(id),
      data: serialize(data, buffers)
    }, buffers);
  }

  private receive(message: Object): void {
    const rawData: any = message['data'];
    const { id, type } : {id: string, type: string} = rawData;
    const done: Function = (error: any, data: any) => {
      this.send(id, '<response>', {error, data,});
    }
    
    if (type === 'undefined' || id === 'undefined') {
      return;
    }

    const [klass, func] = type.split(':');
    this.parent.getWorkerSource(id, klass)[func](deserialize(rawData.data), done);
  }
}