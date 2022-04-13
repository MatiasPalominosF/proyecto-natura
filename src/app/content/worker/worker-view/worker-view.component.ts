import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { UserInterface } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user/user.service';

@Component({
  selector: 'app-worker-view',
  templateUrl: './worker-view.component.html',
  styleUrls: ['./worker-view.component.css']
})
export class WorkerViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('workers') blockUIWorker: NgBlockUI;


  public breadcrumb: BreadcrumbInterface;
  public displayedColumns: string[] = ['position', 'firstname', 'rut', 'actions'];
  public dataSource: MatTableDataSource<UserInterface> = new MatTableDataSource<UserInterface>();
  public isEmpty: boolean = false;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.breadcrumb = {
      mainlabel: 'Gestión de usuarios',
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

  showLastProducts() {

  }

  editWorker() {

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


}
