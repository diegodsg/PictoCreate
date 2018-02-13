import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPictogramPage } from './search-pictogram';

@NgModule({
  declarations: [
    SearchPictogramPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPictogramPage),
  ],
})
export class SearchPictogramPageModule {}
