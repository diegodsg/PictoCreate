import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Scheduler, Items } from '../../models/data-model'
/**
 * Generated class for the PresentationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-presentation',
  templateUrl: 'presentation.html',
})
export class PresentationPage {
  @ViewChild(Slides) slides: Slides;
  currentScheduler: Scheduler;
  paused: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentScheduler = this.navParams.get("scheduler");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresentationPage');
    console.log(this.currentScheduler);
    this.slides;
  }

  startSlides(){
    this.slides.autoplay = '1000';
    this.slides.startAutoplay();
    this.paused = false;
  }

  pauseSlides(){
    this.slides.stopAutoplay();
    this.paused = true;
  }

  nextSlide(){
    this.slides.slideNext();
  }

  previousSlide(){
    this.slides.slidePrev();
  }

}
