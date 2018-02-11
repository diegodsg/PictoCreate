import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewSchedulerPage } from './new-scheduler';

@NgModule({
  declarations: [
    NewSchedulerPage,
  ],
  imports: [
    IonicPageModule.forChild(NewSchedulerPage),
  ],
})
export class NewSchedulerPageModule {}
