// import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-prospecto',
  templateUrl: 'prospecto.html',
})
export class ProspectoPage {
  private listaNombreZonas: Array<number> = [];
  private nombreZona: Array<any> = [];
  private camarasZona: Array<any> = [];
  private aproMts: Array<any> = [];
  private altMts: Array<any> = [];
  private oportunity: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController) {
    this.oportunity = navParams.get("id");
  }
  public habilitarZonas(zonas) {
    this.listaNombreZonas = [];
    let arrayName: any;
    for (let i = 1; i <= zonas; i++) {
      arrayName = { id: i };
      this.listaNombreZonas.push(arrayName);
    }
    console.log(this.listaNombreZonas);
  }
}
