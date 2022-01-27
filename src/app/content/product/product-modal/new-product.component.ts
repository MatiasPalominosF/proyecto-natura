import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyCnameRecord } from 'dns';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { ProductInterface } from 'src/app/_models/product';
import { CicleService } from 'src/app/_services/cicle/cicle.service';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class ProductModalComponent implements OnInit {

  @Input() public opc: boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @BlockUI('cicles') blockUICicle: NgBlockUI;
  @BlockUI('submit') blockUISubmit: NgBlockUI;

  private selectedCicle: CicleInterface = {};
  public productInfo: FormGroup;
  public submitted: boolean = false;
  public selection = {};
  private currentUser: any;
  private product: ProductInterface = {};
  public ciclesArray: CicleInterface[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private cicleService: CicleService,
  ) { }

  ngOnInit(): void {

    this.getUserLogged();
    this.productInfo = this.formBuilder.group({
      name: ['', Validators.required],
      assign: [null],
      codbarra: ['', Validators.required],
      refcicle: [null, Validators.required],
      gross: ['', Validators.required],
      margin: ['', Validators.required],
      nameassign: [null],
      net: ['', Validators.required],
      quantity: [, Validators.required],
      quantitymin: ['', Validators.required],
      total: ['', Validators.required],
      vat: ['', Validators.required],
      isSale: [true, Validators.required],
    });

    this.getCicles();

    if (!this.opc) {
      //Setear valores al formulario
      this.setValuesInForm(this.productService.selectedProduct.name, this.productService.selectedProduct.assign,
        this.productService.selectedProduct.codbarra, this.productService.selectedProduct.refcicle, this.productService.selectedProduct.gross, this.productService.selectedProduct.margin,
        this.productService.selectedProduct.nameassign, this.productService.selectedProduct.net, this.productService.selectedProduct.quantity,
        this.productService.selectedProduct.quantitymin, this.productService.selectedProduct.total, this.productService.selectedProduct.vat,
        this.productService.selectedProduct.isSale);
    }
  }

  setValuesInForm(name: string, assign: string, codbarra: string, selectCicle: any, gross: number, margin: number, nameassign: string, net: number, quantity: number, quantitymin: number, total: number, vat: number, isSale: boolean) {
    this.f['name'].setValue(name);
    this.f['assign'].setValue(assign);
    this.f['codbarra'].setValue(codbarra);
    this.getCicleToForm(this.f['refcicle'], selectCicle);
    this.f['gross'].setValue(gross);
    this.f['margin'].setValue(margin * 100);
    this.f['nameassign'].setValue(nameassign);
    this.f['net'].setValue(net);
    this.f['quantity'].setValue(quantity);
    this.f['quantitymin'].setValue(quantitymin);
    this.f['total'].setValue(total);
    this.f['vat'].setValue(vat);
    this.f['isSale'].setValue(isSale);
  }

  getCicleToForm(selecCicleForm: AbstractControl, selectCicle: any) {
    if (selectCicle) {
      this.blockUICicle.start("Cargando...");
      selectCicle.get().then((result) => {
        let cicle: CicleInterface = result.data();
        selecCicleForm.setValue(cicle.uid);
        this.blockUICicle.stop();
      })
    }
  }

  getCicles() {
    this.blockUICicle.start("Cargando...");
    this.cicleService.getFullInfoCicle().subscribe((cicles) => {
      this.ciclesArray = cicles;
      this.blockUICicle.stop();
    })
  }

  get f() { return this.productInfo.controls; }

  get fValue() { return this.productInfo.value; }

  onProductInfoSubmit() {
    this.submitted = true;

    if (this.productInfo.invalid) {
      return;
    }

    this.blockUISubmit.start("Guardando...")
    if (this.opc) { //Se agrega nuevo producto
      this.fValue.assign = this.currentUser.uid;
      this.fValue.nameassign = this.currentUser.displayName;
      this.fValue.margin = this.fValue.margin / 100; // dejo el % expresado en decimales.
      this.productService.addProduct(this.fValue).finally(() => {
        this.blockUISubmit.stop();
        this.passEntry.emit(true);
        this.activeModal.close(true);
      });

    } else {
      this.fValue.margin = this.fValue.margin / 100; // dejo el % expresado en decimales.
      this.product = this.fValue;
      this.product.uid = this.productService.selectedProduct.uid;
      this.productService.updateProduct(this.product).finally(() => {
        this.blockUISubmit.stop();
        this.passEntry.emit(true);
        this.activeModal.close(true);
      });

    }

  }

  getUserLogged(): void {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  setVatGross(gross: number) {
    if (gross !== null) {
      var vat = (Math.round(gross * 0.19))
      var net = gross + vat;

      this.f['vat'].setValue(vat);
      this.f['net'].setValue(net);
    } else {
      this.f['vat'].setValue("");
      this.f['net'].setValue("");
    }
  }

  setMarginToTotal(margin: any) {
    var marginInPercent = 0;
    var totalWithMargin = 0;
    if (margin !== "") {
      marginInPercent = (+margin / 100) + 1;
      totalWithMargin = Math.round(this.f['net'].value * marginInPercent);
      this.f['total'].setValue(totalWithMargin);
    } else {
      this.f['margin'].setValue(0)
      this.f['total'].setValue(this.f['net'].value);
    }
  }

  setMarginFromTotal(total: any): void {
    var totalWithOutMargin = 0;
    if (total !== "") {
      totalWithOutMargin = Math.ceil(((+total * 100) / this.f['net'].value) - 100);
      this.f['margin'].setValue(totalWithOutMargin);
    } else {
      this.f['margin'].setValue(0);
    }
  }

}
