import { LOCATION } from './../../shared/constants';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html',
})
export class LogsPage {
  logs: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.dataProvider.getAllLogs(LOCATION)
      .subscribe(result => {
        var array = [];
        for (var key in result) {
          var data = result[key];
          if (!data['error']) {
            array.push(result[key]);
          }
        }
        this.logs = array.reverse();
      });
  }
}