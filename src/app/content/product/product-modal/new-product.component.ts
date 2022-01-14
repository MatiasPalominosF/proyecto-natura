import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyCnameRecord } from 'dns';
import { ProductInterface } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class ProductModalComponent implements OnInit {

  @Input() public opc: boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public productInfo: FormGroup;
  public submitted: boolean = false;
  public selection = {};
  private currentUser: any;
  private product: ProductInterface = {};

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {

    this.getUserLogged();

    if (this.opc) {
      this.productInfo = this.formBuilder.group({
        name: ['', Validators.required],
        assign: [null],
        codbarra: ['', Validators.required],
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
    } else {
      //Setear valores al formulario
    }
  }

  get f() { return this.productInfo.controls; }

  get fValue() { return this.productInfo.value; }

  onProductInfoSubmit() {
    this.submitted = true;

    if (this.productInfo.invalid) {
      return;
    }
    if (this.opc) { //Se agrega nuevo producto
      this.fValue.assign = this.currentUser.uid;
      this.fValue.nameassign = this.currentUser.displayName;
      this.fValue.margin = this.fValue.margin / 100; // dejo el % expresado en decimales.
      this.product = this.fValue;
      this.productService.addProduct(this.product);

      this.passEntry.emit(true);
      this.activeModal.close(true);
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
