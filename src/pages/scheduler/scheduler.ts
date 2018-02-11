import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgModel } from '@angular/forms'

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

  image = 'assets/imgs/placeholder_pictogram.png'

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

  //items ara
  items: any[]=[];

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public alertCtrl: AlertController) {

    this.slideOneForm = formBuilder.group({
        name: [''],
        description: [''],
        schedType: [''],
    });

    this.slideTwoForm = formBuilder.group({
        items: this.formBuilder.array([this.createItem()])
    });

    }

  createItem(): FormGroup {
    return this.formBuilder.group({
      image: '',
      text: ''
    });
  }

/*
  addItem(): void {
    this.items = this.slideTwoForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
*/

  ionViewDidLoad() {
    this.hideBackFAB = true;
    this.slideTwoForm = this.formBuilder.group({
      image: '',
      text: '',
      items: this.formBuilder.array([this.createItem()])
    });
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

  popUpSearch(){
    console.log("search should pop-up.")
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
/*
{
  text: 'Login',
  handler: data => {
    if (User.isValid(data.username, data.password)) {
      // logged in!
    } else {
      // invalid login
      return false;
    }
  }
}*/
      ]
    });
    alert.present();
  }


}
