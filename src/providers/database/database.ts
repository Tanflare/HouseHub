import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user.interface';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';

/*
  source: https://angularfirebase.com/snippets/angularfire2-version-4-authentication-service/
*/

@Injectable()
export class DatabaseProvider {

  authState: any = null;
  currentUser = {} as User;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              public events: Events) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      this.updateUserObject();
    });

  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  private updateUserObject(): void {
    if (this.authenticated) {
      this.db.object(`users/${this.currentUserId}`).valueChanges().subscribe(data => {
        this.currentUser.name = data['name'];
        this.currentUser.username = data['username'];
        this.currentUser.email = data['email'];
        this.currentUser.householdKey = data['householdKey'];
        this.currentUser.privateKey = data['privateKey'];
        this.events.publish('user:update');
        console.log('user:update1');
      });
    }
    else {
      this.currentUser = {} as User;
    }
  }

  /* don't know if i need this
  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserObservable(): any {
    return this.afAuth.authState
    }
  */

  // get currentUserObject(): User {
  //   return this.authenticated ? this.user : null;
  // }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  emailSignUp(email:string, password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch(error => console.log(error));
  }

  emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         //this.updateUserObject();
       })
       .catch(error => console.log(error));
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.updateUserObject();
  }
}