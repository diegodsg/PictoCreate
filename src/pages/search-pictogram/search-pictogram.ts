import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams,
         ViewController, Platform,
         LoadingController, Searchbar,
         ActionSheetController, ToastController, Loading, AlertController  } from 'ionic-angular'
import { File } from '@ionic-native/file'
import { FilePath } from '@ionic-native/file-path'
import { Camera } from '@ionic-native/camera'
import { Http } from '@angular/http'
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
              public userImagesService: UserImagesProvider,
              private alertCtrl: AlertController
            ) {

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

    this.userImagesService.loadImages();
    if(this.userImagesService.userImages !== null){
      this.onSearch("");
    }

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

          for(let i = 0; i < this.userImagesService.userImages.length; i++){
  					let v = this.userImagesService.userImages[i].name;
  					//if(value.toLowerCase().indexOf(this.searchbar.value.toLowerCase()) >= 0){
  					if(v !== undefined && v.toLowerCase().indexOf(value.toLowerCase()) >= 0){
  						this.total++;
  						//console.log("Found > ", value);
  						this.temp.push(this.userImagesService.userImages[i]);
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
    allowEdit: true,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    targetWidth: 500,
    targetHeight: 500
  };

  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

      //console.log('imagePath: '+imagePath);

      this.filePath.resolveNativePath(imagePath).then(filePath => {
          //console.log('filepath: '+filePath);
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          let imageData: UserImage = new UserImage();
          let imageName = this.createFileName()
          this.copyFileToLocalDir(correctPath, currentName, imageName, imageData);
/*
          let path = correctPath+'/'+currentName;

          console.log('path: '+correctPath);
          console.log('name: '+currentName);

          imageData.name = imageName;
          imageData.url  = path;
          this.userImagesService.addImage(imageData);
          this.userImagesService.saveImages();
          this.onSearch("");

          this.camera.cleanup();


*/


        });
    } else {
      let imageData: UserImage = new UserImage();
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), imageData);
/*
      let path = correctPath+'/'+currentName;

      console.log('path: '+correctPath);
      console.log('name: '+currentName);

      imageData.name = currentName;
      this.userImagesService.addImage(imageData);
      this.userImagesService.saveImages();
      this.onSearch("");

*/


    }
  }, (err) => {
    this.presentToast('Ha habido algún problema seleccionando la imagen.');
  });
}

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  console.log('newFileName: '+newFileName);
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName, image: UserImage) {

let alert = this.alertCtrl.create({
  title: 'Nombre',
  message:'Introduce un nombre para la imagen, servirá para buscar la imagen por este nombre',
  inputs: [
    {
      name: 'name',
      placeholder: 'Nombre'
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
    {
      text: 'OK',
      handler: data => {
        image.name = data.name;
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, image.name).then(success => {
          let id =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          this.lastImage = image.name;
          image.url = success.nativeURL;
          image.id = id;

          this.userImagesService.addImage(image);
          this.userImagesService.saveImages();
          this.onSearch("");
        }, error => {
          this.presentToast('Error while storing file.');
          this.onSearch("");
        }
      );
      }
    }
  ]
});
alert.present();
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
