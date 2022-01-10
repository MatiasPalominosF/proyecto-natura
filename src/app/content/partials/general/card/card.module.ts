import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchHeightModule } from '../../../partials/general/match-height/match-height.module';
import { CardComponent } from './card.component';
import { CardDirective } from '../../../../../app/_directives/card.directive';

@NgModule({
  imports: [
    CommonModule,
    MatchHeightModule
  ],
  declarations: [CardComponent, CardDirective],
  exports: [CardComponent]
})
export class CardModule { }
