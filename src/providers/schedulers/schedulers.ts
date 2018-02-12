//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Scheduler, Items } from '../../models/data-models';

/*
  Generated class for the SchedulersProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class SchedulersProvider {

  schedulers: Scheduler = [];

  constructor(public storage: Storage) {

  }

  saveScheduler(scheduler: Scheduler){
    let id = Math.random(4);
    console.log("data"+id+ "stored with id=" + id);
    this.storage.set(id, scheduler);

    console.log("se obtiene ");
    this.storage.get(id).then((val)=>{
      console.log(val);
    })
  }

  load(){
    this.schedulers = [
      {title: 'Sched 1', summary: 'Sched summary 1'},
      {title: 'Sched 2', summary: 'Sched summary 2'},
      {title: 'Sched 3', summary: 'Sched summary 3'}
    ];
  }

  addItem(){
    //DoStuff.
  }

}
