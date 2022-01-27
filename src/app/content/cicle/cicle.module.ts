import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CicleViewComponent } from './cicle-view/cicle-view.component';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { CardModule } from '../partials/general/card/card.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { CicleModalComponent } from './cicle-modal/cicle-modal.component';
import { ShowProductsComponent } from './show-products/show-products.component';



@NgModule({
  declarations: [
    CicleViewComponent,
    CicleModalComponent,
    ShowProductsComponent
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
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'cicle-view',
        component: CicleViewComponent,
      }
    ]),
  ]
})
export class CicleModule { }
