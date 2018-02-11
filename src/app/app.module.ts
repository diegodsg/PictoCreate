import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

//Pages
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ListPage } from '../pages/list/list';
import { SchedulerPage } from '../pages/scheduler/scheduler';
import { NewSchedulerPage } from '../pages/new-scheduler/new-scheduler'

//Components
import { SchedulerDetailComponent } from '../components/scheduler-detail/scheduler-detail'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera'
import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms'

//providers
import { SchedulersProvider } from '../providers/schedulers/schedulers';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ListPage,
    SchedulerPage,
    NewSchedulerPage,
    SchedulerDetailComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule,
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
    SchedulerDetailComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SchedulersProvider
  ]
})
export class AppModule {}
