import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Items, Scheduler, schedulers } from '../../models/data-model';

/**
 * Generated class for the SchedulerDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scheduler-detail',
  templateUrl: 'scheduler-detail.html'
})
export class SchedulerDetailComponent implements OnChanges {

  /*creado un formGroup con un formControl llamado name.
  Estara enlazado en el template varios input html para los valores del scheduler*/

  image = 'assets/imgs/placeholder_pictogram.png'


  @Input() scheduler: Scheduler;

  schedulerForm: FormGroup;
  defaultScheduler = schedulers[0];
  selectedScheduler : Scheduler;


  /*
  schedulerForm = new FormGroup({
    name: new FormControl()
  })
*/

  constructor(private fb: FormBuilder) {
    this.createForm();

  }

  createForm(){
    this.schedulerForm = this.fb.group({
      name: ['', Validators.required],
      type: '',
      items: this.fb.array([])
    });
/*
    this.schedulerForm.setValue({
      name: '',
      type: '',
      items: this.defaultScheduler.items[0] || new Items()
    });
    */
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
    this.items.push(this.fb.group(new Items()));
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

}
