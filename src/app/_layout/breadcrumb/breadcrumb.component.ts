import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BreadcrumbInterface } from 'src/app/_models/breadcrumb';
import { CicleInterface } from 'src/app/_models/cicle';
import { CicleService } from 'src/app/_services/cicle/cicle.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Output() idCategory = new EventEmitter<CicleInterface>();
  @BlockUI('selectBlockUi') blockUISelect: NgBlockUI;
  public dataForSelect: CicleInterface[] = [];
  public singlebasicSelected: CicleInterface = {};
  private customData: CicleInterface = {
    uid: 'customuid',
    dateend: 'customuid',
    dateinit: 'customuid',
    name: "General"
  }

  constructor(
    private cicleService: CicleService,
  ) { }

  @Input() breadcrumb: BreadcrumbInterface;

  ngOnInit() {
    this.processBreadCrumbLinks();
    this.getCicles();
  }

  getCicles(): void {
    this.blockUISelect.start("Cargando...");
    this.cicleService.getFullInfoCicle().subscribe((cicles) => {
      this.dataForSelect = cicles;
      this.dataForSelect.unshift(this.customData)
      this.singlebasicSelected = this.dataForSelect[0];
      this.idCategory.emit(this.singlebasicSelected);
      this.blockUISelect.stop();
    });
  }

  private processBreadCrumbLinks() {
  }

  change($event: CicleInterface): void {
    if ($event) {
      this.singlebasicSelected = $event;
      this.idCategory.emit(this.singlebasicSelected);
    }
  }
}
