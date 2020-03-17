import { Injectable } from '@angular/core';
var OneSignal;

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {
  public userId;

  constructor() {
    }

    iniciar() {
      // console.log('asd');
      OneSignal = window['OneSignal'] || [] || [];
      OneSignal.push(function() {
      OneSignal.init({
        appId: "f8e8d04c-0ea4-41cc-b166-63b0bf23bb48",
        notifyButton: {
          enable: true,
        },
      });
    });
    // console.log('OneSignal Initialized');
      this.checkIfSubscribed();
      OneSignal.push(function () {
      // console.log('Register For Push');
      OneSignal.push(["registerForPushNotifications"])
    });
      OneSignal.push(function () {
      // Occurs when the user's subscription changes to a new value.
      OneSignal.on('subscriptionChange', function (isSubscribed) {
        // console.log("The user's subscription state is now:", isSubscribed);
        OneSignal.getUserId().then(function (userId) {
          // console.log("User ID is", userId);
        });
      });
    });
    }


    getUserID() {
      OneSignal.getUserId().then((userId) => {
          console.log('User ID is', userId);
          this.userId = userId;
      });
  }

  checkIfSubscribed() {
      OneSignal.push(() => {
          /* These examples are all valid */
          OneSignal.isPushNotificationsEnabled((isEnabled) => {
              if (isEnabled) {
                  // console.log('Push notifications are enabled!');
                  this.getUserID();
              } else {
                  // console.log('Push notifications are not enabled yet.');
                  // this.subscribe();
              }
          }, (error) => {
              // console.log('Push permission not granted');
          });
      });

}

}
