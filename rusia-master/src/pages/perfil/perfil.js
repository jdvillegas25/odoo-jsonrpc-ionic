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
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListPage } from '../../pages/list/list';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
var PerfilPage = /** @class */ (function () {
    function PerfilPage(navCtrl, navParams, storage, _DomSanitizer, alertCtrl, camera) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this._DomSanitizer = _DomSanitizer;
        this.alertCtrl = alertCtrl;
        this.camera = camera;
        this.user = {
            image: null,
            name: null,
            login: null
        };
        this.mensaje = '';
        var self = this;
        this.storage.get('res.users').then(function (val) {
            if (val == null) {
                self.navCtrl.setRoot(ListPage, { borrar: true });
            }
            else {
                self.user.name = val.name;
                self.user.login = val.login;
                //self.user.image = self._DomSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64, '+ val.image); 
                self.user.image = 'assets/imgs/icon_user.png?v=1';
            }
        });
    }
    PerfilPage.prototype.ionViewDidLoad = function () {
        //console.log('ionViewDidLoad PerfilPage');
    };
    PerfilPage.prototype.salir = function () {
        this.navCtrl.setRoot(ListPage, { borrar: true, login: this.user.login });
    };
    PerfilPage.prototype.presentAlert = function (titulo, texto) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    };
    PerfilPage.prototype.cambiarImagen = function () {
        var _this = this;
        var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            var base64Image = 'data:image/jpeg;base64,' + imageData;
        }, function (err) {
            _this.mensaje =
            ;
            // Handle error
        });
        // var self = this;
        // //self.mensaje += 'esta entrando';
        // self.storage.get('CONEXION').then((val) => {
        //   //self.mensaje += 'esta2';
        //   if(val == null){
        //     self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
        //   }else{
        //     var odoo = new Odoo(val);
        //     odoo.connect(function (err) {
        //       //self.mensaje += 'esta3';
        //         if (err) { 
        //           return self.presentAlert('Falla!', 
        //             'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
        //         }
        //         self.storage.get('res.users').then((val) => {
        //           //self.mensaje += 'esta5';
        //           if(val == null){
        //             self.navCtrl.setRoot(ListPage,{borrar: true, login:null});
        //           }else{
        //             self.mensaje += JSON.stringify({
        //               name: val.cliente_id,
        //               tour_id: self.event.tour_id,
        //               state: 'borrador',
        //               num_person:data.num_person
        //             });
        //             var inParams = [];
        //             inParams.push({
        //               name: val.cliente_id,
        //               tour_id: self.event.tour_id,
        //               state: 'borrador',
        //               num_person:data.num_person
        //             });
        //             var params = [];
        //             params.push(inParams);
        //             odoo.execute_kw('tours.clientes.solicitudes', 'create', params, function (err, value) {
        //               //self.mensaje += 'Entro hasta el ultimo';
        //                 if (err) { 
        //                   return self.presentAlert('Falla!', 
        //                     'Error: '+ JSON.stringify(err, Object.getOwnPropertyNames(err)) );
        //                 }
        //                 self.presentAlert('Alerta!','Has solicitado participar en este tour:<br><b>Estado: Pendiente</b>');
        //             });
        //           }
        //       });
        //     });                
        //   }
        // });
    };
    PerfilPage = __decorate([
        Component({
            selector: 'page-perfil',
            templateUrl: 'perfil.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Storage, DomSanitizer, AlertController, Camera])
    ], PerfilPage);
    return PerfilPage;
}());
export { PerfilPage };
//# sourceMappingURL=perfil.js.map