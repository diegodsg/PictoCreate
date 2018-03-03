import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SchedulersProvider } from '../../providers/schedulers/schedulers'
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public schedulersService: SchedulersProvider,) {
  }

  Image = 'assets/imgs/Plantilla_1.PNG'

  ionViewDidLoad() {
    //this.schedulersService.getScheduler();
  }

  selectTemplate(){
    //this.viewCtrl.dismiss(scheduler);
    this.viewCtrl.dismiss('Plantilla seleccionada');
  }

}
