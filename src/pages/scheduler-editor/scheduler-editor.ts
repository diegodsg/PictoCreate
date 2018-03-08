import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Items, Scheduler } from '../../models/data-model';
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

  schedulerForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {
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
        //itemImage: [''],
        //itemFav:[''],
    }))
  }

  deleteItem(control, index) {
    control.removeAt(index)
  }

}
