import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import $ from 'jquery';


@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;

  @Output() udpateConfigList = new EventEmitter<boolean>();
  state$: Observable<object>;

  versionList: any = [];
  versionSubsribe: Subscription;
  targetSubsribe: Subscription;
  apiList: any = [];
  apiSubscription: Subscription;
  apiFieldSubscription: Subscription;
  targetFieldSubscription: Subscription;
  createConfigSubsribe: Subscription;
  showApiList: boolean = false;
  service_type: string;
  currentLoggedUser: any;
  version: any;
  api_name: any;
  apiFieldList: any = [];
  targetFieldList: any = [];
  user: any;
  activatedRoute: any;
  targetList: any = [];
  target:any;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.state$ = this.route.params.pipe(map(p => p.id));


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

    let targetPayload = { "userID": this.currentLoggedUser.name };
    this.targetSubsribe = this.authService.getTargets(targetPayload).subscribe((data: { result: {} }) => {
      console.log("targetPayload-->", data);
      this.targetList = data.result;
      console.log("this.targetList-->", this.targetList);
    })

  }

  onAddConfig(form: NgForm) {
    const value = form.value;
    console.log("onAddConfig---->", value);
    const requiredPayload: any = {
      "api_name": this.api_name,
      "userID": this.user.name,
      "service_type": this.service_type,
      "version": this.version,
      "target":this.target
    };
    const configPayload: any = { ...form.value, ...requiredPayload }
    console.log("onAddConfig payload---->", configPayload);
    this.createConfigSubsribe = this.authService.createConfig(configPayload).subscribe((data: { result: {} }) => {
      console.log("create config data -->", data);

      $('#formCreateMessage').html('<div class="alert alert-success" role="alert">' + data.result + '</div>');
      setTimeout(function () {
        $('#formCreateMessage').fadeOut('fast');
      }, 8000); // <-- time in milliseconds

      this.udpateConfigList.emit();
      this.onClear();
    })
  }

  changePasswordToggle(input: any){
    this.authService.togglePassword(input);
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  onClear() {
    this.slForm.reset();
  }

  public onChangeVersion(event): void {  // event will give you full breif of action
    this.apiFieldList = [];
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

  onChangeTarget(event): void {
    this.targetFieldList = [];
    this.target = event.target.value;
    console.log("onChangeTarget-->", this.target);
    let targetFieldPayload = {
      "userID": this.currentLoggedUser.name,
      "target": this.target
    };
    if (this.target != 0) {
      this.targetFieldSubscription = this.authService.getTargetFields(targetFieldPayload).subscribe((data: any) => {
        this.targetFieldList = data.result;
        console.log("apiList-->", this.targetFieldList);
      })
    } else {
      this.targetFieldList = [];
    }
  }

  onChangeApi(event): void {
    this.apiFieldList = [];
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
        console.log("apiList-->", this.apiFieldList);
      })
    } else {
      this.apiFieldList = [];
    }

  }

  ngOnDestroy() {
    // Unsubscribe sap list service
    if (this.versionSubsribe) { this.versionSubsribe.unsubscribe(); console.log("version list unsubscribe"); }
    if (this.apiFieldSubscription) { this.apiFieldSubscription.unsubscribe(); console.log("apiFieldSubscription unsubscribe"); }
    if (this.createConfigSubsribe) { this.createConfigSubsribe.unsubscribe(); console.log("createConfigSubsribe unsubscribe"); }
    if (this.targetSubsribe) { this.targetSubsribe.unsubscribe(); console.log("target list unsubscribe"); }
    if (this.targetFieldSubscription) { this.targetFieldSubscription.unsubscribe(); console.log("target field list unsubscribe"); }

  }




}
