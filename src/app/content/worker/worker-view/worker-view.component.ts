import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worker-view',
  templateUrl: './worker-view.component.html',
  styleUrls: ['./worker-view.component.css']
})
export class WorkerViewComponent implements OnInit {

  public breadcrumb: any;

  constructor() { }

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Gestión de usuarios',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/dashboard-view'
        },
        {
          'name': 'Usuarios',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };
  }

}
