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
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as Odoo from 'odoo-xmlrpc';
import { DomSanitizer } from '@angular/platform-browser';
import { PromoDetailPage } from '../../pages/promo-detail/promo-detail';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
/**
 * Generated class for the PromocionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PromocionPage = /** @class */ (function () {
    //promocion = {city:'', numero:0, items:[]};
    function PromocionPage(navCtrl, navParams, alertCtrl, _DomSanitizer, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this._DomSanitizer = _DomSanitizer;
        this.storage = storage;
        this.items = [];
        this.cargar = true;
        var self = this;
        self.items = [];
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, { borrar: true, login: null });
            }
            else {
                var odoo = new Odoo(val);
                _this.storage.get('tours.promociones').then(function (val) {
                    if (val == null) {
                        odoo.connect(function (err) {
                            if (err) {
                                return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                            }
                            var inParams = [];
                            inParams.push([['id', '<>', '0']]);
                            inParams.push(['id', 'promocion', 'city_id', 'name']); //fields
                            var params = [];
                            params.push(inParams);
                            odoo.execute_kw('tours.promociones', 'search_read', params, function (err2, value) {
                                if (err2) {
                                    return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                                }
                                for (var key in value) {
                                    (value[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (value[key]).promocion);
                                    (value[key]).city = (value[key]).city_id[1];
                                    self.items.push(value[key]);
                                }
                                self.cargar = false;
                                self.storage.set('tours.promociones', value);
                            });
                        });
                    }
                    else {
                        for (var key in val) {
                            (val[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (val[key]).promocion);
                            self.items.push((val[key]));
                        }
                        self.cargar = false;
                    }
                });
            }
        });
    }
    PromocionPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    PromocionPage.prototype.ionViewDidLoad = function () {
    };
    PromocionPage.prototype.showImagen = function (item) {
        this.navCtrl.push(PromoDetailPage, { promo: item.name, image: item.promocion2 });
    };
    PromocionPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-promocion',
            templateUrl: 'promocion.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController, DomSanitizer, Storage])
    ], PromocionPage);
    return PromocionPage;
}());
export { PromocionPage };
//# sourceMappingURL=promocion.js.map