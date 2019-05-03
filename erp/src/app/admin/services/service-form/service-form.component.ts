import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;

  versionList: any = [];
  versionSubsribe: Subscription;
  apiList: any = [];
  apiSubscription: Subscription;
  apiFieldSubscription: Subscription;
  createConfigSubsribe: Subscription;
  showApiList: boolean = false;
  service_type: string;
  currentLoggedUser: any;
  version: any;
  api_name: any;
  apiFieldList: any = [];
  isEnablePassword: boolean = false;
  isEnableUrlId: boolean = false;
  isEnableUrl: boolean = false;
  user: any;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.loadUser()
    this.service_type = this.route.snapshot.params['id'];
    this.currentLoggedUser = this.authService.loadUser();

    let versionPayload = { "userID": this.currentLoggedUser.name, "service_type": this.service_type };
    this.versionList = [1, 2, 3];
    this.versionSubsribe = this.authService.getVersionList(versionPayload).subscribe((data: { result: {} }) => {
      console.log("versionSubsribe-->", data);
      this.versionList = data.result;
      console.log("versionList-->", this.versionList);
    })
  }

  onAddConfig(form: NgForm){
    const value = form.value;
    console.log("onAddConfig---->",value);
    const configPayload :any = {
      "url":value.url,
      "url_id":value.url_id,
      "api_name":this.api_name,
      "url_password":value.password,
      "client_id":value.client_id,
      "client_secret":value.client_secret,
      "dataset_name":value.dataset_name,
      "data_description":value.data_description,
      "userID":this.user.name,
      "email_update": value.email_update,
      "service_type":this.service_type,
      "version":this.version
    };
    console.log("onAddConfig payload---->",configPayload);
    this.createConfigSubsribe = this.authService.createConfig(configPayload).subscribe((data: { result: {} }) => {
      console.log("create config data -->", data);
    })
  }

  onClear() {
    this.slForm.reset();
  }

  public onChangeVersion(event): void {  // event will give you full breif of action
    this.version = event.target.value;
    console.log("onChangeVersion-->", this.version);
    let versionPayload = {
      "userID": this.currentLoggedUser.name,
      "service_type": this.service_type,
      "version": this.version
    };
    if (this.version != 0) {
      this.apiSubscription = this.authService.getApiList(versionPayload).subscribe((data: any) => {
        this.showApiList = true;
        this.apiList = data.result;
        console.log("apiList-->", this.apiList);
      })
    } else {
      this.showApiList = false;
      this.apiList = [];
    }
  }

  onChangeApi(event): void {
    this.api_name = event.target.value;
    let apiPayload = {
      "userID": this.currentLoggedUser.name,
      "service_type": this.service_type,
      "version": this.version,
      "api_name": this.api_name
    }
    console.log("onChangeApi-->", apiPayload);
    if (this.api_name != 0) {
      this.apiFieldSubscription = this.authService.getApiFields(apiPayload).subscribe((data: any) => {
        this.apiFieldList = data.result;
        this.isEnablePassword = this.checkFormData("password");
        this.isEnableUrlId = this.checkFormData("url_id");
        this.isEnableUrl = this.checkFormData("url");
        console.log("apiList-->", this.apiFieldList);
      })
    } else {
      this.apiFieldList = [];
      this.isEnablePassword = false;
      this.isEnableUrl = false;
      this.isEnableUrlId = false;
    }

  }

  checkFormData(chk): boolean {
    console.log("chk-----"+chk);
    if (this.apiFieldList.includes(chk) > -1) {
      //In the array!
      console.log("In the array");
      return true;
    } else {
      //Not in the array
      console.log("Not in the array");
      return false;
    }
  }
  ngOnDestroy() {
    // Unsubscribe sap list service
    if (this.versionSubsribe) { this.versionSubsribe.unsubscribe(); console.log("version list unsubscribe"); }
    if (this.apiFieldSubscription) { this.apiFieldSubscription.unsubscribe(); console.log("apiFieldSubscription unsubscribe"); }
    if (this.createConfigSubsribe) { this.createConfigSubsribe.unsubscribe(); console.log("createConfigSubsribe unsubscribe"); }

  }




}
