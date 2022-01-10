import { Component, OnInit, Renderer2, Inject, ViewChild } from '@angular/core';
import { ThemeSettingsService } from '../../settings/theme-settings.service';
import { DOCUMENT } from '@angular/common';
import { NavbarService } from 'src/app/_services/navbar.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MenuSettingsService } from '../../settings/menu-settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AppConstants } from 'src/app/_helpers/app.constants';
declare var require: any;
const colors = require('../../../../assets/data/customizer/customizerColor.json');

@Component({
  selector: 'app-horizontal-customizer',
  templateUrl: './horizontal-customizer.component.html',
  styleUrls: ['./horizontal-customizer.component.css']
})
export class HorizontalCustomizerComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public _themeCustomizerConfig: any;
  public _menuCustomizerConfig: any;
  private _themeSettingsConfig: any;
  public selectColorClass: string;

  public isCollapsedMenu = false;
  public isfixChecked = false;
  public isboxChecked = false;
  public isStaticLayout = false;

  public isRightSideIcons = false;

  activeIdString = 'light';

  public config: PerfectScrollbarConfigInterface = { wheelPropagation: false };

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: true }) directiveRef?: PerfectScrollbarDirective;
  constructor(private _renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private navbarService: NavbarService,
    private _themeSettingsService: ThemeSettingsService,
    private _menuSettingsService: MenuSettingsService, ) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit() {

    this._themeSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._themeCustomizerConfig = config;
      });
    this._themeSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._themeSettingsConfig = config;
      });
  }
  toggleCustomizer(event) {
    const element = document.getElementById('customizer');
    if (element && element.classList.contains('open')) {
      this._renderer.removeClass(element, 'open');
    } else {
      this._renderer.addClass(element, 'open');
    }
  }
  changeNavbarFontColor($event: NgbTabChangeEvent) {
    const headerElement = document.getElementsByClassName('top-header');
    if ($event.nextId === 'dark') {
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-light');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-light');
      this._renderer.removeClass(headerElement.item(0), 'navbar-shadow');
      this._renderer.addClass(headerElement.item(0), 'navbar-dark');
    } else if ($event.nextId === 'light') {
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-light');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-dark');
      this._renderer.addClass(headerElement.item(0), 'navbar-light');
      this._renderer.addClass(headerElement.item(0), 'navbar-shadow');
    }

    this._themeSettingsService.config = {
      color: ''
    };
  }
  setColor(colorClass) {
    for (let i = 0; i <= colors.colorArray.length; i++) {
      if (colorClass === colors.colorArray[i].cssClass) {
        this.selectColorClass = colorClass;
        break;
      }
    }
    this._themeSettingsService.config = {
      color: this.selectColorClass
    };
  }
  setMenuColor(e) {
    const darkMenuButton = document.getElementById('dark-menu');
    const lightMenuButton = document.getElementById('light-menu');
    const menuHeaderElement = document.getElementById('menu-header');

    if (e.currentTarget.className === 'btn btn-outline-info _dark') {
      this._renderer.removeClass(lightMenuButton, 'active');
      this._renderer.removeClass(menuHeaderElement, 'navbar-light');
      this._renderer.addClass(darkMenuButton, 'active');
      this._renderer.addClass(menuHeaderElement, 'navbar-dark');
    } else if (e.currentTarget.className === 'btn btn-outline-info _light') {
      this._renderer.removeClass(menuHeaderElement, 'navbar-dark');
      this._renderer.removeClass(darkMenuButton, 'active');
      this._renderer.addClass(lightMenuButton, 'active');
      this._renderer.addClass(menuHeaderElement, 'navbar-light');
    }

    // this._themeSettingsService.config = {
    //   menuColor: colorClass, // menu-dark, menu-light
    // };
  }
  toggleFixMenu(e) {
    if (this.document.body.classList.contains('menu-expanded') && e.currentTarget.checked === true) {
      // show the left aside menu
      this.navbarService.setFixedMenu(false);
      this.document.body.classList.remove('menu-expanded');
      this.document.body.classList.add('menu-collapsed');

      // Change switch icon
      e.srcElement.classList.remove('ft-toggle-right');
      e.srcElement.classList.add('ft-toggle-left');
      this.isCollapsedMenu = true;
    } else {
      this.navbarService.setFixedMenu(true);
      this.document.body.classList.remove('menu-collapsed');
      this.document.body.classList.add('menu-expanded');
      // Change switch icon
      e.srcElement.classList.remove('ft-toggle-left');
      e.srcElement.classList.add('ft-toggle-right');
      this.isCollapsedMenu = false;
    }
  }
  setLayout(layout, e) {

    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    const menuHeader = document.getElementById('menu-header');
    const isSticky = document.getElementsByClassName('sticky-wrapper');
    const element = document.getElementById('sticky-wrapper');

    if (e.currentTarget.checked === true && layout === 'static') {
      // this._renderer.removeClass(headerNavbar.item(0), 'fixed-top');
      this._renderer.addClass(headerNavbar.item(0), 'navbar-static-top');
      this._renderer.addClass(menuHeader, 'navbar-static');
      this._renderer.addClass(footer, 'footer-static');
      this.isStaticLayout = true;
      this._themeSettingsConfig.layout.pattern = 'static';
      element.classList.add('is-static');


      if (this.isboxChecked === false ) {
        this._renderer.removeClass(footer, 'fixed-bottom');
      }

    } else {
      this._themeSettingsConfig.layout.pattern = '';
      this._renderer.removeClass(headerNavbar.item(0), 'navbar-static-top');
      this._renderer.removeClass(footer, 'footer-static');
      this._renderer.removeClass(menuHeader, 'navbar-static');
      this._renderer.removeClass(isSticky.item(0), 'is-static');
      this.isStaticLayout = false;

      if (this.isboxChecked === true) {
        this.boxedLayout();
      }

      if (this.isfixChecked === true) {
        this.fixedLayout();
      }
    }

  }
  setNavigation(navigationClass, event) {
    const navigationElement = document.getElementById('menu-header');
    if (event.target.checked === true) {
      this._themeSettingsService.config = {
        navigation: navigationClass,
      };
    } else if (event.target.checked === false) {
      this._renderer.removeClass(navigationElement, navigationClass);
      this._renderer.removeClass(document.body, navigationClass);
    }

    if (navigationClass === 'menu-icon-right' && event.currentTarget.checked === true) {
      this.isRightSideIcons = true;
    } else if (navigationClass === 'menu-icon-right' && event.currentTarget.checked === false) {
      this.isRightSideIcons = false;
    }
  }

  toggleLayout(layout) {
    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    const element = document.getElementById('sticky-wrapper');

    if (layout === 'boxed' && this.isboxChecked === true) {
      this.boxedLayout();
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
    } else if (layout === 'boxed' && this.isboxChecked === false) {
      this._renderer.removeClass(headerNavbar.item(0), 'container');
      this._renderer.removeClass(headerNavbar.item(0), 'boxed-layout');
      this._renderer.removeClass(document.body, 'boxed-layout');
      this._renderer.removeClass(document.body, 'container');
      element.classList.remove('container');
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
      this._themeSettingsConfig.layout.pattern = '';
    } else if (layout === 'fixed' && this.isfixChecked === true) {
      this.fixedLayout();
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
    } else if (layout === 'fixed' && this.isfixChecked === false) {
      this._renderer.removeClass(footer, 'fixed-bottom');
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
      this._themeSettingsConfig.layout.pattern = '';
    }
  }


  fixedLayout() {
    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    const menuHeader = document.getElementById('menu-header');
    const element = document.getElementById('sticky-wrapper');

    this._renderer.addClass(footer, 'fixed-bottom');
    this._renderer.removeClass(document.body, 'boxed-layout');
    this._renderer.removeClass(headerNavbar.item(0), 'boxed-layout');
    this._renderer.removeClass(headerNavbar.item(0), 'container');
    this._renderer.removeClass(document.body, 'container');
    element.classList.remove('container');

    if (this.isStaticLayout === true) {
      this._renderer.removeClass(headerNavbar.item(0), 'fixed-top');
      this._renderer.removeClass(footer, 'fixed-bottom');
      this._renderer.addClass(headerNavbar.item(0), 'navbar-static-top');
      this._renderer.addClass(menuHeader, 'navbar-static');
      this._renderer.addClass(footer, 'footer-static');
    }

    this.isfixChecked = true;
    this.isboxChecked = false;
    this._themeSettingsConfig.layout.pattern = 'fixed';
  }

  boxedLayout() {
    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    const menuHeader = document.getElementById('menu-header');
    const element = document.getElementById('sticky-wrapper');

    this._renderer.removeClass(footer, 'fixed-bottom');
    this._renderer.addClass(headerNavbar.item(0), 'container');
    this._renderer.addClass(headerNavbar.item(0), 'boxed-layout');
    this._renderer.addClass(document.body, 'boxed-layout');
    this._renderer.addClass(document.body, 'container');
    element.classList.add('container');

    if (this.isStaticLayout === true) {
      this._renderer.removeClass(headerNavbar.item(0), 'fixed-top');
      this._renderer.addClass(headerNavbar.item(0), 'navbar-static-top');
      this._renderer.addClass(menuHeader, 'navbar-static');
      this._renderer.addClass(footer, 'footer-static');
    }
    this.isboxChecked = true;
    this.isfixChecked = false;
    this._themeSettingsConfig.layout.pattern = 'boxed';
  }
}
