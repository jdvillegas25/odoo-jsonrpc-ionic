import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ModalPage } from '../modal/modal';
import { AddCustomerPage } from "../add-customer/add-customer";
import { SafePropertyRead } from '@angular/compiler';
import { LatLng } from '@ionic-native/google-maps';

declare var google;

/**
 * Generated class for the ActaDigitalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-acta-digital',
  templateUrl: 'acta-digital.html',
})
export class ActaDigitalPage {

  /***********************************************************************
   * Autor: Brayan Gonzalez
   * Descripcion: Variables necesarios para el proceso de acta digital
   **********************************************************************/
  private dataMantenimiento: any = [];
  private necesidad: Array<any> = [];
  private servicios: Array<any> = [];
  private productos: Array<any> = [];
  private firma: String = "";
  private Datafirma: String = "";
  private observation_user: any;
  private functionary_vat: any;
  private functionary_name: any;
  private functionary_email: any;
  private username: any = JSON.parse(localStorage.getItem('token'))['username'];
  public finish: Boolean = false;
  private listaClientes: any;
  private cliente: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform, public alertCtrl: AlertController, private rendere: Renderer2, private modal: ModalController) {

    /**********************************************************************
     * Autor: Brayan Gonzalez
     * Descripcion:Asignaremos las variables que llegan desde ServicioPage
     ***********************************************************************/
    this.dataMantenimiento = (navParams.get("dataMantenimiento")) ? navParams.get("dataMantenimiento") : {};
    this.necesidad = (navParams.get("necesidad")) ? navParams.get("necesidad") : {};
    this.servicios = (navParams.get("servicios")) ? navParams.get("servicios") : {};
    this.productos = (navParams.get("productos")) ? navParams.get("productos") : {};
    this.firma = "";
    this.getClientes();
  }
  async openModal() {
    const myModal: Modal = this.modal.create(ModalPage);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.firma = data.firma;
      this.Datafirma = data.Datafirma;
      this.finish = data.finish;
    });
    myModal.onWillDismiss((data) => {
      this.firma = data.firma;
      this.Datafirma = data.Datafirma;
      this.finish = data.finish;
    });
  }
  private save_acta() {
    if (this.Datafirma == "") {
      const alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Por favor agregue la firma del encargado',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.functionary_vat === undefined) {
      const alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Por favor el documento del encargado',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.functionary_name === undefined) {
      const alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Por favor agregue el nombre del encargado',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.functionary_email === undefined) {
      const alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Por favor agregue el email del encargado',
        buttons: ['OK']
      });
      alert.present();
    } else {


      /*************Data a almacenar para equipos electronicos***********/
      if (this.update_task()) {
        if (this.insert_services_task()) {
          this.navCtrl.setRoot(HomePage);
          // this.navCtrl.push(HomePage);
        } else {
          const alert = this.alertCtrl.create({
            title: 'ERROR',
            subTitle: 'Se han presentado fallas para generar los productos en el acta digital',
            buttons: ['OK']
          });
          alert.present();
        }
      } else {
        const alert = this.alertCtrl.create({
          title: 'ERROR',
          subTitle: 'Se han presentado fallas para generar la firma digital',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }
  async update_task() {
    let _self = this;
    let salida = true;
    if (this.firma != "") {

      let table = "project.task"
      let data = {
        notes: this.observation_user,
        customer_sign_image: this.Datafirma,
        finished: true,
        kanban_state: 'done',
        functionary_vat: this.functionary_vat,
        functionary_name: this.functionary_name,
        functionary_email: this.functionary_email,
        origin_tech_coord: this.dataMantenimiento.origin_tech_coord,
        entry_time: this.dataMantenimiento.entry_time,
        departure_time: new Date()
      }
      console.log(data);
      let geocoder = new google.maps.Geocoder;
      let latlngStr = this.dataMantenimiento.origin_tech_coord.split(',', 2);
      var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
      geocoder.geocode({ 'location': latlng }, function (results, status) {
        data['origin_address'] = results[0].formatted_address;
        _self.odooRpc.updateRecord(table, _self.dataMantenimiento.id, data).then((query: any) => {
          if (query.ok) {
            salida = true;
          }
        }).catch((err: any) => {
          salida = false;
        });
      });
    } else {
      salida = false;
    }
    return salida;

  }
  async insert_services_task() {
    let salida = true;
    let contador = 0;
    let table = 'project.customer.asset';
    this.productos.forEach(pro => {
      let data = {
        task_id: this.dataMantenimiento.id,
        product_category_id: null,
        product_service_cat_id: null,
        product_id: pro.id,
        quantity: pro.cantidad,
        replaced: (pro.accion == 1) ? true : false,
        asset_location: pro.ubication,
        asset_image: pro.pictures,
        spare_location_id: null,
        equipment_type_id: null,
        equipment_id: null
      };
      switch (this.dataMantenimiento.typeMaintenance) {
        case 'electronico':
          data.product_category_id = this.necesidad['id'];
          data.product_service_cat_id = pro.service[0];
          break;
        case 'metalmecanico':
          data.product_category_id = pro.categ_id;
          data.spare_location_id = pro.location_id;
          data.equipment_type_id = pro.equipment_id;
          break;

        default:
          break;
      }
      this.odooRpc.createRecord(table, data).then((res: any) => {
        if (res.ok === true) {
          contador++;
          if (contador == this.productos.length) {
            salida = true;
          }
        }
      }).catch((err: any) => {
        salida = false;
      })
    });
    salida = true
    return salida;
  }
  private getClientes() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let table_cliente = "res.partner"
    let domain = [["active", "=", "t"], ["parent_id", "=", this.dataMantenimiento.partner_id[0]]];
    this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then((partner: any) => {
      let json = JSON.parse(partner._body);
      if (!json.error) {
        this.listaClientes = json["result"].records;
        loading.dismiss();
      }
    });
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
        this.functionary_vat = client.vat_vd ? client.vat_vd : 'N/A';
        this.functionary_name = client.name ? client.name : 'N/A';
        this.functionary_email = client.email ? client.email : 'N/A';
      }
    }
  }
  private addCustomer() {
    this.navCtrl.push(AddCustomerPage)
  }

}
