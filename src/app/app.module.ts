import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FormsModule } from '@angular/forms';
import { FrontendModule } from './frontend/frontend.module';
import { AdminModule } from './admin/admin.module';

import { APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './shared/app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './frontend/page-not-found/page-not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthService } from './shared/service/auth.service';
import { AppConfig } from './config/app.config';
import { PopupComponent } from './popup/popup.component';
import { PopupService } from './shared/service/popup.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';

export function configLoad(config: AppConfig) { return () => config.load(); }
export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    PopupComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FrontendModule,
    AdminModule,
    FlashMessagesModule.forRoot(),
    NgbModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter ,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: ['http://localhost:4200/']
      }
    })
  ],
  entryComponents: [ ConfirmationDialogComponent ],
  providers: [AuthService, PopupService,ConfirmationDialogService, AuthGuard, AppConfig, { provide: APP_INITIALIZER, useFactory: configLoad, deps: [AppConfig], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
