import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  public breadcrumb: any;

  constructor() { }

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Vista principal',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/dashboard-view'
        },
        {
          'name': 'Dashboard',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };
  }

}
