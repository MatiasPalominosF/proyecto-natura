import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/_models/user';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<UserInterface>;
  private users: Observable<UserInterface[]>;
  private userDoc: AngularFirestoreDocument<UserInterface>;
  private user: Observable<UserInterface>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.usersCollection = afs.collection<UserInterface>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getOneUser(userId: string) {
    this.userDoc = this.afs.doc<UserInterface>(`users/${userId}`);
    return this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as UserInterface;
        data.uid = action.payload.id;
        return data;
      }
    }));
  }

  getAllUsers(): Observable<UserInterface[]> {
    return this.users = this.usersCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as UserInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  getUserDistinct(uid: string) {
    return this.users = this.afs.collection<UserInterface>('users', ref => ref.where('uid', '!=', uid))
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as UserInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  /**
   * Update field in all documents firestore.
   */
  async test(): Promise<void> {
    let date: Date = new Date(2022, 3, 12, 0, 0, 0, 0);
    const querySnapshot = await firebase.firestore().collection("product").get();
    querySnapshot.forEach(function (doc) {
      doc.ref.update({
        dateadded: date
      });
    });
  }

  getUsers() {
    return this.afs.collection('users').snapshotChanges(); // use only for login.
  }

  createUser(user) {
    return firebase.firestore().collection("users").doc(user.uid).set(user);
  }
}
