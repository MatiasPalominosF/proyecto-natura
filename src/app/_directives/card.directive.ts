import {
  Directive,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  OnInit,
  Input,
  HostBinding
} from '@angular/core';

interface CardOptions {
  enableSticky?: boolean;
  headOverlay?: boolean;
  headLarge?: boolean;
  class?: string[];
}

@Directive({
  selector: '[mCard]'
})
export class CardDirective implements AfterViewInit, OnDestroy, OnInit {
  card: any;

  @Input() options: CardOptions;
  @HostBinding('class') class: any;

  constructor(
    private el: ElementRef
  ) {
    this.class = this.el.nativeElement.classList;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }
}
