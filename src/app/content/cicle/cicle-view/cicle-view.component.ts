import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { CicleService } from 'src/app/_services/cicle/cicle.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { CicleModalComponent } from '../cicle-modal/cicle-modal.component';
import { ShowProductsComponent } from '../show-products/show-products.component';

@Component({
  selector: 'app-cicle-view',
  templateUrl: './cicle-view.component.html',
  styleUrls: ['./cicle-view.component.css']
})
export class CicleViewComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('cicles') blockUICicle: NgBlockUI;

  public displayedColumns: string[] = ['position', 'name', 'dateinit', 'dateend', 'actions'];
  public dataSource: MatTableDataSource<CicleInterface> = new MatTableDataSource<CicleInterface>();
  public isEmpty: boolean = false;
  private closeResult = '';

  public breadcrumb: any;

  constructor(
    private cicleService: CicleService,
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
          'name': 'Ciclos',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };

    this.getCicles();
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
      case 'name': return item.name;
      case 'position': {
        console.log("property: ", property);
        console.log("item.position: ", item);
        return item.position
      };
      case 'dateinit': return item.dateinit;
      case 'dateend': return item.dateend;
      default: return item[property];
    }
  };

  /**
   * 
   * @returns Custom accessor function
   */
  filterCustomAccessor() {
    const myFilterPredicate = (data: CicleInterface, filter: string): boolean => {
      let searchString = JSON.parse(filter);

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  addNewCicle(): void {
    this.cicleService.selectedCicle = Object.assign({}, {});
    const modalRef = this.modalService.open(CicleModalComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.componentInstance.opc = true;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Agregar", "¡El ciclo se agregó correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editCicle(cicle: CicleInterface): void {
    this.cicleService.selectedCicle = Object.assign({}, cicle);
    const modalRef = this.modalService.open(CicleModalComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' });
    modalRef.componentInstance.opc = false;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Editar", "¡El ciclo se editó correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues = {
      name: ''
    };

    filteredValues['name'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCicles() {
    this.blockUICicle.start('Cargando...');
    this.isEmpty = true;
    this.cicleService.getFullInfoCicle().subscribe((cicles) => {
      if (cicles.length === 0) {
        this.isEmpty = true;
        this.blockUICicle.stop();
        this.isEmpty = false;
        return;
      }
      this.dataSource.data = cicles;
      this.blockUICicle.stop();
    });
  }

  showProductsCicle(cicle: CicleInterface) {
    const modalRef = this.modalService.open(ShowProductsComponent, { windowClass: 'animated fadeInDown my-class', backdrop: 'static' , size: 'lg' });
    modalRef.componentInstance.cuid = cicle.uid;
    modalRef.componentInstance.namecicle = cicle.name;
    modalRef.result.then((result) => {
      if (result) {
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
