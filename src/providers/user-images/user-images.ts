//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserImage } from '../../models/data-model'
import { Storage } from '@ionic/storage'
/*
  Generated class for the UserImagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserImagesProvider {

  userImages: UserImage[];
  key: string = '_personalPicto';

  constructor(public storage: Storage) {
  }

  saveImage(data: UserImage){
    if(this.userImages==undefined){
        this.userImages = [];
    }
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
