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
import { Storage } from '@ionic/storage';
import * as Odoo from 'odoo-xmlrpc';
import { EvenDetailPage } from '../even-detail/even-detail';
import { ListPage } from '../../pages/list/list';
var ProximoPage = /** @class */ (function () {
    //mensaje = '';
    function ProximoPage(navCtrl, navParams, alertCtrl, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.calendar = {
            eventSource: [],
            mode: 'month',
            currentDate: new Date(),
            locale: 'es-RU',
            formatDayHeader: 'E',
            noEventsLabel: 'Sin Eventos',
            formatMonthTitle: 'MMMM yyyy',
            allDayLabel: 'Todo el día',
            formatWeekTitle: 'MMMM yyyy, Se $n'
        };
        this.items = [];
        this.cargar = true;
        this.viewTitle = '';
        var self = this;
        self.calendar.eventSource = [];
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, { borrar: true, login: null });
            }
            else {
                var odoo = new Odoo(val);
                _this.storage.get('tours.guia').then(function (val) {
                    if (val == null) {
                        odoo.connect(function (err) {
                            if (err) {
                                return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                            }
                            var inParams = [];
                            inParams.push([['id', '<>', '0']]);
                            inParams.push(['id', 'guia_id', 'tour_id', 'date_begin', 'date_end']); //fields 
                            var params = [];
                            params.push(inParams);
                            odoo.execute_kw('tours.guia', 'search_read', params, function (err2, value) {
                                if (err2) {
                                    return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                                }
                                //traigo todos los tours
                                var inParams = [];
                                inParams.push([['id', '<>', '0']]);
                                inParams.push(['id', 'name', 'codigo', 'description', 'company_id']); //fields
                                var params = [];
                                params.push(inParams);
                                odoo.execute_kw('tours', 'search_read', params, function (err3, value2) {
                                    if (err3) {
                                        return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err3, Object.getOwnPropertyNames(err3)));
                                    }
                                    var events = [];
                                    for (var key in value) {
                                        var dateStart = new Date((value[key]).date_begin);
                                        var dateEnd = new Date((value[key]).date_end);
                                        var startTime = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate(), dateStart.getHours(), dateStart.getMinutes());
                                        var endTime = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate(), dateEnd.getHours(), dateEnd.getMinutes());
                                        for (var key2 in value2) {
                                            if (value2[key2].id == (value[key]).tour_id[0]) {
                                                events.push({
                                                    title: (value2[key2]).name,
                                                    startTime: startTime,
                                                    endTime: endTime,
                                                    allDay: false,
                                                    description: (value2[key2]).description,
                                                    guia: (value[key]).guia_id[1],
                                                    ubicacion: (value2[key2]).company_id[1],
                                                    tour_id: (value[key]).id
                                                });
                                                break;
                                            }
                                        }
                                    }
                                    self.cargar = false;
                                    self.calendar.eventSource = events;
                                    self.storage.set('tours.guia', events);
                                    //self.mensaje += JSON.stringify(events);
                                });
                            });
                        });
                    }
                    else {
                        var events = [];
                        for (var key in val) {
                            events.push({
                                title: (val[key]).title,
                                startTime: new Date((val[key]).startTime),
                                endTime: new Date((val[key]).endTime),
                                allDay: false,
                                description: (val[key]).description,
                                guia: (val[key]).guia,
                                ubicacion: (val[key]).ubicacion,
                                tour_id: (val[key]).tour_id
                            });
                        }
                        self.cargar = false;
                        self.calendar.eventSource = events;
                    }
                });
            }
        });
    }
    ProximoPage.prototype.onViewTitleChanged = function (title) {
        this.viewTitle = title;
    };
    ProximoPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    ProximoPage.prototype.ionViewDidLoad = function () {
    };
    ProximoPage.prototype.changeMode = function (mode) {
        this.calendar.mode = mode;
    };
    ProximoPage.prototype.today = function () {
        this.calendar.currentDate = new Date();
    };
    ProximoPage.prototype.onEventSelected = function (evt) {
        this.navCtrl.push(EvenDetailPage, {
            title: evt.title,
            startTime: evt.startTime,
            endTime: evt.endTime,
            description: evt.description,
            guia: evt.guia,
            ubicacion: evt.ubicacion,
            tour_id: evt.tour_id,
            home: false
        });
    };
    ProximoPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-proximo',
            templateUrl: 'proximo.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AlertController, Storage])
    ], ProximoPage);
    return ProximoPage;
}());
export { ProximoPage };
//# sourceMappingURL=proximo.js.map