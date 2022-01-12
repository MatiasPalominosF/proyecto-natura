import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductInterface } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product/product.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


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

  constructor(
    private productService: ProductService,
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
    this.productService.getFullInfoHarvest().subscribe(data => {
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
    console.log("Se presiona");
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

