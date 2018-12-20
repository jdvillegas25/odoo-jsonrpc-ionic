import { AddCustomerPage } from '../pages/add-customer/add-customer';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { OdooJsonRpc } from '../services/odoojsonrpc';
import { ParallaxDirective } from '../directives/parallax/parallax';
import { ProfilePage } from '../pages/profile/profile';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ViewPage } from '../pages/view/view';
import { FormProbabilidadPage } from "../pages/form-probabilidad/form-probabilidad";
import { ProspectoPage } from "../pages/prospecto/prospecto";
import { ServicioPage } from "../pages/servicio/servicio"
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicStorageModule } from '@ionic/storage';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ViewPage,
    ProfilePage,
    ParallaxDirective,
    AddCustomerPage,
    FormProbabilidadPage,
    ProspectoPage,
    ServicioPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ViewPage,
    ProfilePage,
    AddCustomerPage,
    FormProbabilidadPage,
    ProspectoPage,
    ServicioPage
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    OdooJsonRpc,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileChooser,
    FileTransfer,
    FileTransferObject,
    Camera,
    AndroidPermissions
  ]
})
export class AppModule {}
