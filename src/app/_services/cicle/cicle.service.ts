import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CicleInterface } from 'src/app/_models/cicle';

@Injectable({
  providedIn: 'root'
})
export class CicleService {

  private cicleCollection: AngularFirestoreCollection<CicleInterface>;
  private cicleDoc: AngularFirestoreDocument<CicleInterface>;
  private cicle: Observable<CicleInterface[]>;
  public selectedCicle: CicleInterface = {};

  constructor(
    public afs: AngularFirestore
  ) {
    this.cicleCollection = afs.collection<CicleInterface>('cicles');
    this.cicle = this.cicleCollection.valueChanges();
  }

  getFullInfoCicle(): Observable<CicleInterface[]> {
    return this.cicle = this.afs.collection<CicleInterface>('cicles')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as CicleInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  addCicle(cicle: CicleInterface) {
    var tempId = this.afs.createId();
    cicle.uid = tempId;

    this.afs.collection<CicleInterface>('cicles').doc(tempId).set(cicle);
  }

  updateCicle(cicle: CicleInterface) {
    console.log(cicle);
    this.cicleDoc = this.afs.collection<CicleInterface>('cicles').doc(`${cicle.uid}`);
    this.cicleDoc.update(cicle);
  }
}
