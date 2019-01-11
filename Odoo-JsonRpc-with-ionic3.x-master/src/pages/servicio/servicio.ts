import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  public oportunity: any;
  public list_necesidades: Array<any> = [];
  public list_items: Array<any> = [];
  public list_service_category: Array<any> = [];
  private dataServicio: any
  private listProducts: Array<{
    id: number;
    name: String;
    display_name: String;
    image: Array<any>;
    pictures: Array<any>;
    // 1= Reparacion, 2= Cambio
    accion: number;
    cantidad: Number;
  }> = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform) {
    this.oportunity = navParams.get("id");
    this.dataServicio = {
      id: navParams.get('id'),
      name: navParams.get('name'),
      categs_ids: navParams.get('categs_id'),
      request_type: navParams.get('request_type'),
      city_id: navParams.get('city_i'),
      request_source: navParams.get('request_source'),
      branch_type: navParams.get('branch_type'),
      partner_id: navParams.get('partner_i'),
      location_id: navParams.get('location_i'),
      contact_id: navParams.get('contact_i'),
      user_id: navParams.get('user_i'),
      date_start: navParams.get('date_start'),
      date_finish: navParams.get('date_finish'),
      description: navParams.get('description')

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
      let domain = [['categ_id', '=', +nec[index]]]
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
  public addProduct(items) {
    this.listProducts = [];
    this.list_items.forEach(a => {
      items.forEach(b => {
        if (a.id == b) {
          this.listProducts.push({
            id: a.id,
            name: a.name,
            display_name: a.display_name,
            image: a.image_medium,
            pictures: [],
            accion: 0,
            cantidad: 0
          })
        }
      });
    });
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
      this.listProducts[i].pictures.push(imageData);
    }, (err) => {
      console.error(err);
    });
    console.log(this.listProducts)
  }
  private change_accion(value,position){
    this.listProducts[position].accion = value;
  }

}
