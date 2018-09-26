import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Utils } from '../../services/utils';
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
  private city: any;
  private cliente: any;
  private dirContact: any;
  private nameContact: any;
  private functionContact: any;
  private movilContact: any;
  private emailContact: any;
  private notaInterna: any;
  private titleAction: any;
  private listaClientes: any;
  private namePartner: any;
  private InfoVendedor: any = JSON.parse(localStorage.getItem('token'));
  private vendedor = this.InfoVendedor['username'].charAt(0).toUpperCase() + this.InfoVendedor['username'].slice(1);
  private pest: string = "oportunidad";
  private isAndroid: boolean = false;
  private listaTags: any;
  private listCity: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController,private utils:Utils) {
    this.getClientes();
    this.getTags();
    this.getCity();
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
  private getCity (){
    let tableCity = "res.country.state"
    this.odooRpc.searchRead(tableCity, [["country_id","=",50]], [], 0, 0, "").then((city: any) => {
      let json = JSON.parse(city._body);
      if (!json.error) {
        this.listCity = json["result"].records;
      }
    });
  }
  private saveData() {
    if (!this.name) {
      const toast = this.toastCtrl.create({
        message: 'Por favor agrege un nombre para la oportunidad.',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.probabilidad) {
      const toast = this.toastCtrl.create({
        message: 'Por favor seleccione un rango de probabilidad',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.cliente) {
      const toast = this.toastCtrl.create({
        message: 'Por favor seleccione un cliente',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.email) {
      const toast = this.toastCtrl.create({
        message: 'Por favor agregue un correo para el cliente',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.telefono) {
      const toast = this.toastCtrl.create({
        message: 'Por favor agregue un teléfono para el cliente',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (this.nextAcitivity && !this.fechaActividad) {
      const toast = this.toastCtrl.create({
        message: 'Por favor seleccione una fecha para la proxima actividad',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.nameContact) {
      const toast = this.toastCtrl.create({
        message: 'Por favor agregue un nombre de contacto',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.movilContact) {
      const toast = this.toastCtrl.create({
        message: 'Por favor agregue un telefono de contacto',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else if (!this.emailContact) {
      const toast = this.toastCtrl.create({
        message: 'Por favor agregue un email de contacto',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "OK"
      });
      toast.present();
    }
    else {
      let params = {
        date_closed: this.cierrePrevisto,
        probability: this.probabilidad,
        country_id: 50,
        write_uid: JSON.parse(localStorage.getItem('token'))['uid'],
        contact_name: this.nameContact,
        partner_id: this.cliente,
        partner_name: this.namePartner,
        company_id: 1,
        next_activity_id: this.nextAcitivity,
        type: "opportunity",
        function: this.functionContact,
        description: (!this.notaInterna)?'':this.notaInterna,
        create_uid: JSON.parse(localStorage.getItem('token'))['uid'],
        title_action: this.titleAction,
        phone: this.movilContact,
        user_id: JSON.parse(localStorage.getItem('token'))['uid'],
        date_action: this.fechaActividad,
        name: this.name,
        stage_id: 1,
        mobile: this.telefono,
        street: this.dirContact,
        state_id: this.city[0],
        city: this.city[1],
      };
      console.log(params); 
      let model = "crm.lead";
      this.odooRpc.createRecord(model,params).then((res:any)=>{
        console.log(res);
      }).catch((err:any)=>{
        alert(err)
      })
    }
  }
  public persistCliente() {
    for (let client of this.listaClientes) {
      if (this.cliente == client.id) {
        this.email = (client.email == false)?'':client.email;
        this.telefono = client.phone;
        this.mobil = client.mobil;
        this.namePartner = client.name;
        this.dirContact = client.street;
        this.city = client.state_id;
      }
    }
  }
}
