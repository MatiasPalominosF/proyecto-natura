import { Component, OnInit, Input } from '@angular/core';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  constructor() { }

  @Input() breadcrumb: BreadcrumbInterface;

  ngOnInit() {
    this.processBreadCrumbLinks();
  }
  private processBreadCrumbLinks() {
  }
}
