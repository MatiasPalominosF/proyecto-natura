import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductInterface } from 'src/app/_models/product';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit, AfterViewInit {

  @BlockUI('products') blockUIProduct: NgBlockUI;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public breadcrumb: any;
  public displayedColumns: string[] = ['name', 'net', 'margin', 'total', 'quantity', 'quantitymin'];
  public dataSource: MatTableDataSource<ProductInterface> = new MatTableDataSource<ProductInterface>();
  public isEmpty: boolean = false;
  private closeResult = '';

  constructor(
    private productService: ProductService,
    private modalService: NgbModal,
    private notifyService: NotificationService,
  ) { }
  
  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Gestión de productos',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/dashboard-view'
        },
        {
          'name': 'Productos',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };
    this.getProducts();
  }

  getProducts() {
    this.blockUIProduct.start('Cargando...');
    this.productService.getFullInfoProduct().subscribe(data => {
      if (data.length === 0) {
        this.isEmpty = true;
      }
      this.dataSource.data = data;
      this.blockUIProduct.stop();
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;
  }

  addNewProduct() {
    const modalRef = this.modalService.open(NewProductComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.componentInstance.opc = true;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Agregar", "¡El producto se agregó correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortingCustomAccesor = (item, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'net': return item.net;
      case 'margin': return item.margin;
      case 'total': return item.total;
      case 'quantity': return item.quantity;
      case 'quantitymin': return item.quantitymin;
      default: return item[property];
    }
  };
}

