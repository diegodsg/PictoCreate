import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { SchedulersProvider } from '../../providers/schedulers/schedulers';
import { SchedulerEditorPage } from '../../pages/scheduler-editor/scheduler-editor';
import { HomePage } from '../../pages/home/home';

import { Scheduler } from '../../models/data-model';

/**
 * Generated class for the SchedulerTemplatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheduler-templates',
  templateUrl: 'scheduler-templates.html',
})
export class SchedulerTemplatesPage {

  templates : Scheduler[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public appCtrl: App,
              public schedulersService: SchedulersProvider) {

              this.templates = this.navParams.get("templates");
  }

  Image = 'assets/imgs/Plantilla_1.PNG'

  loadCreateScheduler(){
    this.viewCtrl.dismiss('Crear de cero');
    //this.navCtrl.setRoot(HomePage);
    this.appCtrl.getRootNav().push(SchedulerEditorPage, {
      isEdit: 0,
    });
  }

  selectTemplate(scheduler: Scheduler){
    //this.viewCtrl.dismiss(scheduler);
    this.viewCtrl.dismiss('Plantilla seleccionada');
    //this.navCtrl.setRoot(HomePage);
    this.appCtrl.getRootNav().push(SchedulerEditorPage, {
      isEdit : 3,
      scheduler: scheduler
    });
  }

  loadCreateTemplate(){
    this.navCtrl.push(SchedulerEditorPage,{
      isEdit : 2,
    });
  }

  deleteTemplate(template: Scheduler){
    this.schedulersService.deleteTemplate(template.id);
    let aux = [];
    for(let i = 0; i<this.templates.length;i++){
      if(this.templates[i].id != template.id){
        aux.push(template);
      }
    }
    this.templates = aux;
  }


}
