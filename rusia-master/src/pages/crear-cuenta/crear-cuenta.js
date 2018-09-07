var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
/**
 * Generated class for the CrearCuentaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CrearCuentaPage = /** @class */ (function () {
    function CrearCuentaPage(navCtrl, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.mail = { para: 'tourgratisrusia@gmail.com', nombre: '', email: '', hotel: '', tel: '' };
    }
    CrearCuentaPage.prototype.solicitar = function () {
        if (this.mail.para.length < 3 || this.mail.email.length < 5 || this.mail.nombre.length < 2 || this.mail.hotel.length < 2 || this.mail.tel.length < 5) {
            this.presentAlert('Error!', 'Por favor ingresa correctamente todos los datos del formulario');
            return;
        }
        location.href = "mailto:" + this.mail.para + "?subject=Solicitud de Cuenta&body=Solicitud de cuenta para Tour Gratis Rusia:%0D%0A%0D%0ANombre:"
            + this.mail.nombre + "%0D%0AEmail: " + this.mail.email + "%0D%0ATel: " + this.mail.tel + "%0D%0AHotel: " + this.mail.hotel;
    };
    CrearCuentaPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    CrearCuentaPage = __decorate([
        Component({
            selector: 'page-crear-cuenta',
            templateUrl: 'crear-cuenta.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController])
    ], CrearCuentaPage);
    return CrearCuentaPage;
}());
export { CrearCuentaPage };
//# sourceMappingURL=crear-cuenta.js.map