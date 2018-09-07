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
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import * as Odoo from 'odoo-xmlrpc';
/**
 * Generated class for the EvenDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EvenDetailPage = /** @class */ (function () {
    function EvenDetailPage(navCtrl, navParams, viewCtrl, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.mensaje = '';
        this.event_estado = '';
        this.event_color = '';
        this.event = { estado_bol: false, estado: null, title: '', startTime: null, endTime: null, allDay: false, description: null, guia: null, ubicacion: null, home: false, tour_id: null };
        this.event.title = this.navParams.get('title');
        this.event.startTime = this.navParams.get('startTime').toISOString();
        this.event.endTime = this.navParams.get('endTime').toISOString();
        this.event.description = this.navParams.get('description');
        this.event.guia = this.navParams.get('guia');
        this.event.ubicacion = this.navParams.get('ubicacion');
        this.event.home = this.navParams.get('home');
        this.event.tour_id = this.navParams.get('tour_id');
        this.event.estado = this.navParams.get('estado');
        if (this.event.estado == 'borrador') {
            this.event.estado_bol = true;
            this.event_estado = 'Esperando aceptación de solicitud';
            this.event_color = 'danger';
        }
        else if (this.event.estado == 'aceptado') {
            this.event.estado_bol = true;
            this.event_estado = 'Solicitud Aceptada';
            this.event_color = 'secondary';
        }
        else if (this.event.estado == 'rechazado') {
            this.event.estado_bol = true;
            this.event_estado = 'Solicitud Rechazada';
            this.event_color = 'danger';
        }
    }
    EvenDetailPage.prototype.ionViewDidLoad = function () {
        //console.log('ionViewDidLoad EvenDetailPage');
    };
    EvenDetailPage.prototype.participar = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '¿Desea apuntarse a este tour?',
            message: 'Un gerente validará su petición',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Si',
                    handler: function () {
                        _this.presentPrompt();
                    }
                }
            ]
        });
        alert.present();
    };
    EvenDetailPage.prototype.cancelar = function () {
        this.viewCtrl.dismiss(null);
    };
    EvenDetailPage.prototype.guardar = function () {
        this.viewCtrl.dismiss(this.event);
    };
    EvenDetailPage.prototype.presentPrompt = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Asistencia',
            inputs: [
                {
                    name: 'num_person',
                    placeholder: 'Numero de Personas',
                    type: 'number'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Continuar',
                    handler: function (data) {
                        var self = _this;
                        //self.mensaje += 'esta entrando';
                        self.storage.get('CONEXION').then(function (val) {
                            //self.mensaje += 'esta2';
                            if (val == null) {
                                self.navCtrl.setRoot(ListPage, { borrar: true, login: null });
                            }
                            else {
                                var odoo = new Odoo(val);
                                odoo.connect(function (err) {
                                    //self.mensaje += 'esta3';
                                    if (err) {
                                        return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                                    }
                                    self.storage.get('res.users').then(function (val) {
                                        //self.mensaje += 'esta5';
                                        if (val == null) {
                                            self.navCtrl.setRoot(ListPage, { borrar: true, login: null });
                                        }
                                        else {
                                            /*self.mensaje += JSON.stringify({
                                              name: val.cliente_id,
                                              tour_id: self.event.tour_id,
                                              state: 'borrador',
                                              num_person:data.num_person
                                            });*/
                                            var inParams = [];
                                            inParams.push({
                                                name: val.cliente_id,
                                                tour_id: self.event.tour_id,
                                                state: 'borrador',
                                                num_person: data.num_person
                                            });
                                            var params = [];
                                            params.push(inParams);
                                            odoo.execute_kw('tours.clientes.solicitudes', 'create', params, function (err, value) {
                                                //self.mensaje += 'Entro hasta el ultimo';
                                                if (err) {
                                                    return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                                                }
                                                self.presentAlert('Alerta!', 'Has solicitado participar en este tour:<br><b>Estado: Pendiente</b>');
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    EvenDetailPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    EvenDetailPage = __decorate([
        Component({
            selector: 'page-even-detail',
            templateUrl: 'even-detail.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController, AlertController, Storage])
    ], EvenDetailPage);
    return EvenDetailPage;
}());
export { EvenDetailPage };
//# sourceMappingURL=even-detail.js.map