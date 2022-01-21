import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { ProductInterface } from 'src/app/_models/product';
import { UserInterface } from 'src/app/_models/user';
import { ProductService } from 'src/app/_services/product/product.service';
import { UserService } from 'src/app/_services/user/user.service';

@Component({
  selector: 'app-change-product-modal',
  templateUrl: './change-product-modal.component.html',
  styleUrls: ['./change-product-modal.component.css']
})
export class ChangeProductModalComponent implements OnInit {

  @BlockUI('usersBlock') blockUIUsers: NgBlockUI;
  @BlockUI('submitBlock') blockUISubmit: NgBlockUI;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public title: string;
  public productInfo: FormGroup;
  public submitted: boolean = false;
  public users: UserInterface[] = [];
  private oldSelectedProduct: ProductInterface;
  private newSelectedProduct: ProductInterface;
  public isBiggest: boolean = false;
  private data: ProductInterface = Object.assign({}, {});


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private productService: ProductService,
  ) {
    this.oldSelectedProduct = Object.assign({}, this.productService.selectedProduct);
    this.newSelectedProduct = Object.assign({}, this.productService.selectedProduct);
  }

  ngOnInit(): void {
    this.title = 'Mover stock';
    this.productInfo = this.formBuilder.group({
      name: ['', Validators.required],
      codbarra: ['', Validators.required],
      quantity: ['', Validators.required],
      move: ['', Validators.required],
      assign: [null],
      nameassign: [null],
    });

    this.getUsers();
    this.setValuesInForm(this.productService.selectedProduct.name, this.productService.selectedProduct.codbarra,
      this.productService.selectedProduct.quantity);

  }

  setValuesInForm(name: string, codbarra: string, quantity: number) {
    this.f['name'].setValue(name);
    this.f['codbarra'].setValue(codbarra);
    this.f['quantity'].setValue(quantity);
  }

  private getUsers(): void {
    this.blockUIUsers.start("Cargando...");
    this.userService.getUserDistinct(this.productService.selectedProduct.assign).subscribe(users => {
      this.users = users;
      this.blockUIUsers.stop();
    });
  }

  get f() { return this.productInfo.controls; }

  get fValue() { return this.productInfo.value; }

  async onProductInfoSubmit() {
    this.submitted = true;

    if (this.productInfo.invalid) {
      return;
    } if (this.verifyStock(this.fValue, this.productService.selectedProduct)) {
      this.isBiggest = true;
      return;
    }
    this.setNameAssign(this.users, this.newSelectedProduct);
    this.newSelectedProduct.assign = this.fValue.assign;
    this.newSelectedProduct.quantity = this.fValue.move;

    this.blockUISubmit.start("Guardando...");
    this.productService.getProductByUid(this.newSelectedProduct).then((querySnapshot) => {
      querySnapshot.forEach(document => {
        this.data = Object.assign({}, document.data());
      })
    }).finally(() => {
      if (Object.keys(this.data).length !== 0) {// Si a la persona que se envía stock ya existe, se actualiza stock.
        console.log(this.data);
        this.newSelectedProduct.refcicle.get().then((cicleFs) => {
          let cicle: CicleInterface = cicleFs.data();
          this.newSelectedProduct.refcicle = cicle.uid;
          this.oldSelectedProduct.refcicle = cicle.uid;
        }).finally(() => {
          this.updateQuantityOldSelectedProduct(this.data, this.newSelectedProduct, false);
          this.updateQuantityOldSelectedProduct(this.oldSelectedProduct, this.newSelectedProduct, true);
          this.productService.updateProduct(this.data);
          this.productService.updateProduct(this.oldSelectedProduct);
          this.blockUISubmit.stop();
          this.passEntry.emit(true);
          this.activeModal.close(true);
        });

      } else { // Si la persona a la que se le pasa stock no existe, se crea el producto y se reduce stock al que mandó.
        this.newSelectedProduct.refcicle.get().then((cicleFs) => {
          let cicle: CicleInterface = cicleFs.data();
          this.newSelectedProduct.refcicle = cicle.uid;
          this.oldSelectedProduct.refcicle = cicle.uid;
        }).finally(() => {
          this.updateQuantityOldSelectedProduct(this.oldSelectedProduct, this.newSelectedProduct, true);
          this.productService.updateProduct(this.oldSelectedProduct);
          this.productService.addProduct(this.newSelectedProduct);
          this.blockUISubmit.stop();
          this.passEntry.emit(true);
          this.activeModal.close(true);
        });

      }

    })
  }

  updateQuantityOldSelectedProduct(oldSelectedProduct: ProductInterface, newSelectedProduct: ProductInterface, opc: boolean) {
    var quantity = oldSelectedProduct.quantity;
    if (opc) {// Se resta stock
      oldSelectedProduct.quantity = quantity - newSelectedProduct.quantity;
    } else {// Se suma stock
      oldSelectedProduct.quantity = quantity + newSelectedProduct.quantity;
    }

  }

  private setNameAssign(users: UserInterface[], selectedProduct: ProductInterface): void {
    users.forEach(user => {
      if (user.uid === this.fValue.assign) {
        selectedProduct.nameassign = user.firstname;
      }
    });
  }

  updateIsBiggest(event: any) {
    this.isBiggest = false;
  }

  private verifyStock(fValue: any, selectedProduct: ProductInterface): boolean {
    if (fValue.move > selectedProduct.quantity) {
      return true
    }
    return false
  }


}

