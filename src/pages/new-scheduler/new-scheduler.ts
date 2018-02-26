import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Items, Scheduler } from '../../models/data-model';
import { SearchPictogramPage } from '../../pages/search-pictogram/search-pictogram'
import { SchedulerPage } from '../../pages/scheduler/scheduler'

import { SchedulersProvider } from '../../providers/schedulers/schedulers'
import { Screenshot } from '@ionic-native/screenshot'



import { File } from '@ionic-native/file';

/**
 * Generated class for the NewSchedulerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-new-scheduler',
  templateUrl: 'new-scheduler.html',
})
export class NewSchedulerPage implements OnChanges {
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              public modalCtrl: ModalController,
              public schedulerService: SchedulersProvider,
              private screenshot: Screenshot,
              private file: File,) {
    this.createForm();
  }

  @Input() scheduler: Scheduler;
  schedulerForm: FormGroup;

  textOnly : boolean = false; //Controls show/hide images

  screen: any;
  state: boolean = false;

  ionViewDidLoad() {
    this.schedulerForm.patchValue({type: 'isNormal'});
  }

  createForm(){
    this.schedulerForm = this.fb.group({
      name: ['', Validators.required],
      type: '',
      items: this.fb.array([])
    });
  }

  setItems(items: Items[]){
    const itemsFGs = items.map(items => this.fb.group(items));
    const itemsFromArray = this.fb.array(itemsFGs);
    this.schedulerForm.setControl('items', itemsFromArray);
  }

  get items(): FormArray {
    return this.schedulerForm.get('items') as FormArray;
  }

  addItem(){
    let newItem = new Items();
    newItem.image = "assets/imgs/placeholder_pictogram.png"
    this.items.push(this.fb.group(newItem));
  }

  deleteItem(index: any){
    this.items.removeAt(index);
  }


  ngOnChanges(){
    this.schedulerForm.reset({
      name: this.scheduler.name,
      type: this.scheduler.type,
    });
    this.setItems(this.scheduler.items)
  }

  select(type){
    if(type == "isText"){
      this.textOnly = true;
    }
    else{
      this.textOnly = false;
    }
  }

  pictogramSearch(i){
    let modal: Modal = this.modalCtrl.create(SearchPictogramPage);
    modal.present();
    modal.onDidDismiss((data)=>{
      console.log(data);
      if(data != null){
        this.items.controls[i].patchValue({image: data.url});
      }
    })
  }


    savePicto(){
      //create random ID
      let id =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      this.screenshot.URI(10).then(res=>{
        //console.log(res);
      });

      //android filesystem path
      let path = this.file.dataDirectory;

      //creates dataDirectory/preview directory if it doesn't exist
      this.file.createDir(path, 'previews', false).then(res=>{
        //console.log(res);
      }, res=>{/*console.log('error')*/});

      //path for the preview screenshot
      let url = path + '/previews/' + id;



      //take the screenshot and save it to the url
      this.screenshot.URI(30).then(image=>{
          this.file.writeFile(path, id+'.jpg', image,  {append: false, replace:false}).then(res=>{
              //console.log(res);
          })
      });
      //save name, type and items
      this.scheduler = this.schedulerForm.value;

      //save randomly-generated id
      this.scheduler.id = id;

      //save preview url
      this.scheduler.preview = url+'.jpg';

      //call to the provider in order to permanently-store it
      this.schedulerService.addScheduler(this.scheduler);

      this.navCtrl.pop();
    }


/*
    onSubmit() {
      this.scheduler = this.prepareSaveHero();
      this.heroService.updateHero(this.hero).subscribe(// error handling);
      this.ngOnChanges();
    }
*/




  }
