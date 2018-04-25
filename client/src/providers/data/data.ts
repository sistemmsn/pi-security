import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Reference, Query } from '@firebase/database-types';

@Injectable()
export class DataProvider {
  ref: Reference;

  constructor(public http: HttpClient, public db: AngularFireDatabase) {
    this.ref = this.db.database.ref();
  }

  lastImage(location: string): Query {
    return this.ref.child(`imageLogs/${location}`)
      .orderByKey()
      .limitToLast(1);
  }

  lastImageTags(location: string): Query {
    return this.ref.child(`dataLogs/${location}`)
      .orderByKey()
      .limitToLast(1);
  }

  getAllImages(location: string) {
    return this.ref.child(`imageLogs/${location}`)
      .orderByKey();
  }

}
