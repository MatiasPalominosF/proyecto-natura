import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductViewComponent } from './product-view/product-view.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { CardModule } from '../partials/general/card/card.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { ProductModalComponent } from './product-modal/new-product.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatRadioModule } from '@angular/material/radio';
import { ChangeProductModalComponent } from './change-product-modal/change-product-modal.component';


@NgModule({
  declarations: [
    ProductViewComponent,
    ProductModalComponent,
    ChangeProductModalComponent
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
        path: 'product-view',
        component: ProductViewComponent,
      }
    ]),
  ]
})
export class ProductModule { }
