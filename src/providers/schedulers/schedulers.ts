//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Scheduler, Items } from '../../models/data-model';

/*
  Generated class for the SchedulersProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class SchedulersProvider {

  //schedulers: Scheduler = [];

  constructor(public storage: Storage) {

  }

  saveScheduler(scheduler: Scheduler){
    /*
    let id = Math.random(4);
    console.log("data"+id+ "stored with id=" + id);
    this.storage.set(id, scheduler);

    console.log("se obtiene ");
    this.storage.get(id).then((val)=>{
      console.log(val);
    })
  */
}

  load(){
      //
  }

  addItem(){
    //DoStuff.
  }

}
