import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { Utils } from "../../services/utils";
import { ProspectoPage } from "../prospecto/prospecto"
import { ServicioPage } from "../servicio/servicio"

@Component({
  selector: "page-view",
  templateUrl: "view.html"
})
export class ViewPage {
  private oportunity: number;
  public imageSrc: string;
  private isMember: boolean;
  private name: string;
  private email: string;

  public data: Array<{
    id: number;
    date_closed: string;
    create_date: string;
    probability: number;
    country_id: number;
    day_close: number;
    write_uid: number;
    team_id: number;
    partner_id: number;
    city: string;
    partner_name: string;
    company_id: number;
    description: string;
    create_uid: string;
    title_action: string;
    phone: any;
    name: any;
    stage_id: any;
    mobile: any;
    street: string;
    state_id: number;
    email_from: string;
    title: number;
    colorDanger: boolean;
    colorwarning: boolean;
    colorSuccess: boolean;
    contact_name: string;
  }> = [];
  public dataMantenimiento: Array<{
    id: Number;
    name: string;
    categs_ids: Array<any>;
    request_type: String;
    city_id: Array<any>;
    request_source: String;
    branch_type: String;
    partner_id: Array<any>;
    location_id: Array<any>;
    contact_id: Array<any>;
    user_id: Array<any>;
    date_start: String;
    date_finish: String;
    description: String;
  }> = [];
  public homeComercial: boolean = false;
  public homeMantemimiento: boolean = false;
  testRadioOpen: boolean;
  testRadioResult;

  constructor(public navCtrl: NavController, public navParams: NavParams, public odooRpc: OdooJsonRpc, public utils: Utils, public alertCtrl: AlertController) {
    this.oportunity = navParams.get("id");
    switch (JSON.parse(localStorage.getItem('token'))['uid']) {
      case 1:
        this.homeComercial = true;
        this.homeMantemimiento = false;
        break;
      case 20:
        this.homeMantemimiento = true;
        this.homeComercial = false;
        break;

      default:
        break;
    }
    this.display();
  }

  private display(): void {


    switch (JSON.parse(localStorage.getItem('token'))['uid']) {
      case 1:
        this.getOportunidad();
        break;
      case 20:
        this.getMantenimiento();
        break;

      default:
        break;
    }
  }
  private addProspecto() {
    let params = {
      id: this.oportunity
    };
    this.navCtrl.push(ProspectoPage, params);
  }
  private getOportunidad() {
    let partner = "crm.lead";
    let fields = [
      "id",
      "date_closed",
      "create_date",
      "probability",
      "country_id",
      "day_close",
      "write_uid",
      "team_id",
      "partner_id",
      "city",
      "partner_name",
      "contact_name",
      "company_id",
      "description",
      "create_uid",
      "title_action",
      "phone",
      "name",
      "stage_id",
      "mobile",
      "street",
      "state_id",
      "email_from",
      "title"
    ];
    let domain = [["id", "=", this.oportunity]];
    let sort = "";
    let limit = 0;
    let offset = 0;
    this.odooRpc
      .searchRead(partner, domain, fields, limit, offset, sort)
      .then((res: any) => {
        let data = JSON.parse(res._body)["result"].records;
        for (let record in data) {
          this.name = data[record].name == false ? "N/A" : data[record].name;
          this.email = data[record].email_from == false ? "N/A" : data[record].email;
          this.data.push({
            id: data[record].id == false ? "" : data[record].id,
            date_closed: data[record].date_closed == false ? "" : data[record].date_closed,
            create_date: data[record].create_date == false ? "" : data[record].create_date,
            probability: data[record].probability == false ? "" : data[record].probability,
            country_id: data[record].country_id == false ? "" : data[record].country_id,
            day_close: data[record].day_close == false ? "" : data[record].day_close,
            write_uid: data[record].write_uid == false ? "" : data[record].write_uid,
            team_id: data[record].team_id == false ? "" : data[record].team_id,
            partner_id: data[record].partner_id == false ? "" : data[record].partner_id,
            city: data[record].city == false ? "" : data[record].city,
            partner_name: data[record].partner_name == false ? "" : data[record].partner_name,
            company_id: data[record].company_id == false ? "" : data[record].company_id,
            description: data[record].description == false ? "" : data[record].description,
            create_uid: data[record].create_uid == false ? "" : data[record].create_uid,
            title_action: data[record].title_action == false ? "" : data[record].title_action,
            phone: data[record].phone == false ? "" : data[record].phone,
            name: data[record].name == false ? "" : data[record].name,
            stage_id: data[record].stage_id == false ? "" : data[record].stage_id,
            mobile: data[record].mobile == false ? "" : data[record].mobile,
            street: data[record].street == false ? "" : data[record].street,
            state_id: data[record].state_id == false ? "" : data[record].state_id,
            email_from: data[record].email_from == false ? "" : data[record].email_from,
            title: data[record].title == false ? "" : data[record].title,
            colorDanger: data[record].probability < 30 ? true : false,
            colorwarning: data[record].probability >= 30 && data[record].probability < 70 ? true : false,
            colorSuccess: data[record].probability > 70 ? true : false,
            contact_name: data[record].contact_name == false ? "" : data[record].contact_name,
          });
        }
      });
  }
  private getMantenimiento() {
    let partner = "project.issue";
    let fields = [];
    let domain = [["id", "=", this.oportunity]];
    let sort = "";
    let limit = 0;
    let offset = 0;
    this.odooRpc
      .searchRead(partner, domain, fields, limit, offset, sort)
      .then((res: any) => {
        let data = JSON.parse(res._body)["result"].records;
        console.log(data);
        for (let record in data) {
          this.dataMantenimiento.push({
            id: data[record].id == false ? "N/A" : data[record].id,
            name: data[record].name == false ? "N/A" : data[record].name,
            categs_ids: data[record].categs_ids == false ? [] : data[record].categs_ids,
            request_type: data[record].request_type == false ? "N/A" : data[record].request_type,
            city_id: data[record].city_id == false ? [] : data[record].city_id,
            request_source: data[record].request_source == false ? "N/A" : data[record].request_source,
            branch_type: data[record].branch_type == false ? "N/A" : data[record].branch_type,
            partner_id: data[record].partner_id == false ? [] : data[record].partner_id,
            location_id: data[record].location_id == false ? [] : data[record].location_id,
            contact_id: data[record].contact_id == false ? [] : data[record].contact_id,
            user_id: data[record].user_id == false ? [] : data[record].user_id,
            date_start: data[record].date_start == false ? "N/A" : data[record].date_start,
            date_finish: data[record].date_finish == false ? "N/A" : data[record].date_finish,
            description: data[record].description == false ? "N/A" : data[record].description
          });
        }
      });
  }
  private continuarServicio() {
    let params = {
      id: this.oportunity
    };
    this.navCtrl.push(ServicioPage, params);
  }
  private cancelarServicio() {
    // const prompt = this.alertCtrl.create({
    //   title: 'Cancelacion de ervicio',
    //   message: "Por favor ingrese el ",
    //   inputs: [
    //     {
    //       name: 'title',
    //       placeholder: 'Title'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: data => {
    //         console.log('Saved clicked');
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');

    alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Grenn',
      value: 'grenn',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Red',
      value: 'red',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Gray',
      value: 'gray',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });
    alert.present();
  }
}
