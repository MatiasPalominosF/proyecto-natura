import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCartInterface } from 'src/app/_models/productCart';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private saleCollection: AngularFirestoreCollection<ProductCartInterface>;
  private saleDoc: AngularFirestoreDocument<ProductCartInterface>;
  private sales: Observable<ProductCartInterface[]>;
  public selectedSale: ProductCartInterface = {};
  constructor(
    public afs: AngularFirestore,
  ) {
    this.saleCollection = afs.collection<ProductCartInterface>('sales');
    this.sales = this.saleCollection.valueChanges();
  }

  async addProduct(sale: ProductCartInterface) {
    var tempId = this.afs.createId();
    sale.suid = tempId;

    return await this.afs.collection<ProductCartInterface>('sales').doc(tempId).set(sale);
  }

  getAllSales() {
    return this.afs.firestore.collection('sales').get();
  }

  getSalesByCicle(cuid: string) {
    return this.afs.firestore.collection('sales').where('cuid', '==', `${cuid}`).get();
  }

}
