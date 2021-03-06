import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { UserInterface } from 'src/app/_models/user';
import { ExportToExcelService } from 'src/app/_services/export-to-excel/export-to-excel.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { UserService } from 'src/app/_services/user/user.service';
import { FilterDataExportComponent } from '../filter-data-export/filter-data-export.component';

export interface DataToExport {
  codbarra?: string;
  producto?: string;
  cantidad?: number;
  precioVenta?: number;
}


@Component({
  selector: 'app-worker-view',
  templateUrl: './worker-view.component.html',
  styleUrls: ['./worker-view.component.css']
})
export class WorkerViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('workers') blockUIWorker: NgBlockUI;
  @BlockUI('showAllProductsBtn') blockUIShowAllProductsBtn: NgBlockUI;


  public breadcrumb: BreadcrumbInterface;
  public displayedColumns: string[] = ['position', 'firstname', 'rut', 'actions'];
  public dataSource: MatTableDataSource<UserInterface> = new MatTableDataSource<UserInterface>();
  public isEmpty: boolean = false;
  private closeResult = '';
  private excelData: DataToExport[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private modalService: NgbModal,
    private notifyService: NotificationService,
    private exportToExcelService: ExportToExcelService,
  ) { }

  ngOnInit(): void {
    this.breadcrumb = {
      mainlabel: 'Gesti??n de usuarios',
      links: [{
        'name': 'Home',
        'isLink': true,
        'link': '/dashboard/dashboard-view'
      },
      {
        'name': 'Usuarios',
        'isLink': false,
        'link': '#'
      },],
      options: false,
      putselect: false,
    };

    this.getWorkers();
  }

  getWorkers() {
    this.blockUIWorker.start('Cargando...');
    this.isEmpty = true;
    this.userService.getAllUsers().subscribe((users) => {
      if (users.length === 0) {
        this.isEmpty = true;
        this.blockUIWorker.stop();
        this.isEmpty = false;
        return;
      }
      this.dataSource.data = users;
      this.blockUIWorker.stop();
    });
  }

  addNewWorker() {

  }

  showLastProducts(user: UserInterface) {
    const modalRef = this.modalService.open(FilterDataExportComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.componentInstance.user = user;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Exportar", "??Archivo exportado con ??xito!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showAllProducts(user: UserInterface) {
    console.log(user);
    this.excelData = [];
    this.blockUIShowAllProductsBtn.start('Cargando...');
    this.productService.getProductsByAssign(user.uid).subscribe((products) => {
      products.forEach((product) => {
        let dataToExport: DataToExport = {};
        dataToExport.codbarra = product.codbarra;
        dataToExport.producto = product.name;
        dataToExport.cantidad = product.quantity;
        dataToExport.precioVenta = product.total;
        if (this.excelData.filter(e => e.codbarra === dataToExport.codbarra).length > 0) {
          let element = this.excelData.find(el => el.codbarra === dataToExport.codbarra);
          let index = this.excelData.indexOf(element);
          element.cantidad = element.cantidad + dataToExport.cantidad;
          this.excelData[index] = element;
        } else {
          this.excelData.push(dataToExport);
        }
      });
      let nameExcel = 'Productos ' + user.firstname
      this.exportToExcelService.exportAsExcelFile(this.excelData, nameExcel);
      this.blockUIShowAllProductsBtn.stop();
    });
  }

  editWorker(user: UserInterface) {

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }

  sortingCustomAccesor = (item, property) => {
    switch (property) {
      case 'firstname': return item.firstname;
      case 'rut': return item.rut;
      default: return item[property];
    }
  };

  /**
   * 
   * @returns Custom accessor function
   */
  filterCustomAccessor() {
    const myFilterPredicate = (data: UserInterface, filter: string): boolean => {
      let searchString = JSON.parse(filter);

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return data.firstname.toString().trim().toLowerCase().indexOf(searchString.firstname.toString().trim().toLowerCase()) !== -1 ||
        data.rut.toString().trim().toLowerCase().indexOf(searchString.rut.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues = {
      firstname: '',
      rut: '',
    };

    filteredValues['firstname'] = filterValue;
    filteredValues['rut'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
