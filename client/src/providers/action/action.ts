import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Reference } from '@firebase/database-types';

@Injectable()
export class ActionProvider {
  ref: Reference;

  constructor(public http: HttpClient, public db: AngularFireDatabase) {
    this.ref = this.db.database.ref();
  }

  takeImage(location: string) {
    let child = this.ref.child(`controls/${location}/takeImage`);
    return child.set(true)
      .then(() => {
        return child.set(false);
      })
  }

  getLogSetting(location: string) {
    return this.ref.child(`settings/${location}/isLogging`)
      .once('value', snap => {
        return snap.val();
      });
  }

  setLogSetting(location: string, value: boolean) {
    return this.ref.child(`settings/${location}/isLogging`).set(value);
  }
}
