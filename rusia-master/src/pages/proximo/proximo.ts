import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {EvenDetailPage} from '../even-detail/even-detail';
import {ListPage} from '../../pages/list/list';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;
@Component({
    selector: 'page-proximo',
    templateUrl: 'proximo.html',
})
export class ProximoPage {


    calendar = {
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

    items = [];
    cargar = true;
    viewTitle = '';
    hours = 0;
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {

        var self = this;
        self.calendar.eventSource = [];
        this.storage.get('CONEXION').then((val) => {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
            } else {

                var con = val;
                console.log(JSON.stringify(con));
                var odoo = new OdooApi(PROXY, con.db);
                self.storage.get('tours.guia').then((val) => {

                    console.log(JSON.stringify(val));
                    if (val == null) {

                        odoo.login(con.username, con.password).then(
                            function (uid) {

                                console.log(JSON.stringify(uid));
                                odoo.search_read('tours.guia', [['id', '<>', '0']], ['id', 'guia_id', 'tour_id', 'date_begin', 'date_end']).then(
                                    function (value) {

                                        console.log(JSON.stringify(value));
                                        odoo.search_read('tours', [['id', '<>', '0']], ['id', 'name', 'codigo', 'description', 'company_id']).then(

                                            
                                            function (value2) {
                                                console.log(JSON.stringify(value2));
                                                var events = [];
                                                var localdate = new Date();
                                                self.hours = localdate.getTimezoneOffset()/60;
                                                self.storage.set('hours', self.hours);    
                                                for (var key in value) {

                                                    let valB = (value[key]).date_begin.replace(' ', 'T');
                                                    let valE = (value[key]).date_end.replace(' ', 'T');        
                                                    var dateS = new Date(valB);
                                                    var dateE = new Date(valE);

                                                    var date_begin = new Date(dateS.getFullYear(), dateS.getMonth(), dateS.getDate(), dateS.getHours(), dateS.getMinutes());
                                                    var date_end = new Date(dateE.getFullYear(), dateE.getMonth(), dateE.getDate(), dateE.getHours(), dateE.getMinutes());                                                                                               
                                                    
                                                    var dateStart = new Date(valB).getTime();
                                                    var dateEnd = new Date(valE).getTime();
                                                    var startTime = new Date(dateStart- (self.hours*60*60*1000));
                                                    var endTime = new Date(dateEnd - (self.hours*60*60*1000));                                           
                                                    for (var key2 in value2) {
                                                        if (value2[key2].id == (value[key]).tour_id[0]) {
                                                            events.push({
                                                                title: (value2[key2]).name,
                                                                date_begin:date_begin,
                                                                date_end:date_end,
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
                                            },
                                            function () {
                                                return self.presentAlert('Falla!', 'Error de conexion');
                                            }
                                        );

                                    },
                                    function () {
                                        return self.presentAlert('Falla!', 'Error de conexion');
                                    }
                                );

                            },
                            function () {
                                return self.presentAlert('Falla!', 'Error de conexion');
                            }
                        );

                    } else {

                        var events = [];
                        var eventsProx = [];
                        var localdate = new Date();
                        self.hours = localdate.getTimezoneOffset()/60;
                        self.storage.get('hours').then((val) => {                                                                
                            if(val != self.hours){
                                self.storage.set('hours', self.hours);
                            }                                                                
                        });
                        for (var key in val) {

                            //var dateStart = new Date((val[key]).date_begin).getTime();
                            //var dateEnd = new Date((val[key]).date_end).getTime();
                            //var startTime = new Date(dateStart- (self.hours*60*60*1000));
                            //var endTime = new Date(dateEnd - (self.hours*60*60*1000));

                            events.push({
                                title: (val[key]).title,
                                date_begin:new Date((val[key]).date_begin),
                                date_end:new Date((val[key]).date_end),
                                startTime: (val[key]).startTime,
                                endTime: (val[key]).endTime,
                                allDay: false,
                                description: (val[key]).description,
                                estado: val[key].estado,
                                guia: (val[key]).guia,
                                ubicacion: (val[key]).ubicacion,
                                tour_id: (val[key]).tour_id,
                                home: false
                            });
                        }
                        self.cargar = false;
                        self.calendar.eventSource = events;
                    }
                });
            }
        });
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }

    ionViewDidLoad() {

    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onEventSelected(evt) {

        let evento = {
            title: evt.title,
            date_begin:evt.date_begin,
            date_end:evt.date_end,
            startTime: evt.startTime,
            endTime: evt.endTime,
            description: evt.description,
            guia: evt.guia,
            ubicacion: evt.ubicacion,
            tour_id: evt.tour_id,
            estado: evt.estado,
            home: false,
            editable: false
        };

        console.log(evento);

        if (evt.estado != null) {
            this.navCtrl.push(EvenDetailPage, evento);
        } else {
            evt.home = true;
            let modal = this.modalCtrl.create(EvenDetailPage, evento);
            modal.present();
            var self = this;
            modal.onDidDismiss(data => {
                if (data) {

                    self.storage.get('tours.eventos').then((val) => {
                        //actualizo el home
                        val.push(data);
                        //console.log(val);                        
                        self.storage.set('tours.eventos', val);
                    });

                    self.storage.get('tours.guia').then((val) => {

                        let events = self.calendar.eventSource;
                        self.calendar.eventSource = [];
                        for (var key in events) {
                            //&& evt.date_begin == events[key].date_begin
                            if (events[key].tour_id == evt.tour_id ) {//->busco el evento original y lo reemplazo 
                               

                                let eventData = data; 
                                console.log(eventData);

                                var dateStart = new Date((events[key]).date_begin).getTime();
                                var dateEnd = new Date((events[key]).date_end).getTime();
                                var startTime = new Date(dateStart- (self.hours*60*60*1000));
                                var endTime = new Date(dateEnd - (self.hours*60*60*1000));                                

                                eventData.startTime = startTime;                                
                                eventData.endTime = endTime;

                                eventData.date_begin = new Date((events[key]).date_begin);
                                eventData.date_end = new Date((events[key]).date_end);

                                console.log(eventData);
                                events[key] = eventData;
                                break;
                            }
                        }
                        setTimeout(() => {
                            this.calendar.eventSource = events;
                            this.storage.set('tours.guia', events);
                        });

                    });
                }
            });
        }
    }
}
