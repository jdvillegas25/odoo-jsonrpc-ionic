import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {ListPage} from '../../pages/list/list';
import {Storage} from '@ionic/storage';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;

@Component({
    selector: 'page-faq',
    templateUrl: 'faq.html',
})
export class FaqPage {

    items = [];
    cargar = true;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private storage: Storage) {

        var self = this;
        self.items = [];
        this.storage.get('CONEXION').then((val) => {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
            } else {
                var con = val;
                var odoo = new OdooApi(PROXY, con.db);
                this.storage.get('tours.clientes.faq').then((val) => {

                    if (val == null) {

                        odoo.login(con.username, con.password).then(
                            function (uid) {
                                odoo.search_read('tours.clientes.faq', [['id', '<>', '0']], ['id', 'response', 'name']).then(
                                    function (value) {

                                        for (var key in value) {
                                            (value[key]).icon = 'arrow-dropdown-circle';
                                            (value[key]).visible = false;
                                            self.items.push((value[key]));
                                        }
                                        self.cargar = false;
                                        self.storage.set('tours.clientes.faq', value);
                                    },
                                    function () {
                                        self.cargar = false;
                                        self.presentAlert('Falla!', 'Imposible conectarse');
                                    }
                                );
                            },
                            function () {
                                self.cargar = false;
                                self.presentAlert('Falla!', 'Imposible conectarse');
                            }
                        );

                    } else {

                        for (var key in val) {
                            self.items.push((val[key]));
                        }
                        self.cargar = false;
                    }
                });
            }
        });
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
        //console.log('ionViewDidLoad FaqPage');
    }

    showResponse(item) {
        if (item.visible) {
            item.visible = false;
            item.icon = 'arrow-dropup-circle';
        } else {
            item.visible = true;
            item.icon = 'arrow-dropdown-circle';
        }
    }

}
