import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumberPipe } from './format-number/format-number.pipe';



@NgModule({
  declarations: [
    FormatNumberPipe
  ],
  exports: [
    FormatNumberPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
