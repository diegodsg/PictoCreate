import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Items, Scheduler } from '../../models/data-model';
import { SearchPictogramPage } from '../../pages/search-pictogram/search-pictogram'
//import { SchedulersProvider } from '../../providers/schedulers/schedulers'

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
              public modalCtrl: ModalController
            /*public schedulerService: SchedulersProvider*/) {
    this.createForm();
  }

  @Input() scheduler: Scheduler;
  schedulerForm: FormGroup;

  ionViewDidLoad() {
  console.log('ionViewDidLoad NewSchedulerPage');
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

  select(type: ''){
    console.log(type);
  }

  pictogramSearch(i){
    console.log(i+" clicked")
    let modal: Modal = this.modalCtrl.create(SearchPictogramPage);

    modal.present();

    modal.onDidDismiss((data)=>{
      console.log(data);
      if(data != null){
        this.items.controls[i].patchValue({image: data.url});
        this.schedulerForm.value.items[i].image = data.url;
      }
    })


  }

    save(){
      console.log(this.schedulerForm.value);
      //this.schedulerService.saveScheduler(this.schedulerForm.value);
    }


/*
    onSubmit() {
      this.scheduler = this.prepareSaveHero();
      this.heroService.updateHero(this.hero).subscribe(// error handling);
      this.ngOnChanges();
    }
*/

  }
