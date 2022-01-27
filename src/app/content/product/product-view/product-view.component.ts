import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { CicleInterface } from 'src/app/_models/cicle';
import { ProductInterface } from 'src/app/_models/product';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { ChangeProductModalComponent } from '../change-product-modal/change-product-modal.component';
import { ProductModalComponent } from '../product-modal/new-product.component';

export interface FilterInterface {
  id: string,
  value: string
}

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit, AfterViewInit {

  @BlockUI('products') blockUIProduct: NgBlockUI;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public breadcrumb: BreadcrumbInterface;
  public displayedColumns: string[] = ['name', 'net', 'margin', 'total', 'quantity', 'quantitymin', 'namecicle', 'nameassign', 'actions'];
  public dataSource: MatTableDataSource<ProductInterface> = new MatTableDataSource<ProductInterface>();
  public isEmpty: boolean;
  public isFounded: boolean;
  private closeResult = '';
  private productArray: ProductInterface[];


  constructor(
    private productService: ProductService,
    private modalService: NgbModal,
    private notifyService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit(): void {
    this.breadcrumb = {
      mainlabel: 'Gestión de productos',
      links: [{
        'name': 'Home',
        'isLink': true,
        'link': '/dashboard/dashboard-view'
      },
      {
        'name': 'Productso',
        'isLink': false,
        'link': '#'
      },],
      options: false,
      putselect: false,
    };
    this.getProducts();
  }

  getProducts() {
    this.blockUIProduct.start('Cargando...');
    this.isEmpty = true;
    this.isFounded = true;
    this.productService.getFullInfoProductNotObservable().then((querySnapshot) => {
      this.productArray = [];
      if (querySnapshot.empty) {
        this.isEmpty = true;
        this.blockUIProduct.stop();
        this.dataSource.data = this.productArray;
        return;
      }

      querySnapshot.forEach(doc => {
        let data: any = doc.data();
        if (Object.keys(data.refcicle).length !== 0) {
          let product: ProductInterface = {};
          data.refcicle.get().then((cicleFs) => {
            let cicle: CicleInterface = cicleFs.data();
            product = data;
            product.namecicle = cicle.name;
            this.productArray.push(product);
          }).finally(() => {
            this.dataSource.data = this.productArray;
            this.isEmpty = false;
            this.isFounded = false;
            this.blockUIProduct.stop();
          })
        } else {
          this.productArray = [];
          this.dataSource.data = this.productArray;
          this.isEmpty = false;
          this.isFounded = false;
          this.blockUIProduct.stop();
        }

      });
    })
  }

  refreshView() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues = {
      name: '', nameassign: '', codbarra: '', namecicle: ''
    };

    filteredValues['name'] = filterValue;
    filteredValues['nameassign'] = filterValue;
    filteredValues['codbarra'] = filterValue;
    filteredValues['namecicle'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * 
   * @returns Custom accessor function
   */
  filterCustomAccessor() {
    const myFilterPredicate = (data: ProductInterface, filter: string): boolean => {
      let searchString = JSON.parse(filter);

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return data.name.toString().trim().toLowerCase().indexOf(searchString.nameassign.toLowerCase()) !== -1 ||
        data.nameassign.toString().trim().toLowerCase().indexOf(searchString.nameassign.toLowerCase()) !== -1 ||
        data.codbarra.toString().trim().toLowerCase().indexOf(searchString.codbarra.toLowerCase()) !== -1 ||
        data.namecicle.toString().trim().toLowerCase().indexOf(searchString.namecicle.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }



  sortingCustomAccesor = (item, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'net': return item.net;
      case 'margin': return item.margin;
      case 'total': return item.total;
      case 'quantity': return item.quantity;
      case 'quantitymin': return item.quantitymin;
      case 'nameassign': return item.nameassign;
      default: return item[property];
    }
  };

  addNewProduct() {
    this.productService.selectedProduct = Object.assign({}, {});
    const modalRef = this.modalService.open(ProductModalComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.componentInstance.opc = true;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Agregar", "¡El producto se agregó correctamente!");
        this.refreshView();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  changeOwnerProduct(product: ProductInterface): void {
    this.productService.selectedProduct = Object.assign({}, product);
    const modalRef = this.modalService.open(ChangeProductModalComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Mover stock", "¡El stock se ha movido correctamente!");
        this.refreshView();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editProduct(product: ProductInterface): void {
    this.productService.selectedProduct = Object.assign({}, product);
    const modalRef = this.modalService.open(ProductModalComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.componentInstance.opc = false;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Editar", "¡El producto se editó correctamente!");
        this.refreshView();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteProduct(product: ProductInterface): void {
    this.confirmationDialogService.confirm('Confirmación', '¿Estás seguro de eliminar el producto?')
      .then(async confirmed => {
        if (!confirmed) {
        } else {
          this.productService.deleteProduct(product);
          this.refreshView();
          this.notifyService.showSuccess("Eliminar", "¡El producto se eliminó correctamente!");

        }
      }).catch(() => {
        console.log("Not ok");
      });
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

