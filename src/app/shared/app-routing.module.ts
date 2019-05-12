import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { FrontendComponent } from '../frontend/frontend.component';
import { HomeComponent } from '../frontend/home/home.component';
import { AboutUsComponent } from '../frontend/about-us/about-us.component';
import { ServicesComponent } from '../frontend/services/services.component';
import { BenefitsComponent } from '../frontend/benefits/benefits.component';
import { ContactUsComponent } from '../frontend/contact-us/contact-us.component';
import { AdminComponent } from '../admin/admin.component';
import { PageNotFoundComponent } from '../frontend/page-not-found/page-not-found.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { AboutUsComponent as AdminAboutUsComponent } from '../admin/about-us/about-us.component';
import { ServicesComponent as AdminServicesComponent } from '../admin/services/services.component';
import { BenefitsComponent as AdminBenefitsComponent } from '../admin/benefits/benefits.component';
import { ContactUsComponent as AdminContactUsComponent } from '../admin/contact-us/contact-us.component';


const routes: Routes = [
  {
    path: '', component: FrontendComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'benefits', component: BenefitsComponent },
      { path: 'contact-us', component: ContactUsComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'about-us', component: AdminAboutUsComponent },
      { path: 'services', component: AdminServicesComponent },
      { path: 'services/:id', component: AdminServicesComponent },
      { path: 'benefits', component: AdminBenefitsComponent },
      { path: 'contact-us', component: AdminContactUsComponent },
    ]
  },
  {
    path: 'not-found', component: PageNotFoundComponent
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
