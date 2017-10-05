import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';

import { ShoppingItem } from '../../models/shopping-item.interface';

import { Observable } from 'rxjs/Observable';
import { AddItemComponent } from '../../components/add-item/add-item';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

/**
 * Generated class for the ShoppingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  itemsRef: AngularFireList<ShoppingItem>
  items: Observable<ShoppingItem[]>

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private db: AngularFireDatabase) {

    this.itemsRef = db.list('shopping-list');
    this.items = this.itemsRef.valueChanges();
  }

  showAddItem() {
    let modal = this.modalCtrl.create(AddItemComponent);
    modal.present();
  }

}
