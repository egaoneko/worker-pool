import WorkerSource from './WorkerSource';

export default class WorkerService {
  private workerSources: { [key: string]: WorkerSource} = {};
  
  public getWorkerSource(id: string, klass: string) {

    if (!this.workerSources[id]) {
      this.workerSources[id] = this.getWorkerSourceClass(klass);
    }

    return this.workerSources[id];
  }

  private getWorkerSourceClass(klass: string): any {
    switch(klass) {
      case 'WorkerSource':
        return new WorkerSource();
    }
    return null;
  }
}