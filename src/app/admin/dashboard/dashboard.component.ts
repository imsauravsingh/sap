import { Component, OnInit, AfterContentInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterContentInit {
  user: JSON;
  SAP_LIST: [];
  sap_list_subscription: Subscription

  constructor(private authService: AuthService) { }

  ngOnInit(){}

  ngAfterContentInit() {
    this.user = this.authService.loadUser()

    // Subscribe sap list service
    this.sap_list_subscription = this.authService.getSAPList(this.user)
      .subscribe((data: any) => {
        this.SAP_LIST = data.result;
        console.log("this.SAP_LIST", this.SAP_LIST);
      });
  }

  ngOnDestroy() {
    // Unsubscribe sap list service
    this.sap_list_subscription.unsubscribe();
    console.log("unsubscribe sap list");
  }


}
