import { Component, ViewChild } from '@angular/core';

import { AlertController, App, FabContainer, List, ModalController, NavController, ToastController, LoadingController, NavParams, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';


import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { MealsdataProvider } from '../../providers/mealsdata/mealsdata';

import { SoupsPage } from '../soups/soups';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})

@Injectable()

export class SchedulePage {
  @ViewChild('scheduleList', { read: List }) scheduleList: List;
  @ViewChild(Content) content: Content;

  items: any;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  results: any = [];
  item: string;
  temp: any;
  data: Array<{cat_id: string, cat_name: string, cat_img: string}> = [];
  
  
  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public http: Http,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    public navParams: NavParams,
    public meals: MealsdataProvider,
    public user: UserData
  ) {


    this.meals.getCategories().subscribe(

      data => {
        this.items = data;
        this.initialize();
      });
      
  }
  
  scroll() {
    this.content.scrollToTop();
  }


  initialize() {
    this.data = this.items;

    
/*    this.meals.getTracks().then(data => {
      this.temp = JSON.stringify(data);
      var arr = this.temp.split(",");
      var i = 0;
      this.items.forEach(value => {
        this.data.push({
          cat_id: value.cat_id,
          cat_name: arr[i],
          cat_img: value.cat_img
        });
        i++;
      })
      console.log("Data: "+JSON.stringify(this.data));
    });
    */
  }

  getItems(ev: any) {

    this.initialize();

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.data = this.data.filter((item) => {
        return (item.cat_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  ionViewDidLoad() {
    this.updateTimeline();
  }

  updateTimeline() {

    this.meals.getCategories().subscribe(

      data => {
        this.items = data;
        this.data = this.items.filter(item => this.excludeTracks.indexOf(item.name) < 0);
      });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {       
        this.excludeTracks = data;
        this.updateTimeline();
      }
    });

  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }


  view(item: any) {
  
      this.navCtrl.push(SoupsPage,{item: item});

  }
}
