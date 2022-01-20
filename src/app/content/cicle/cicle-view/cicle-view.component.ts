import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CicleInterface } from 'src/app/_models/cicle';
import { CicleService } from 'src/app/_services/cicle/cicle.service';

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

  }

  editCicle(cicle: CicleInterface): void {

  }

  deleteCicle(cicle: CicleInterface): void {

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
    this.cicleService.getFullInfoCicle().subscribe((cicles) => {
      if (cicles.length === 0) {
        this.isEmpty = true;
      }
      this.dataSource.data = cicles;
      this.blockUICicle.stop();
    });
  }

}
