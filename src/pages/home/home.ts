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

//File-sharing
import { SocialSharing } from '@ionic-native/social-sharing';

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
              public toastCtrl: ToastController,
              private socialSharing: SocialSharing
              ){
    this.statusBar.backgroundColorByHexString('#2085c1');
    console.log('viewDidLoad');
    this.schedulersService.load();
    this.schedulersService.loadTemplates();
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
            this.createB64(scheduler);
          }
        },{
          text: 'Exportar como Archivo',
          icon: 'code',
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

  //Take all images from the scheduler and fill a base64 array of images
  createB64(scheduler: Scheduler) {
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
      //console.log('path: '+path+', filename: '+fileName);
      let promiseB64 = this.file.readAsDataURL(path, fileName);

      //push promise intro promises
      promises.push(promiseB64);
      this.texts.push(item.itemText);
      //console.log(promises);
    }
  }

  var createBodyPromise;

  Promise.all(promises).then(res=>{
    //console.log(res);
    //let count = 0;
    res.forEach(imagen=>{
      this.base64.push(imagen);
/*
      count++;
      if(count==res.length){
        this.createBody(this.base64, this.texts, scheduler.name);
        console.log("Creating body")
      }
      */
    });
    console.log(this.base64);
    this.createBody(this.base64, this.texts, scheduler.name);

  });



}

//take a bunch of base64 images and their respective text and create the body structure of the pdf
createBody(images, texts, pdfName){
  let imgRow = [];
  let txtRow = [];

  if(images.length==texts.length){
    let i=0;
    //take the b64 image array and pop it in a "pdf-formatted array"
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
    //same as before with the text
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

    //content stores the whole body of the pdf document
    var content = [];

    //we first create and push the scheduler title
    let title = {
			text: pdfName,
			style: 'header',
      marginBottom: 20
		};
    content.push(title);

    //the plan is pushing images/texts in rows of 6
    //then we need to break to the next page each 3 rows
    let pageBreak = 0;
    let pageBreaker = {
      text: ' ',
      pageBreak: "after",
      width: 0
    }

    //these variables will store a row of 6
    let img = [];
    let text = [];

    let count = 0;
    let totalItems = imgRow.length; //this one won't change
    let elements = imgRow.length; //regressive count

    while(count<totalItems){
      //fill columns 1-5
      if((count+1)%6!=0){
        img.push(imgRow.pop());
        text.push(txtRow.pop());
      }
      //when we hit the 6th column, we push it into the content
      else{
        img.push(imgRow.pop());
        text.push(txtRow.pop());
        //before pushing these into content, we need to "format" everything again.
        let iR = {
          columns: img
        }
        let tR = {
          columns: text
        }

        //this is some magic, if you push the row directly it overwrites it...
        //So we turn it into a string to turn it into an object again... Well, now it works.
        content.push(JSON.parse(JSON.stringify(iR)));
        content.push(JSON.parse(JSON.stringify(tR)));

        //empty the used arrays
        img.length=0;
        text.length=0;
        pageBreak++;
      }
      //if the scheduler ends and we haven't hit the 6th column, we need to push the last remaining
      if((count+1)%6!=0 && elements==1){
        let iR = {
          columns: img
        }
        let tR = {
          columns: text
        }

        //more of the same magic...
        content.push(JSON.parse(JSON.stringify(iR)));
        content.push(JSON.parse(JSON.stringify(tR)));
      }

      //every 3 rows... pageBreaker
      if(pageBreak==3){
        content.push(JSON.parse(JSON.stringify(pageBreaker)));
        pageBreak=0;
      }
      elements--;
      count++;
    }

    console.log('Generating pdf...');
    this.generatePDF(content, pdfName);

  }
  else{
    console.log('error, item text and images dont match.')
  }
}

//create the pdf structure with the content and the name
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

createJSON(scheduler){
  //scheduler object to JSON string
  let content: string = JSON.stringify(scheduler);
  //file creation on dataDirectory (as a promise)
  let createPromise = this.file.createFile(this.file.dataDirectory, scheduler.name, true);
  createPromise.then(fileEntry=>{
    //the file is created, we can now write
    let writePromise = this.file.writeFile(this.file.dataDirectory, fileEntry.name+'.pictos', content, {replace:true, append:false});
    writePromise.then(writtenFile=>{
      //once the file is written, we can share it
      let sharePromise = this.socialSharing.share("Planificador con Pictogramas",fileEntry.name+'.pictos', writtenFile.nativeURL);
      sharePromise.then(res=>{
        console.log(res);
      });
      //error sharing the file
      sharePromise.catch(shareErr=>{
        console.log(shareErr);
      });
    });
    //error writing on the file
    writePromise.catch(writeErr=>{
      console.log(writeErr);
    });
  });
  //error creating the file
  createPromise.catch(err=>{
    console.log(err);
  });

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
