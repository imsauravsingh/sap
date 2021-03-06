// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  "auth_token": "Basic c3VwZXJ1c2VyOnN1cGVydXNlcg==",
  "sap_list_url": "http://34.242.51.14:8000/domo/getServicetypes/",
  "login_url": "http://34.242.51.14/domo/login/userlogin",
  "service_list_url": "http://34.242.51.14:8000/domo/readConfig/",
  "version_list_url": "http://34.242.51.14:8000/domo/getVersions/",
  "api_list_url": "http://34.242.51.14:8000/domo/getAPIs/",
  "api_field_url": "http://34.242.51.14:8000/domo/getAPIFields/",
  "config_log_url": "http://34.242.51.14:8000/domo/readUserLogs/",
  "disable_config_url": "http://34.242.51.14:8000/domo/disableConfig/",
  "delete_config_url": "http://34.242.51.14:8000/domo/deleteConfig/",
  "create_config_url":"http://34.242.51.14:8000/domo/create_config/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
