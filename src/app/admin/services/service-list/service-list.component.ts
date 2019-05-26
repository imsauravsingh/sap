import { Component, OnInit, Input, AfterContentInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription, Observable } from 'rxjs';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import $ from 'jquery';

import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

declare var bootstrapModalMethod: any;

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit, AfterContentInit, OnDestroy {
  configForm: FormGroup;

  @Input() updateConfigList: string;

  page: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;
  serviceId: string;
  sap_list_subscription: Subscription;
  config_log_subscription: Subscription;
  update_config_subscription: Subscription;
  read_scheduler_subscription: Subscription;
  serviceList: any=[];
  user: any;
  payload: { service_type: string, userID: string, target: string };
  closeResult: string;
  viewLogs: any;
  viewLogsData: any;
  updateApiFieldList: any = [];
  removedApiFieldList: any = [];
  apiListConfigForm: any;
  serviceListData: any=[];
  schedularData: any;
  formFields: any = [];
  runNowLable:any = [];



  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.removedApiFieldList = [
      'active',
      'api_name',
      'delete_flag',
      'last_update_time',
      'mode',
      'service_type',
      'user_id',
      'version'
    ];
    this.configForm = this.formBuilder.group({});

    // this.configForm.statusChanges.subscribe(
    //   (status) =>{
    //     console.log("status change--->",status)
    //   }
    //   );

    // this.
    // configForm.
    // valueChanges.
    // subscribe(form => {
    //   sessionStorage.setItem('configForm', JSON.stringify(form));
    // });
  }

  private applyFormValues(group, formValues) {
    Object.keys(formValues).forEach(key => {
      let formControl = <FormControl>group.controls[key];

      if (formControl instanceof FormGroup) {
        this.applyFormValues(formControl, formValues[key]);
      } else {
        formControl.setValue(formValues[key]);
      }
    });
  }

  ngAfterContentInit() {
    bootstrapModalMethod();

    this.getSapList();
    //this.readSchedular();

  }

  readSchedular() {
    this.serviceId = this.route.snapshot.params['id'];
    let payload = { "userID": (this.user.name), "service_type": this.serviceId };

    this.read_scheduler_subscription = this.authService.readSchedule(payload)
      .subscribe((data: any) => {
        this.schedularData = data;
      });

  }

  getSapList() {
    // Subscribe sap list service
    this.serviceList=[];
    this.serviceId = this.route.snapshot.params['id'];
    this.user = this.authService.loadUser()
    this.payload = { "userID": (this.user.name), "service_type": this.serviceId, "target":"domo" };
    this.sap_list_subscription = this.authService.getServiceList(this.payload)
      .subscribe((data: any) => {

        //this.serviceListData = this.serviceList = data.result;
        data.result.filter((val)=>{ val.filter((value)=>{ this.serviceList.push(value); }) })
        this.serviceListData = this.serviceList;

          console.log("this.serviceListData--->", this.serviceListData, this.serviceList);
      });
  }

  receiveUpdatedConfigList($event) {
    this.getSapList();
  }


  ngOnDestroy() {
    // Unsubscribe sap list service
    if (this.serviceId) { this.sap_list_subscription.unsubscribe(); console.log("service list unsubscribe sap list"); }
    if (this.config_log_subscription) { this.config_log_subscription.unsubscribe(); console.log("service list unsubscribe sap list"); }
    if (this.update_config_subscription) { this.update_config_subscription.unsubscribe(); console.log("update_config_subscription update form unsubscribe sap list"); }
    if (this.read_scheduler_subscription) { this.read_scheduler_subscription.unsubscribe(); console.log("read_scheduler_subscription read schedular unsubscribe sap list"); }

  }

  viewServiceLogs(i: number) {
    let data = this.serviceList[i];
    let data_set_name = data.data_set_name;
    this.viewLogsData = [];

    // Subscribe sap list service
    let payload = { "userID": (this.user.name), "dataset_name": data_set_name, "service_type": data.service_type};

    this.config_log_subscription = this.authService.getConfigLogs(payload)
      .subscribe((data: any) => {
        this.viewLogsData = data.result;
        this.getPageFromService(1);
      });

    return this.viewLogsData;
  }

  getPageFromService(page) {
    this.viewLogs = ((typeof this.viewLogsData != "string") ? this.viewLogsData.slice(((page - 1) * this.pageSize), (page * this.pageSize)) : []);
    this.collectionSize = ((typeof this.viewLogsData != "string") ? this.viewLogsData.length : 0);
  }

  updateStatus(index) {
    let data = this.serviceList[index];
    let data_set_name = data.data_set_name;

    let payload = { "userID": (this.user.name), "dataset_name": data_set_name, "api_name":data.api_name, "service_type":data.service_type }

    this.authService.disableConfig(payload)
      .subscribe((data: any) => {
        if (this.serviceList[index]['active'] == "Activated") {
          this.serviceList[index]['active'] = "Deactivated";
        } else {
          this.serviceList[index]['active'] = "Activated";
        }
      });

  }

  changeMode(index) {
    let data = Object.assign({},this.serviceList[index]);
    console.log("data---",data);
    let data_set_name = data.data_set_name;

    let payload = { "userID": (this.user.name), "dataset_name": data_set_name, "api_name":data.api_name, "service_type":data.service_type }
    this.authService.changeMode(payload)
      .subscribe((data: any) => {
        if (this.serviceList[index]['mode'] == 0) {
          this.serviceList[index]['mode'] = 1;
        } else {
          this.serviceList[index]['mode'] = 0;
        }
      });

  }

  runNow(index) {
    this.runNowLable[index] = 0;
    let data = Object.assign({},this.serviceList[index]);
    console.log("data---",data);
    let data_set_name = data.data_set_name;

    let payload = { "userID": (this.user.name), "dataset_name": data_set_name, "target":data.target }
    this.authService.runNow(payload)
      .subscribe((data: any) => {
        console.log("runNow data---->",data);
        this.runNowLable[index] = 1;
        this.confirmationDialogService.confirm('Run Now Confirmation!', data.result, false, 'Ok');
      });

  }

  checkConfigNotExist(fieldName): boolean {
    if (this.removedApiFieldList.indexOf(fieldName) != -1) return false;
    else return true;
  }

  onAddConfirForm(key, val) {
    this.configForm = new FormGroup({
      [key]: new FormControl(val, [Validators.required])
    });
  }

  getConfigByDataSetName(i) {

    this.updateApiFieldList = [];
    let data = Object.assign({}, this.serviceList[i]);
    this.apiListConfigForm={};

    if (data) {
      this.apiListConfigForm = { "userID": data.user_id, "dataset_name": data.data_set_name, "service_type": data.service_type, "target":data.target };
      let apiListConfig = Object.entries(data);

      apiListConfig.map((val) => {
        if (this.checkConfigNotExist(val[0]) == true) {
          if (val[0] == 'data_set_id' || val[0] == 'data_set_name' || val[0] == 'target') {
            this.formFields[val[0]] = [{ value: val[1], disabled: true }, Validators.required];
          } else if (val[0] == 'email_list') {
            let email: any = val[1];
            email = email.pop();
            this.formFields[val[0]] = [email, [Validators.required, Validators.email]];
          } else {
            this.formFields[val[0]] = [val[1], Validators.required];
          }
          this.updateApiFieldList.push(val);
        } else {
          delete data[val[0]];
        }
      });

      this.configForm = this.formBuilder.group(this.formFields);
    }
  }

  onUpdateConfig() {
    if (this.configForm.value['email_list']) {
      this.configForm.value['email_update'] = this.configForm.value['email_list']
      delete this.configForm.value['email_list'];
    }

    const configPayload: any = { ...this.configForm.value, ...this.apiListConfigForm };
    this.update_config_subscription = this.authService.updateConfig(configPayload).subscribe((data: { result: {} }) => {
      $('#formUpdateMessage').html('<div class="alert alert-success" role="alert">' + data.result + '</div>');
      setTimeout(function () {
        $('#formUpdateMessage').fadeOut('fast');
      }, 8000); // <-- time in milliseconds
      this.getSapList();
    })
  }

  destroyFormValues() {
    sessionStorage.removeItem('configForm');
  }

  deleteConfig(index) {
    let data = Object.assign({},this.serviceList[index]);
    let data_set_name = data.data_set_name;

    this.confirmationDialogService.confirm('Delete Configuration!', 'Do you really want to delete ' + data_set_name + '  ?')
      .then((confirmed) => {
        if (confirmed) {
          let payload = { "userID": (this.user.name), "dataset_name": data_set_name, "api_name":data.api_name, "service_type":data.service_type }
          this.authService.deleteConfig(payload)
            .subscribe((data: any) => {
              if (this.serviceList[index]['delete_flag'] == 0) {
                this.serviceList[index]['delete_flag'] = 1;
              } else {
                this.serviceList[index]['delete_flag'] = 0;
              }
              this.serviceList.splice(index, 1);
            });

        }

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  changePasswordToggle(input: any) {
    this.authService.togglePassword(input);
  }


}
