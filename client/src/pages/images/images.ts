import { LOCATION } from './../../shared/constants';
import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  images: Image[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.dataProvider.getAllImages(LOCATION)
      .once('value', snap => {
        snap.forEach(child => {
          this.images.push(child.val());
          return true;
        })
      })
  }

}
