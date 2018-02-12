import { Component, ViewChild } from '@angular/core';
import { NavParams, Platform } from 'ionic-angular';
import { LoadingController, Searchbar, ViewController } from 'ionic-angular';

import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';


@Component({
/*
  selector: 'filter-search',
  templateUrl: 'filter-search.html'
*/
	selector: 'filter-search',
	templateUrl: 'filter-search.html',
})

export class PictogramsList {
	@ViewChild('searchBar') searchbar:Searchbar;

	type: string = "0";

	pictograms: Array<any> = [];
	favourites: Array<any> = [];
	personal: Array<any> = [];

	temp: Array<any> = [];

	results: Array<any> = [];
	keys: Array<string> = [];
	total: number = 0;
	cnt: number = 0;
	batch: number = 15;

 constructor(
	 public params: NavParams,
	 public platform: Platform,
 	 public http: Http,
	 public storage: Storage,
 	 public loadingCtrl: LoadingController,
 	 public viewCtrl: ViewController) {
     /*
		 	var path = "";
 		 	if(this.platform.is('android') && !this.platform.is('mobileweb')){
			 	path = "/android_asset/www";
			}
*/
		 	http.get(path+'/res/img/arasaac.json').map(res => res.json()).subscribe(data => {
					this.pictograms = data;
		 		});

			storage.get("_favourites").then((data) => {
				//console.log(data);
				if(data !== null){
					this.favourites = data;
					this.onSearch("");
				}
			});

			storage.get("_personalPicto").then((data) => {
				//console.log("personal pictos", data);
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

}
