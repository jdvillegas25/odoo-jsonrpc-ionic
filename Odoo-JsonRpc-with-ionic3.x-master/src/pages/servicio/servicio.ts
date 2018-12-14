import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
import { OdooJsonRpc } from '../../services/odoojsonrpc';

/**
 * Generated class for the ServicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  public oportunity: any;
  public list_necesidades: any;
  public list_items: Array<any> = [];
  public toolbar: boolean;
  public div_els: boolean;
  public div_cctv: boolean;
  public div_eps: boolean;
  public div_alarmas: boolean;
  public div_incendios: boolean;
  public div_cae: boolean;
  public pestanias: string = "mantenimiento";

  public habitacionesCCTV:any;
  public listaHabitacionesCCTV:any;
  public picturesCCTV:any;
  public habitacionesCAE:any;
  public listaHabitacionesCAE:any;
  public habitacionesAlarmas:any;
  public listaHabitacionesAlarmas:any;
  public picturesAlarmas:any;
  public habitacionesIncendios:any;
  public listaHabitacionesIncendios:any;
  public picturesIncendio:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, private loadingCtrl: LoadingController, ) {
    this.oportunity = navParams.get("id");
    this.get_necesidad_cliente();
  }
  private get_necesidad_cliente() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let table = "product.category"
    this.odooRpc.searchRead(table, [], [], 0, 0, "").then((tags: any) => {
      let json = JSON.parse(tags._body);
      if (!json.error) {
        this.list_necesidades = json["result"].records;
        loading.dismiss();
      }
    });
  }
  public habilita_formulario(necesidad) {
    this.toolbar = true;
    this.div_els = false;
    this.div_cctv = false;
    this.div_eps = false;
    this.toolbar = false;
    this.div_alarmas = false;
    this.div_incendios = false;
    this.div_cae = false;
    switch (necesidad) {
      //cctv
      case "6":
      this.div_cctv = true;
      this.div_els = false;
      this.div_eps = false;
      this.toolbar = false;
      this.div_alarmas = false;
      this.div_incendios = false;
      this.div_cae = false;
      this.get_productos(necesidad);
        break;
      //eps
      case "8":
        this.div_eps = true;
        this.div_els = false;
        this.div_cctv = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //cae
      case "7":
        this.div_cae = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.get_productos(necesidad);
        break;
      //Equipo loviano
      case "17":
        this.div_els = true;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //Alarmas
      case "3":
        this.div_alarmas = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //Incendios
      case "18":
        this.div_incendios = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      default:
        // this.div_els = false;
        // this.div_cctv = false;
        // this.div_eps = false;
        // this.toolbar = false;
        // this.div_alarmas = false;
        // this.div_incendios = false;
        break;
    }
  }
  private get_productos(nec = "") {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    // let domain = (nec != "") ? [['categ_id', '=', +nec], ['qty_available', '>', 0]] : [['qty_available', '>', 0]]
    let domain = (nec != "") ? [['categ_id', '=', +nec]] : []
    let table = "product.template"
    this.odooRpc.searchRead(table, domain, [], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records != []) {
        for (let i of json["result"].records) {
          this.list_items.push(i);
        }
        loading.dismiss();
      }
    });
  }
  public habilitarHabitacionesCCTV(zonas) {
    this.habitacionesCCTV = zonas;
    this.listaHabitacionesCCTV = [];
    let arrayName: any;
    for (let i = 1; i <= this.habitacionesCCTV; i++) {
        arrayName = { id: i };
        this.picturesCCTV[i] = []
        this.listaHabitacionesCCTV.push(arrayName);
    }
}
public habilitarHabitacionesCAE(zonas) {
    this.habitacionesCAE = zonas;
    this.listaHabitacionesCAE = [];
    let arrayName: any;
    for (let i = 1; i <= this.habitacionesCAE; i++) {
        arrayName = { id: i };
        this.listaHabitacionesCAE.push(arrayName);
    }
}
public habilitarHabitacionesAlarmas(zonas) {
    this.habitacionesAlarmas = zonas;
    this.listaHabitacionesAlarmas = [];
    let arrayName: any;
    for (let i = 1; i <= this.habitacionesAlarmas; i++) {
        arrayName = { id: i };
        this.picturesAlarmas[i] = []
        this.listaHabitacionesAlarmas.push(arrayName);
    }
}
public habilitarHabitacionesIncendios(zonas) {
    this.habitacionesIncendios = zonas;
    this.listaHabitacionesIncendios = [];
    let arrayName: any;
    for (let i = 1; i <= this.habitacionesIncendios; i++) {
        arrayName = { id: i };
        this.picturesIncendio[i] = []
        this.listaHabitacionesIncendios.push(arrayName);
    }
}

}
