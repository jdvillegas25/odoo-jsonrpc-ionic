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
import { ListPage } from '../../pages/list/list';
import { Storage } from '@ionic/storage';
var FaqPage = /** @class */ (function () {
    function FaqPage(navCtrl, navParams, alertCtrl, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
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
                _this.storage.get('tours.clientes.faq').then(function (val) {
                    if (val == null) {
                        odoo.connect(function (err) {
                            if (err) {
                                return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                            }
                            var inParams = [];
                            inParams.push([['id', '<>', '0']]);
                            inParams.push(['id', 'response', 'name']); //fields
                            var params = [];
                            params.push(inParams);
                            odoo.execute_kw('tours.clientes.faq', 'search_read', params, function (err2, value) {
                                if (err2) {
                                    return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                                }
                                for (var key in value) {
                                    (value[key]).icon = 'arrow-dropdown-circle';
                                    (value[key]).visible = false;
                                    self.items.push((value[key]));
                                }
                                self.cargar = false;
                                self.storage.set('tours.clientes.faq', value);
                            });
                        });
                    }
                    else {
                        for (var key in val) {
                            self.items.push((val[key]));
                        }
                        self.cargar = false;
                    }
                });
            }
        });
    }
    FaqPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    FaqPage.prototype.ionViewDidLoad = function () {
        //console.log('ionViewDidLoad FaqPage');
    };
    FaqPage.prototype.showResponse = function (item) {
        if (item.visible) {
            item.visible = false;
            item.icon = 'arrow-dropup-circle';
        }
        else {
            item.visible = true;
            item.icon = 'arrow-dropdown-circle';
        }
    };
    FaqPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-faq',
            templateUrl: 'faq.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController, Storage])
    ], FaqPage);
    return FaqPage;
}());
export { FaqPage };
//# sourceMappingURL=faq.js.map