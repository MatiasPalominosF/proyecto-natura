import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-view',
  templateUrl: './assign-view.component.html',
  styleUrls: ['./assign-view.component.css']
})
export class AssignViewComponent implements OnInit {

  public breadcrumb: any;

  constructor() { }

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
          'name': 'Asignaciones',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };
  }

}
