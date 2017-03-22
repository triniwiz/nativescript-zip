import {Observable} from 'data/observable';

export class HelloWorldModel extends Observable {
  public message: string = 'Demo';
  public progress: number = 0;
  constructor() {
    super();
  }
}