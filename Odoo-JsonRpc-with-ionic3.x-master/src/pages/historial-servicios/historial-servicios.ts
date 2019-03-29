import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { DetallePage } from "../detalle/detalle";

/**
 * Generated class for the HistorialServiciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-historial-servicios',
  templateUrl: 'historial-servicios.html',
})
export class HistorialServiciosPage {

  private list_servicios: Array<{
    id: number;
    issue_id: any;
    name: string;
    categs_ids: any;
    request_type: any;
    city_id: boolean;
    request_source: any;
    branch_type: String;
    partner_id: any;
    location_id: any;
    contact_id: any;
    user_id: any;
    date_start: any;
    date_finish: any;
    description: any;
    priority: number;
    sec: string;
    finished: boolean;
    kanban_state: String;
  }> = [];
  private loginData: Array<any>;
  homeMantemimiento: boolean = false;
  homeComercial: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, private loadinCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loginData = JSON.parse(localStorage.getItem('token'));
    this.get_mantenimientos();
    if (this.loginData['technician']) {
      this.homeMantemimiento = true;
      this.homeComercial = false;
    } else {
      this.homeMantemimiento = false;
      this.homeComercial = true;
    }
  }
  private get_mantenimientos() {
    let table = '';
    let domain = [];
    let filter = []
    if (this.loginData['technician']) {
      table = 'project.task';
      domain = [['user_id', '=', this.loginData['uid']], ['finished', '=', 'true']]
    }
    this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then((query: any) => {
      this.llenar_servicios(query);
    }).catch(err => {
      console.log(err)
    });
  }
  private llenar_servicios(data: any): void {
    let loading = this.loadinCtrl.create({
      content: 'Estamos preparando todo...'
    });
    loading.present();
    let json = JSON.parse(data._body);
    if (!json.error) {
      json["result"].records.forEach(e => {
        this.list_servicios.push({
          id: e.id,
          issue_id: e.issue_id,
          name: e.name == false ? "N/A" : e.name,
          categs_ids: e.categs_ids == false ? "N/A" : e.categs_ids,
          request_type: e.request_type == false ? "N/A" : e.request_type,
          city_id: e.city_id == false ? "N/A" : e.city_id,
          request_source: e.request_source == false ? "N/A" : e.request_source,
          branch_type: e.location_type_id == false ? "N/A" : e.location_type_id,
          partner_id: e.partner_id == false ? "N/A" : e.partner_id,
          location_id: e.location_id == false ? "N/A" : e.location_id,
          contact_id: e.contact_id == false ? "N/A" : e.contact_id,
          user_id: e.user_id == false ? "N/A" : e.user_id,
          date_start: e.date_start == false ? "N/A" : e.date_start,
          date_finish: e.date_finish == false ? "N/A" : e.date_finish,
          description: e.issue_description == false ? "N/A" : e.issue_description,
          priority: e.priority == false ? "N/A" : e.priority,
          sec: e.issue_sec == false ? "N/A" : e.issue_sec,
          finished: e.finished,
          kanban_state: e.kanban_state
        });
      });
    }
    loading.dismiss();
  }
  public view(idx: number): void {
    let params = {}

    //Validacion para cargar causas de rol mantenimiento3
    if (this.loginData['technician']) {
      params['id'] = this.list_servicios[idx].id
    }
    this.navCtrl.push(DetallePage, params);
  }

}
