import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-form-probabilidad',
  templateUrl: 'form-probabilidad.html',
})
export class FormProbabilidadPage {

  private listaClientes :any;
  private InfoVendedor :any = JSON.parse(localStorage.getItem('token'));
  private vendedor = this.InfoVendedor['username'].charAt(0).toUpperCase() + this.InfoVendedor['username'].slice(1);
  // private listaClientes: Array<{
  //   id: number;
  //   name: string;
  // }> = [];
  private table_cliente = "res.partner"

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController) {
    this.getClientes();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormProbabilidadPage');
  }
  private getClientes() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    })
    loading.present();
    let domain = [["active", "=", "t"],["customer", "=", "t"]];
    this.odooRpc.searchRead(this.table_cliente, domain, [], 0, 0, "").then((partner: any) => {
      let json = JSON.parse(partner._body);
      if (!json.error) {
        this.listaClientes = json["result"].records;
        // let query = json["result"].records;
        // for (let i in query) {
        //   this.listaClientes.push({
        //     id: query[i].id,
        //     name: query[i].name == false ? "N/A" : query[i].name,
        //   });
        // }
        loading.dismiss();
      }
    });
  }
}
