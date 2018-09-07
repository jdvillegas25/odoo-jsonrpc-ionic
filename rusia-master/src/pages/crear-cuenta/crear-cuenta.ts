import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {PROXY} from '../../providers/constants/constants';
import {ListPage} from '../../pages/list/list';

declare var OdooApi: any;

@Component({
  selector: 'page-crear-cuenta',
  templateUrl: 'crear-cuenta.html',
})
export class CrearCuentaPage {

  private CONEXION = {
        url: 'http://moscutourgratis.com',
        port: '8069',
        db: 'Tour_Gratis_Rusia',
        username: 'app_admin',
        password: 'p{R2H[',
    };
  private cargar = false;
  private mail = {nombre:'', email:'', hotel:'', tel:'', password:'', password2:''};
  //private mail = {nombre:'jose luis garcia', email:'jose2@test.com', hotel:'cualquiera', tel:'123456', password:'12345', password2:'12345'};
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  solicitar() {

  	if(this.mail.email.length < 5 || this.mail.nombre.length < 2 || this.mail.hotel.length < 2 || this.mail.tel.length < 5 ){
  		this.presentAlert('Alerta!','Por favor ingresa correctamente todos los datos del formulario');
  		return;
  	}
    if(this.mail.password.length < 5 || this.mail.password2.length < 5 ){
      this.presentAlert('Alerta!','La longitud de la contraseña debe ser mayor o igual a 5');
      return;
    }

    if(this.mail.password.length < 5 != this.mail.password2.length < 5 ){
      this.presentAlert('Alerta!','Las contraseñas deben coincidir');
      return;
    }

    var odoo = new OdooApi(PROXY, this.CONEXION.db);
    var self = this;
    self.cargar = true;
    odoo.login(this.CONEXION.username, this.CONEXION.password).then(
    function (uid) {

      odoo.call('api', 'createUser', 1, [self.mail.nombre,self.mail.email,self.mail.password, self.mail.hotel, self.mail.tel]).then(

        function (respuesta) {

          if(respuesta.success == true){

            self.presentAlert('Usuario Creado', 'Tu usuario fue creado exitosamente. Puedes ingresar a la plataforma.');
            self.navCtrl.setRoot(ListPage);

          }else{

            self.presentAlert('Error',respuesta.error);    
            self.mail.nombre = '';
            self.mail.email = '';
            self.mail.password = '';
            self.mail.password2 = '';
            self.mail.hotel = '';
            self.mail.tel = '';
          }         

          self.cargar = false;
          
        },
      function (){
        self.presentAlert('Error','Error de conexion. Vuelve a intentarlo mas tarde.');
        self.cargar = false;
      })
    },
    function (){
      self.presentAlert('Error','Error de conexion. Vuelve a intentarlo mas tarde.');
      self.cargar = false;
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

}
