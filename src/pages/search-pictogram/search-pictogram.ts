import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SearchPictogramPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-pictogram',
  templateUrl: 'search-pictogram.html',
})
export class SearchPictogramPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPictogramPage');
  }

  selectImg(){
    let data = {
      img: 'some_image_url'
    }
    this.viewCtrl.dismiss(data);
  }

}
