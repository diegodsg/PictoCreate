import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';


//Pages
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ListPage } from '../pages/list/list';
import { SchedulerPage } from '../pages/scheduler/scheduler';
import { NewSchedulerPage } from '../pages/new-scheduler/new-scheduler'
import { SearchPictogramPage } from '../pages/search-pictogram/search-pictogram'
import { PresentationPage } from '../pages/presentation/presentation'

//Components
//import { SchedulerDetailComponent } from '../components/scheduler-detail/scheduler-detail'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera'
import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms'
//import { File } from '@ionic-native/file';
//import { Scheduler, Items } from '../models/data-model'

//providers
import { SchedulersProvider } from '../providers/schedulers/schedulers';
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
    PresentationPage
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
    PresentationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SchedulersProvider,
    HttpClientModule,
    //Screenshot,
    //File,
  ]
})
export class AppModule {}
