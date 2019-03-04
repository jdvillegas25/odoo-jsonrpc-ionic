import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content, AlertController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { ActaDigitalPage } from '../acta-digital/acta-digital';

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  public typeMaintenance: any;
  private oportunity: any;
  private necCliente: any;
  private idServicio: any;
  public list_necesidades: Array<any> = [];
  public list_items: Array<any> = [];
  public list_service_category: Array<any> = [];
  private dataServicio: any;
  private listProducts: Array<{
    id: number;
    name: String;
    display_name: String;
    image: Array<any>;
    pictures: String;
    // pictures: Array<any>;
    // 1= Reparacion, 2= Cambio
    accion: number;
    cantidad: Number;
    service: number;
    ubication: String;
  }> = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform, private alert: AlertController) {
    this.dataServicio = {
      id: navParams.get("id"),
      issue_id: navParams.get("issue_id"),
      name: navParams.get("name"),
      categs_ids: navParams.get("categs_id"),
      city_id: navParams.get("city_id"),
      request_type: navParams.get("request_type"),
      request_source: navParams.get("request_source"),
      branch_type: navParams.get("branch_type"),
      partner_id: navParams.get("partner_id"),
      location_id: navParams.get("location_id"),
      user_id: navParams.get("user_id"),
      date_start: navParams.get("date_start"),
      date_finish: navParams.get("date_finish"),
      description: navParams.get("description"),
      sec: navParams.get("sec")
    };
    this.get_necesidad_cliente();
  }
  private get_necesidad_cliente() {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let table = "product.category"
    this.odooRpc.searchRead(table, [], ["id", "name"], 0, 0, "").then((tags: any) => {
      let json = JSON.parse(tags._body);
      if (!json.error) {
        this.list_necesidades = json["result"].records;
        loading.dismiss();
      }
    });
  }
  private getServiceCategory(category) {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let domain = [['product_category_id', '=', +category]];
    let table = "product.service.category"
    this.odooRpc.searchRead(table, domain, ["id", "name"], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records.length > 0) {
        this.list_service_category = json["result"].records;
        loading.dismiss();
      }
    });
  }
  private get_productos(nec = "") {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    for (let index = 0; index < nec.length; index++) {
      let domain = [['service_cat_id', '=', +nec[index]]]
      // let domain = [['categ_id', '=', +nec[index]]]
      let table = "product.template"
      this.odooRpc.searchRead(table, domain, [], 0, 0, "").then((items: any) => {
        let json = JSON.parse(items._body);
        if (!json.error && json["result"].records.length > 0) {
          json["result"].records.forEach(element => {
            this.list_items.push(element);
          });
        }
      });
    }
    loading.dismiss();
  }
  public sanitize(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  public setCantidadItem(item) {
    let alerta = this.alert.create();
    alerta.setTitle('Cantidad de items');

    alerta.addInput({
      type: 'number',
      min: 0,
      name:'cant'
    });

    alerta.addButton('Cancelar');
    alerta.addButton({
      text: 'Agregar',
      handler: cantidad => {
        this.addProduct(item, cantidad);
      }
    });
    alerta.present();
  }
  public addProduct(items, cantidad) {
    for (let i = 1; i <= +cantidad.cant; i++) {
      this.list_items.forEach(a => {
        if (a.id == items) {
          this.listProducts.push({
            id: a.id,
            name: a.name,
            display_name: a.display_name,
            image: a.image_medium,
            pictures: '',
            // pictures: [],
            accion: 0,
            cantidad: 1,
            service: a.service_cat_id,
            ubication: ""
          })
        }
      });
    }
  }
  private take_pictures(i) {
    const options: CameraOptions = {
      // quality: 70,
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture(options).then((imageData) => {
      this.listProducts[i].pictures = imageData;
      // this.listProducts[i].pictures.push(imageData);
    }, (err) => {
      console.error(err);
    });
  }
  private change_action(value, position) {
    this.listProducts[position].accion = value;
  }
  private change_cant(value, position) {
    this.listProducts[position].cantidad = value;
  }
  private change_ubication(value, position) {
    this.listProducts[position].ubication = value;
  }
  private continue_process() {
    let params = {};
    params["necesidad"] = []
    params["servicios"] = []
    params["dataMantenimiento"] = this.dataServicio;
    params["productos"] = this.listProducts;

    /************ Necesidad del cliente **********/
    this.list_necesidades.forEach(nec => {
      if (nec.id == this.necCliente) {
        params["necesidad"] = nec;

      }
    });

    /************ servicios del cliente **********/
    this.list_service_category.forEach(ser => {
      this.idServicio.forEach(idser => {
        if (ser.id == idser) {
          params["servicios"].push(ser);
        }
      });


    });
    this.navCtrl.push(ActaDigitalPage, params);
  }

}
