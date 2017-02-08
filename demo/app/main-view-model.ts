import {Observable} from 'data/observable';
import {Zip} from 'nativescript-zip';

export class HelloWorldModel extends Observable {
  public message: string;
  constructor() {
    super();
  }
}