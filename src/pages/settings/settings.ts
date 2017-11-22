import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, AlertController, PopoverController } from 'ionic-angular';
import { AuthProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

import { SettingsPopPage } from '../settings-pop/settings-pop';

/**
 * Settings page. Displays log-out button, current user, household name, and household key.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  members: Observable<any[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public alertCtrl: AlertController,
              public popCtrl: PopoverController,
              public modalCtrl: ModalController,
              public authProv: AuthProvider,
              public db: AngularFireDatabase) {
      this.members = this.db.list(`households/${authProv.currentUser.householdKey}/members`).valueChanges();
  }

  // 'About' page
  showAlert() {
      let alert = this.alertCtrl.create({
        title: 'About Version 3.7',
        subTitle: 'HouseHub allows users of a common living space to easily share information on household matters. With shopping lists, inventories, notes, and reminders, we aim to improve the headspace of our users by simplifying the management of domestic living.',
        message: 'Developed by Bart Martinon, Jacob Naranjo, Skyler Norgaard and Tanush Samson',
        buttons: ['Close']
      });
      alert.present();
    }

    // Log out
    logOut()
    {
      this.authProv.signOut();

      // publish event for global function in app.component.ts
      this.events.publish('user:logout');

    }

    // Log out
    pressDeleteAccount() {

      // prompt for confirmation
      this.alertCtrl.create({
        title: 'Delete account?',
        message: "Are you sure you want to delete your HouseHub account? This action cannot be undone.",
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: 'OK',
            handler: data => {
              this.confirmDeleteAccount();
            }
          }
        ]
      }).present();
    }

    displayPopover(event) {
      this.popCtrl.create(SettingsPopPage).present({ ev: event });
    }

    confirmDeleteAccount() {

      // call method in AuthProvider
      this.authProv.deleteAccount();

      // show confirmation alert
      this.alertCtrl.create({
        title: 'Success',
        message: "Your account has been deleted.",
        buttons: [
          {
            text: 'OK',
          }
        ]
      }).present();

      // navigate to login page
      this.events.publish('user:logout');
    }
}
