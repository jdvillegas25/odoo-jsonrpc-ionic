import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ListPage} from '../../pages/list/list';
import {PROXY} from '../../providers/constants/constants';


declare var OdooApi: any;
@Component({
    selector: 'page-even-detail',
    templateUrl: 'even-detail.html',
})
export class EvenDetailPage {

    mensaje = '';
    event_estado = '';
    event_color = '';//alejandro.lacquaniti@gmail.com
    nuevo = false;
    editable = true;

    event = { date_begin:null, date_end:null, estado_bol: false, estado: null, title: '', startTime: null, num_person: 0, endTime: null, allDay: false, description: null, guia: null, ubicacion: null, home: false, tour_id: null}
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private storage: Storage) {
        this.event.title = this.navParams.get('title');
        var dateS = this.navParams.get('startTime');
        var isoDateS = new Date(dateS.getTime() - (dateS.getTimezoneOffset() * 60000)).toISOString();
        var dateE = this.navParams.get('endTime');
        var isoDateE = new Date(dateE.getTime() - (dateE.getTimezoneOffset() * 60000)).toISOString();
        
        this.event.startTime = isoDateS;
        this.event.endTime = isoDateE;
        this.event.description = this.navParams.get('description');
        
        this.event.date_begin = (this.navParams.get('date_begin') == undefined)?null: this.navParams.get('date_begin').toISOString();
        this.event.date_end = (this.navParams.get('date_end') == undefined)?null: this.navParams.get('date_end').toISOString();//this.navParams.get('date_end').toISOString();
        
        this.event.guia = this.navParams.get('guia');
        this.event.ubicacion = this.navParams.get('ubicacion');
        this.event.home = this.navParams.get('home');
        this.editable = this.navParams.get('editable');
        this.event.tour_id = this.navParams.get('tour_id');
        this.event.estado = this.navParams.get('estado');
        if (this.event.estado == 'borrador' || this.event.estado == 'pendiente') {
            this.event.estado_bol = true;
            this.event_estado = 'Esperando aceptación de solicitud';
            this.event_color = 'danger';
            this.event.home = true;
        } else if (this.event.estado == 'aceptado') {

            this.event.estado_bol = true;
            this.event_estado = 'Solicitud Aceptada';
            this.event_color = 'secondary';
            this.event.home = true;
        } else if (this.event.estado == 'rechazado') {
            this.event.estado_bol = true;
            this.event_estado = 'Solicitud Rechazada';
            this.event_color = 'danger';
            this.event.home = true;
        }
        this.nuevo = this.navParams.get('nuevo');
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad EvenDetailPage');
    }

    participar() {
        let alert = this.alertCtrl.create({
            title: '¿Desea apuntarse a este tour?',
            message: 'Un gerente validará su petición',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Si',
                    handler: () => {
                        this.presentPrompt();
                    }
                }
            ]
        });
        alert.present();
    }

    cancelar() {
        this.viewCtrl.dismiss(null);
    }

    guardar() {
        this.viewCtrl.dismiss(this.event);
    }

    encolarRegistros(num_person) {

        var self = this;
        self.event.estado_bol = true;
        self.event_estado = 'Esperando aceptación de solicitud';
        self.event_color = 'danger';
        self.event.home = false;
        self.event.estado = 'pendiente';
        self.event.num_person = num_person;
        self.presentAlert('Alerta!', 'Has solicitado participar en este tour:<br><b>Estado: Pendiente</b>');
        this.viewCtrl.dismiss(this.event);


    }

    presentPrompt() {
        var self = this;
        let alert = this.alertCtrl.create({
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
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Continuar',
                    handler: data => {

                        //self.mensaje += 'esta entrando';
                        self.storage.get('CONEXION').then((val) => {
                            //self.mensaje += 'esta2';
                            if (val == null) {
                                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
                            } else {
                                var con = val;
                                var odoo = new OdooApi(PROXY, con.db);

                                odoo.login(con.username, con.password).then(
                                    function (uid) {

                                        self.storage.get('res.users').then((val) => {
                                            //self.mensaje += 'esta5';
                                            if (val == null) {
                                                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
                                            } else {
                                                //console.log({name: val.cliente_id, tour_id: self.event.tour_id, state: 'borrador', num_person: data.num_person});
                                                odoo.create('tours.clientes.solicitudes', {name: val.cliente_id, tour_id: self.event.tour_id, state: 'borrador', num_person: data.num_person}).then(
                                                    function (value) {

                                                        //var self = this;
                                                        self.event.estado_bol = true;
                                                        self.event_estado = 'Esperando aceptación de solicitud';
                                                        self.event_color = 'danger';
                                                        self.event.home = false;
                                                        self.event.estado = 'borrador';
                                                        self.event.num_person = data.num_person;
                                                        self.presentAlert('Alerta!', 'Has solicitado participar en este tour:<br><b>Estado: Pendiente</b>');
                                                        self.viewCtrl.dismiss(self.event);
                                                    },
                                                    function () {
                                                        return self.encolarRegistros(data.num_person);
                                                    }
                                                );
                                            }
                                        });



                                    },
                                    function () {
                                        return self.encolarRegistros(data.num_person);
                                    }
                                );
                            }
                        });
                    }
                }
            ]
        });
        alert.present();
    }

    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }

}
