import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductInterface } from 'src/app/_models/product';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollection: AngularFirestoreCollection<ProductInterface>;
  private productDoc: AngularFirestoreDocument<ProductInterface>;
  private products: Observable<ProductInterface[]>;
  public selectedProduct: ProductInterface = {};

  constructor(
    public afs: AngularFirestore
  ) {
    this.productCollection = afs.collection<ProductInterface>('product');
    this.products = this.productCollection.valueChanges();
  }

  getFullInfoProduct2(): Observable<ProductInterface[]> {
    // Colocar después de 'product' para consulta con where --> , ref => ref.where('assign', '==', null)
    return this.products = this.afs.collection<ProductInterface>('product')
      .snapshotChanges()
      .pipe(take(1), map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as ProductInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  getFullInfoProduct(): Observable<ProductInterface[]> {
    // Colocar después de 'product' para consulta con where --> , ref => ref.where('assign', '==', null)
    return this.products = this.afs.collection<ProductInterface>('product')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as ProductInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  getProductsWithFilterDate(userId: string, fromDate: any, toDate: any): Observable<ProductInterface[]> {
    return this.products = this.afs.collection<ProductInterface>('product', ref => ref
      .where('assign', '==', `${userId}`)
      .where('dateadded', '>=', fromDate)
      .where('dateadded', '<=', toDate)
    )
      .snapshotChanges()
      .pipe(take(1), map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as ProductInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  getProductsByAssign(userId: string) {
    return this.products = this.afs.collection<ProductInterface>('product', ref => ref
      .where('assign', '==', `${userId}`)
      .where('quantity', '>', 0)
    )
      .snapshotChanges()
      .pipe(take(1), map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as ProductInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  getFullInfoProductNotObservable() {
    return this.afs.firestore.collection('product').get();
  }

  getFullInfoProductNotObservableWithFilter() {
    return this.afs.firestore.collection('product').where('quantity', '>', 0).get();
  }

  getProductByCicle(cuid: string) {
    return this.afs.firestore.collection('product').where('cuid', '==', `${cuid}`).get();
  }

  getProductByUid(product: ProductInterface) {
    return this.afs.firestore.collection('product').where('nameassign', '==', product.nameassign).where('assign', '==', product.assign)
      .where('codbarra', '==', product.codbarra).where('total', '==', product.total).where('net', '==', product.net).where('margin', '==', product.margin).get();
  }

  addProduct(product: ProductInterface): Promise<void> {
    var tempId = this.afs.createId();
    var refcicle = product.refcicle;
    product.cuid = refcicle;
    product.uid = tempId;
    product.refcicle = this.afs.firestore.doc('/cicles/' + refcicle);

    return this.afs.collection<ProductInterface>('product').doc(tempId).set(product);
  }

  updateFieldProduct(puid: string, quantity: number) {
    this.productDoc = this.afs.collection('product').doc(`${puid}`);
    this.productDoc.update({ quantity: quantity });
  }

  updateProduct(product: ProductInterface): Promise<void> {
    var refcicle = product.refcicle;
    product.refcicle = this.afs.firestore.doc('/cicles/' + refcicle);
    this.productDoc = this.afs.collection<ProductInterface>('product').doc(`${product.uid}`);
    return this.productDoc.update(product);
  }

  deleteProduct(product: ProductInterface): Promise<void> {
    this.productDoc = this.afs.collection<ProductInterface>('product').doc(`${product.uid}`);
    return this.productDoc.delete();
  }

  async delete2(product: ProductInterface): Promise<void> {
    return await this.afs.firestore.collection('product').doc(`${product.uid}`).delete();
  }

  /**
  * Update field in all documents firestore.
  */
  async updateAllFields(): Promise<void> {
    let date: Date = new Date(2022, 1, 12, 0, 0, 0, 0);
    const querySnapshot = await firebase.firestore().collection("product").get();
    querySnapshot.forEach(function (doc) {
      doc.ref.update({
        dateadded: date
      });
    });
  }
}
