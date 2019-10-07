import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SpinnerPage } from '../../pages/spinner/spinner';
import { MyApp } from '../../app/app.component';

@Injectable()
export class NavigationProvider {

  ctrl: any;
  modal: any;
  navTabs: any;
  activeModal: any;

  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalController: ModalController) {
    console.log('Hello NavigationProvider Provider');
    this.ctrl = navCtrl;
    this.modal = modalController;
  }

  setNavTabs(tabs) {
    this.navTabs = tabs;
    MyApp.tabsNav = this.navTabs;
  }

  getNavTabs() {
    return this.navTabs;
  }

  openModal(data) {
    if (MyApp.activeModal != undefined) {
      MyApp.activeModal.present();
    } else {
      MyApp.activeModal = this.modal.create(SpinnerPage, {
        page: data
      }, {
        enterAnimation: 'ModalEnterFadeIn',
        leaveAnimation: 'ModalLeaveFadeOut',
      });
      MyApp.activeModal.present();
    }
  }

  closeModal() {
    if (MyApp.activeModal != undefined) {
      MyApp.activeModal.dismiss();
    }
  }

  navigateToPage(page, data) {
    this.openModal(undefined);
    setTimeout(() => {
      this.ctrl.push(page, data, {
        enterAnimation: 'ModalEnterFadeIn',
        leaveAnimation: 'ModalLeaveFadeOut',                
    });
    }, 500);
  }

  selectTab(tab) {
    if (this.navTabs != undefined) {
      this.navTabs.select(tab);
    }
  }

}
