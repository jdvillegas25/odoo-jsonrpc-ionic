var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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
import { NgCalendarModule } from 'ionic2-calendar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
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
                Camera,
                StatusBar,
                SplashScreen,
                { provide: ErrorHandler, useClass: IonicErrorHandler }
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map