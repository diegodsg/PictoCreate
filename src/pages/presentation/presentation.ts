import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Scheduler, Item } from '../../models/data-model'
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
  favedItems: Item[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentScheduler = this.navParams.get("scheduler");

  }

  ionViewDidLoad() {
    this.loadFaved();
    console.log(this.favedItems);
  }

  loadFaved(){
    for(let i = 0; i<this.currentScheduler.categories.length; i++){
      for(let j = 0; j<this.currentScheduler.categories[i].items.length; j++){
        if(this.currentScheduler.categories[i].items[j].itemFav == true){
          this.favedItems.push(this.currentScheduler.categories[i].items[j]);
        }
      }
    }
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
