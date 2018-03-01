import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchedulerTemplatesPage } from './scheduler-templates';

@NgModule({
  declarations: [
    SchedulerTemplatesPage,
  ],
  imports: [
    IonicPageModule.forChild(SchedulerTemplatesPage),
  ],
})
export class SchedulerTemplatesPageModule {}
