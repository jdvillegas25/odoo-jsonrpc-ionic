import { FormProbabilidadPage } from "../form-probabilidad/form-probabilidad";
import { Utils } from "../../services/utils";
import { ViewPage } from "../view/view";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, AlertController, LoadingController } from "ionic-angular";
import { Network } from "@ionic-native/network";
import { ProfilePage } from "../profile/profile";


@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  // splash = true;

  private listaOportunidades: Array<{
    id: number;
    probability: number;
    partner_id: string;
    name: string;
    colorDanger: boolean;
    colorwarning: boolean;
    colorSuccess: boolean;
  }> = [];

  private oportunidades: Array<{
    id: number;
    probability: number;
    partner_id: string;
    name: string;
    colorDanger: boolean;
    colorwarning: boolean;
    colorSuccess: boolean;
  }> = [];

  private listaServicios: Array<{
    id: number;
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
  }> = [];
  private servicios: Array<{
    id: number;
    probability: number;
    partner_id: string;
    name: string;
    colorDanger: boolean;
    colorwarning: boolean;
    colorSuccess: boolean;
  }> = [];

  private tableOportunidades = "crm.lead";
  private tableServicios = "project.issue";
  // private tableServicios = "mantenimientos";
  public homeComercial: boolean = false;
  public homeMantemimiento: boolean = false;

  constructor(private navCtrl: NavController, private odooRpc: OdooJsonRpc, private alertCtrl: AlertController, private network: Network, private alert: AlertController, private utils: Utils, public loadingCtrl: LoadingController) {
    this.display();
  }

  private display(): void {

    let table = '';
    let domain = [];
    let filter = [];
    switch (JSON.parse(localStorage.getItem('token'))['uid']) {
      case 1:
        domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
        table = this.tableOportunidades;
        this.homeComercial = true;
        this.homeMantemimiento = false;
        break;
      case 20:
        domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
        table = this.tableServicios;
        filter = [];
        this.homeComercial = false;
        this.homeMantemimiento = true;
        break;

      default:
        break;
    }
    this.odooRpc
      .searchRead(table, domain, filter, 0, 0, "")
      .then((query: any) => {
        this.fillParners(query);
      });
  }

  private fillParners(data: any): void {

    let loading = this.loadingCtrl.create({
      content: "Estamos preparando todo..."
    });
    loading.present();
    let json = JSON.parse(data._body);
    if (!json.error) {
      let query = json["result"].records;
      for (let i in query) {

        switch (JSON.parse(localStorage.getItem('token'))['uid']) {
          case 1:
            this.listaOportunidades.push({
              id: query[i].id,
              probability: query[i].probability == false ? "N/A" : query[i].probability,
              name: query[i].name == false ? "N/A" : query[i].name,
              partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_name,
              colorDanger: query[i].probability < 30 ? true : false,
              colorwarning: query[i].probability >= 30 && query[i].probability < 70 ? true : false,
              colorSuccess: query[i].probability >= 70 ? true : false,
            });
            break;
          case 20:
          console.log(query)
            this.listaServicios.push({
              id: query[i].id,
              name: query[i].name == false ? "N/A" : query[i].name,
              categs_ids: query[i].categs_ids == false ? "N/A" : query[i].categs_ids,
              request_type: query[i].request_type == false ? "N/A" : query[i].request_type,
              city_id: query[i].city_id == false ? "N/A" : query[i].city_id,
              request_source: query[i].request_source == false ? "N/A" : query[i].request_source,
              branch_type: query[i].branch_type == false ? "N/A" : query[i].branch_type,
              partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_id,
              location_id: query[i].location_id == false ? "N/A" : query[i].location_id,
              contact_id: query[i].contact_id == false ? "N/A" : query[i].contact_id,
              user_id: query[i].user_id == false ? "N/A" : query[i].user_id,
              date_start: query[i].date_start == false ? "N/A" : query[i].date_start,
              date_finish: query[i].date_finish == false ? "N/A" : query[i].date_finish,
              description: query[i].description == false ? "N/A" : query[i].description,
              priority: query[i].priority == false ? "N/A" : query[i].priority,
              sec: query[i].sec == false ? "N/A" : query[i].sec
            });
            break;

          default:
            break;
        }

      }
    }
    loading.dismiss();
  }

  public view(idx: number): void {
    let params = {}

    switch (JSON.parse(localStorage.getItem('token'))['uid']) {
      case 1:
        params['id'] = this.listaOportunidades[idx].id
        break;
      case 20:
        params['id'] = this.listaServicios[idx].id
        break;

      default:
        break;
    }
    this.navCtrl.push(ViewPage, params);
  }

  initializeItems(): void {
    this.listaOportunidades = this.oportunidades;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }


    this.listaOportunidades = this.listaOportunidades.filter(v => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  private delete(idx: number) {
    const confirm = this.alertCtrl.create({
      title: '¡Atención!',
      message: '¿Esta seguro de Eliminar el Registro?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.odooRpc.updateRecord(this.tableOportunidades, this.listaOportunidades[idx].id, { active: false });
            this.utils.presentToast(
              this.listaOportunidades[idx].name + " se Elimino con Exito",
              5000,
              true,
              "top"
            );
            this.listaOportunidades.splice(idx, 1);
          }
        }
      ]
    });
    confirm.present();

  }
  viewProfile(): void {
    this.navCtrl.push(ProfilePage);
  }

  FormProbabilidad(tipo: any, idx: any = ""): void {
    let params = {
      tipo: tipo
    }
    if (idx !== "") {
      params['id'] = this.listaOportunidades[idx].id;
    } else {
      params['id'] = "";
    }
    this.navCtrl.push(FormProbabilidadPage, params);
  }
}
