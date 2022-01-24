import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductInterface } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-sale-view',
  templateUrl: './sale-view.component.html',
  styleUrls: ['./sale-view.component.css']
})
export class SaleViewComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('products') blockUIProduct: NgBlockUI;

  public breadcrumb: any;
  public displayedColumns: string[] = ['position', 'name', 'quantity', 'total', 'actions'];
  public dataSource: MatTableDataSource<ProductInterface> = new MatTableDataSource<ProductInterface>();
  public isEmpty: boolean = false;

  constructor(
    private productService: ProductService,
  ) { }

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

    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }

  getProducts(): void {
    this.blockUIProduct.start("Cargando...");
    this.productService.getFullInfoProduct().subscribe((products) => {
      this.dataSource.data = products;
      this.blockUIProduct.stop();
    });
  }

  addCart(producto: ProductInterface): void {
    console.log(producto);
  }

  sortingCustomAccesor = (item, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'quantity': return item.quantity;
      case 'total': return item.total;
      default: return item[property];
    }
  };

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
