import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, ActionSheetController,  NavParams, ModalController, Modal } from 'ionic-angular';

import { SchedulersProvider } from '../../providers/schedulers/schedulers';
import { SchedulerPage } from '../../pages/scheduler/scheduler';
import { SchedulerTemplatesPage } from '../../pages/scheduler-templates/scheduler-templates'
import { SchedulerEditorPage } from '../../pages/scheduler-editor/scheduler-editor'

import { Scheduler, Item, Category } from '../../models/data-model';
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
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              ){
    this.statusBar.backgroundColorByHexString('#2085c1');
  }

  ionViewDidLoad(){
    console.log(this.schedulersService.scheds);
  }

  ionViewWillEnter(){
    this.schedulersService.load();
  }

  ionViewDidEnter(){
    this.schedulersService.load();
  }

  openScheduler(scheduler : Scheduler){
    this.navCtrl.push(SchedulerPage,{
      scheduler : scheduler
    });

  }

  loadCreateScheduler(){
    this.navCtrl.push(SchedulerEditorPage);
  }

  shareScheduler(id){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Compartir/Exportar Planificador',
      buttons: [
        {

          text: 'Exportar como PDF',
          icon: 'document',
          handler: () => {
            console.log('export as PDF clicked');
          }
        },{
          text: 'Exportar como Imágenes',
          icon: 'photos',
          handler: () => {
            console.log('export as img clicked');
          }
        },{
          text: 'Enviar por correo como PDF',
          icon: 'mail',
          handler: () => {
            console.log('Send via Mail clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  deleteScheduler(id){
    let deleteConfirm = this.alertCtrl.create({
      title: 'Eliminar',
      message: '¿Eliminar este Pictograma?',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            this.schedulersService.deleteScheduler(id);
          }
        },
        {
          role: 'cancel',
          text: 'Cancelar',
          handler: () => {
          }
        }
      ]
    });

    deleteConfirm.present();

  }

  editScheduler(scheduler: Scheduler){
    this.navCtrl.push(SchedulerEditorPage,{
      isEdit : true,
      scheduler : scheduler
    });
  }

  loadTemplatesModal(){
    let modal: Modal = this.modalCtrl.create(SchedulerTemplatesPage);
    modal.present();
    modal.onDidDismiss((data)=>{
      console.log(data);
      /*
      if(data != null){
        editScheduler(data);
      }
      */
    });
  }
}
