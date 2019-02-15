import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Utils } from '../../services/utils';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html',
})
export class AddCustomerPage {

  private company_type;
  private firstname;
  private lastname;
  private vat_type;
  private vat_vd;
  private street;
  private state_id;
  private phone;
  private mobile;
  private email;
  private listCity: any;
  private listaClientes: any;
  private parent_id;
  public homeComercial: boolean = false;
  public homeMantenimiento: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, private utils: Utils, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.getCity();
    if (JSON.parse(localStorage.getItem('token'))['salesman']) {
      this.homeComercial = true;
      this.homeMantenimiento = false;
    }else{
      this.homeComercial = false;
      this.homeMantenimiento = true;
    }
  }


  public saveData() {
    let alert = this.alertCtrl.create({
      title: 'Confirmación de crear cliente',
      message: '¿Esta seguro que quiere crear un cliente nuevo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.saveCustomer();
          }
        }
      ]
    });
    alert.present();
  }
  private saveCustomer(): void {
    let city = []
    for (let i = 0; i < this.listCity.length; i++) {
      if (this.listCity[i]['code'] == this.state_id) {
        city = this.listCity[i];
      }

    }
    let model = "res.partner";
    let params = {
      name: this.firstname + ' ' +this.lastname,
      company_type: this.company_type,
      phone: this.phone,
      mobile: this.mobile,
      email: this.email,
      vat_type: this.vat_type,
      vat_vd: this.vat_vd,
      street: this.street,
      city: (city['code']) ? city['code'] : '',
      state_id: (city['code']) ? city['code'] : '',
      country_id: 50,
      customer: true,
      supplier: false,
      parent_id:this.parent_id,
      write_uid: JSON.parse(localStorage.getItem('token'))['uid'],
      create_uid: JSON.parse(localStorage.getItem('token'))['uid'],
      type: "contact"

    }
    this.odooRpc.createRecord(model, params).then((res: any) => {
      this.utils.presentToast("Creacion Exitosa", 1000, false, 'top')
      this.navCtrl.pop()
    }).catch((err: any) => {
      alert(err)
    })
  }
  private getCity() {
    let tableCity = "res.country.state"
    this.odooRpc.searchRead(tableCity, [["country_id", "=", 50]], [], 0, 0, "").then((city: any) => {
      let json = JSON.parse(city._body);
      if (!json.error) {
        this.listCity = json["result"].records;
      }
    });
  }
  private getClientes() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let table_cliente = "res.partner"
    let domain = [["active", "=", "t"], ["parent_id", "=", null]];
    this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then((partner: any) => {
      let json = JSON.parse(partner._body);
      if (!json.error) {
        this.listaClientes = json["result"].records;
        loading.dismiss();
      }
    });
  } 
}
