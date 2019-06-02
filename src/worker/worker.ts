import 'whatwg-fetch';
import Actor from './Actor';
import WorkerService from './WorkerService';

if (typeof self !== 'undefined') {
  // tslint:disable-next-line:no-unused-expression
  new Actor(self, new WorkerService());
}