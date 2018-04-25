import { LOCATION } from './../../shared/constants';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

interface Image {
  imageUrl: string,
  timestamp: string
}

@IonicPage()
@Component({
  selector: 'page-images',
  templateUrl: 'images.html',
})
export class ImagesPage {
  images: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.dataProvider.getAllImages(LOCATION)
      .subscribe(result => {
        var array = [];
        for (var key in result) {
          var data = result[key];
          if (!data['error']) {
            array.push(result[key]);
          }
        }
        this.images = array.reverse();
      });
  }

}
