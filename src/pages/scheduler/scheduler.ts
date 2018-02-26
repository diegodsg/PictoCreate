import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SchedulersProvider } from '../../providers/schedulers/schedulers'
import { Scheduler, Items, SchedulerList } from '../../models/data-model'

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

  image = 'assets/imgs/placeholder_pictogram.png'
  schedulerId = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public schedulerService: SchedulersProvider) {
    this.schedulerId = this.navParams.get("schedulerID");
    this.schedulerService.getScheduler(this.schedulerId);
  }

  ionViewDidLoad() {
    console.log(this.schedulerService.scheduler);
  }

  ionViewWillEnter(){
    this.schedulerService.load();
  }

}
