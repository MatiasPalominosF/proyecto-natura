import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/_models/user';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<UserInterface>;
  private users: Observable<UserInterface[]>;
  private userDoc: AngularFirestoreDocument<UserInterface>;
  private user: Observable<UserInterface>;

  constructor(
    private firestore: AngularFirestore
  ) {
    this.usersCollection = firestore.collection<UserInterface>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges(); // use only for login.
  }

  createUser(user) {
    return firebase.firestore().collection("users").doc(user.uid).set(user);
  }
}
