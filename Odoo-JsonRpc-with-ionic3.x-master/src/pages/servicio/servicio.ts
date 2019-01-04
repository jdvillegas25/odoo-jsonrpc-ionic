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
  public list_necesidades: Array<any>;
  public list_items: Array<any>;
  public list_service_category: Array<any>;
  private dataServicio: any


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
      }
    });
    loading.dismiss();
  }
  private getServiceCategory(category) {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    // let domain = (nec != "") ? [['categ_id', '=', +nec], ['qty_available', '>', 0]] : [['qty_available', '>', 0]]
    let domain = (category != "") ? [['product_category_id', '=', +category]] : []
    let table = "product.service.category"
    this.odooRpc.searchRead(table, domain, ["id", "name"], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records != []) {
        for (let i of json["result"].records) {
          this.list_service_category.push(i);
        }
        loading.dismiss();
      }
    });
  }
  private get_productos(nec = "") {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    // let domain = (nec != "") ? [['categ_id', '=', +nec], ['qty_available', '>', 0]] : [['qty_available', '>', 0]]
    let domain = (nec != "") ? [['categ_id', '=', +nec]] : []
    let table = "product.template"
    this.odooRpc.searchRead(table, domain, ["id", "name"], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records != []) {
        for (let i of json["result"].records) {
          this.list_items.push(i);
        }
        loading.dismiss();
      }
    });
  }
  public sanitize(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
