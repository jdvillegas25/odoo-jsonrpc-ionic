import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content, AlertController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { ActaDigitalPage } from '../acta-digital/acta-digital';
import { ApiProvider } from '../../providers/api/api';
import { isArray } from 'ionic-angular/util/util';
import { stringify } from 'querystring';

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  typeMaintenance: any;
  list_necesidades: Array<any> = [];
  list_items: Array<any> = [];
  arregloExtra: Array<any> = [];
  list_service_category: Array<any> = [];
  list_spare_location: Array<any> = [];
  private oportunity: any;
  private necCliente: any;
  private idServicio: any;
  private dataServicio: any;
  private spare_location: any;
  private pointC: any;
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
    categ_id: Number;
    categ_name: String;
    equipment_id: Number;
    equipment_name: String;
    location_id: Number;
    location_name: String;
    serial_number: String;
  }> = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform, private alert: AlertController, public api: ApiProvider, private alertCtrl: AlertController) {
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
      sec: navParams.get("sec"),
      origin_tech_coord: navParams.get("origin_tech_coord"),
      entry_time: navParams.get("entry_time")
    };
    // this.get_necesidad_cliente();
  }
  ionViewDidLoad() {
    /** 
     * Función para generar al ubicacion real del tecnico y que no este mintiendo en su ubicacion
     */
    /* this.getLocation(); */
  }
  /** 
   * Función para generar al ubicacion real del tecnico y que no este mintiendo en su ubicacion
   */
  /* private getLocation(){
    var _self = this;
    _self.plt.ready().then(readySource => {
      const currentposition = navigator.geolocation;
      if (currentposition) {
          currentposition.getCurrentPosition(function (position) {
            _self.pointC = position.coords.latitude+','+position.coords.longitude;
            _self.dataServicio["pointC"] = _self.pointC;
          });
        }
    });
  } */
  /*******Primer Filtro********/
  private get_necesidad_cliente() {
    this.list_service_category = [];
    this.list_items = [];
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let where = [];
    let table = "product.category"
    switch (this.typeMaintenance) {
      case 'electronico':
        where = [['is_electronic', '=', true], ['is_metalworking', '=', false]];
        break;
      case 'metalmecanico':
        where = [['is_metalworking', '=', true], ['is_electronic', '=', false]];
        break;

      default:
        break;
    }
    if (where != []) {
      this.odooRpc.searchRead(table, where, ["id", "name"], 0, 0, "").then((tags: any) => {
        let json = JSON.parse(tags._body);
        if (!json.error) {
          this.list_necesidades = json["result"].records;
          loading.dismiss();
        }
      });
    }
  }
  /*******Segundo Filtro**************/
  private getServiceCategory(category) {
    this.list_items = [];
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let domain = [];
    let table = "";
    switch (this.typeMaintenance) {
      case 'electronico':
        domain = [['product_category_id', '=', +category]];
        table = "product.service.category"
        break;
      case 'metalmecanico':
        domain = [['equipment_category', '=', +category]]
        table = "project.spare.equipment.type"
        break;

      default:
        break;
    }
    this.odooRpc.searchRead(table, domain, ["id", "name"], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records.length > 0) {
        this.list_service_category = json["result"].records;
        loading.dismiss();
      }
    });
  }
  /*Traemos la locaciones de los productos para equipo metalmecanicos (filtro intermedio entre filtro dos y tres)*/
  private get_spare_location(subsistemas = "") {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    this.list_spare_location = [];
    let domain = [];
    domain = [['equipment_type', '=', +subsistemas]];
    this.odooRpc.searchRead("project.equipment.spare.location", domain, [], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records.length > 0) {
        json["result"].records.forEach(el => {
          this.list_spare_location.push(el);
        });
      }
    });
    loading.dismiss();
  }

  /************Tercer Filtro*****************/
  private get_productos(nec = []) {
    let loading = this.loadingCtrl.create({
      content: "Por Favor Espere..."
    });
    loading.present();
    let table = "";
    let domain = [];
    this.list_items = [];
    switch (this.typeMaintenance) {
      case 'electronico':
        for (let index = 0; index < nec.length; index++) {
          domain = [['service_cat_id', '=', +nec[index]]];
          this.odooRpc.searchRead("product.template", domain, [], 0, 0, "").then((items: any) => {
            let json = JSON.parse(items._body);
            if (!json.error && json["result"].records.length > 0) {
              json["result"].records.forEach(element => {
                this.list_items.push(element);
              });
            }
          });
        }
        break;
      case 'metalmecanico':
        this.list_items = [];
        let url = "https://erp.allser.com.co/web/dataset/spare_list";
        let parametros = { "params": { "product_categ_id": +this.necCliente, "equipment_type_id": +this.idServicio, "spare_location_id": +this.spare_location } };
        this.api.getData(url, parametros).subscribe(
          data => {
            data['result'].records.forEach(pro => {
              let a = {
                'id': pro.product_id,
                'display_name': pro.product_name + ' [' + pro.location_name + '] [' + pro.equipment_name + ']',
                'name': pro.product_name,
                'categ_id': pro.categ_id,
                'categ_name': pro.categ_name,
                'equipment_id': pro.equipment_id,
                'equipment_name': pro.equipment_name,
                'location_id': pro.location_id,
                'location_name': pro.location_name,
              }

              this.list_items.push(a);
            });
          },
          error => {
            console.log(error);
          }
        );
        break;
      default:
        break;
    }

    loading.dismiss();
  }
  private getElementoMetalmecanico(category_line) {
    let where = [['id', '=', category_line.product_id[0]]];
    this.odooRpc.searchRead("product.template", where, [], 0, 0, "").then((j: any) => {
      let consulta = JSON.parse(j._body);
      if (!consulta.error && consulta["result"].records.length > 0) {
        consulta["result"].records.forEach(el => {
          if (!(el in this.list_items)) {
            this.list_items.push(el);
          }
        });
      }
    });
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
      name: 'cant'
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
            accion: 0,
            cantidad: 1,
            service: a.service_cat_id ? a.service_cat_id : a.equipment_type,
            ubication: "",
            categ_id: a.categ_id ? a.categ_id : null,
            categ_name: a.categ_name ? a.categ_name : null,
            equipment_id: a.equipment_id ? a.equipment_id : null,
            equipment_name: a.equipment_name ? a.equipment_name : null,
            location_id: a.location_id ? a.location_id : null,
            location_name: a.location_name ? a.location_name : null,
            serial_number: ""
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
  private change_serial(value, position) {
    this.listProducts[position].serial_number = value;
  }
  private continue_process() {
    let bandera = true;
    let params = {};
    params["necesidad"] = [];
    params["servicios"] = [];


    /*data basica que ya viene del mantenimiento*/
    params["dataMantenimiento"] = this.dataServicio;

    /*checknox de si es Electronico o metal mecanico*/
    params["dataMantenimiento"]["typeMaintenance"] = this.typeMaintenance;

    /*lista de los productos que hace referencia a los equipos afectados*/

    params["productos"] = this.listProducts;
    this.listProducts.forEach(produc => {

      if (produc.pictures == "" || produc.accion == 0 || produc.ubication == "" || produc.serial_number == "")
        bandera = false;

    });
    if (bandera) {
      /*Si es metalmecanico, agrega un campo que se llama locacion que hace referencia al tercer filtro de metalmecanicos*/
      if (this.typeMaintenance == 'metalmecanico') {
        params["locacion"] = this.spare_location;
      }

      /*Necesidad del cliente o categoria del servicio que hace referencia al filtro de sistemas intervenidos*/
      this.list_necesidades.forEach(nec => {
        if (nec.id == this.necCliente) {
          params["necesidad"] = nec;

        }
      });
      /*servicios del cliente o subsistemas intervenidos que hace referencia al filtro de subsistemas intervenidos*/
      this.list_service_category.forEach(ser => {
        if (isArray(this.idServicio)) {
          this.idServicio.forEach(idser => {
            if (ser.id == idser) {
              params["servicios"].push(ser);
            }
          });
        } else {
          if (ser.id == this.idServicio) {
            params["servicios"].push(ser);
          }
        }


      });
      this.navCtrl.push(ActaDigitalPage, params);
    } else {
      const alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Por favor agregue la firma del encargado',
        buttons: ['OK']
      });
      alert.present();
    }

  }

}
