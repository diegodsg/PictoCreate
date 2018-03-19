import { IonicPage, NavController, NavParams, ModalController, Modal, FabContainer  } from 'ionic-angular';
import { Component, OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Item, Category, Scheduler } from '../../models/data-model';
import { SearchPictogramPage } from '../../pages/search-pictogram/search-pictogram'
import { SchedulerPage } from '../../pages/scheduler/scheduler'

import { SchedulersProvider } from '../../providers/schedulers/schedulers'

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
  edit: boolean = false;

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public modalCtrl: ModalController, fab: FabContainer, public schedulerService: SchedulersProvider) {

    this.edit = this.navParams.get("isEdit");
    if (this.edit == true){
      this.scheduler = this.navParams.get("scheduler");
      this.createForm();
      this.setForm(this.scheduler);

    }
    else{
      this.createForm();
    }

  }

  createForm(){
    this.schedulerForm = this.fb.group({
    // you can also set initial formgroup inside if you like
    id: [''],
    name: [''],
    preview: [''],
    hasImage: true,
    hasText: true,
    categories: this.fb.array([])
    })
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
      console.log('potatoe');
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
    let modal: Modal = this.modalCtrl.create(SearchPictogramPage);
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

  savePicto(){
    //create random ID
    let id =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.scheduler = this.schedulerForm.value;
    this.scheduler.preview = this.scheduler.categories[0].items[0].itemImage;
    if(this.edit == false || this.edit==undefined){
      this.scheduler.id = id;
      this.schedulerService.addScheduler(this.scheduler);
    }
    else{
      this.schedulerService.updateScheduler(this.scheduler);
    }
    this.navCtrl.pop();
  }
}
