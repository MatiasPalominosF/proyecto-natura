// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// WARNING - Values under "firebase" and value of "googleApiKey" needs to be replaced from your own accounts
// If left as is, it firbase and google map related functionality will not work on LIVE instance.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBRODRblKSNpevDPa3HN9hnvmauXBsvfLU",
    authDomain: "natura-proyecto.firebaseapp.com",
    projectId: "natura-proyecto",
    storageBucket: "natura-proyecto.appspot.com",
    messagingSenderId: "1012091638909",
    appId: "1:1012091638909:web:b22c566ddf3a2d80f74d14",
    measurementId: "G-50074XFDQ1"
  },
  googleApiKey: 'AIzaSyAIIYOxA7qeetFz6TuR1Qewc0Rrjhzx7ZU'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
