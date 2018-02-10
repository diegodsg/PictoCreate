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

  //hide back button.
  hideBackFAB: boolean = false;

  //Description Form
  slideOneForm: FormGroup;

  //Scheduler Content Form
  slideTwoForm: FormGroup;

  //wrong submit msg warning
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
        image: [''],
        text: [''],
    });
  }

  ionViewDidLoad() {
    this.hideBackFAB = true;
  }

  next() {
    this.schedulerSlider.slideNext();
  }

  prev() {
    this.schedulerSlider.slidePrev();
  }

  addField(){
    console.log("trying to add field...")
  }

  save() {
    console.log(this.slideOneForm.value);
    console.log(this.slideTwoForm.value);
  }

  slideChanged() {
    let currentIndex = this.schedulerSlider.getActiveIndex();
    if(currentIndex!=0){
      this.hideBackFAB=false;
    }
    else{
      this.hideBackFAB=true;
    }
}

}
