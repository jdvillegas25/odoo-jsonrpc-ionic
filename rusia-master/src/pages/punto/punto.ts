import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {Storage} from '@ionic/storage';
import {ListPage} from '../../pages/list/list';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import {PROXY} from '../../providers/constants/constants';

declare var OdooApi: any;
@Component({
    selector: 'page-punto',
    templateUrl: 'punto.html',
})
export class PuntoPage {


    items = [];
    cargar = true;
    mensaje = 'Cargando Imagenes...';
    
    //private androidPermissions: AndroidPermissions,
    constructor( private file: File, public photoViewer: PhotoViewer, public navCtrl: NavController, public alertCtrl: AlertController, private _DomSanitizer: DomSanitizer, private storage: Storage) {

        //this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.CAMERA]);
        var self = this;
        self.items = [];
        this.storage.get('CONEXION').then((val) => {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, {borrar: true, login: null});
            } else {
                var con = val;
                var odoo = new OdooApi(PROXY, con.db);
                this.storage.get('tours.companies').then((val) => {
                    if (val == null) {

                        odoo.login(con.username, con.password).then(
                            function (uid){
                                odoo.search_read('tours.companies', [['id', '<>', '0']], ['id', 'name', 'punto_encuentro', 'url_map', 'phone', 'mapa']).then(
                                    function (value){
                                        for (var key in value) {
                                            (value[key]).name = (value[key]).name[1];
                                            (value[key]).punto_encuentro2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (value[key]).punto_encuentro);
                                            self.items.push((value[key]));
                                        }
                                        self.cargar = false;
                                        self.storage.set('tours.companies', self.items);
                                    },
                                    function (){
                                        self.cargar = false;
                                        self.presentAlert('Falla!', 'Imposible conectarse');
                                    }
                                );
                            },
                            function (){
                                self.cargar = false;
                                self.presentAlert('Falla!', 'Imposible conectarse');
                            }
                        );                                                
                    } else {

                        for (var key in val) {
                            (val[key]).punto_encuentro2 = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, ' + (val[key]).punto_encuentro);
                            self.items.push((val[key]));
                        }
                        self.cargar = false;
                    }
                });
            }
        });
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    zoomImage(imageData) {

        var self = this;
        self.cargar = true;
        self.mensaje = 'Preparando Imagen...';

        this.file.createFile(this.file.dataDirectory, imageData.id + 'punto.jpg', true)
            .then(FileEntry => {

                self.file.writeExistingFile(self.file.dataDirectory, imageData.id + 'punto.jpg', self.b64toBlob(imageData.punto_encuentro, 'image/jpeg', 512)).then(
                    Result => {

                        self.cargar = false;
                        self.photoViewer.show(self.file.dataDirectory + imageData.id + 'punto.jpg', imageData.name);
                    }
                ).catch(err => {
                    self.presentAlert('Falla!', 'Imposible cargar: ' + JSON.stringify(err));
                });

            })
            .catch(err => {

                self.presentAlert('Falla!', 'Imposible cargar: ' + JSON.stringify(err));
            });
        
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad PuntoPage');
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
