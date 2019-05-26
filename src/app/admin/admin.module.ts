import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LeftNavbarComponent } from './left-navbar/left-navbar.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from '../admin/footer/footer.component';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../shared/app-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServicesComponent } from './services/services.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ServiceDetailsComponent } from './services/service-details/service-details.component';
import { ServiceListComponent } from './services/service-list/service-list.component';
import { ServiceFormComponent } from './services/service-form/service-form.component';
import { ObjNgForPipe } from "../shared/obj-ng-for.pipe"
import { ObjLengthPipe } from "../shared/obj-length.pipe"


@NgModule({
  declarations: [
    AdminComponent,
    LeftNavbarComponent,
    TopNavbarComponent,
    DashboardComponent,
    FooterComponent,
    AboutUsComponent,
    ServicesComponent,
    BenefitsComponent,
    ContactUsComponent,
    ServiceDetailsComponent,
    ServiceListComponent,
    ServiceFormComponent,
    ObjNgForPipe,
    ObjLengthPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  exports:[
    AdminComponent
  ]
})
export class AdminModule { }
