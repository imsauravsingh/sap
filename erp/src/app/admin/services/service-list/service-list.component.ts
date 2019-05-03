import { Component, OnInit, Input, AfterContentInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Subscription } from 'rxjs';
import $ from 'jquery';

declare var bootstrapModalMethod: any;

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit, AfterContentInit, OnDestroy {
  page :number = 1;
  pageSize: number = 10;
  collectionSize: number = 70;
  serviceId: string;
  sap_list_subscription: Subscription;
  config_log_subscription: Subscription;
  serviceList: any;
  user: any;
  payload: { service_type: string, userID: string };
  closeResult: string;
  viewLogs: any;
  viewLogsData: any;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(){}

  ngAfterContentInit() {
    bootstrapModalMethod();

    this.serviceId = this.route.snapshot.params['id'];
    this.user = this.authService.loadUser()
    this.payload = { "userID": (this.user.name), "service_type": this.serviceId };

    // Subscribe sap list service
    this.sap_list_subscription = this.authService.getServiceList(this.payload)
      .subscribe((data: any) => {
        this.serviceList = data.result;
        console.log("this.serviceList-->", this.serviceList);
      });
  }

  ngOnDestroy() {
    // Unsubscribe sap list service
    if (this.serviceId) { this.sap_list_subscription.unsubscribe(); console.log("service list unsubscribe sap list"); }
    if (this.config_log_subscription) { this.config_log_subscription.unsubscribe(); console.log("service list unsubscribe sap list"); }

  }

  viewServiceLogs(data_set_name:string){
    console.log("data_set_name--->",data_set_name);
    this.viewLogsData =  [
      {"dataset_name":"a", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"b", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"c", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"d", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"e", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"f", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"g", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"h", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"i", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"j", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"k", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"l", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"m", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"n", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"o", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"p", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"q", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"r", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"s", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"t", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"u", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"v", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"w", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"x", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"y", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"z", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"aa", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"bb", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"cc", "userID":"sunny", "timestamp":"2012-02-04"},
      {"dataset_name":"dd", "userID":"sunny", "timestamp":"2012-02-04"}
    ];

    this.getPageFromService(1);

    // Subscribe sap list service
    let payload = { "userID": (this.user.name), "dataset_name": data_set_name };

    this.config_log_subscription = this.authService.getConfigLogs(payload)
      .subscribe((data: any) => {
        this.viewLogsData = data.result;
        console.log("this.viewLogsData-->", this.viewLogsData);
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


deleteConfig(data_set_name, index){
  console.log("deleteConfig:------",data_set_name, index)

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
    console.log("deleteConfig: After update status----",this.serviceList);
    console.log("deleteConfig: updateStatus----",data);
  });

}



}
