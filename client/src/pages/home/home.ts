import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ActionProvider } from '../../providers/action/action';
import { LOCATION } from '../../shared/constants';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isSurveilling: boolean;
  surveillanceState: string;
  lastImage: string;
  lastTime: Date;
  lastImageData: any;

  constructor(public navCtrl: NavController, private actionProvider: ActionProvider,
    private toast: ToastController, private dataProvider: DataProvider) {
    this.actionProvider.getLogSetting(LOCATION)
      .on('value', snap => {
        this.isSurveilling = snap.val();
        this.surveillanceState = snap.val() ? "Disable" : "Enable";
      });
    this.dataProvider.lastImage(LOCATION)
      .on('child_added', snap => {
        this.lastImage = snap.val().imageUrl;
        this.lastTime = snap.val().timestamp;
      })
    this.dataProvider.lastImageTags(LOCATION)
      .on('child_added', snap => {
        this.lastImageData = snap.val();
      })
  }

  takeImage() {
    this.actionProvider.takeImage(LOCATION)
      .then(() => {
        this.toastMessage("Please wait while the pi captures image.")
      });
  }

  toggleSurveillance(event) {
    console.log(event);
    this.actionProvider.setLogSetting(LOCATION, event.value)
      .then(() => {
        let message = event.value ? "Disabled" : "Enabled";
        message += "  surveillance on PI";
        this.toastMessage(message);

      });
  }

  toastMessage(message: string) {
    return this.toast.create({
      message: message,
      duration: 2000
    }).present();
  }
}
