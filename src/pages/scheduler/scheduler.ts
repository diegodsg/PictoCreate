import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms'

/**
 * Generated class for the SchedulerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheduler',
  templateUrl: 'scheduler.html',
})
export class SchedulerPage {

  @ViewChild('schedulerSlider') schedulerSlider: any;

  public buttonClicked: boolean = false; //hide or show back button.

  //1 formGroup / Slide
  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  //submit button.
  submitAttemp: boolean = true;

  //radioButton model
  type: any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) {

    this.slideOneForm = formBuilder.group({
        name: [''],
        description: [''],
        schedType: [''],
    });

    this.slideTwoForm = formBuilder.group({
        username: [''],
        privacy: [''],
        bio: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulerPage');
    this.buttonClicked = true;
  }

  next() {
    this.schedulerSlider.slideNext();
  }

  prev() {
    this.schedulerSlider.slidePrev();
  }

  save() {
    console.log(this.slideOneForm.value);
    console.log(this.slideTwoForm.value);
  }

  slideChanged() {
    let currentIndex = this.schedulerSlider.getActiveIndex();
    console.log('Current index is', currentIndex);
    if(currentIndex!=0){
      this.buttonClicked=false;
    }
    else{
      this.buttonClicked=true;
    }
}

}
