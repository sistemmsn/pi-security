import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ActionProvider } from '../../providers/action/action';
import { LOCATION } from '../../shared/constants';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private actionProvider: ActionProvider,
    private toast: ToastController) {

  }

  takeImage() {
    this.actionProvider.takeImage(LOCATION)
      .then(() => {
        this.toastMessage("Please wait while the pi captures image.")
      });
  }

  getSurveillance() {
    this.actionProvider.getLogSetting(LOCATION)
      .then(value => {
        console.log(value);
        return value;
      });
  }

  toggleSurveillance() {
    this.actionProvider.getLogSetting(LOCATION)
      .then(value => {
        console.log(value);
        this.actionProvider.setLogSetting(LOCATION, !value)
          .then(() => {
            let message = value ? "Disabled" : "Enabled";
            message += "  surveillance on PI";
            this.toastMessage(message);
            
          });
      })
  }

  toastMessage(message: string) {
    return this.toast.create({
      message: message,
      duration: 2000
    }).present();
  }
}
