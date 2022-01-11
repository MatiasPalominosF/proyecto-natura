import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerViewComponent } from './worker-view/worker-view.component';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { CardModule } from '../partials/general/card/card.module';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    WorkerViewComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CardModule,
    NgbModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'worker-view',
        component: WorkerViewComponent,
      }
    ]),
  ]
})
export class WorkerModule { }
