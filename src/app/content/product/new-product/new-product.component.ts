import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  @Input() public opc: boolean;

  public productInfo: FormGroup;
  public submitted: boolean = false;
  public selection = {}

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
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
  }

  get f() { return this.productInfo.controls; }

  get fValue() { return this.productInfo.value; }

  onProductInfoSubmit() {
    this.submitted = true;
    console.log("fValue", this.fValue);

  }

}
