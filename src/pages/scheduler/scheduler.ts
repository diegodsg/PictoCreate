import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SchedulersProvider } from '../../providers/schedulers/schedulers'
import { Scheduler } from '../../models/data-model'
import { PresentationPage } from '../../pages/presentation/presentation';
import {SchedulerEditorPage } from '../../pages/scheduler-editor/scheduler-editor';

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
  hasText: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public schedulerService: SchedulersProvider) {
    this.currentScheduler = this.navParams.get("scheduler");
    //this.schedulerService.getScheduler(this.schedulerId);
  }

  editScheduler(scheduler: Scheduler){
    this.navCtrl.push(SchedulerEditorPage,{
      isEdit : true,
      scheduler : scheduler
    });
  }

  loadPresentation(){
    this.navCtrl.push(PresentationPage,{
      scheduler : this.currentScheduler
    });
  }

}
