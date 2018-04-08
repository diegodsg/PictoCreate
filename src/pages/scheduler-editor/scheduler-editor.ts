import { IonicPage, NavController, NavParams,
         ModalController, Modal, FabContainer,
         ToastController, AlertController} from 'ionic-angular';
import { Component, OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Scheduler } from '../../models/data-model';
import { SearchPictogramPage } from '../../pages/search-pictogram/search-pictogram';
import { HomePage } from '../../pages/home/home';

import { SchedulersProvider } from '../../providers/schedulers/schedulers';

import { Screenshot } from '@ionic-native/screenshot'

/**
 * Generated class for the SchedulerEditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheduler-editor',
  templateUrl: 'scheduler-editor.html',

})
export class SchedulerEditorPage {

  disableImage: boolean = false;
  disableText: boolean = false;
  toggle = {};
  edit = 0; //0 - creator , 1 - editor, 2 - template, 3 - create from template

  colors = {
    "color":[
    {
      val: "#ffffff"
    }, {
      val: "#ee4035"
    }, {
      val: "#f37736"
    }, {
      val: "#fdf498"
    }, {
      val: "#7bc043"
    }, {
      val: "#0392cf"
    },{
      val: "#222222"
    }
    ]
  }

  @Input() scheduler: Scheduler;
  schedulerForm: FormGroup;
  pageTitle: string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              public modalCtrl: ModalController,
              fab: FabContainer,
              public toastCtrl: ToastController,
              public schedulerService: SchedulersProvider,
              private screenshot: Screenshot,
              private alertCtrl: AlertController) {

    this.edit = this.navParams.get("isEdit");

    if (this.edit == 1){
      this.scheduler = this.navParams.get("scheduler");
      this.createForm();
      this.setForm(this.scheduler);
      this.pageTitle ="Editar Planificador";
    }
    else if(this.edit == 2){
      this.createForm();
      this.pageTitle = "Crear Plantilla";
    }
    else if(this.edit == 3){
      this.scheduler = this.navParams.get("scheduler");
      this.createForm();
      this.setForm(this.scheduler);
      this.pageTitle = "Crear Planificador"
    }
    else{
      this.edit = 0;
      this.createForm();
      this.pageTitle="Crear Planificador";
    }

    console.log(this.edit);

  }

  createForm(){
    this.schedulerForm = this.fb.group({
    // you can also set initial formgroup inside if you like
    id: [''],
    name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    preview: [''],
    hasImage: true,
    hasText: true,
    categories: this.fb.array([])
    })

    this.addNewCategory();
  }

  setForm(scheduler: Scheduler){
    this.schedulerForm.patchValue({
      id: scheduler.id,
      name: scheduler.name,
      preview: scheduler.preview,
      hasImage: scheduler.hasImage,
      hasText: scheduler.hasText,
    });

    let categoriesFGs = scheduler.categories.map(categories => this.fb.group(categories));
    let categoriesFromArray = this.fb.array(categoriesFGs);
    this.schedulerForm.setControl('categories', categoriesFromArray);

    for(let i=0; i<this.scheduler.categories.length; i++){
      let itemsFGs = scheduler.categories[i].items.map(items => this.fb.group(items));
      let itemsFromArray = this.fb.array(itemsFGs);
      let allCategories = <FormArray> this.schedulerForm.controls.categories as FormArray;
      let cat = <FormGroup> allCategories.controls[i] as FormGroup;
      cat.setControl('items', itemsFromArray);

      this.toggle[i]=true;
    }

  }

  addNewCategory() {
    let control = <FormArray>this.schedulerForm.controls.categories;
    control.push(
      this.fb.group({
        category: [''],
        color: ['#FFFFFF'],
        textColor: ['#000000'],
        // nested form array, you could also add a form group initially
        items: this.fb.array([
          this.fb.group({
            itemText: [''],
            itemImage: ['assets/imgs/placeholder_pictogram.png'],
            itemFav:[false],
        })
      ])
      })
    )
    this.toggle[control.length-1] = true;
  }

  deleteCategory(index) {
    let control = <FormArray>this.schedulerForm.controls.categories;
    control.removeAt(index);
  }

  addNewItem(control: FormArray) {
    control.push(
      this.fb.group({
        itemText: [''],
        itemImage: ['assets/imgs/placeholder_pictogram.png'],
        itemFav:[false],
    }))
  }

  deleteItem(control, index) {
    control.removeAt(index)
  }

  favItem(control, index) {

    if(control.controls[index].get("itemFav").value==false){
      control.controls[index].patchValue({itemFav: true});

    }
    else{
      control.controls[index].patchValue({itemFav: false});
    }
    console.log(control.controls[index].get("itemFav").value);
  }

  get categories(): FormArray {
    return <FormArray>this.schedulerForm.get('categories') as FormArray;
  }

  pictogramSearch(i, j){
    let modal: Modal = this.modalCtrl.create(SearchPictogramPage, undefined, {cssClass: "modal-fullscreen"});
    modal.present();
    modal.onDidDismiss((data)=>{
      console.log(data);
      if(data != null){
        /*patchValue({image: data.url})*/
        let item = <FormArray> this.categories.controls[i].get('items');
        item.controls[j].patchValue({itemImage: data.url});
      }
    })
  }

  selectCatColor(i, k, fab){

    let cat = <FormArray> this.schedulerForm.get('categories');
    let color = this.colors.color[k].val.replace('#', '');

    let bigint = parseInt(color, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

  	let yiq = ((r*299)+(g*587)+(b*114))/1000;

    cat.controls[i].patchValue({color: '#'+color});
    if(yiq >= 128){
      cat.controls[i].patchValue({textColor: '#000000'});
    }
    else{
      cat.controls[i].patchValue({textColor: '#FFFFFF'});
    }

    fab.close();
    this.toggle[i]=true;

  }

  //Hides/Show pictos or text
  select(){
    let imageCheckBox = this.schedulerForm.get('hasImage').value;
    let textCheckBox = this.schedulerForm.get('hasText').value;
    if(imageCheckBox == true && textCheckBox == false){
      this.disableImage = true;
      this.disableText = false;
    }
    else if(imageCheckBox == false && textCheckBox == true){
      this.disableText = true;
      this.disableImage = false;
    }
    else{
      this.disableText = false;
      this.disableImage = false;
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

  private presentToastBottom(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  saveAlert(){
    let saveConfirm = this.alertCtrl.create({
      title: 'Guardar',
      message: '¿Terminar y guardar este planificador?',
      buttons: [
        {
          text: 'Guardar',
          handler: () => {
          this.presentToastBottom("Guardando planificador");
          saveConfirm.dismiss();
          let TIME_IN_MS = 500;
          let hideFooterTimeout = setTimeout( () => {
            this.savePicto();
          }, TIME_IN_MS);
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
    saveConfirm.present();
  }



  savePicto(){
    //check values.
    if(this.schedulerForm.get('name').value==""){
      this.presentToast("Introduce un nombre para el planificador");
    }
    else if(this.schedulerForm.get('categories').value.length<1){
      this.presentToast("El planificador está vacío");
    }
    else{
      let id =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.screenshot.save('jpg', 80, id).then(res => {
          //create random ID
          this.scheduler = this.schedulerForm.value;
          //this.scheduler.preview = this.scheduler.categories[0].items[0].itemImage;
          this.scheduler.preview = res.filePath;
          //this.scheduler.preview = 'assets/imgs/plantillaV.png'
          console.log(this.scheduler);
          if(this.edit == 0 || this.edit==3 || this.edit==undefined){
              this.scheduler.id = id;
              this.schedulerService.addScheduler(this.scheduler);
          }
          else if(this.edit == 1){
              this.schedulerService.updateScheduler(this.scheduler);
          }
          else if(this.edit== 2){
              this.schedulerService.addTemplate(this.scheduler);
          }
              this.schedulerService.load();
              this.navCtrl.setRoot(HomePage);

      });
    }
  }
}
