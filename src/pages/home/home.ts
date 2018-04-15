import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, ActionSheetController,
         NavParams, ModalController, Modal,
         Platform } from 'ionic-angular';

import { SchedulersProvider } from '../../providers/schedulers/schedulers';
import { SchedulerPage } from '../../pages/scheduler/scheduler';
import { SchedulerTemplatesPage } from '../../pages/scheduler-templates/scheduler-templates'
import { SchedulerEditorPage } from '../../pages/scheduler-editor/scheduler-editor'

import { Scheduler } from '../../models/data-model';
import { StatusBar } from '@ionic-native/status-bar'


//PDF generation
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare var cordova: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pdfObj = null;
  Imagen = 'assets/imgs/pictograma.jpg';
  schedulers : Scheduler[];

  images : any[];

  sampleImage : any;



  constructor(public navCtrl: NavController,
              public schedulersService: SchedulersProvider,
              private statusBar: StatusBar,
              private alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener,
              private zone: NgZone,
              private filePath: FilePath
              ){
    this.statusBar.backgroundColorByHexString('#2085c1');
    console.log('viewDidLoad');
    this.schedulersService.load();
    this.schedulersService.loadTemplates();

    let promise = this.schedulersService.loadSchedulers();
    promise.then((val)=>{
      if(val == null){
        this.schedulersService.emptyList=true;
      }
      else if(val.length == 0){
        this.schedulersService.emptyList=true;
      }
      else{
        this.schedulersService.emptyList=false;
      }
        this.schedulersService.scheds = val;
        this.schedulers=val;
        console.log('scheds:::')
        console.log(this.schedulers);
    });
  }

  ionViewDidLoad(){

    this.zone.run(()=>{
      this.schedulersService.load();
      this.schedulersService.loadTemplates();
    });

    /*
    let promise = this.schedulersService.loadSchedulers();
    promise.then((val)=>{
      if(val == null){
        this.schedulersService.emptyList=true;
      }
      else if(val.length == 0){
        this.schedulersService.emptyList=true;
      }
      else{
        this.schedulersService.emptyList=false;
      }
        this.schedulersService.scheds = val;
        this.schedulers=val;
    });
    */
  }

  ionViewWillEnter(){
    console.log('viewWillEnter');
    this.zone.run(()=>{
      this.schedulersService.load();
      this.schedulersService.loadTemplates();
    });
  }

  ionViewDidEnter(){
    console.log('viewdidenter');
    this.zone.run(()=>{
      this.schedulersService.load();
      this.schedulersService.loadTemplates();
    });/*
    this.schedulersService.load();
    this.schedulersService.loadTemplates();
    let promise = this.schedulersService.loadSchedulers();
    promise.then((val)=>{
      if(val == null){
        this.schedulersService.emptyList=true;
      }
      else if(val.length == 0){
        this.schedulersService.emptyList=true;
      }
      else{
        this.schedulersService.emptyList=false;
      }
        this.schedulersService.scheds = val;
        this.schedulers=val;
    });*/

  }

  openScheduler(scheduler : Scheduler){
    this.navCtrl.push(SchedulerPage,{
      scheduler : scheduler
    });
  }

  loadCreateScheduler(){
    this.navCtrl.push(SchedulerEditorPage);
  }

  refreshHomePage(){
    this.navCtrl.setRoot(HomePage);
  }

  shareScheduler(scheduler: Scheduler){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Compartir/Exportar Planificador',
      buttons: [
        {
          text: 'Exportar como PDF',
          icon: 'document',
          handler: () => {
            console.log('a PDF from Scheduler '+scheduler.id+' should be generated.');
            this.createPdf(scheduler);
            //this.downloadPdf();
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
      isEdit : 1,
      scheduler : scheduler
    });
  }

  loadTemplatesModal(){
    console.log(this.schedulersService.templates);
    let modal: Modal = this.modalCtrl.create(SchedulerTemplatesPage,{
      templates: this.schedulersService.templates,
    });
    modal.present();
  }



  //Create PDF
  createPdf(scheduler: Scheduler) {

  let image = {
    image: '',
    width: 100
  }

  let text = {
    text: '',
    width: 100
  }

  let rows = [];

  for(let i = 0; i<scheduler.categories.length; i++){
    for(let j = 0; j<scheduler.categories[i].items.length; j++){
      let txt = scheduler.categories[i].items[j].itemText;
      text.text = txt;
      let src :string = scheduler.categories[i].items[j].itemImage;
      image.image = src;


/*
      let promise = this.filePath.resolveNativePath(src);
      promise.then(filepath=>{
        console.log(filepath);
      });

      promise.catch(err=>{
        console.log(err);
      });
*/

      let path = image.image.substr(0, image.image.lastIndexOf('/') + 1);
      let fileName = image.image.substr(image.image.lastIndexOf('/')+1, image.image.length);

    //  let path2 = path.substr(0, path.lastIndexOf('/'));
      //let path3 = path2.substr(0, path2.lastIndexOf('/')+1);
      //console.log('path2: '+path3);
/*
      let p3 = this.file.checkDir(path2, 'arasaac');
      p3.then(res => {
        console.log(res);
      })
      p3.catch(err=>{
        console.log(err);
      })
*/

      console.log('file: '+image.image);
      console.log('path: '+path+', fileName: '+fileName);
      console.log("data directory is: "+this.file.dataDirectory);
      console.log("appStorage directory is: "+this.file.applicationStorageDirectory);

      /*let paht = this.file.applicationStorageDirectory;

      let pathG= this.file.applicationStorageDirectory.substr(0, this.file.applicationStorageDirectory.lastIndexOf('/')+1);

      console.log('Full path: '+this.file.applicationStorageDirectory);
      console.log('Trimmed: '+ pathG);*/


/*
      //let p4 = this.file.listDir('file:///data/user/0/', 'io.ionic.starter');
      let p4 = this.file.listDir('file:///android_asset/www/res/img/', 'arasaac');

      p4.then(res=>{
        console.log('dir...')
        console.log(res);
      })

      p4.catch(err=>{
        console.log(err);
      })

*/

  let promise2 =
      this.file.readAsDataURL('file:///android_asset/www/'+path, fileName);
      promise2.then(dataURL=>{

        this.sampleImage=dataURL;


        var docDefinition = {
          content: [
              {
          			image: this.sampleImage,
          		},
          ],
          pageOrientation: 'landscape',
        }

        this.pdfObj = pdfMake.createPdf(docDefinition);


        console.log(dataURL);
        image.image = dataURL;
        rows.push(image);
        this.downloadPdf(scheduler.name);
      })

      promise2.catch(err=>{
        console.log(err)
      })

    }
  }



}

downloadPdf(schedulerName) {
  if (this.plt.is('cordova')) {
    this.pdfObj.getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });

      let pdfName = schedulerName+'.pdf';
      // Save the PDF to the data Directory of our App
      this.file.writeFile(this.file.dataDirectory, pdfName, blob, { replace: true }).then(fileEntry => {
        // Open the PDf with the correct OS tools
        this.fileOpener.open(this.file.dataDirectory + pdfName, 'application/pdf');

      })
    });
  } else {
    // On a browser simply use download!
    this.pdfObj.download();
  }
}


}
