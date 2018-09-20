import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,Platform  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-form-probabilidad',
  templateUrl: 'form-probabilidad.html',
})
export class FormProbabilidadPage {

  private listaClientes :any;
  private InfoVendedor :any = JSON.parse(localStorage.getItem('token'));
  private vendedor = this.InfoVendedor['username'].charAt(0).toUpperCase() + this.InfoVendedor['username'].slice(1);
  private pest: string = "oportunidad";
  private isAndroid: boolean = false;
  private listaTags : any;
  private dataInsert: Array<{
    date_closed:string,
    create_date:string,
    probability:string
 }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform:Platform) {
    this.getClientes();
    this.getTags();
    this.isAndroid = platform.is('android');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormProbabilidadPage');
  }
  private getClientes() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    })
    loading.present();
    let table_cliente = "res.partner"
    let domain = [["active", "=", "t"],["customer", "=", "t"]];
    this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then((partner: any) => {
      let json = JSON.parse(partner._body);
      if (!json.error) {
        this.listaClientes = json["result"].records;
        loading.dismiss();
      }
    });
  }
  private getTags(){
    let tableTags = "crm.lead.tag"
    this.odooRpc.searchRead(tableTags, [], [], 0, 0, "").then((tags: any) => {
      let json = JSON.parse(tags._body);
      if (!json.error) {
        this.listaTags = json["result"].records;
      }
    });
  }
  public saveData(){
    
  }
}
