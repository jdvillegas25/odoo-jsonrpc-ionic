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
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import * as Odoo from 'odoo-xmlrpc';
import { EvenDetailPage } from '../even-detail/even-detail';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, modalCtrl, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.selectedDay = new Date();
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
        this.mensaje = '';
        this.cargar = true;
        this.viewTitle = '';
        var self = this;
        this.storage.get('CONEXION').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, { borrar: true, login: null });
            }
            else {
                self.cargar = true;
                var odoo = new Odoo(val);
                odoo.connect(function (err) {
                    if (err) {
                        self.cargar = false;
                        return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                    }
                    //
                    var inParams = [];
                    inParams.push([['id', '<>', '0']]);
                    inParams.push(['id', 'name', 'tour_id', 'state', 'num_person']); //fields 
                    var params = [];
                    params.push(inParams);
                    odoo.execute_kw('tours.clientes.solicitudes', 'search_read', params, function (err_s, value_s) {
                        if (err_s) {
                            self.cargar = false;
                            return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err_s, Object.getOwnPropertyNames(err_s)));
                        }
                        //self.mensaje += JSON.stringify(value_s);
                        //Traigo todos los eventos proximos
                        var inParams = [];
                        inParams.push([['id', '<>', '0']]);
                        inParams.push(['id', 'guia_id', 'tour_id', 'date_begin', 'date_end']); //fields 
                        var params = [];
                        params.push(inParams);
                        odoo.execute_kw('tours.guia', 'search_read', params, function (err2, value) {
                            if (err2) {
                                return self.presentAlert('Falla!', 'Error: ' + JSON.stringify(err2, Object.getOwnPropertyNames(err2)));
                            }
                            //traigo toda la informacion de los tours
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
                                for (var key_s in value_s) {
                                    for (var key in value) {
                                        if (value_s[key_s].tour_id[0] == value[key].id) {
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
                                                        estado: value_s[key_s].state
                                                    });
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                self.cargar = false;
                                self.calendar.eventSource = events;
                                //self.storage.set('tours.guia', events);
                                //self.mensaje += JSON.stringify(events);
                            });
                        });
                    });
                });
            }
        });
    }
    HomePage.prototype.addEvent = function () {
        var _this = this;
        var modal = this.modalCtrl.create(EvenDetailPage, { startTime: new Date(), endTime: new Date(), home: true });
        modal.present();
        modal.onDidDismiss(function (data) {
            if (data) {
                var eventData = data;
                console.log(data.startTime);
                eventData.startTime = new Date(data.startTime);
                console.log(eventData.startTime);
                eventData.endTime = new Date(data.endTime);
                var events_1 = _this.calendar.eventSource;
                events_1.push(eventData);
                _this.calendar.eventSource = [];
                setTimeout(function () {
                    _this.calendar.eventSource = events_1;
                });
            }
        });
    };
    HomePage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    HomePage.prototype.onEventSelected = function (evt) {
        this.navCtrl.push(EvenDetailPage, {
            title: evt.title,
            startTime: evt.startTime,
            endTime: evt.endTime,
            description: evt.description,
            guia: evt.guia,
            ubicacion: evt.ubicacion,
            home: false,
            estado: evt.estado
        });
    };
    HomePage.prototype.onViewTitleChanged = function (title) {
        this.viewTitle = title;
    };
    HomePage.prototype.changeMode = function (mode) {
        this.calendar.mode = mode;
    };
    HomePage.prototype.today = function () {
        this.calendar.currentDate = new Date();
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController, ModalController, AlertController, Storage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map