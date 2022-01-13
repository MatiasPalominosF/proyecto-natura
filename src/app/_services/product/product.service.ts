import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductInterface } from 'src/app/_models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollection: AngularFirestoreCollection<ProductInterface>;
  private productDoc: AngularFirestoreDocument<ProductInterface>;
  private product: Observable<ProductInterface[]>;

  constructor(
    public afs: AngularFirestore
  ) {
    this.productCollection = afs.collection<ProductInterface>('product');
    this.product = this.productCollection.valueChanges();
  }

  getFullInfoProduct(): Observable<ProductInterface[]> {
    // Colocar después de 'product' para consulta con where --> , ref => ref.where('assign', '==', null)
    return this.product = this.afs.collection<ProductInterface>('product')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as ProductInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  addProduct(product: ProductInterface) {
    var tempId = this.afs.createId();
    product.uid = tempId;

    this.afs.collection('product').doc(tempId).set(product);
  }



}
