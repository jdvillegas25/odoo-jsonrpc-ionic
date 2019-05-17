import { HomePage } from "../home/home";
import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Utils } from '../../services/utils';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
import { AddCustomerPage } from "../add-customer/add-customer";
import { AlertController } from 'ionic-angular';
// import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';


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
  private pestanias: string = "oportunidad";
  private isAndroid: boolean = false;
  private listaTags: any;
  private listCity: any;
  private idOportunidad: any = '';


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private utils: Utils, private alertCtrl: AlertController) {

    // validamos si es actualizar o crear una oportunidad
    if (navParams.get("tipo") == 'update') {
      //si es modificar una oportunidad, consultamos toda la informacion de la oportunidad y asigamos idOportunidad al id que viene por get
      this.idOportunidad = navParams.get("id");
      this.getOportunidad(this.idOportunidad)
    }
    // de lo contrario dejamos el formulairo vacio para crear una nueva oportunidad
    else {
      this.name = '';
      this.probabilidad = '';
      this.email = '';
      this.telefono = '';
      this.mobil = '';
      this.nextAcitivity = '';
      this.fechaActividad = '';
      this.cierrePrevisto = '';
      this.website = '';
      this.calificacion = '';
      this.tags = '';
      this.city = '';
      this.cliente = '';
      this.dirContact = '';
      this.nameContact = '';
      this.functionContact = '';
      this.movilContact = '';
      this.emailContact = '';
      this.notaInterna = '';
      this.titleAction = '';
      this.namePartner = '';
      this.listaTags = '';
      this.getClientes();
    }
    this.getTags();
    this.getCity();
    this.isAndroid = platform.is('android');

  }

  ionViewDidLoad() {

  }
  private getOportunidad(idOportunidad) {
    this.getClientes();
    let table_oportunidad = "crm.lead";
    let domain = [["id", "=", idOportunidad]];
    this.odooRpc
      .searchRead(table_oportunidad, domain, [], 0, 0, "")
      .then((partner: any) => {
        let loading = this.loadingCtrl.create({
          content: "Estamos preparando todo..."
        });
        loading.present();
        let json = JSON.parse(partner._body);
        if (!json.error) {
          let query = json["result"].records;
          for (let i in query) {
            this.name = query[i].name;
            this.probabilidad = query[i].probability;
            this.email = query[i].email_from;
            this.telefono = query[i].phone;
            this.mobil = query[i].mobile;
            this.nextAcitivity = query[i].next_activity_id[0];
            this.fechaActividad = query[i].date_action;
            this.cierrePrevisto = query[i].date_closed;
            this.city = query[i].state_id;
            this.cliente = query[i].partner_id[0];
            this.dirContact = query[i].street;
            this.nameContact = query[i].contact_name;
            this.functionContact = query[i].function;
            this.movilContact = query[i].phone;
            this.emailContact = query[i].email_from;
            this.notaInterna = query[i].description;
            this.titleAction = query[i].title_action;
            this.namePartner = query[i].partner_name;
          }
        }
        loading.dismiss();
      });

  }
  private getClientes() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
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
  private getCity() {
    let tableCity = "res.country.state"
    this.odooRpc.searchRead(tableCity, [["country_id", "=", 50]], [], 0, 0, "").then((city: any) => {
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
    else if (!this.nextAcitivity) {
      const toast = this.toastCtrl.create({
        message: 'Por favor seleccione una siguiente actividad',
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
      let loading = this.loadingCtrl.create({
        content: "Por Favor Espere..."
      })
      loading.present();
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
        description: (!this.notaInterna) ? '' : this.notaInterna,
        create_uid: JSON.parse(localStorage.getItem('token'))['uid'],
        title_action: this.titleAction,
        phone: this.movilContact,
        user_id: JSON.parse(localStorage.getItem('token'))['uid'],
        date_action: this.fechaActividad,
        name: this.name,
        day_open: 0,
        planned_revenue: 0,
        stage_id: 1,
        date_deadline: new Date,
        mobile: this.mobil,
        street: this.dirContact,
        state_id: this.city[0],
        city: this.city[1],
        email_from: this.email,
        cat_names: null

      };
      let model = "crm.lead";
      if (this.idOportunidad == '') {
        this.odooRpc.createRecord(model, params).then((res: any) => {
          let json = JSON.parse(res._body);
          if (!json.error) {
            this.utils.presentToast("Oportunidad Creada Correctamente", 3000, false, 'top');
            this.navCtrl.pop();
          }
        }).catch((err: any) => {
          alert(err);
        })
        loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      } else {
        this.odooRpc.updateRecord(model, this.idOportunidad, params).then((res: any) => {
          let json = JSON.parse(res._body);
          if (!json.error) {
            this.utils.presentToast("Oportunidad Modificada Correctamente", 3000, false, 'top');
            this.navCtrl.pop();
          }
        }).catch((err: any) => {
          alert(err);
        });
        loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      }
    }
  }
  public persistCliente() {
    if (this.cliente == 'addCustomer') {
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
              this.addCustomer();
            }
          }
        ]
      });
      alert.present();
    } else {
      this.parseoClientes();
    }

  }
  private parseoClientes() {
    for (let client of this.listaClientes) {
      if (this.cliente == client.id) {
        this.email = (client.email == false) ? '' : client.email;
        this.telefono = client.phone;
        this.mobil = client.mobil;
        this.namePartner = client.name;
        this.dirContact = client.street;
        this.city = client.state_id;
      }
    }
  }
  private addCustomer() {
    this.navCtrl.push(AddCustomerPage)
  }
}
