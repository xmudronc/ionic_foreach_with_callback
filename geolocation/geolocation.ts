import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { MyApp } from '../../app/app.component';

declare var backgroundGeoFactory;

@Injectable()
export class GeolocationProvider {

  backGeo: any;

  getBackGeo() {
    return this.backGeo;
  }

  constructor(
    public http: HttpClient,
    platform: Platform) {
    console.log('Hello GeolocationProvider Provider');
    platform.ready().then(() => {
      this.backGeo = backgroundGeoFactory;
      try {
        if (this.backGeo != undefined) {
          this.backGeo.configure({
            locationProvider: this.backGeo.ACTIVITY_PROVIDER,
            desiredAccuracy: this.backGeo.HIGH_ACCURACY,
            stationaryRadius: 10,
            distanceFilter: 10,
            notificationsEnabled: true,
            startForeground: true,
            notificationTitle: 'Tour active.',
            notificationText: 'Background geolocation running.',
            notificationIconColor: '#bd1722',
            notificationIconSmall: 'small_icon',
            notificationIconLarge: 'welcome',
            saveBatteryOnBackground: false,
            stopOnTerminate: true,
            debug: true,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000
          });
          this.backGeo.getCurrentLocation(function (e) {
            console.log('location succ ' + e);
            MyApp.geoData = e;
          }, function (e) {
            console.log('location error ' + e.message + ' ' + e.code);
          }, {
            timeout: 5000,
            maximumAge: 10000,
            enableHighAccuracy: true
          });
        }
      } catch (error) {        
      }
    });
  }

}
