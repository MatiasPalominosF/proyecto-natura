import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NavbarService {
  private mouseInMenuRegion = false;
  private fixedMenu = false;
  constructor() {
  }

  isMouseInRegion() {
    return this.mouseInMenuRegion;
  }

  setMouseInRegion(flag) {
    this.mouseInMenuRegion = flag;
  }

  isFixedMenu() {
    return this.fixedMenu;
  }

  setFixedMenu(flag) {
    this.fixedMenu = flag;
  }
}
