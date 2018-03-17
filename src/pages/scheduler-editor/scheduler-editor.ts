import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Items, Scheduler } from '../../models/data-model';
import { SearchPictogramPage } from '../../pages/search-pictogram/search-pictogram'
import { SchedulerPage } from '../../pages/scheduler/scheduler'

import { SchedulersProvider } from '../../providers/schedulers/schedulers'
import { ColorPickerComponent } from '../../components/color-picker/color-picker'

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

  schedulerForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public modalCtrl: ModalController) {
    this.schedulerForm = this.fb.group({
    // you can also set initial formgroup inside if you like
    name: '',
    hasImage: true,
    hasText: true,
    categories: this.fb.array([])
    })
  }

  addNewCategory() {
    let control = <FormArray>this.schedulerForm.controls.categories;
    control.push(
      this.fb.group({
        category: [''],
        color: ['#FFFFFF'],
        textColor: ['#000000'],
        // nested form array, you could also add a form group initially
        items: this.fb.array([])
      })
    )
  }

  deleteCategory(index) {
    let control = <FormArray>this.schedulerForm.controls.categories;
    control.removeAt(index);
  }

  addNewItem(control) {
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

/*
  launchColorPicker(i){
    let modal: Modal = this.modalCtrl.create(ColorPickerComponent);
    modal.present();
    modal.onDidDismiss((data)=>{
      console.log(data);
      if(data != null){
        //patchValue({image: data.url})
        this.categories.controls[i].get('color').patchValue({color: data.url});;
      }
    })
  }
  */

  selectCatColor(i, k){
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

}
