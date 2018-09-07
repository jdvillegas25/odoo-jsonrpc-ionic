import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { EvenDetailPage } from '../pages/even-detail/even-detail';
import { PerfilPage } from '../pages/perfil/perfil';
import { ContactoPage } from '../pages/contacto/contacto';
import { FaqPage } from '../pages/faq/faq';
import { ProximoPage } from '../pages/proximo/proximo';
import { MapaPage } from '../pages/mapa/mapa';
import { PuntoPage } from '../pages/punto/punto';
import { PromocionPage } from '../pages/promocion/promocion';
import { PromoDetailPage } from '../pages/promo-detail/promo-detail';
import { CrearCuentaPage } from '../pages/crear-cuenta/crear-cuenta';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgCalendarModule  } from 'ionic2-calendar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { File } from '@ionic-native/file';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ContactoPage,
    ProximoPage,
    FaqPage,
    MapaPage,
    PuntoPage,
    PromocionPage,
    PromoDetailPage,
    EvenDetailPage,
    PerfilPage,
    CrearCuentaPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ContactoPage,
    ProximoPage,
    FaqPage,
    MapaPage,
    PuntoPage,
    PromocionPage,
    PromoDetailPage,
    EvenDetailPage,
    PerfilPage,
    CrearCuentaPage
  ],
  providers: [
    Base64ToGallery,  
    Camera,
    File,
    Network,
    PhotoViewer,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
