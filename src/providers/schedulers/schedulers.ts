//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


/*
  Generated class for the SchedulersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SchedulersProvider {

  schedulers: any = [];

  constructor(public storage: Storage) {

  }

  saveScheduler(scheduler){
    storage.set("id", scheduler);
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
