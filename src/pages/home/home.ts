import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { storage, initializeApp } from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SchedulersProvider } from '../../providers/schedulers/schedulers';
import { SchedulerPage } from '../../pages/scheduler/scheduler';
import { NewSchedulerPage } from '../../pages/new-scheduler/new-scheduler';
import { Scheduler, Items } from '../../models/data-model';
import { StatusBar } from '@ionic-native/status-bar'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  schedulerList: any = {};

  Imagen = 'assets/imgs/pictograma.jpg'

  constructor(public navCtrl: NavController,
     public schedulersService: SchedulersProvider,
    private statusBar: StatusBar,
    private viewCtrl: ViewController) {
    initializeApp(FIREBASE_CONFIG);
    this.statusBar.backgroundColorByHexString('#2085c1');
  }

  ionViewDidLoad(){
    console.log('look right');
    console.log(this.schedulersService.scheds);
  }

  ionViewWillEnter(){
    this.schedulersService.load();
  }

  ionViewDidEnter(){
    this.schedulersService.load();
    console.log(this.schedulersService.scheds);

  }


  openScheduler(scheduler : Scheduler){
    //((console.log('card '+this.schedulersService.scheds.find(id)+' clicked');
    this.navCtrl.push(SchedulerPage,{
      scheduler : scheduler
    });

  }

  loadCreateScheduler(){
    this.navCtrl.push(NewSchedulerPage);
  }

  deleteScheduler(id){
    this.schedulersService.deleteScheduler(id);
    //this.viewCtrl._didEnter();
  }

/*

  async takePhoto() {
    //definir opciones de camara
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 500,
        targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      const result = await this.camera.getPicture(options);

      const image = 'data:image/jpeg;base64,' + result;

      const pictures = storage().ref('pictures/myPhoto');

      pictures.putString(image, 'data_url');

      console.log("takingPhoto...");

    }
    catch (e) {
      console.error(e);
    }
  }

*/
}
