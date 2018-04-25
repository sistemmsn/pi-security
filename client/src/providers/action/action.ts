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
    return this.ref.child(`settings/${location}/takeImage`).set(true);
  }

  getLogSetting(location: string): Reference {
    return this.ref.child(`settings/${location}/isLogging`);
  }

  setLogSetting(location: string, value: boolean) {
    return this.ref.child(`settings/${location}/isLogging`).set(value);
  }

  getDarkHoursSetting(location: string): Reference {
    return this.ref.child(`settings/${location}/isDarkHours`);
  }

  setDarkHoursSetting(location: string, value: boolean) {
    return this.ref.child(`settings/${location}/isDarkHours`).set(value);
  }
}
