import { Component, OnInit, Input, AfterContentInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription, Observable } from 'rxjs';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import $ from 'jquery';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

declare var bootstrapModalMethod: any;

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit, AfterContentInit, OnDestroy {
  configForm: FormGroup;

  @Input() updateConfigList: string;

  page :number = 1;
  pageSize: number = 10;
  collectionSize: number = 70;
  serviceId: string;
  sap_list_subscription: Subscription;
  config_log_subscription: Subscription;
  update_config_subscription: Subscription;
  read_scheduler_subscription: Subscription;
  serviceList: any;
  user: any;
  payload: { service_type: string, userID: string };
  closeResult: string;
  viewLogs: any;
  viewLogsData: any;
  updateApiFieldList: any=[];
  removedApiFieldList: any = [];
  apiListConfigForm: any;
  serviceListData: any;
  schedularData: any;


  constructor(private route: ActivatedRoute, private authService: AuthService, private confirmationDialogService: ConfirmationDialogService) {}

  ngOnInit(){
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
    this.configForm = new FormGroup({
        // 'active': new FormControl({value:null, disabled: true}, [Validators.required]),
        // 'api_name': new FormControl({value:null, disabled: true}, [Validators.required]),
        'client_id': new FormControl(null, [Validators.required]),
        'client_secret': new FormControl(null, [Validators.required]),
        'data_desc': new FormControl(null, [Validators.required]),
        'data_set_id': new FormControl({value:null, disabled: true}, [Validators.required]),
        'data_set_name': new FormControl({value:null, disabled: true}, [Validators.required]),
        // 'delete_flag': new FormControl({value:null, disabled: true}, [Validators.required]),
        // 'last_update_time': new FormControl({value:null, disabled: true}, [Validators.required]),
        // 'mode': new FormControl({value:null, disabled: true}, [Validators.required]),
        // 'service_type': new FormControl({value:null, disabled: true}, [Validators.required]),
        'url': new FormControl(null),
        'url_id': new FormControl(null),
        'url_password': new FormControl(null),
        // 'user_id': new FormControl({value:null, disabled: true}, [Validators.required]),
        // 'version': new FormControl({value:null, disabled: true}, [Validators.required]),
        'email_list': new FormControl(null, [Validators.required, Validators.email])
    });

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

  private applyFormValues (group, formValues) {
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

  readSchedular(){
    this.serviceId = this.route.snapshot.params['id'];
    let payload = { "userID": (this.user.name), "service_type": this.serviceId };

    this.read_scheduler_subscription = this.authService.readSchedule(payload)
    .subscribe((data: any) => {
      this.schedularData = data;
      console.log("this.schedularData-->", this.schedularData);
    });

  }

  getSapList(){
    // Subscribe sap list service
    this.serviceId = this.route.snapshot.params['id'];
    this.user = this.authService.loadUser()
    this.payload = { "userID": (this.user.name), "service_type": this.serviceId };
    this.sap_list_subscription = this.authService.getServiceList(this.payload)
      .subscribe((data: any) => {
        this.serviceListData = this.serviceList = data.result;
        console.log("this.serviceList-->", this.serviceList);
      });
  }

  receiveUpdatedConfigList($event) {
    console.log("receiveUpdatedConfigList---->", $event);
    this.getSapList();
  }


  ngOnDestroy() {
    // Unsubscribe sap list service
    if (this.serviceId) { this.sap_list_subscription.unsubscribe(); console.log("service list unsubscribe sap list"); }
    if (this.config_log_subscription) { this.config_log_subscription.unsubscribe(); console.log("service list unsubscribe sap list"); }
    if (this.update_config_subscription) { this.update_config_subscription.unsubscribe(); console.log("update_config_subscription update form unsubscribe sap list"); }
    if (this.read_scheduler_subscription) { this.read_scheduler_subscription.unsubscribe(); console.log("read_scheduler_subscription read schedular unsubscribe sap list"); }


  }

  viewServiceLogs(data_set_name:string){
    console.log("data_set_name--->",data_set_name);
    this.viewLogsData =  [];

    // Subscribe sap list service
    let payload = { "userID": (this.user.name), "dataset_name": data_set_name };

    this.config_log_subscription = this.authService.getConfigLogs(payload)
      .subscribe((data: any) => {
        this.viewLogsData = data.result;
        console.log("this.viewLogsData-->", this.viewLogsData);
        this.getPageFromService(1);
      });

    return this.viewLogsData;
  }

  getPageFromService(page) {
    console.log("page----",page);
    console.log("this.viewLogsData-----", typeof this.viewLogsData);
    this.viewLogs = ((typeof this.viewLogsData!="string")? this.viewLogsData.slice(((page-1)*this.pageSize),(page*this.pageSize)):[]);
    console.log("data---->",this.viewLogs);
    console.log("data len---->",this.viewLogsData.length);
    this.collectionSize = this.viewLogsData.length;
    // this.movieService.getListOfMovies(page, this.pageSize).subscribe(response => {
    //   this.movies = response.data.movies;
    //   this.collectionSize = response.data.movie_count;
    // });
}

updateStatus(data_set_name, index){
  console.log("updateStatus:------",data_set_name, index);

  let payload = { "userID": (this.user.name),"dataset_name":data_set_name}
  console.log("updateStatus: payload----",payload);
  this.authService.disableConfig(payload)
  .subscribe((data: any) => {
    console.log("updateStatus: before update status----",this.serviceList);
    if(this.serviceList[index]['active']=="Activated"){
      this.serviceList[index]['active']= "Deactivated";
    }else{
      this.serviceList[index]['active']= "Activated";
    }
    console.log("updateStatus: After update status----",this.serviceList);
    console.log("updateStatus: updateStatus----",data);
  });

}

checkConfigNotExist(fieldName):boolean{
  console.log("fieldName---->"+fieldName+":"+(this.removedApiFieldList.indexOf(fieldName)!=-1), this.removedApiFieldList);
  if(this.removedApiFieldList.indexOf(fieldName)!=-1) return false;
  else return true;
}

// addItem() {
//   this.repeatControls = this.configForm.get('repeatControls') as FormArray;
//   this.repeatControls.push(this.createItem());
// }

// createItem() {
//   return this.formBuilder.array(
//      [this.formBuilder.group(this.myfromGroup.controls.repeatControls)],
//   );
// }
onAddConfirForm(key, val) {
  this.configForm = new FormGroup({
    [key]: new FormControl(val, [Validators.required])
  });

  console.log("onADdConfiForm-------",key,this.configForm)
}

getConfigByDataSetName(dataset_name, user_id, service_type){
  console.log("getConfigByDataSetName----------", user_id, service_type);
  this.updateApiFieldList = [];
  let serviceListData = this.serviceListData;
  serviceListData.map((data:any)=>{
    if(data.data_set_name.trim().toLowerCase()==dataset_name.trim().toLowerCase()){
      this.apiListConfigForm = {"userID":user_id, "dataset_name":dataset_name, "service_type":service_type};
      let apiListConfig =  Object.entries(data);

      apiListConfig.map((val)=>{
        if(this.checkConfigNotExist(val[0])==true){
          this.updateApiFieldList.push(val);
      }else{
        delete data[val[0]];
      }
      });

      setTimeout(() => {
        this.configForm.setValue(data);
      });

  }
  });
}

onUpdateConfig(){
  console.log("updateconfig---------------------");
  console.log("this.configForm---->",this.configForm.value);
  if(this.configForm.value['email_list']){
    this.configForm.value['email_update'] = this.configForm.value['email_list']
    delete this.configForm.value['email_list'];
  }

 console.log("end updateconfig---------------------", this.configForm.value);
 console.log("apiListConfigForm---------------------", this.apiListConfigForm)
 //const value = form.value;
  //console.log("onUdpateConfig---->",value);
 const configPayload: any = {...this.configForm.value, ...this.apiListConfigForm};
  console.log("onAddConfig payload---->",configPayload);
  // console.log(this.configForm.value);

  // this.configForm.reset();

  this.update_config_subscription = this.authService.updateConfig(configPayload).subscribe((data: { result: {} }) => {
    console.log("update config data -->", data);
    $('#formUpdateMessage').html('<div class="alert alert-success" role="alert">'+data.result+'</div>');
    setTimeout(function() {
      $('#formUpdateMessage').fadeOut('fast');
  }, 8000); // <-- time in milliseconds
    // this.destroyFormValues();
    this.getSapList();
  })
}

destroyFormValues() {
  sessionStorage.removeItem('configForm');
  console.log('Saved form data deleted');
}

deleteConfig(data_set_name, index){
  console.log("deleteConfig:------",data_set_name, index)

  //$('#ghanta').modal('show');

  this.confirmationDialogService.confirm('Delete Configuration', 'Do you really want to delete '+data_set_name+'  ?')
  .then((confirmed) =>{
    if(confirmed){
    console.log('User confirmed:', confirmed)
    console.log("Implement delete functionality here");

    let payload = { "userID": (this.user.name),"dataset_name":data_set_name}
    console.log("deleteConfig: payload----",payload);
    this.authService.deleteConfig(payload)
    .subscribe((data: any) => {
      console.log("deleteConfig: before update status----",this.serviceList);
      if(this.serviceList[index]['delete_flag']==0){
        this.serviceList[index]['delete_flag']= 1;
      }else{
        this.serviceList[index]['delete_flag']= 0;
      }
      this.serviceList.splice(index, 1);
      console.log("deleteConfig: After update status----",this.serviceList);
      console.log("deleteConfig: updateStatus----",data);
    });

  }

  } )
  .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

}

changePasswordToggle(input: any){
  this.authService.togglePassword(input);
}


}
