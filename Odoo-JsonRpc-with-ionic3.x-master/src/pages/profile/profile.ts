import { LoginPage } from '../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Utils } from '../../services/utils';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public homeComercial: boolean = false;
  public homeMantenimiento: boolean = false;

  private name: string
  private partnerId: number
  private imageSrc: string
  private email: string
  private db: string
  private serverUrl: string
  private data: Array<{
    id: number,
    name: string,
    email: string,
    mobile: any,
    phone: any,
    title: number,
    street: string,
    street2: string,
    city: string,
    state_id: number,
    country_id: number,
    zip: number,
    website: any
  }> = []

  constructor(public navCtrl: NavController, public navParams: NavParams, public odooRpc: OdooJsonRpc, public utils: Utils) {

  }

  ionViewDidLoad() {
    if (JSON.parse(localStorage.getItem('token'))['salesman']) {
      this.homeComercial = true;
      this.homeMantenimiento = false;
    } else {
      this.homeMantenimiento = true;
      this.homeComercial = false;
    }
    let response = localStorage.getItem('token');
    let jsonData = JSON.parse(response);
    this.name = jsonData['name'];
    this.partnerId = jsonData['partner_id'];
    this.db = jsonData['db']
    this.serverUrl = jsonData['web.base.url']

    let resUser: string = "res.partner";
    let fields = [
      "name", "email", "mobile", "phone", "title", "street",
      "street2", "city", "state_id", "country_id", "zip", "website", "image"
    ];
    let domain = [
      ["id", "=", this.partnerId]
    ];
    let offset = 0;
    let limit = 0;
    let sort = "";

    this.odooRpc.searchRead(resUser, domain, fields, limit, offset, sort).then((res: any) => {
      this.fillData(res)
    })
  }

  fillData(data: any) {
    let json = JSON.parse(data._body)["result"].records;
    for (let record in json) {
      this.imageSrc = json[record].image
      this.email = json[record].email
      this.data.push({
        id: json[record].id,
        name: json[record].name,
        email: json[record].email == false ? "N/A" : json[record].email,
        mobile: json[record].mobile == false ? "N/A" : json[record].mobile,
        phone: json[record].phone == false ? "N/A" : json[record].phone,
        title: json[record].title == false ? "N/A" : json[record].title[1],
        street: json[record].street == false ? "" : json[record].street,
        street2: json[record].street2 == false ? "" : json[record].street2,
        city: json[record].city == false ? "" : json[record].city,
        state_id: json[record].state_id == false ? "" : json[record].state_id[1],
        country_id: json[record].country_id == false ? "" : json[record].country_id[1],
        zip: json[record].zip == false ? "" : json[record].zip,
        website: json[record].website == false ? "N/A" : json[record].website
      })
    }
  }

  logout() {
    this.utils.presentAlert("Cerrar Sesión", "¿Esta seguro de cerra la sesión?", [{
      text: "Cancelar"
    },
    {
      text: "Cerrar Sesión",
      handler: () => {
        localStorage.clear()
        console.log(localStorage);
        this.odooRpc.destroy()
        this.navCtrl.setRoot(LoginPage);
      }
    }])
  }

}
