import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleViewComponent } from './sale-view/sale-view.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { CardModule } from '../partials/general/card/card.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatRadioModule } from '@angular/material/radio';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SaleViewComponent
  ],
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    BreadcrumbModule,
    CardModule,
    NgbModule,
    MatRippleModule,
    NgbModalModule,
    NgSelectModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'sale-view',
        component: SaleViewComponent,
      }
    ]),
  ]
})
export class SaleModule { }
