import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { storage, initializeApp } from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';
import { Camera, CameraOptions } from '@ionic-native/camera'

import { SchedulerPage } from '../../pages/scheduler/scheduler'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  schedulerList: any = {};


  constructor(public navCtrl: NavController, private camera: Camera) {
    initializeApp(FIREBASE_CONFIG);
  }


  openScheduler(scheduler){
    console.log("card clicked");
    /*
    this.navCtrl.push(SchedulerPage,{
      schedulerId: scheduler.id
    });
    */
  }


  async takePhoto(){
    //definir opciones de camara
    try{
      const options: CameraOptions = {
        quality:50,
        targetHeight: 500,
        targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      const result = await this.camera.getPicture(options);

      const image = 'data:image/jpeg;base64,'+result;

      const pictures = storage().ref('pictures/myPhoto');

      pictures.putString(image, 'data_url');
      
      console.log("takingPhoto...");

    }
    catch(e){
      console.error(e);
    }
  }


}
