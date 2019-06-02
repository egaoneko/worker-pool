export default class WorkerSource {
  public async run(params: any, callback: Function): Promise<any> {
    console.log(params);
    return Promise.resolve();
  }
}