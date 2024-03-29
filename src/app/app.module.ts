import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule, FabContainer } from 'ionic-angular'
import { MyApp } from './app.component'

import {HttpClientModule} from '@angular/common/http'
import {HttpModule} from '@angular/http'


//Pages
import { HomePage } from '../pages/home/home'
import { AboutPage } from '../pages/about/about'
import { SchedulerPage } from '../pages/scheduler/scheduler'
import { SearchPictogramPage } from '../pages/search-pictogram/search-pictogram'
import { PresentationPage } from '../pages/presentation/presentation'
import { SchedulerTemplatesPage } from '../pages/scheduler-templates/scheduler-templates'
import { SchedulerEditorPage } from '../pages/scheduler-editor/scheduler-editor'

//Components

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { IonicStorageModule } from '@ionic/storage'
import { ReactiveFormsModule } from '@angular/forms'
//import { Scheduler, Items } from '../models/data-model'

import { File } from '@ionic-native/file'
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path'
import { Camera } from '@ionic-native/camera'

//providers
import { SchedulersProvider } from '../providers/schedulers/schedulers'
import { UserImagesProvider } from '../providers/user-images/user-images';
import { Screenshot } from '@ionic-native/screenshot'

import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    SchedulerPage,
    SearchPictogramPage,
    PresentationPage,
    SchedulerTemplatesPage,
    SchedulerEditorPage,
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
    SchedulerPage,
    SearchPictogramPage,
    PresentationPage,
    SchedulerTemplatesPage,
    SchedulerEditorPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FileOpener,
    Camera,
    FilePath,
    FabContainer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SchedulersProvider,
    HttpClientModule,
    UserImagesProvider,
    Screenshot,
    SocialSharing
  ]
})
export class AppModule {}
