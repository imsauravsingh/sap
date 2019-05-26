import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular-jwt';
import { AppConfig } from '../../config/app.config';


@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  userdata: any;
  host: string;
  port: string;
  auth_token: string;
  sap_list_url: string;
  service_list_url: string;
  login_url: string;
  version_url: string;
  api_list_url: string;
  api_field_url: string;
  config_log_url: string;
  disable_config_url: string;
  delete_config_url: string;
  create_config_url: string;
  update_config_url: string;
  read_schedule_url: string;
  change_mode_config_url: string;
  run_now_config_url: string;
  targets_config_url: string;
  target_fields_config_url: string;

  constructor(
    private http: HttpClient,
    private config: AppConfig,
  ) {
    this.userdata = JSON.parse(localStorage.getItem('user'));
    this.host = config.getConfig('host');
    this.port = config.getConfig('port');
    this.sap_list_url = config.getConfig('sap_list_url');
    this.login_url = config.getConfig('login_url');
    this.auth_token = config.getConfig('auth_token');
    this.service_list_url = config.getConfig('service_list_url');
    this.version_url = this.config.getConfig('version_list_url');
    this.api_list_url = this.config.getConfig('api_list_url');
    this.api_field_url = this.config.getConfig('api_field_url');
    this.config_log_url = this.config.getConfig('config_log_url');
    this.disable_config_url = this.config.getConfig('disable_config_url');
    this.delete_config_url = this.config.getConfig('delete_config_url');
    this.create_config_url = this.config.getConfig('create_config_url');
    this.update_config_url = this.config.getConfig('update_config_url');
    this.read_schedule_url = this.config.getConfig('read_schedule_url');
    this.change_mode_config_url = this.config.getConfig('change_mode_config_url');
    this.run_now_config_url = this.config.getConfig('run_now_config_url');
    this.targets_config_url = this.config.getConfig('targets_config_url');
    this.target_fields_config_url = this.config.getConfig('target_fields_config_url');
  }

  authenticateUser(user) {
    if (user.userID && user.password) {
      return this.http.post(this.login_url, user);
    } else {
      return this.http.get("./assets/data/error.json");
    }
  }

  storeUserData(token, user) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('access_token');
    this.authToken = token;
  }

  loadUser() {
    return (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  }

  loggedIn() {
    return localStorage.getItem('access_token') !== null;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  getSAPList(user) {
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.sap_list_url, { "userID": user.name }, { headers: headers });
  }

  getServiceList(data) {
    console.log("getServiceList--->", data, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    headers.append('application/json');
    return this.http.post(this.service_list_url, { "userID": data.userID, "service_type": data.service_type, "target":data.target }, { headers: headers });
  }

  getVersionList(payload) {
    console.log("getVersionList--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    headers.append('application/json');
    return this.http.post(this.version_url, {"userID":payload.userID,"service_type":payload.service_type}, { headers: headers });
  }

  getApiList(payload) {
    // let payload = {"userID":"sunny","service_type":"SAP", "version":1};
    console.log("api_list_url--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    headers.append('application/json');
    return this.http.post(this.api_list_url, {"userID":payload.userID,"service_type":payload.service_type, "version": payload.version}, { headers: headers });
  }

  getApiFields(payload) {
    // let payload = {"userID":"sunny","service_type":"SAP", "version":1};
    console.log("getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    headers.append('application/json');
    return this.http.post(this.api_field_url, {"userID":payload.userID,"service_type":payload.service_type, "version": payload.version,  "api_name": payload.api_name}, { headers: headers });
  }

  getConfigLogs(payload) {
    // let payload = {"userID":"sunny","service_type":"SAP", "version":1};
    console.log("getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    // return this.http.get("./assets/admin/js/logs.json", { headers: headers });
    return this.http.post(this.config_log_url, {"userID":payload.userID,"dataset_name":payload.dataset_name, "service_type":payload.service_type}, { headers: headers });
  }

  disableConfig(payload) {
    console.log("disableConfig:   getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.disable_config_url, {"userID":payload.userID, "api_name":payload.api_name, "service_type":payload.service_type,"dataset_name":payload.dataset_name}, { headers: headers });
  }

  deleteConfig(payload) {
    console.log("deleteConfig:   getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.delete_config_url, {"userID":payload.userID,"api_name":payload.api_name, "service_type":payload.service_type,"dataset_name":payload.dataset_name}, { headers: headers });
  }

  createConfig(payload) {
    console.log("createConfig:**********", payload);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.create_config_url, payload, { headers: headers });
  }

  updateConfig(payload) {
    console.log("updateConfig:**********", payload);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.update_config_url, payload, { headers: headers });
  }

  readSchedule(payload) {
    console.log("updateConfig:**********", payload);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.read_schedule_url, payload, { headers: headers });
  }

  changeMode(payload) {
    console.log("changeMode:   getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.change_mode_config_url, {"userID":payload.userID,"api_name":payload.api_name, "service_type":payload.service_type, "dataset_name":payload.dataset_name}, { headers: headers });
  }

  runNow(payload) {
    console.log("changeMode:   getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.run_now_config_url, {"userID":payload.userID,"dataset_name":payload.dataset_name, "target":payload.target}, { headers: headers });
  }

  getTargets(payload) {
    console.log("getTargets:   getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.targets_config_url, {"userID":payload.userID}, { headers: headers });
  }

  getTargetFields(payload) {
    console.log("getTargetFields:   getApiFields--->", payload, this.auth_token);
    let headers: any = new HttpHeaders();
    headers.append('Authorization', this.auth_token);
    return this.http.post(this.target_fields_config_url, {"userID":payload.userID, "target": payload.target}, { headers: headers });
  }

  togglePassword(input: any) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }


}
