﻿import { Component, Inject, OnInit , Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationEnd, NavigationCancel } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { AppConstants } from './_helpers/app.constants';
import { MenuSettingsService } from './_layout/settings/menu-settings.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit {
  public _menuSettingsConfig: any;
  public _unsubscribeAll: Subject<any>;
  private _unsubscribeAllMenu: Subject<any>;
  showContent = false;
  public title;
  constructor(private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    public loader: LoadingBarService,
    private deviceService: DeviceDetectorService,
    public _menuSettingsService: MenuSettingsService,
    private titleService: Title
  ) {
    this._unsubscribeAll = new Subject();
    this._unsubscribeAllMenu = new Subject();
    this.setTitle();
  }
  ngOnInit() {
    this._menuSettingsService.config
      .pipe(takeUntil(this._unsubscribeAllMenu))
      .subscribe((config) => {
        this._menuSettingsConfig = config;
      });
    // page progress bar percentage
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.loader.start();
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loader.increment(35);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loader.increment(75);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // set page progress bar loading to end on NavigationEnd event router
        this.loader.complete();
        this.showContent = true;
        // close menu for mobile view
        if (this.deviceService.isMobile() || window.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH) {
          if (document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
            document.body.classList.add('menu-close');
          }
        }
      }
    });
  }

  setTitle() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        for (let i = 0; i < this._menuSettingsConfig.vertical_menu.items.length; i++) {
          if (!this._menuSettingsConfig.vertical_menu.items[i].submenu &&
            this._menuSettingsConfig.vertical_menu.items[i].page === this.router.url) {
            this.title = this._menuSettingsConfig.vertical_menu.items[i].title;
            break;
          } else if (this._menuSettingsConfig.vertical_menu.items[i].submenu) {
            // Level 1 menu
            for (let j = 0; j < this._menuSettingsConfig.vertical_menu.items[i].submenu.items.length; j++) {
              if (!this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].submenu &&
                this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].page === this.router.url) {
                this.title = this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].title;
                break;
              } else if (this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].submenu) {
                // Level 2 menu
                for (let k = 0; k < this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].submenu.items.length; k++) {
                  if (this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].submenu.items[k].page === this.router.url) {
                    this.title = this._menuSettingsConfig.vertical_menu.items[i].submenu.items[j].submenu.items[k].title;
                  }
                }
              }
            }
          }
        }
        if (this.title && this.router.url !== '/') {
          this.titleService.setTitle(this.title + '- Modern Admin - Angular 11+ Bootstrap 4 Admin Dashboard Template');
        } else {
          if (this.router.url === '/') {
            this.title = 'Login with Background Image';
            this.titleService.setTitle(this.title + '- Modern Admin - Angular 11+ Bootstrap 4 Admin Dashboard Template');
            this.title = '';
          } else if (this.router.url === '/login') {
            this.title = 'Login with Background Image';
            this.titleService.setTitle(this.title + '- Modern Admin - Angular 11+ Bootstrap 4 Admin Dashboard Template');
            this.title = '';
          } else if (this.router.url === '/register') {
            this.title = 'Register with Background Image';
            this.titleService.setTitle(this.title + '- Modern Admin - Angular 11+ Bootstrap 4 Admin Dashboard Template');
            this.title = '';
          }
        }

      }
    });
  }
}
