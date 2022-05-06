import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserInterface } from 'src/app/_models/user';
import { ExportToExcelService } from 'src/app/_services/export-to-excel/export-to-excel.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { ProductService } from 'src/app/_services/product/product.service';

export interface DataToExport {
  producto?: string;
  cantidad?: number;
  precioVenta?: number;
}

@Component({
  selector: 'app-filter-data-export',
  templateUrl: './filter-data-export.component.html',
  styleUrls: ['./filter-data-export.component.css']
})
export class FilterDataExportComponent implements OnInit {
  @Input() public user: UserInterface;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @BlockUI('submit') blockUISubmit: NgBlockUI;

  public title: string;
  public filterForm: FormGroup;
  public submitted: boolean = false;
  private excelData: DataToExport[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private exportToExcelService: ExportToExcelService,
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.title = 'Filtrar productos de ' + this.user.firstname;
    this.filterForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  get f() { return this.filterForm.controls; }

  get fromDate() { return this.filterForm.get('fromDate').value; }

  get toDate() { return this.filterForm.get('toDate').value; }

  public hasError = (controlName: string, errorName: string) => {
    return this.filterForm.get(controlName).hasError(errorName);
  }

  onSubmit() {
    this.submitted = true;

    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    let fromDate = this.fromDate;
    let toDate = new Date(this.toDate.getUTCFullYear(), this.toDate.getUTCMonth(), this.toDate.getUTCDate(), 23, 59, 59, 59);

    this.blockUISubmit.start('Cargando...');
    this.productService.getProductsWithFilterDate(this.user.uid, fromDate, toDate).subscribe(products => {
      if (products.length > 0) {
        products.forEach(product => {
          let dataToExport: DataToExport = {};
          dataToExport.producto = product.name;
          dataToExport.cantidad = product.quantity;
          dataToExport.precioVenta = product.total;

          this.excelData.push(dataToExport);
        });
        let nameExcel = 'Productos ' + this.user.firstname
        this.exportToExcelService.exportAsExcelFile(this.excelData, nameExcel);
        this.blockUISubmit.stop();
        this.passEntry.emit(true);
        this.activeModal.close(true);
      } else {
        this.blockUISubmit.stop();
        this.notifyService.showError("Exportar", "¡No existen datos en el rango de fecha seleccionado!");
      }
    });
  }
}
