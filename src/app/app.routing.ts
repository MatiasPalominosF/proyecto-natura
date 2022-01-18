import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './_layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './_layout/private-layout/private-layout.component';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register';
import { LoginComponent } from './login';
import { ChangelogComponent } from './changelog/changelog.component';

const appRoutes: Routes = [
  // Public layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: '', component: LoginComponent }
    ]
  },
  // Private layout
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      { path: 'logout', component: LoginComponent, canActivate: [AuthGuard] },
      { path: 'product', loadChildren: () => import('../app/content/product/product.module').then(m => m.ProductModule), canActivate: [AuthGuard] },
      { path: 'assign', loadChildren: () => import('../app/content/assign/assign.module').then(m => m.AssignModule), canActivate: [AuthGuard] },
      { path: 'worker', loadChildren: () => import('../app/content/worker/worker.module').then(m => m.WorkerModule), canActivate: [AuthGuard] },
      { path: 'dashboard', loadChildren: () => import('../app/content/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
      { path: 'changelog', component: ChangelogComponent, canActivate: [AuthGuard] },
    ],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'dashboard' }
];

export const routing = RouterModule.forRoot(appRoutes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' });
