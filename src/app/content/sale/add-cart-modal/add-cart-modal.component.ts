import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { ProductCartInterface } from 'src/app/_models/productCart';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-add-cart-modal',
  templateUrl: './add-cart-modal.component.html',
  styleUrls: ['./add-cart-modal.component.css']
})
export class AddCartModalComponent implements OnInit {

  @BlockUI('modalCart') blockUIModalCart: NgBlockUI;
  @Output() passEntry: EventEmitter<ProductCartInterface> = new EventEmitter();

  public title: string;
  public productInfo: FormGroup;
  public submitted: Boolean = false;
  private productCart: ProductCartInterface;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.title = 'Agregar al carrito';
    this.productInfo = this.formBuilder.group({
      name: ['', Validators.required],
      total: [0, Validators.required],
      quantity: ['', Validators.required],
    });

    this.setData(this.productService.selectedProduct.name, this.productService.selectedProduct.total);
  }
  setData(name: string, total: number) {
    this.f['name'].setValue(name);
    this.f['total'].setValue(total);
  }

  get f() { return this.productInfo.controls; }

  get fValue() { return this.productInfo.value; }

  onCicleInfoSubmit() {
    this.submitted = true;
    if (this.productInfo.invalid) {
      return;
    }
    this.productCart = {};

    this.blockUIModalCart.start("Agregando...")
    this.productService.selectedProduct.refcicle.get().then((cicleFs) => {
      let cicle: CicleInterface = cicleFs.data();
      this.productCart.cuid = cicle.uid;
    }).finally(() => {
      let datesold = new Date();
      this.productCart.datesold = datesold;
      this.productCart.puid = this.productService.selectedProduct.uid;
      this.productCart.name = this.productService.selectedProduct.name;
      this.productCart.quantitycart = this.fValue.quantity;
      this.productCart.unitprice = this.productService.selectedProduct.total;
      this.productCart.totalcart = this.fValue.quantity * this.productService.selectedProduct.total;
      this.productCart.grosstotalcart = this.fValue.quantity * this.productService.selectedProduct.gross;
      this.blockUIModalCart.stop();
      this.passEntry.emit(this.productCart);
      this.activeModal.close(true);
    });
  }
}
