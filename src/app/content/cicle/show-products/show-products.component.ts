import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { ProductInterface } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css']
})
export class ShowProductsComponent implements OnInit, AfterViewInit {

  @Input() public cuid: string;
  @Input() public namecicle: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('products') blockUIProduct: NgBlockUI;

  public displayedColumns: string[] = ['name', 'net', 'margin', 'total', 'quantity', 'quantitymin', 'namecicle', 'nameassign'];
  public dataSource: MatTableDataSource<ProductInterface> = new MatTableDataSource<ProductInterface>();
  public isEmpty: boolean;
  public isFounded: boolean;
  private productArray: ProductInterface[];
  public title: string;

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.title = "Productos " + this.namecicle.toLowerCase();
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
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

  getProducts() {
    this.blockUIProduct.start('Cargando...');
    this.isEmpty = true;
    this.isFounded = true;
    this.productService.getProductByCicle(this.cuid).then((querySnapshot) => {
      this.productArray = [];
      if (querySnapshot.empty) {
        this.isEmpty = true;
        this.blockUIProduct.stop();
        this.dataSource.data = this.productArray;
        return;
      }

      var promise = new Promise<void>((resolve, reject) => {
        querySnapshot.docs.forEach(async (doc, index, array) => {
          let product: ProductInterface = doc.data();
          await product.refcicle.get().then((cicleFs) => {
            let cicle: CicleInterface = cicleFs.data();
            product.namecicle = cicle.name;
            this.productArray.push(product);
          })
          if (index === array.length - 1) resolve();
        });
      });

      promise.then(() => {
        this.dataSource.data = this.productArray;
        this.isEmpty = false;
        this.blockUIProduct.stop();
      })
    })
  }
}
