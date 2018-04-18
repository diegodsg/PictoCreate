import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, ActionSheetController,
         NavParams, ModalController, Modal,
         Platform, ToastController } from 'ionic-angular';

import { SchedulersProvider } from '../../providers/schedulers/schedulers';
import { SchedulerPage } from '../../pages/scheduler/scheduler';
import { SchedulerTemplatesPage } from '../../pages/scheduler-templates/scheduler-templates'
import { SchedulerEditorPage } from '../../pages/scheduler-editor/scheduler-editor'

import { Scheduler, Item, pdfText, pdfImage, pdfTextRow, pdfImageRow } from '../../models/data-model';
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

  images : string[];

  sampleImage : any;

  texts = []; //text from schedulers
  base64 = []; //base64 images


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
              private filePath: FilePath,
              public toastCtrl: ToastController
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
        console.log(this.schedulers);
    });
  }

  ionViewDidLoad(){

    this.zone.run(()=>{
      this.schedulersService.load();
      this.schedulersService.loadTemplates();
    });
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
    });
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
            this.presentToast("Generando PDF...");
            this.createPdf(scheduler);
            //this.downloadPdf();
          }
        },{
          text: 'Exportar como Archivo',
          icon: 'code-download',
          handler: () => {
            console.log('export as file');
            this.presentToast("Generando archivo...");
            this.createJSON(scheduler);
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
/*
  let content = []; //PDF structure
  let imageRow : pdfImageRow = new pdfImageRow();
  let iRow = [];

  let textRow : pdfTextRow = new pdfTextRow();
  let tRow = [];
*/

  var promises = [];

  for(let i = 0; i<scheduler.categories.length; i++){
    for(let j = 0; j<scheduler.categories[i].items.length; j++){

      //Obtain url and image text
      let item: Item = scheduler.categories[i].items[j];
      let src :string = item.itemImage;
      let isPersonal: boolean = item.isPersonal;

      //Obtain path+filename to use File's readAsDataURL
      let path = src.substr(0, src.lastIndexOf('/') + 1);
      let fileName = src.substr(src.lastIndexOf('/')+1, src.length);

      //if it's from arasaac, add the full path
      if(isPersonal == false){
        path = 'file:///android_asset/www/'+path;
      }

      //generate the B64 promise from the path+filename
      console.log('path: '+path+', filename: '+fileName);
      let promiseB64 = this.file.readAsDataURL(path, fileName);

      //push promise intro promises
      promises.push(promiseB64);
      this.texts.push(item.itemText);
    }
  }

  Promise.all(promises).then(res=>{
    let count = 0;
    res.forEach(imagen=>{
      this.base64.push(imagen);
      count++;
      if(count==res.length){
        this.createBody(this.base64, this.texts, scheduler.name);
      }
    });
    //console.log(this.base64);
  })

}

createBody(images, texts, pdfName){
  let imgRow = [];
  let txtRow = [];
  console.log('images: '+images.length+' texts: '+texts.length);
  if(images.length==texts.length){
    let i=0;
    while(images.length>0){
      let imageItem = {
      width: 100,
      image: images.pop()
      };
      console.log('iteration: '+i)
      console.log(imageItem);
      imgRow.push(imageItem);
      i++;
    }
    i=0;
    while(texts.length>0){
      let textItem = {
      text: texts.pop(),
      alignment: 'center',
      width: 100,
      marginBottom: 20,
      marginTop: 5
      };
      console.log('iteration: '+i)
      console.log(textItem);
      txtRow.push(textItem);
      i++;
    }

    var content = [];

    let title = {
			text: pdfName,
			style: 'header',
      marginBottom: 20
		};

    content.push(title);

    let elements = imgRow.length;

    let img = [];
    let text = [];
    let pageBreak = 0;

    let pageBreaker = {
      text: ' ',
      pageBreak: "after",
      width: 0
    }

    let count = 0;
    let totalItems = imgRow.length;
    while(count<totalItems){
      if((count+1)%6!=0){
        img.push(imgRow.pop());
        text.push(txtRow.pop());
      }
      else{
        img.push(imgRow.pop());
        text.push(txtRow.pop());

        let iR = {
          columns: img
        }

        let tR = {
          columns: text
        }

        content.push(JSON.parse(JSON.stringify(iR)));
        content.push(JSON.parse(JSON.stringify(tR)));

        img.length=0;
        text.length=0;
        pageBreak++;
      }
      if((count+1)%6!=0 && elements==1){
        let iR = {
          columns: img
        }
        let tR = {
          columns: text
        }

        content.push(JSON.parse(JSON.stringify(iR)));
        content.push(JSON.parse(JSON.stringify(tR)));
      }

      if(pageBreak==3){
        content.push(JSON.parse(JSON.stringify(pageBreaker)));
        pageBreak=0;
      }
      elements--;
      count++;
    }

    this.generatePDF(content, pdfName);

  }
  else{
    console.log('error, item text and images dont match.')
  }
}

generatePDF(content, pdfName){
  console.log(content);
  var docDefinition = {
    content: content,
    styles: {
      header: {
        fontSize: 18,
        bold: true
      }
    },
    pageOrientation: 'landscape',
    pageMargins: [40,40,40,40],
    defaultStyle: {
      columnGap: 30,
    }
  }
  this.pdfObj = pdfMake.createPdf(docDefinition);
  this.downloadPdf(pdfName);

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

private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}


}
