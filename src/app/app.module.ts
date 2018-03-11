import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'
import { MyApp } from './app.component'

import {HttpClientModule} from '@angular/common/http'
import {HttpModule} from '@angular/http'


//Pages
import { HomePage } from '../pages/home/home'
import { AboutPage } from '../pages/about/about'
import { ListPage } from '../pages/list/list'
import { SchedulerPage } from '../pages/scheduler/scheduler'
import { NewSchedulerPage } from '../pages/new-scheduler/new-scheduler'
import { SearchPictogramPage } from '../pages/search-pictogram/search-pictogram'
import { PresentationPage } from '../pages/presentation/presentation'
import { SchedulerTemplatesPage } from '../pages/scheduler-templates/scheduler-templates'
import { SchedulerEditorPage } from '../pages/scheduler-editor/scheduler-editor'

//Components
import { ColorPickerComponent } from '../components/color-picker/color-picker'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { IonicStorageModule } from '@ionic/storage'
import { ReactiveFormsModule } from '@angular/forms'
//import { Scheduler, Items } from '../models/data-model'

import { File } from '@ionic-native/file'
import { FilePath } from '@ionic-native/file-path'
import { Camera } from '@ionic-native/camera'

//providers
import { SchedulersProvider } from '../providers/schedulers/schedulers'
//import { Screenshot } from '@ionic-native/screenshot'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ListPage,
    SchedulerPage,
    NewSchedulerPage,
    SearchPictogramPage,
    PresentationPage,
    SchedulerTemplatesPage,
    SchedulerEditorPage,
    ColorPickerComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    ListPage,
    SchedulerPage,
    NewSchedulerPage,
    SearchPictogramPage,
    PresentationPage,
    SchedulerTemplatesPage,
    SchedulerEditorPage,
    ColorPickerComponent,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    Camera,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SchedulersProvider,
    HttpClientModule,
    //Screenshot,
    //File,
  ]
})
export class AppModule {}
