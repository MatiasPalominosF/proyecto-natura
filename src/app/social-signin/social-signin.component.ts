import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-signin',
  templateUrl: './social-signin.component.html',
  styleUrls: ['./social-signin.component.css']
})
export class SocialSigninComponent implements OnInit {

  private homeURL = '/home';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public authService: AuthService) { }

  ngOnInit() {
  }

  tryAnonymousLogin() {
    return this.authService.doAnonymousLogin();
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
        this.setUserInStorage(res);
        this.router.navigate([this.homeURL]);
      }, err => {
        this.alertService.error(err.message);
      });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
      .then(res => {
        this.setUserInStorage(res);
        this.router.navigate([this.homeURL]);
      }, err => {
        this.alertService.error(err.message);
      });
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin()
      .then(res => {
        this.setUserInStorage(res);
        this.router.navigate([this.homeURL]);
      }, err => {
        console.log(err);
        this.alertService.error(err.message);
      });
  }

  tryGithubLogin() {
    this.authService.doGitHubLogin()
      .then(res => {
        this.setUserInStorage(res);
        this.router.navigate([this.homeURL]);
      }, err => {
        console.log(err);
        this.alertService.error(err.message);
      });
  }

  setUserInStorage(res) {
    if (res.user) {
      localStorage.setItem('currentUser', JSON.stringify(res.user));
    } else {
      localStorage.setItem('currentUser', JSON.stringify(res));
    }
  }

}
