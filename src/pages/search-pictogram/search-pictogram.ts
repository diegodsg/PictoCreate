import { Component, ViewChild } from '@angular/core'

import { IonicPage, NavController, NavParams,
         ViewController, Platform,
         LoadingController, Searchbar,
         ActionSheetController, ToastController, Loading } from 'ionic-angular'

import { File } from '@ionic-native/file'
import { FilePath } from '@ionic-native/file-path'
import { Camera } from '@ionic-native/camera'

import { Http } from '@angular/http'
//import { HttpClientModule } from '@angular/common/http';
//import { HttpModule } from '@angular/http';

import { Storage } from '@ionic/storage'

import { UserImage } from '../../models/data-model'
import { UserImagesProvider } from '../../providers/user-images/user-images'

import 'rxjs/add/operator/map' //add aditional properties of an Observable

declare var cordova: any;
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

  @ViewChild('searchBar') searchbar:Searchbar;

  type: string = "0";

  pictograms: Array<any> = [];
  favourites: Array<any> = [];
  personal: Array<UserImage> = [];

  temp: Array<any> = [];

  results: Array<any> = [];
  keys: Array<string> = [];
  total: number = 0;
  cnt: number = 0;
  batch: number = 15;

  lastImage: string = null;
  loading: Loading;

  image: UserImage;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public platform: Platform,
              public http: Http,
              public storage: Storage,
              public viewCtrl: ViewController,
              private camera: Camera,
              private file: File,
              private filePath: FilePath,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public userImagesService: UserImagesProvider
            ) {

    this.image = new UserImage();
    this.image.url = 'assets/imgs/placeholder_pictogram.png';
    this.image.name = 'lul';

    var path = "";
		 	if(this.platform.is('android') && !this.platform.is('mobileweb')){
		 	path = "/android_asset/www";
		}

	 	http.get(path+'/res/img/arasaac.json').map(res => res.json())
	 		.subscribe(data => {
				this.pictograms = data;
	 		});

		storage.get("_favourites").then((data) => {
			console.log(data);
			if(data !== null){
				this.favourites = data;
				this.onSearch("");
			}
		});

		storage.get("_personalPicto").then((data) => {
			console.log("personal pictos", data);
			if(data !== null){
				this.personal = data;
				this.onSearch("");
			}
		});

  }

  	 decode(uri){
  		 let d_uri = decodeURI(uri);
  		 //console.log(uri, d_uri);
  		 return d_uri;
  	 }

  	 onSegmentChange(event){
  		 this.searchbar.value = "";
  		 this.onSearch("");
  	 }

  	onCancel(event){ }

    onInput(event){
  	  this.onSearch(event.target.value);
  	}

  	selectPictogram(picto){
  		this.viewCtrl.dismiss(picto);
  	}

  	onSearch(value){
  		this.results = [];
  		this.temp = [];
  		this.cnt = 0;
  		this.total = 0;
  		//if(this.searchbar.value !== ""){
  		switch(this.type){
  			case "0":
  			for(let i = 0; i < this.favourites.length; i++){
  				let v = this.favourites[i].name;
  				//if(value.toLowerCase().indexOf(this.searchbar.value.toLowerCase()) >= 0){
  				if(v !== undefined && v.toLowerCase().indexOf(value.toLowerCase()) >= 0){
  					this.total++;
  					//console.log("Found > ", value);
  					this.temp.push(this.favourites[i]);
  				}
  			}
  				break;
  			case "1":
  				for(let i = 0; i < this.pictograms.length; i++){
  					let v = this.pictograms[i].name;
  					//if(value.toLowerCase().indexOf(this.searchbar.value.toLowerCase()) >= 0){
  					if(v !== undefined && v.toLowerCase().indexOf(value.toLowerCase()) >= 0){
  						this.total++;
  						//console.log("Found > ", value);
  						this.temp.push(this.pictograms[i]);

  					}
  				}
  				break;
  			case "2":
  				for(let i = 0; i < this.personal.length; i++){
  					let v = this.personal[i].name;
  					//if(value.toLowerCase().indexOf(this.searchbar.value.toLowerCase()) >= 0){
  					if(v !== undefined && v.toLowerCase().indexOf(value.toLowerCase()) >= 0){
  						this.total++;
  						//console.log("Found > ", value);
  						this.temp.push(this.personal[i]);
  					}
  				}
  				break;

  		}

  			let max =  this.total > this.batch ? this.batch : this.total;
  			for(let j = 0; j < max ; j++){
  				this.results.push(this.temp[j]);
  				this.cnt++;
  			}
        console.log('this temp:');
        console.log(this.temp);
  	}

  	canLoadMore(){
  		return this.total - this.cnt > 0 ? true : false;
  	}

  	doInfinite(event) {
  	 let self = this;
  	 setTimeout(() => {
  		 let max = self.total - self.cnt > self.batch ? self.cnt + self.batch : self.total;

  		 if(max > 0){
  			 for (var i = self.cnt; i < max; i++) {
  				 self.results.push(self.temp[i]);
  				 self.cnt++;
  			 }
  		  event.complete();
  	 	}else{
  		 event.complete();
  	 	}
  	}, 15);

   }

  	ngAfterViewInit() {

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

  public presentActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };

  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

          let path = correctPath+'/'+currentName;

          let imageData: UserImage = new UserImage();

          console.log(path);
          console.log(currentName);

          imageData.name = currentName;
          imageData.url  = path;

          this.userImagesService.saveImage(imageData);

        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      console.log(correctPath+'/'+currentName);
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}

private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

// Always get the accurate path to your apps folder
public pathForImage(img){
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}



}
