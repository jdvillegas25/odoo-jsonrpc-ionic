import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {PromoDetailPage} from '../../pages/promo-detail/promo-detail';
import {Storage} from '@ionic/storage';
import {ListPage} from '../../pages/list/list';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;
//@IonicPage()
@Component({
    selector: 'page-promocion',
    templateUrl: 'promocion.html',
})
export class PromocionPage {

    items = [];
    cargar = true;
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer, private storage: Storage) {
        var self = this;
        self.items = [];
        this.storage.get('CONEXION').then((val) => {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
            } else {
                var con = val;
                var odoo = new OdooApi(PROXY, con.db);
                this.storage.get('tours.promociones').then((val) => {
                    if (val == null) {

                        odoo.login(con.username, con.password).then(
                            function (uid) {
                                odoo.search_read('tours.promociones', [['id', '<>', '0']], ['id', 'promocion', 'city_id', 'name']).then(
                                    function (value) {

                                        for (var key in value) {
                                            (value[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (value[key]).promocion);
                                            (value[key]).city = (value[key]).city_id[1];
                                            self.items.push(value[key]);
                                        }
                                        self.cargar = false;
                                        self.storage.set('tours.promociones', value);
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
                            (val[key]).promocion2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (val[key]).promocion);
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

    }

    showImagen(item) {
        this.navCtrl.push(PromoDetailPage, {promo: item.name, image: item.promocion2});
    }

}
