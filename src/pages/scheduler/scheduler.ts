import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SchedulersProvider } from '../../providers/schedulers/schedulers'
import { Scheduler, Items, SchedulerList } from '../../models/data-model'
import { PresentationPage } from '../../pages/presentation/presentation';

/**
 * Generated class for the SchedulerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheduler',
  templateUrl: 'scheduler.html',
})
export class SchedulerPage {

  currentScheduler : Scheduler = new Scheduler;
  hasImages : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public schedulerService: SchedulersProvider) {
    this.currentScheduler = this.navParams.get("scheduler");
    //this.schedulerService.getScheduler(this.schedulerId);
  }

  ionViewDidLoad() {
    console.log(this.currentScheduler);
    if(this.currentScheduler.type == 'isText'){
      this.hasImages = false;
    }else{
      this.hasImages = true;
    }
  }

  loadPresentation(){
    this.navCtrl.push(PresentationPage,{
      scheduler : this.currentScheduler
    });
  }

}
