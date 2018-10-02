import { OdooJsonRpc } from '../../services/odoojsonrpc';
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
  private list_necesidades:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController) {
    this.oportunity = navParams.get("id");
    this.get_necesidad_cliente();

  }
  private get_necesidad_cliente(){
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let table ="product.category"
    this.odooRpc.searchRead(table, [], [], 0, 0, "").then((tags: any) => {
      let json = JSON.parse(tags._body);
      if (!json.error) {
        this.list_necesidades = json["result"].records;
        loading.dismiss();
      }
    });
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
