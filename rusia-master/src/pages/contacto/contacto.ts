import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

//import {  } from '@ionic-native';

/**
 * Generated class for the ContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
/*declare var cordova: any;*/
@Component({
  selector: 'page-contacto',
  templateUrl: 'contacto.html',
})
export class ContactoPage {


  mail = {para:'tourgratisrusia@gmail.com', asunto:'', mensaje:''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  	
  }

  enviar(){

  	if(this.mail.para.length < 3 || this.mail.asunto.length < 2 || this.mail.mensaje.length < 2){
  		this.presentAlert('Error!','Por favor ingresa correctamente todos los datos del formulario');
  		return;
  	}
    location.href="mailto:"+this.mail.para+"?subject="+this.mail.asunto+"&body="+this.mail.mensaje;
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
