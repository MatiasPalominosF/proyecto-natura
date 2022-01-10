import {
  Directive, ElementRef, AfterViewChecked,
  Input, HostListener, OnInit
} from '@angular/core';

@Directive({
  selector: '[matchHeight]'
})
export class MatchHeightDirective implements AfterViewChecked {

  // class name to match height
  @Input()
  matchHeight: any;
  screenSize: number;

  constructor(private el: ElementRef) {
  }

  ngAfterViewChecked() {
    // call our matchHeight function here later
      this.matchHeightFunction(this.el.nativeElement, this.matchHeight);
  }

  @HostListener('window:resize')
  onResize() {
      // call our matchHeight function here later
      this.matchHeightFunction(this.el.nativeElement, this.matchHeight);
  }
  matchHeightFunction(parent: HTMLElement, className: string) {
    // match height logic here
    if (!parent) { return; }
    const children = parent.getElementsByClassName(className);

    if (!children) { return; }

    // reset all children height
    Array.from(children).forEach((x: HTMLElement) => {
      x.style.height = 'initial';
    });

    // gather all height
    const itemHeights = Array.from(children)
      .map(x => x.getBoundingClientRect().height);

    // find max height
    const maxHeight = itemHeights.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);

    if ( window.innerWidth > 1200) {
      // apply max height
      Array.from(children)
        .forEach((x: HTMLElement) => x.style.height = `${maxHeight}px`);
        parent.style.height = `${maxHeight}px`;
        parent.style.marginBottom = `1.875rem`;
    } else {
      Array.from(children)
        .forEach((x: HTMLElement) => x.style.height = 'unset');
        parent.style.height = 'unset';
        parent.style.marginBottom = `1.875rem`;
    }
  }
}
