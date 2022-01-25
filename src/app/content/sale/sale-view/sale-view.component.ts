import { AfterViewInit, Component, KeyValueDiffers, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductInterface } from 'src/app/_models/product';
import { ProductCartInterface } from 'src/app/_models/productCart';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { SaleService } from 'src/app/_services/sale/sale.service';
import { AddCartModalComponent } from '../add-cart-modal/add-cart-modal.component';


@Component({
  selector: 'app-sale-view',
  templateUrl: './sale-view.component.html',
  styleUrls: ['./sale-view.component.css']
})
export class SaleViewComponent implements OnInit, AfterViewInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @BlockUI('products') blockUIProduct: NgBlockUI;

  public isDisabled: boolean = true;
  public breadcrumb: any;
  public displayedColumns: string[] = ['position', 'name', 'cicle', 'quantity', 'total', 'actions'];
  public displayedColumnsCart: string[] = ['position', 'name', 'quantitycart', 'unitprice', 'totalcart', 'actions'];
  public dataSource: MatTableDataSource<ProductInterface> = new MatTableDataSource<ProductInterface>();
  public dataSourceCart: MatTableDataSource<ProductCartInterface> = new MatTableDataSource<ProductCartInterface>();
  public isEmpty: boolean = false;
  public isEmptyCart: boolean = false;
  public pageSizeOptions: Array<number> = new Array<number>();
  public pageSize: number;
  private closeResult = '';
  private dataCart: ProductCartInterface[] = [];

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private modalService: NgbModal,
    private notifyService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
    private differs: KeyValueDiffers
  ) {
  }

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Gestión de ventas',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/dashboard-view'
        },
        {
          'name': 'Ventas',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };

    if (this.dataSourceCart.data.length === 0) {
      this.isEmptyCart = true;
    }
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    this.dataSourceCart.paginator = this.paginator.toArray()[1];
    this.dataSourceCart.sort = this.sort.toArray()[1];
    this.dataSourceCart.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();

  }

  deleteProductCart(product: ProductCartInterface) {
    this.confirmationDialogService.confirm('Confirmación', '¿Estás seguro de eliminar el producto?')
      .then(async confirmed => {
        if (!confirmed) {
        } else {
          let productDelete = this.dataCart.find(data => data.puid === product.puid);
          if (productDelete) {
            let index = this.dataCart.indexOf(productDelete);
            this.dataCart.splice(index, 1);
            this.dataSourceCart.data = this.dataCart;
            this.notifyService.showSuccess("Eliminar", "¡El producto se eliminó correctamente!");
          }
          if (this.dataCart.length === 0) {
            this.isDisabled = true;
          }

        }
      }).catch(() => {
        console.log("Not ok");
      });
  }

  onSubmitSale(): void {
    this.confirmationDialogService.confirm('Confirmación', '¿Estás seguro de realizar la venta?')
      .then(confirmed => {
        if (!confirmed) {
        } else {
          this.dataCart.forEach((item) => {
            this.saleService.addProduct(item).finally(() => {
            })
          });
          this.dataCart = [];
          this.dataSourceCart.data = this.dataCart;
          this.isDisabled = true;
          this.notifyService.showSuccess("Venta efectuada con éxito", "Venta");
        }
      }).catch(() => {
        console.log("Not ok");
      });
  }

  getProducts(): void {
    this.blockUIProduct.start("Cargando...");
    this.isEmpty = true;

    this.productService.getFullInfoProduct().subscribe((products) => {
      this.dataSource.data = products;
      this.isEmpty = false;
      this.blockUIProduct.stop();
    }, error => {
      console.log("Error", error);
    },
      () => {
        console.log("Se termina el subscribe del getProducts");
      });
  }

  addCart(producto: ProductInterface): void {
    this.productService.selectedProduct = Object.assign({}, producto);
    const modalRef = this.modalService.open(AddCartModalComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      if (this.dataCart.length === 0) {
        this.dataCart.push(receivedEntry);
      } else {
        let product = this.dataCart.find(producto => producto.puid === receivedEntry.puid);
        if (product) {
          let index = this.dataCart.indexOf(product);
          product.quantitycart = product.quantitycart + receivedEntry.quantitycart;
          product.totalcart = product.totalcart + receivedEntry.totalcart
          product.grosstotalcart = product.grosstotalcart + receivedEntry.grosstotalcart;
          this.dataCart[index] = product;
        } else {
          this.dataCart.push(receivedEntry);
        }
      }

      this.dataSourceCart.data = this.dataCart;
      this.isDisabled = false;
      this.notifyService.showInfo("El producto se añadió al carrito", "Aviso");
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

  sortingCustomAccesor = (item, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'quantity': return item.quantity;
      case 'total': return item.total;
      default: return item[property];
    }
  };

  sortingCustomAccesorCart = (item, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'unitprice': return item.unitprice;
      case 'quantitycart': return item.quantitycart;
      case 'totalcart': return item.totalcart;
      default: return item[property];
    }
  };

  public calculateTotal(): number {
    return this.dataCart.reduce((accum, curr) => accum + curr.totalcart, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues = {
      name: '', codbarra: ''
    };

    filteredValues['name'] = filterValue;
    filteredValues['codbarra'] = filterValue;
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
      return data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1 ||
        data.codbarra.toString().trim().toLowerCase().indexOf(searchString.codbarra.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

}
