import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchedulerEditorPage } from './scheduler-editor';

@NgModule({
  declarations: [
    SchedulerEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(SchedulerEditorPage),
  ],
})
export class SchedulerEditorPageModule {}
