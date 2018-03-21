import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserImage } from '../../models/data-model'
import { Storage } from '@ionic/Storage'
/*
  Generated class for the UserImagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserImagesProvider {

  userImages: UserImage[];
  key: string = '_userImages';

  constructor(public http: HttpClient, private storage: Storage) {
  }

  saveImage(data: UserImage){
    this.userImages.push(data);
    this.storage.set(this.key, this.userImages).then((res)=>{
      console.log('image saved');
      console.log(this.userImages);
    });
  }

  loadImages(){
    this.storage.get(this.key).then((res)=>{
      if(res!=null){
        this.userImages = res;
      }
      else{
        console.log('error loading the user images');
      }
    })
  }


}
