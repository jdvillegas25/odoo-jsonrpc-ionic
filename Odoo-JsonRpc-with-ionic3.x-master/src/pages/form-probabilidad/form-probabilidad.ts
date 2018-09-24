import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-form-probabilidad',
  templateUrl: 'form-probabilidad.html',
})
export class FormProbabilidadPage {

  private name: any;
  private probabilidad: any;
  private email: any;
  private telefono: any;
  private mobil: any;
  private nextAcitivity: any;
  private fechaActividad: any;
  private cierrePrevisto: any;
  private website: any;
  private calificacion: any;
  private tags: any;
  private cliente: any;
  private dirContact: any;
  private nameContact: any;
  private functionContact: any;
  private movilContact: any;
  private emailContact: any;
  private notaInterna: any;
  private listaClientes: any;
  private namePartner: any;
  private InfoVendedor: any = JSON.parse(localStorage.getItem('token'));
  private vendedor = this.InfoVendedor['username'].charAt(0).toUpperCase() + this.InfoVendedor['username'].slice(1);
  private pest: string = "oportunidad";
  private isAndroid: boolean = false;
  private listaTags: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController) {
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
    let domain = [["active", "=", "t"], ["customer", "=", "t"]];
    this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then((partner: any) => {
      let json = JSON.parse(partner._body);
      if (!json.error) {
        this.listaClientes = json["result"].records;
        loading.dismiss();
      }
    });
  }
  private getTags() {
    let tableTags = "crm.lead.tag"
    this.odooRpc.searchRead(tableTags, [], [], 0, 0, "").then((tags: any) => {
      let json = JSON.parse(tags._body);
      if (!json.error) {
        this.listaTags = json["result"].records;
      }
    });
  }
  private saveData() {
    if (!this.name) {
      const toast = this.toastCtrl.create({
        message: 'Agrege un nombre para la oportunidad.',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.probabilidad) {
      const toast = this.toastCtrl.create({
        message: 'Seleccione un rango de probabilidad',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.cliente) {
      const toast = this.toastCtrl.create({
        message: 'Seleccione un cliente',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.email) {
      const toast = this.toastCtrl.create({
        message: 'Agregue un correo',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.telefono) {
      const toast = this.toastCtrl.create({
        message: 'Agregue un teléfono',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (this.nextAcitivity && !this.fechaActividad) {
      const toast = this.toastCtrl.create({
        message: 'Seleccione una fecha para la proxima actividad',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.nameContact) {
      const toast = this.toastCtrl.create({
        message: 'Agregue un nombre de contacto',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.movilContact) {
      const toast = this.toastCtrl.create({
        message: 'Agregue un telefono de contacto',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.emailContact) {
      const toast = this.toastCtrl.create({
        message: 'Agregue un email de contacto',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else {
      let dataInsert = {
        date_closed: this.cierrePrevisto,
        probability: this.probabilidad,
        country_id: 50,
        write_uid: JSON.parse(localStorage.getItem('token'))['uid'],
        contact_name: this.nameContact,
        partner_id: this.cliente,
        // partner_name: this.,
        // company_id: this.,
        // priority: this.,
        // next_activity_id: this.,
        // type: this.,
        // function: this.,
        // description: this.,
        // create_uid: this.,
        // date_deadline: this.,
        // title_action: this.,
        // phone: this.,
        // user_id: this.,
        // date_action: this.,
        // name: this.name,
        // stage_id: this.,
        // mobile: this.,
        // street: this.,
        // state_id: this.
      };
    }
  }
  public persistCliente(cli) {
    for (let client of this.listaClientes) {
      if (cli == client.id) {
        this.email = client.email;
        this.telefono = client.phone;
        this.mobil = client.mobil;
        this.namePartner = client.name;
        this.dirContact = client.street;
      }
    }
  }
}
