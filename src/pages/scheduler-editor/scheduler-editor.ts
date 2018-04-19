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

    /*There are different ways to use the editor
      0: new
      -for the next ones we need to receive a scheduler as a parameter-
      1: edit
      2: template
      3: create new from template
    */
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
  }

  //creates the form and adds a category
  createForm(){
    this.schedulerForm = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      preview: [''],
      hasImage: true,
      hasText: true,
      categories: this.fb.array([])
    })
    this.addNewCategory();
  }

  //receive scheduler and displays it on the editor
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
        items: this.fb.array([
          this.fb.group({
            itemText: [''],
            itemImage: ['assets/imgs/placeholder_pictogram.png'],
            itemFav:[false],
            isPersonal:false,
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
        isPersonal:[false]
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
  }

  get categories(): FormArray {
    return <FormArray>this.schedulerForm.get('categories') as FormArray;
  }

  pictogramSearch(i, j){
    let modal: Modal = this.modalCtrl.create(SearchPictogramPage, undefined, {cssClass: "modal-fullscreen"});
    modal.present();
    modal.onDidDismiss((data)=>{
      if(data != null){
        let path = data.url.substr(0,1);
        let fromArasaac : boolean = path == 'r';
        let item = <FormArray> this.categories.controls[i].get('items');
        if(fromArasaac == false){
          item.controls[j].patchValue({isPersonal: true});
        }
        else{
          item.controls[j].patchValue({isPersonal: false});
        }
        item.controls[j].patchValue({itemImage: data.url});
        console.log(item.controls[j]);

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
    //check some values first...
    if(this.schedulerForm.get('name').value==""){
      this.presentToast("Introduce un nombre para el planificador");
    }
    else if(this.schedulerForm.get('categories').value.length<1){
      this.presentToast("El planificador está vacío");
    }
    else{
      //allright, let's save it or update it...
      //create random (enough?) ID
      let id =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.screenshot.save('jpg', 80, id).then(res => {
          this.scheduler = this.schedulerForm.value;
          //this.scheduler.preview = this.scheduler.categories[0].items[0].itemImage;
          this.scheduler.preview = res.filePath;
          //this.scheduler.preview = 'assets/imgs/plantillaV.png'
          if(this.edit == 0 || this.edit==3 || this.edit==undefined){
          /*
              this.scheduler.id = id;
              this.schedulerService.addScheduler(this.scheduler);
              */
              this.scheduler.id = id;
              this.schedulerService.addSchedulerb(this.scheduler).then(res=>{
                if(res==undefined){
                    res = [];
                }
                this.schedulerService.storage.get('listSize').then((numScheds) => {
                    if(numScheds==undefined){
                        numScheds = 1;
                    }
                    numScheds++;
                    res.push(this.scheduler);
                    console.log(res);
                    this.schedulerService.storage.set(this.schedulerService.scheduler_key, res);
                    this.schedulerService.storage.set('listSize',numScheds);
                    this.schedulerService.loadb().then((val) => {
                          if(val == null){
                            this.schedulerService.emptyList=true;
                          }
                          else if(val.length == 0){
                            this.schedulerService.emptyList=true;
                          }
                          else{
                            this.schedulerService.emptyList=false;
                          }
                          this.schedulerService.scheds=val;
                        });
                    this.navCtrl.pop();
                });
              });
          }
          else if(this.edit == 1){
              this.schedulerService.updateSchedulerb(this.scheduler).then((res)=>{
                this.schedulerService.loadb().then((val) => {
                      if(val == null){
                        this.schedulerService.emptyList=true;
                      }
                      else if(val.length == 0){
                        this.schedulerService.emptyList=true;
                      }
                      else{
                        this.schedulerService.emptyList=false;
                      }
                      this.schedulerService.scheds=val;
                    });
                this.navCtrl.pop();
              });;
          }
          else if(this.edit== 2){
              this.schedulerService.addTemplateb(this.scheduler).then((res) => {
                  if(res==undefined){
                      res = [];
                  }
                  this.schedulerService.storage.get('listSize_templates').then((numScheds) => {
                      if(numScheds==undefined){
                          numScheds = 1;
                      }
                      numScheds++;
                      res.push(this.scheduler);
                      console.log(res);
                      this.schedulerService.storage.set(this.schedulerService.template_key, res);
                      this.schedulerService.storage.set('listSize_templates',numScheds);
                      this.schedulerService.loadb().then((val) => {
                            if(val == null){
                              this.schedulerService.emptyList=true;
                            }
                            else if(val.length == 0){
                              this.schedulerService.emptyList=true;
                            }
                            else{
                              this.schedulerService.emptyList=false;
                            }
                            this.schedulerService.scheds=val;
                          });
                      this.schedulerService.loadTemplatesb().then((val) => {
                            this.schedulerService.templates=val;
                          });
                      this.navCtrl.pop();
                  });
              });
          }

          this.schedulerService.loadb().then((val) => {
                if(val == null){
                  this.schedulerService.emptyList=true;
                }
                else if(val.length == 0){
                  this.schedulerService.emptyList=true;
                }
                else{
                  this.schedulerService.emptyList=false;
                }
                this.schedulerService.scheds=val;
              });
          this.navCtrl.pop();

      });
    }
  }
}
