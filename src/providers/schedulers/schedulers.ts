//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Scheduler, Item, Category } from '../../models/data-model';

/*
  Generated class for the SchedulersProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class SchedulersProvider {

  scheds : Scheduler[];
  key = '_schedulers';
  listSize = 0;
  emptyList = true;
  scheduler : Scheduler;
  //schedulers: Scheduler = [];

  constructor(public storage: Storage) {

  }

  addScheduler(scheduler: Scheduler){
      this.storage.get(this.key).then((res) => {
          if(res==undefined){
              res = [];
          }
          this.storage.get('listSize').then((numScheds) => {
              if(numScheds==undefined){
                  numScheds = 1;
              }
              numScheds++;
              res.push(scheduler);
              console.log(res);
              this.storage.set(this.key, res);
              this.storage.set('listSize',numScheds);
          });
      });
  }

  saveScheduler(scheduler: Scheduler){
    //console.log(scheduler);
    this.storage.get(this.key).then(res=>{
      let list = [];
      list = res;
      list.push(scheduler);
      console.log('lista es'+ list);
      this.storage.set(this.key, list).then(res=>{
        console.log('added items');
      });
    });
}

  load(){
    this.storage.get(this.key).then((val) => {
          if(val == null){
            this.emptyList=true;
          }
          else if(val.length == 0){
            this.emptyList=true;
          }
          else{
            this.emptyList=false;
          }
          this.scheds=val;
        });
  }

deleteScheduler(id){
  this.storage.get(this.key).then((val) => {
    let schedsAux = [];
    for(var i=0; i<val.length; i++){
      if(val[i].id != id){
        schedsAux.push(val[i]);
      }
    }
    this.scheds = schedsAux;
    this.storage.set(this.key, schedsAux).then((val)=>{
      console.log('item '+id+' deleted');
    })
  });
}

getScheduler(id){
  this.storage.get(this.key).then((val) => {
    for(var i=0; i<val.length; i++){
      if(val[i].id == id){
        this.scheduler = val[i];
      }
    }
  });
}

  updateScheduler(scheduler: Scheduler){
    let auxSched : Scheduler;
    for(let i=0; i<this.scheds.length; i++){
      if(this.scheds[i].id == scheduler.id){
        this.scheds[i]=scheduler;
      }
    }
    this.storage.set(this.key, this.scheds).then((res)=>{
      console.log("scheduler updated");
    })
  }
}
