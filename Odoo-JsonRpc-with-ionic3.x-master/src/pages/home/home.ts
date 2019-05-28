import { FormProbabilidadPage } from "../form-probabilidad/form-probabilidad";
import { Utils } from "../../services/utils";
import { DetallePage } from "../detalle/detalle";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, AlertController, LoadingController, MenuController } from "ionic-angular";
import { Network } from "@ionic-native/network";
import { ProfilePage } from "../profile/profile";
import { OneSignal } from '@ionic-native/onesignal';
import { ActaDigitalPage } from '../acta-digital/acta-digital';


@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  // splash = true;
  doRefresh(refresher) {
    this.listaOportunidades = [];
    this.listaServicios = [];
    setTimeout(() => {
      this.display();
      refresher.complete();
    }, 1000);
  }

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
    number_sap: String;
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
  // private tableServicios = "project.issue";
  private tableServicios = "project.task";
  // private tableServicios = "mantenimientos";
  public homeComercial: boolean = false;
  public homeMantemimiento: boolean = false;

  private list_cause: any;
  private list_description: any;
  private logiData: any;

  constructor(private navCtrl: NavController, private odooRpc: OdooJsonRpc, private alertCtrl: AlertController, private network: Network, private alert: AlertController, private utils: Utils, public loadingCtrl: LoadingController, private oneSignal: OneSignal, public menu: MenuController) {

  }
  ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
      content: "Estamos preparando todo..."
    });
    loading.present();
    this.listaOportunidades = [];
    this.listaServicios = [];
    /*Trae los servicios de mantenimiento o las oportunidades creadas; todo esto segun el rol*/
    this.logiData = JSON.parse(localStorage.getItem('token'));

    //Consultamos los permisos o interfase para el usuario logeado
    // this.permisos();
    this.display();

    //Validacion para cargar causas de rol mantenimiento
    if (JSON.parse(localStorage.getItem('token'))['technician']) {
      this.get_causas();
    }
    loading.dismiss();
  }
  private display(): void {

    let table = '';
    let domain = [];
    let filter = [];

    //Validacion para cargar causas de rol mantenimiento
    if (JSON.parse(localStorage.getItem('token'))['salesman']) {

      domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
      table = this.tableOportunidades;
      this.homeComercial = true;
      this.homeMantemimiento = false;
      this.menu.enable(true, 'salesman');
    } else {

      // domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
      domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']], ['finished', '!=', 'true']];
      table = this.tableServicios;
      filter = [];
      this.homeComercial = false;
      this.homeMantemimiento = true;
      this.menu.enable(true, 'technician');
    }
    this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then((query: any) => {
      this.fillParners(query);
    });
  }

  private fillParners(data: any): void {
    let json = JSON.parse(data._body);
    if (!json.error) {
      let query = json["result"].records;
      for (let i in query) {

        //Validacion para cargar causas de rol mantenimiento
        if (JSON.parse(localStorage.getItem('token'))['salesman']) {

          this.listaOportunidades.push({
            id: query[i].id,
            probability: query[i].probability == false ? "N/A" : query[i].probability,
            name: query[i].name == false ? "N/A" : query[i].name,
            partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_name,
            colorDanger: query[i].probability < 30 ? true : false,
            colorwarning: query[i].probability >= 30 && query[i].probability < 70 ? true : false,
            colorSuccess: query[i].probability >= 70 ? true : false,
          });
        } else {
          this.listaServicios.push({
            id: query[i].id,
            issue_id: query[i].issue_id,
            name: query[i].name == false ? "N/A" : query[i].name,
            categs_ids: query[i].categs_ids == false ? "N/A" : query[i].categs_ids,
            request_type: query[i].request_type == false ? "N/A" : query[i].request_type,
            city_id: query[i].city_id == false ? "N/A" : query[i].city_id,
            request_source: query[i].request_source == false ? "N/A" : query[i].request_source,
            branch_type: query[i].location_type_id == false ? "N/A" : query[i].location_type_id,
            partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_id,
            location_id: query[i].location_id == false ? "N/A" : query[i].location_id,
            contact_id: query[i].contact_id == false ? "N/A" : query[i].contact_id,
            user_id: query[i].user_id == false ? "N/A" : query[i].user_id,
            date_start: query[i].date_start == false ? "N/A" : query[i].date_start,
            date_finish: query[i].date_finish == false ? "N/A" : query[i].date_finish,
            description: query[i].issue_description == false ? "N/A" : query[i].issue_description,
            priority: query[i].priority == false ? "N/A" : query[i].priority,
            sec: query[i].issue_sec == false ? "N/A" : query[i].issue_sec,
            number_sap: query[i].number_sap == false ? "N/A" : query[i].number_sap
          });
        }
      }
    }
  }

  public view(idx: number): void {
    let params = {}

    //Validacion para cargar causas de rol mantenimiento
    if (this.logiData.salesman) {
      params['id'] = this.listaOportunidades[idx].id;
    } else if (this.logiData.technician) {
      params['id'] = this.listaServicios[idx].id;
    } else {
      console.log('NO ESTA DEFINIDO EL ROL');
    }
    this.navCtrl.push(DetallePage, params);
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
  public cancelarCita(servicio) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Motivos de Cita Cancelada');

    for (let cause of this.list_cause) {

      if (cause.assignment_status == 'cancel') {

        alert.addInput({
          type: 'radio',
          label: cause.name,
          value: cause.id,
          checked: false
        });
      }
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.get_description(data);
        let alerta = this.alertCtrl.create();
        alerta.setTitle('Descripción de Cita Cancelada');

        for (let desc of this.list_description) {
          alerta.addInput({
            type: 'radio',
            label: desc.name,
            value: desc.id,
            checked: false
          });
        }

        alerta.addButton('Cancel');
        alerta.addButton({
          text: 'OK',
          handler: dataDesc => {
            this.generateActaDigital('cancel', data, dataDesc, servicio);
          }
        });
        alerta.present();
      }
    });
    alert.present();
  }


  public citaFallida(servicio) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Motivos de Cita Fallida');

    for (let cause of this.list_cause) {

      if (cause.assignment_status == 'fail') {

        alert.addInput({
          type: 'radio',
          label: cause.name,
          value: cause.id,
          checked: false
        });
      }
    }

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.get_description(data);
        let alerta = this.alertCtrl.create();
        alerta.setTitle('Descripción de Cita Fallida');

        for (let desc of this.list_description) {
          alerta.addInput({
            type: 'radio',
            label: desc.name,
            value: desc.id,
            checked: false
          });
        }

        alerta.addButton('Cancelar');
        alerta.addButton({
          text: 'OK',
          handler: dataDesc => {
            this.generateActaDigital('fail', data, dataDesc, servicio);
          }
        });
        alerta.present();
      }
    });
    alert.present();
  }


  private get_causas(): void {

    let table = 'project.task.fail.cause'
    let domain = []
    let filter = []
    this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then((query: any) => {
      let json = JSON.parse(query._body);
      if (!json.error) {
        this.list_cause = json["result"].records;
      }
    });

  }
  private get_description(cause) {
    let table = 'project.task.fail.description'
    let domain = [['fail_cause_id', '=', cause]]
    let filter = []
    this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then((query: any) => {
      let json = JSON.parse(query._body);
      if (!json.error) {
        this.list_description = json["result"].records;
      }
    });

  }

  private generateActaDigital(motivo, causa, detalleCausa, servicio) {
    let infoCausa: Array<any> = [];
    let infoDetalleCausa: Array<any> = [];

    for (let i = 0; i < this.list_cause.length; i++) {
      if (this.list_cause[i].id == causa) {
        infoCausa[0] = this.list_cause[i].id;
        infoCausa[1] = this.list_cause[i].name;
      }
    }
    for (let j = 0; j < this.list_description.length; j++) {
      if (this.list_description[j].id == detalleCausa) {
        infoDetalleCausa[0] = this.list_description[j].id;
        infoDetalleCausa[1] = this.list_description[j].name;
      }
    }
    let data = {
      fail_cause_id: infoCausa,
      assignment_status: motivo,
      fail_description_id: infoDetalleCausa,
      finished: 'true',
      kanban_state: 'blocked'
    }
    let params: Array<any> = [];
    params['dataMantenimiento'] = this.listaServicios[servicio];
    params['data'] = data;
    this.navCtrl.push(ActaDigitalPage, params);
  }

}
