import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { ProductCartInterface } from 'src/app/_models/productCart';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private saleCollection: AngularFirestoreCollection<ProductCartInterface>;
  private saleDoc: AngularFirestoreDocument<ProductCartInterface>;
  private sale: Observable<ProductCartInterface[]>;
  public selectedSale: ProductCartInterface = {};
  constructor(
    public afs: AngularFirestore,
  ) {
    this.saleCollection = afs.collection<ProductCartInterface>('sales');
    this.sale = this.saleCollection.valueChanges();
  }

  addProduct(sale: ProductCartInterface) {
    var tempId = this.afs.createId();
    sale.suid = tempId;

    this.afs.collection<ProductCartInterface>('sales').doc(tempId).set(sale);
  }
}
