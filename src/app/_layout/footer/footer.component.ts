import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { ThemeSettingsService } from '../settings/theme-settings.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationEnd, NavigationStart, Event } from '@angular/router';
import { FullLayoutComponent } from '../full-layout/full-layout.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public showFooter: boolean;

  private _unsubscribeAll: Subject<any>;
  private _themeSettingsConfig: any;

  constructor(private renderer: Renderer2,
    private _renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private _themeSettingsService: ThemeSettingsService) {
    this._unsubscribeAll = new Subject();
    this.router.events.subscribe((event: Event) => {
      const footerElement = document.getElementsByClassName('footer');
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        if ((this.router.url === '/chats' || this.router.url === '/email') && footerElement.item(0)) {
          this._renderer.removeClass(footerElement.item(0), 'footer-static');
          this.renderer.addClass(footerElement.item(0), 'fixed-bottom');
        } else if (footerElement.item(0)) {
          this._renderer.removeClass(footerElement.item(0), 'fixed-bottom');
          this.renderer.addClass(footerElement.item(0), 'footer-static');
        }
      }
    });
  }

  ngOnInit() {
    if ((this.router.url.indexOf('WithNavbar') >= 0) || (this.router.url.indexOf('Advanced') >= 0) ||
      (this.router.url.indexOf('searchPage') >= 0)) {
      this.showFooter = false;
    } else if (FullLayoutComponent) {
      this.showFooter = true;
    } else {
      this.showFooter = true;
    }
    // Subscribe to config changes
    this._themeSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._themeSettingsConfig = config;
      });

    const footerElement = document.getElementsByClassName('footer');
    if (this.router.url === '/chats' || this.router.url === '/email' && footerElement.item(0)) {
      this._renderer.removeClass(footerElement.item(0), 'footer-static');
      this._renderer.addClass(footerElement.item(0), 'fixed-bottom');
    }

  }
}
