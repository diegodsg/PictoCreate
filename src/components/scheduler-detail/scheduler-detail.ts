import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
export class SchedulerDetailComponent {

  /*creado un formGroup con un formControl llamado name.
  Estara enlazado en el template varios input html para los valores del scheduler*/

  image = 'assets/imgs/placeholder_pictogram.png'

  schedulerForm: FormGroup;
  scheduler = schedulers[0];



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
      item: this.fb.group(new Items())
    });

    this.schedulerForm.setValue({
      name: '',
      item: this.scheduler.items[0] || new Items()
    });
  }
}
