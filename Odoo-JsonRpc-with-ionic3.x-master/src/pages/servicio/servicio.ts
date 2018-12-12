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

  private oportunity: any;
  private list_necesidades: any;
  private list_items: Array<any> = [];
  private toolbar: boolean;
  private div_els: boolean;
  private div_cctv: boolean;
  private div_eps: boolean;
  private div_alarmas: boolean;
  private div_incendios: boolean;
  private div_cae: boolean;
  private pestanias: string = "mantenimiento";

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, private loadingCtrl: LoadingController, ) {
    this.oportunity = navParams.get("id");
    this.get_necesidad_cliente();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicioPage');
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
          this.get_productos(necesidad);
          break;
        //eps
        case "8":
          this.div_eps = true;
          this.get_productos(necesidad);
          break;
        //cae
        case "7":
          this.div_cae = true;
          this.get_productos(necesidad);
          break;
        //Equipo loviano
        case "17":
          this.div_els = true;
          this.get_productos(necesidad);
          break;
        //Alarmas
        case "3":
          this.div_alarmas = true;
          this.get_productos(necesidad);
          break;
        //Incendios
        case "18":
          this.div_incendios = true;
          this.get_productos(necesidad);
          break;
        default:
          this.div_els = false;
          this.div_cctv = false;
          this.div_eps = false;
          this.toolbar = false;
          this.div_alarmas = false;
          this.div_incendios = false;
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

}
