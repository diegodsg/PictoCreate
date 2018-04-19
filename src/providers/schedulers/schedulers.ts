//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Scheduler } from '../../models/data-model';

/*
  Generated class for the SchedulersProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class SchedulersProvider {

  scheds : Scheduler[];
  templates : Scheduler[];

  scheduler_key = '_schedulers';
  template_key = '_templates';

  listSize = 0;
  listSize_templates = 0;

  emptyList = true;
  scheduler : Scheduler;
  //schedulers: Scheduler = [];

  constructor(public storage: Storage) {

  }

  addScheduler(scheduler: Scheduler){
      this.storage.get(this.scheduler_key).then((res) => {
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
              this.storage.set(this.scheduler_key, res);
              this.storage.set('listSize',numScheds);
          });
      });
  }

  addSchedulerb(scheduler: Scheduler){
    return this.storage.get(this.scheduler_key);
  }

  saveScheduler(scheduler: Scheduler){
    //console.log(scheduler);
    this.storage.get(this.scheduler_key).then(res=>{
      let list = [];
      list = res;
      list.push(scheduler);
      console.log('lista es'+ list);
      this.storage.set(this.scheduler_key, list).then(res=>{
        console.log('added items');
      });
    });
}

addTemplate(scheduler: Scheduler){
    this.storage.get(this.template_key).then((res) => {
        if(res==undefined){
            res = [];
        }
        this.storage.get('listSize_templates').then((numScheds) => {
            if(numScheds==undefined){
                numScheds = 1;
            }
            numScheds++;
            res.push(scheduler);
            console.log(res);
            this.storage.set(this.template_key, res);
            this.storage.set('listSize_templates',numScheds);
        });
    });
}

addTemplateb(scheduler: Scheduler){
    return this.storage.get(this.template_key);
}


  load(){
    this.storage.get(this.scheduler_key).then((val) => {
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

  loadb(){
    return this.storage.get(this.scheduler_key);
  }

  loadSchedulers(){
    var loadPromise = this.storage.get(this.scheduler_key);
/*
    loadPromise.then((schedulers)=>{
      if(schedulers == null){
        this.emptyList=true;
      }
      else if(schedulers.length == 0){
        this.emptyList=true;
      }
      else{
        this.emptyList=false;
      }
      this.scheds=schedulers;
    })
    */
    return loadPromise;
  }

  loadTemplates(){
    this.storage.get(this.template_key).then((val) => {
          this.templates=val;
        });
  }

  loadTemplatesb(){
    return this.storage.get(this.template_key);
  }

deleteScheduler(id){
  this.storage.get(this.scheduler_key).then((val) => {
    let schedsAux = [];
    for(var i=0; i<val.length; i++){
      if(val[i].id != id){
        schedsAux.push(val[i]);
      }
    }
    this.scheds = schedsAux;
    this.storage.set(this.scheduler_key, schedsAux).then((val)=>{
      console.log('item '+id+' deleted');
    })

    if(this.scheds.length == 0){
      this.emptyList = true;
    }
  });

}

deleteTemplate(id){
  this.storage.get(this.template_key).then((val) => {
    let schedsAux = [];
    for(var i=0; i<val.length; i++){
      if(val[i].id != id){
        schedsAux.push(val[i]);
      }
    }
    this.templates = schedsAux;
    this.storage.set(this.template_key, schedsAux).then((val)=>{
      console.log('item '+id+' deleted');
    })
  });
}

getScheduler(id){
  this.storage.get(this.scheduler_key).then((val) => {
    for(var i=0; i<val.length; i++){
      if(val[i].id == id){
        this.scheduler = val[i];
      }
    }
  });
}

getSchedulerb(id){
  return this.storage.get(this.scheduler_key);
}

updateScheduler(scheduler: Scheduler){
  for(let i=0; i<this.scheds.length; i++){
    if(this.scheds[i].id == scheduler.id){
      this.scheds[i]=scheduler;
    }
  }
  this.storage.set(this.scheduler_key, this.scheds).then((res)=>{
    console.log("scheduler updated");
  });
}

updateSchedulerb(scheduler: Scheduler){
  for(let i=0; i<this.scheds.length; i++){
    if(this.scheds[i].id == scheduler.id){
      this.scheds[i]=scheduler;
    }
  }
  return this.storage.set(this.scheduler_key, this.scheds);
}

}
