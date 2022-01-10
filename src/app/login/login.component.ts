import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
 })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        public authService: AuthService) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        if (localStorage.getItem('currentUser')) {
            this.authService.doLogout();
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    tryLogin() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        const value = {
            email: this.f.email.value,
            password: this.f.password.value
        };
        this.authService.doLogin(value)
            .then(res => {
                this.setUserInStorage(res);
                localStorage.removeItem('currentLayoutStyle');
                let returnUrl = '/dashboard/sales';
                if (this.returnUrl) {
                  returnUrl = this.returnUrl;
                }
                this.router.navigate([returnUrl]);
            }, err => {
                this.submitted = false;
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
