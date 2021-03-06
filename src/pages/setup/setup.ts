import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { Subscription } from 'rxjs/Subscription';

import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../../providers/database/database';


/**
 * Setup page. Allows a newly registered user to choose between creating a new
 * household and joining one. Note: if the user closes the app from this page,
 * (I think) they are added to the household with ID 'nullhouseholdkey'.
 */


@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {
  checker: Subscription;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase,
              public authProv: AuthProvider) {
  }

  // display dialog box for creating household
  create() {
    this.alertCtrl.create({
      title: 'Create New Household',
      message: "Enter a unique household ID:",
      inputs: [
        {
          name: 'id',
          placeholder: 'e.g. \'302douglas\''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          handler: data => {
            if (this.validate(data.id)) {
              this.checkHouseholdId(data.id, 'create');
            }
            else {
              this.showError('The household ID must contain 5-20 letters, numbers, \'-\' and \'_\'.');
            }

          }
        }
      ]
    }).present();
  }

  // check input against regex
  validate(id: string): boolean {
    return /^[\w-]{5,20}$/.test(id);
  }

  // check whether a household ID is in use and proceed accordingly
  checkHouseholdId(key: string, action: string) {
    // initialize boolean flag
    var exists = false;

    this.checker = this.db.list(`households/${key}`).valueChanges().first().subscribe(() => {
      // ID exists
      exists = true;

      // show error if user wants to create and ID exists
      if (action=='create') {
        this.showError(`The ID \'${key}\' is already in use.`);
      }

      // proceed if user wants to join and ID exists
      if (action=='join') {
        this.authProv.updateHousehold(key);
        that.done();
      }
    });

    var that = this;  // workaround (scope issue)

    // perform this if ID has not been found after 500 milliseconds
    setTimeout(function() {
      if (!exists) {

        // unsubscribe from 'checker' observable
        that.checker.unsubscribe();

        // proceed if user wants to create and ID doesn't exist
        if (action=='create') {
          that.authProv.updateHousehold(key);
          that.done();
        }

        // show error if user wants to join and ID doesn't exist
        if (action=='join') {
          that.showError(`No household with ID \'${key}\' was found. Remember that ID's are case-sensitive.`);
        }
      }
    }, 500);  // may need to change later
  }

  // display dialog box for joining household
  join() {
    this.alertCtrl.create({
      title: 'Join Existing Household',
      message: "Enter the household ID:",
      inputs: [
        {
          name: 'id',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'OK',
          handler: data => {
            if (this.validate(data.id)) {
              this.checkHouseholdId(data.id, 'join');
            }
            else {
              this.showError('The household ID must contain 5-20 letters, numbers, underscores, and dashes.');
            }
          }
        }
      ]
    }).present();
  }

  // error message
  showError(message: string) {
    this.alertCtrl.create({
      title: 'Error',
      message: message,
      buttons: [
        {
          text: 'OK',
        }
      ]
    }).present();
  }

  // navigate to home page
  done() {
    this.navCtrl.setRoot(TabsPage);
  }
}
