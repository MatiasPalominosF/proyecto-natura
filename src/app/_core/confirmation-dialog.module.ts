import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
  exports: [ConfirmationDialogComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ConfirmationDialogModule { }
