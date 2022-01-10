import { Component, OnInit, Renderer2, Inject, NgZone, ViewChild, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavbarService } from 'src/app/_services/navbar.service';
import { ThemeSettingsService } from '../settings/theme-settings.service';
import { MenuSettingsService } from '../settings/menu-settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from 'src/app/_helpers/app.constants';

declare var require: any;
const colors = require('../../../assets/data/customizer/customizerColor.json');

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.css']
})
export class CustomizerComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  private _unsubscribeAllMenu: Subject<any>;
  public _themeCustomizerConfig: any;
  public _menuCustomizerConfig: any;
  public _themeSettingsConfig: any;
  public selectColorClass: string;
  public activebutton: any;

  public isCollapsedMenu = false;
  public isfixChecked = false;
  public isboxChecked = false;
  public isStaticLayout = false;

  public isRightSideIcons = false;
  public isBorderedNavigation = false;
  public isFlippedNavigation = false;
  public isCollapsibleNavigation = false;
  public isStaticNavigation = false;

  public isStaticTop = false;

  public config: PerfectScrollbarConfigInterface = { wheelPropagation: false };
  collapsed = true;

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: true }) directiveRef?: PerfectScrollbarDirective;

  constructor(
    private _renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private navbarService: NavbarService,
    private _themeSettingsService: ThemeSettingsService,
    private _menuSettingsService: MenuSettingsService
  ) {
    this._unsubscribeAll = new Subject();
    this._unsubscribeAllMenu = new Subject();
  }

  ngOnInit() {
    // Subscribe to config changes
    this._themeSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._themeCustomizerConfig = config;
      });
    this._menuSettingsService.config
      .pipe(takeUntil(this._unsubscribeAllMenu))
      .subscribe((config) => {
        this._menuCustomizerConfig = config;
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

  setLayout(layout, e) {

    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    const mainMenu = document.getElementsByClassName('main-menu');

    if (layout === 'static' && e.currentTarget.checked === true) {
      this.staticLayout(e);
    } else if (layout === 'static' && e.currentTarget.checked === false) {
      this._themeSettingsConfig.layout.pattern = '';
      this._renderer.removeClass(headerNavbar.item(0), 'navbar-static-top');
      this._renderer.removeClass(footer, 'footer-static');
      this._renderer.addClass(headerNavbar.item(0), 'fixed-top');
      this._renderer.addClass(document.body, 'fixed-navbar');
      this._renderer.addClass(mainMenu.item(0), 'menu-fixed');
      this.isStaticLayout = false;
    }
  }

  toggleFixMenu(e) {

    const toggleIcon = document.getElementsByClassName('toggle-icon');

    if (this.document.body.classList.contains('menu-expanded') && e.currentTarget.checked === true) {
      this._themeCustomizerConfig.navbar = 'collapse';
      // show the left aside menu
      this.navbarService.setFixedMenu(false);
      this.document.body.classList.remove('menu-expanded');
      this.document.body.classList.add('menu-collapsed');
      // Change switch icon
      this._renderer.removeClass(toggleIcon.item(0), 'ft-toggle-right');
      this._renderer.addClass(toggleIcon.item(0), 'ft-toggle-left');
      this.isCollapsedMenu = true;
    } else {
      this._themeCustomizerConfig.navbar = 'expand';
      this.navbarService.setFixedMenu(true);
      this.document.body.classList.remove('menu-collapsed');
      this.document.body.classList.add('menu-expanded');
      // Change switch icon
      this._renderer.removeClass(toggleIcon.item(0), 'ft-toggle-left');
      this._renderer.addClass(toggleIcon.item(0), 'ft-toggle-right');
      this.isCollapsedMenu = false;
    }
    setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
    this.resetOpenMenu();
  }

  resetOpenMenu() {
    for (let i = 0; i < this._menuCustomizerConfig.vertical_menu.items.length; i++) {
      const menu = this._menuCustomizerConfig.vertical_menu.items[i];
      if (!menu.submenu) {
        menu['isOpen'] = false;
        menu['isActive'] = false;
        menu['hover'] = false;
      } else if (menu.submenu) {
        for (let j = 0; j < menu.submenu.items.length; j++) {
          menu['isOpen'] = false;
          menu['isActive'] = false;
          menu['hover'] = false;
          menu.submenu.items[j]['isOpen'] = false;
        }
      }
    }
  }

  changeNavbarFontColor($event: NgbTabChangeEvent) {
    const headerElement = document.getElementsByClassName('header-navbar');
    const navbarHeaderElement = document.getElementsByClassName('navbar-header');
    if ($event.nextId === 'semi-dark') {
      this._renderer.removeClass(headerElement.item(0), 'navbar-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-light');
      this._renderer.removeClass(headerElement.item(0), 'navbar-light');
      this._renderer.addClass(headerElement.item(0), 'navbar-semi-dark');
      this._themeCustomizerConfig.colorTheme = 'semi-dark';
    } else if ($event.nextId === 'semi-light') {
      this._renderer.removeClass(headerElement.item(0), 'navbar-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-light');
      this._renderer.addClass(headerElement.item(0), 'navbar-semi-light');
      this._themeCustomizerConfig.colorTheme = 'semi-light';
    } else if ($event.nextId === 'dark') {
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-light');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-light');
      this._renderer.addClass(headerElement.item(0), 'navbar-dark');
      this._themeCustomizerConfig.colorTheme = 'dark';
    } else if ($event.nextId === 'light') {
      this._renderer.removeClass(headerElement.item(0), 'navbar-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-dark');
      this._renderer.removeClass(headerElement.item(0), 'navbar-semi-light');
      this._renderer.addClass(headerElement.item(0), 'navbar-light');
      this._themeCustomizerConfig.colorTheme = 'light';
    }

    this._themeSettingsService.config = {
      color: ''
    };
  }

  setMenuColor(colorClass, event) {
    const darkMenuButton = document.getElementById('dark-menu');
    const lightMenuButton = document.getElementById('light-menu');

    if (event.currentTarget.className === 'btn btn-outline-info _dark') {
      this._renderer.removeClass(lightMenuButton, 'active');
      this._renderer.addClass(darkMenuButton, 'active');
    } else if (event.currentTarget.className === 'btn btn-outline-info _light') {
      this._renderer.removeClass(darkMenuButton, 'active');
      this._renderer.addClass(lightMenuButton, 'active');
    }

    this._themeSettingsService.config = {
      menuColor: colorClass, // light-menu, dark-menu
    };
  }

  setNavigation(navigationClass, event) {
    const navigationElement = document.getElementById('main-menu');
    const element = document.getElementById('customizer');
    if (event.target.checked === true && navigationClass !== 'menu-collapsible') {
      this._themeSettingsService.config = {
        navigation: navigationClass
      };
      if (navigationClass === 'menu-flipped') {
        this._renderer.removeClass(element, 'open');
      } else if (navigationClass === 'menu-static') {
        this._renderer.removeClass(navigationElement, 'menu-fixed');
      }
    } else if (event.target.checked === false && navigationClass !== 'menu-collapsible') {
      this._themeSettingsConfig.navigation = AppConstants.NAVIGATION_TYPE_ACCORDATION;
      this._renderer.removeClass(navigationElement, navigationClass);
      this._renderer.removeClass(document.body, navigationClass);

      if (navigationClass === 'menu-static') {
        this._renderer.addClass(navigationElement, 'menu-fixed');
      }
    }

    if (event.target.checked === true && navigationClass === 'menu-collapsible') {
      this._themeSettingsConfig.navigation = AppConstants.NAVIGATION_TYPE_ACCORDATION;
      this._renderer.removeClass(navigationElement, navigationClass);
    } else if (event.target.checked === false && navigationClass === 'menu-collapsible') {
      this._themeSettingsService.config = {
        navigation: navigationClass
      };
    }

    if (navigationClass === 'menu-icon-right' && event.currentTarget.checked === true) {
      this.isRightSideIcons = true;
    } else if (navigationClass === 'menu-icon-right' && event.currentTarget.checked === false) {
      this.isRightSideIcons = false;
    }
    if (navigationClass === 'menu-bordered' && event.currentTarget.checked === true) {
      this.isBorderedNavigation = true;
    } else if (navigationClass === 'menu-bordered' && event.currentTarget.checked === false) {
      this.isBorderedNavigation = false;
    }

    if (navigationClass === 'menu-flipped' && event.currentTarget.checked === true) {
      this.isFlippedNavigation = true;
    } else if (navigationClass === 'menu-flipped' && event.currentTarget.checked === false) {
      this.isFlippedNavigation = false;
    }

    if (navigationClass === 'menu-collapsible' && event.currentTarget.checked === true) {
      this.isCollapsibleNavigation = true;
    } else if (navigationClass === 'menu-collapsible' && event.currentTarget.checked === false) {
      this.isCollapsibleNavigation = false;
    }

    if (navigationClass === 'menu-static' && event.currentTarget.checked === true) {
      this.isStaticNavigation = true;
    } else if (navigationClass === 'menu-static' && event.currentTarget.checked === false) {
      this.isStaticNavigation = false;
    }
  }

  setNavbar(event) {
    const navbarElement = document.getElementsByClassName('header-navbar');
    const navigationElement = document.getElementById('main-menu');
    if (event.target.checked === true) {
      this._renderer.removeClass(document.body, 'fixed-navbar');
      this._renderer.removeClass(navbarElement.item(0), 'fixed-top');
      this._renderer.removeClass(navigationElement, 'menu-fixed');
      this._renderer.addClass(navbarElement.item(0), 'navbar-static-top');
      this._renderer.addClass(navigationElement, 'menu-static');
      this.isStaticTop = true;
    } else if (event.target.checked === false) {
      this._renderer.removeClass(navbarElement.item(0), 'navbar-static-top');
      this._renderer.removeClass(navigationElement, 'menu-static');
      this._renderer.addClass(document.body, 'fixed-navbar');
      this._renderer.addClass(navbarElement.item(0), 'fixed-top');
      this._renderer.addClass(navigationElement, 'menu-fixed');
      this.isStaticTop = false;
    }
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

  toggleLayout(layout) {
    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    if (layout === 'boxed' && this.isboxChecked === false) {
      this.boxedLayout();
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
    } else if (layout === 'boxed' && this.isboxChecked === true) {
      this._renderer.removeClass(headerNavbar.item(0), 'container');
      this._renderer.removeClass(headerNavbar.item(0), 'boxed-layout');
      this._renderer.removeClass(document.body, 'boxed-layout');
      this._renderer.removeClass(document.body, 'container');
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
      this._themeSettingsConfig.layout.pattern = '';
    } else if (layout === 'fixed' && this.isfixChecked === false) {
      this.fixedLayout();
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
    } else if (layout === 'fixed' && this.isfixChecked === true) {
      this._renderer.removeClass(footer, 'fixed-bottom');
      this._themeSettingsConfig.layout.pattern = '';
      setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
    }
  }

  fixedLayout() {

    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    this._renderer.removeClass(headerNavbar.item(0), 'container');
    this._renderer.removeClass(headerNavbar.item(0), 'boxed-layout');
    this._renderer.removeClass(document.body, 'boxed-layout');
    this._renderer.removeClass(document.body, 'container');
    this._renderer.addClass(footer, 'fixed-bottom');

    if (this.isStaticLayout === true) {
      this._renderer.addClass(headerNavbar.item(0), 'fixed-top');
      this._renderer.addClass(document.body, 'fixed-navbar');
      this._renderer.removeClass(footer, 'fixed-bottom');
    }

    this.isfixChecked = true;
    this.isboxChecked = false;
    this._themeSettingsConfig.layout.pattern = 'fixed';
  }

  boxedLayout() {
    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');

    this._renderer.removeClass(footer, 'fixed-bottom');

    this._renderer.addClass(headerNavbar.item(0), 'container');
    this._renderer.addClass(headerNavbar.item(0), 'boxed-layout');
    this._renderer.addClass(headerNavbar.item(0), 'fixed-top');
    this._renderer.addClass(document.body, 'boxed-layout');
    this._renderer.addClass(document.body, 'container');

    if (this.isStaticLayout === true) {
      this._renderer.removeClass(headerNavbar.item(0), 'fixed-top');
      this._renderer.removeClass(document.body, 'fixed-navbar');
    }
    this.isboxChecked = true;
    this.isfixChecked = false;
    this._themeSettingsConfig.layout.pattern = 'boxed';
  }

  staticLayout(e) {
    const footer = document.getElementById('footer');
    const headerNavbar = document.getElementsByClassName('header-navbar');
    const mainMenu = document.getElementsByClassName('main-menu');

    this._renderer.removeClass(document.body, 'fixed-navbar');
    this._renderer.removeClass(headerNavbar.item(0), 'fixed-top');
    this._renderer.removeClass(mainMenu.item(0), 'menu-fixed');
    this._renderer.addClass(headerNavbar.item(0), 'navbar-static-top');
    this._renderer.addClass(footer, 'footer-static');
    this._renderer.removeClass(footer, 'fixed-bottom');
    this.isStaticLayout = true;

    this._themeSettingsConfig.layout.pattern = 'static';
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.document.body.classList.contains('menu-expanded')) {
      this.collapsed = false;
    } else {
      this.collapsed = true;
    }
  }
}
