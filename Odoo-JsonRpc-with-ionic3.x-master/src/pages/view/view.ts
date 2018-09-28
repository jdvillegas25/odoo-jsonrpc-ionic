import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Utils } from "../../services/utils";
import {ProspectoPage} from "../prospecto/prospecto"

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
    date_closed:string;
    create_date:string;
    probability:number;
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
    colorDanger:boolean;
    colorwarning:boolean;
    colorSuccess:boolean;
    contact_name:string;
  }> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public odooRpc: OdooJsonRpc, public utils: Utils) {
    this.oportunity = navParams.get("id");
    this.display();
  }

  private display(): void {
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
            id:data[record].id == false? "" :data[record].id,
            date_closed:data[record].date_closed == false? "" :data[record].date_closed,
            create_date:data[record].create_date == false? "" :data[record].create_date,
            probability:data[record].probability == false? "" :data[record].probability,
            country_id:data[record].country_id == false? "" :data[record].country_id,
            day_close:data[record].day_close == false? "" :data[record].day_close,
            write_uid:data[record].write_uid == false? "" :data[record].write_uid,
            team_id:data[record].team_id == false? "" :data[record].team_id,
            partner_id:data[record].partner_id == false? "" :data[record].partner_id,
            city:data[record].city == false? "" :data[record].city,
            partner_name:data[record].partner_name == false? "" :data[record].partner_name,
            company_id:data[record].company_id == false? "" :data[record].company_id,
            description:data[record].description == false? "" :data[record].description,
            create_uid:data[record].create_uid == false? "" :data[record].create_uid,
            title_action:data[record].title_action == false? "" :data[record].title_action,
            phone:data[record].phone == false? "" :data[record].phone,
            name:data[record].name == false? "" :data[record].name,
            stage_id:data[record].stage_id == false? "" :data[record].stage_id,
            mobile:data[record].mobile == false? "" :data[record].mobile,
            street:data[record].street == false? "" :data[record].street,
            state_id:data[record].state_id == false? "" :data[record].state_id,
            email_from:data[record].email_from == false? "" :data[record].email_from,
            title:data[record].title == false? "" :data[record].title,
            colorDanger:data[record].probability < 30 ? true : false,
            colorwarning:data[record].probability >= 30 && data[record].probability < 70 ? true : false,
            colorSuccess:data[record].probability > 70 ? true : false,
            contact_name:data[record].contact_name == false ? "" :data[record].contact_name,
          });
        }
      });
  }
  private addProspecto (){
    let params = {
      id: this.oportunity
    };
    this.navCtrl.push(ProspectoPage, params);
  }
}
