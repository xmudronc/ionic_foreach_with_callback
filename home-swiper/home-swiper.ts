import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Network } from '@ionic-native/network';
import { ForEachSynchProvider } from '../../providers/for-each-synch/for-each-synch';

declare var swiperFactory;

@Injectable()
export class HomeSwiperProvider {

  swiper: any = undefined;
  locations: any = [];

  newHomeSwiper() {
    this.swiper = swiperFactory.newSwiper('swiper-container-home', 'swiper-pagination-home');
    this.locations = MyApp.locationsGlobal;
  }

  getHomeSwiper() {
    return this.swiper;
  }

  getLocations() {
    return this.locations;
  }

  setLocations(locations) {
    this.locations = locations;
  }

  forceLine() {
    console.log('offline element ' + document.getElementById('offline') + ' app offline ' + MyApp.offline);
    if (MyApp.offline) {
      if (this.swiper != undefined) {
        //if (document.getElementById('offline') == undefined) {
          var style = 'md';
          if (MyApp.cordev != undefined) {
            style = MyApp.cordev.platform.toUpperCase() != 'IOS' ? 'md' : 'ios';
          }
          var first = '';
          if (MyApp.firstRun) {
            first = ' If this is your first time using this app, use the "Check for updates" option in settings and restart the app after it\'s finished.';
          }
          this.swiper.prependSlide('<div class="swiper-slide swiper-slide-active">  <ion-card text-wrap="" id="offline" class="offline card card-' + style + '"> <div class="card-title">You are offline</div> <ion-icon item-start="" name="close" role="img" class="icon-offline icon icon-' + style + ' ion-' + style + '-close item-icon" aria-label="close" ng-reflect-name="close"></ion-icon> <div class="card-description">We need internet connection for full functionality. Please, turn the data on.' + first + '</div> </ion-card> </div>');
          this.swiper.slideTo(0);
          this.resizeBullets();
        //}
      }
    } else {
      //if (this.swiper != undefined) {
        if (document.getElementById('offline') != undefined) {
          this.swiper.removeSlide(0);
          this.resizeBullets();
        }
      //}
    }
  }

  resizeBullets() {
    console.log('resize bullets');
    var cards = this.swiper.slides.length;
    var bullets = (document.getElementsByClassName('swiper-pagination-bullet') as any);
    var home = (document.getElementsByClassName('swiper-pagination-home') as any);
    var tabbar = (document.getElementsByClassName('tabbar') as any)[0].offsetHeight;
    for (var i = 0; i < bullets.length; i++) {
      bullets[i].style.width = (100/cards) + 'vw';
    }
    for (var i = 0; i < home.length; i++) {
      home[i].style.bottom = 'calc(' + tabbar + 'px - 20px)';
    }
    if (this.swiper != undefined) {
      this.swiper.update();
    }
  }

  removeCard(count) {
    if (this.swiper != undefined) {
      if (count < MyApp.locationsGlobal.length) {
        this.swiper.removeSlide(this.swiper.slides.length - 1);
        count = count + 1;
        this.removeCard(count);
      } else {
        this.addCards();
      }
    }
  }

  removeCardOnUpdare(count, size) {
    var stop = 1;
    if (MyApp.firstRun) {
      stop += 3;
    }
    if (MyApp.offline) {
      stop += 1;
    }
    this.removeCardTmp(count, size, stop);
  }

  removeCardTmp(count, size, stop) {
    if (this.swiper != undefined) {
      if (count < size && this.swiper.slides.length > stop) {
        this.swiper.removeSlide(this.swiper.slides.length - 1);
        count = count + 1;
        this.removeCardTmp(count, size, stop);
      } 
    }
  }

  getCardHtml(location) { 
    var style = 'md';
    if (MyApp.cordev != undefined) {
      style = MyApp.cordev.platform.toUpperCase() != 'IOS' ? 'md' : 'ios';
    }
    var img = location.img;
    if (img != null) {
      img = location.img.changingThisBreaksApplicationSecurity;
    }
    return '\
      <div class="swiper-slide" id="' + location.id + '">\
        <ion-card class="card-with-image card card-' + style + '" text-wrap="">\
          <img class="dark" id="image-home-' + location.id + '" src="' + img + '">\
          <div class=" card-title ">\
            ' + location.name + '\
          </div>\
          <div class="card-description ">\
            ' + location.description + '\
          </div>\
        </ion-card>\
      </div>\
    ';
  }

  addCards() {
    if (this.swiper != undefined) {
      MyApp.locationsGlobal.forEach(element => {
        console.log(element.img);
        this.swiper.appendSlide(this.getCardHtml(element));
      });
      this.resizeBullets();
    }
  }

  addCardsOnEnter(locations, callback) {
    if (this.swiper != undefined) {
      this.fes.forEach(locations, (index, array, next) => {
        console.log(array[index].img);
        this.swiper.appendSlide(this.getCardHtml(array[index]))
        next();
      }, (array) => {
        this.resizeBullets();
        callback(array);
      });
    }
  }

  refreshCards() {
    if (this.swiper != undefined) {
      if (MyApp.locationsGlobal != undefined) {
        this.removeCard(0);
      } else {
        this.addCards();
      }
    }
  }



  constructor(
    public fes: ForEachSynchProvider,
    public http: HttpClient,
    private network: Network,
    platform: Platform) {
    console.log('Hello HomeSwiperProvider Provider');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      MyApp.offline = true;
      var style = 'md';
      if (MyApp.cordev != undefined) {
        style = MyApp.cordev.platform.toUpperCase() != 'IOS' ? 'md' : 'ios';
      }
      if (this.swiper != undefined) {
        if (document.getElementById('offline') == undefined) {
          var first = '';
          if (MyApp.firstRun) {
            first = ' If this is your first time using this app, use the "Check for updates" option in settings and restart the app after it\'s finished.';
          }
          this.swiper.prependSlide('<div class="swiper-slide swiper-slide-active">  <ion-card text-wrap="" id="offline" class="offline card card-' + style + '"> <div class="card-title">You are offline</div> <ion-icon item-start="" name="close" role="img" class="icon-offline icon icon-' + style + ' ion-' + style + '-close item-icon" aria-label="close" ng-reflect-name="close"></ion-icon> <div class="card-description">We need internet connection for full functionality. Please, turn the data on.' + first + '</div> </ion-card> </div>');
          this.swiper.slideTo(0);
          this.resizeBullets();
        }
      }
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      MyApp.offline = false;
      if (this.swiper != undefined) {
        if (document.getElementById('offline') != undefined) {
          this.swiper.removeSlide(0);
          this.resizeBullets();
        }
      }
    });
  }

}
