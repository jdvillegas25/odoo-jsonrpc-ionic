import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'page-prospecto',
    templateUrl: 'prospecto.html',
})
export class ProspectoPage {
    //Div a habilitar segun categoria del producto
    public div_cctv: boolean;
    public div_eps: boolean;
    public div_cae: boolean;
    public div_els: boolean;
    public div_alarmas: boolean;
    public div_incendios: boolean;

    //Nombre de las zonas
    public nombreZona: Array<any> = [];
    public nombreZonaCAE: Array<any> = [];
    public nombreZonaAlarmas: Array<any> = [];
    public nombreZonaIncendios: Array<any> = [];

    //Zonas
    public zonas: any;
    public zonasCAE: any;
    public zonasAlarmas: any;
    public zonasIncendios: any;

    //Lista de nombres
    public listaNombreZonas: Array<number> = [];
    public listaNombreZonasCAE: Array<number> = [];
    public listaNombreZonasAlarmas: Array<number> = [];
    public listaNombreZonasIncendios: Array<number> = [];

    public pestanias: string = "prospecto";
    public tipoGama: string = "baja";

    public camarasZona: Array<any> = [];
    public aproMts: Array<any> = [];
    public altMts: Array<any> = [];
    public pictures: Array<any> = [];

    public alarmasZona: Array<any> = []
    public aproMtsAlarmas: Array<any> = [];
    public altMtsAlarmas: Array<any> = [];
    public picturesAlarmas: Array<any> = [];

    public incendiosZona: Array<any> = []
    public aproMtsIncendio: Array<any> = [];
    public altMtsIncendio: Array<any> = [];
    public picturesIncendio: Array<any> = [];

    public oportunity: any;
    public list_necesidades: any;
    public necCliente: any;
    public toolbar: boolean;


    public list_items: Array<any> = [];
    public list_items_carrito: Array<any> = [];
    public porcentajeUtilidad: Array<any> = []
    public subTotal: number = 0;
    public total: number = 0;
    public entZonaCAE: Array<any> = [];
    public salZonaCAE: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer) {
        this.oportunity = navParams.get("id");
        this.get_necesidad_cliente();
    }
    private get_necesidad_cliente() {
        let loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        let table = "product.category"
        this.odooRpc.searchRead(table, [], [], 0, 0, "").then((tags: any) => {
            let json = JSON.parse(tags._body);
            if (!json.error) {
                this.list_necesidades = json["result"].records;
                loading.dismiss();
            }
        });
    }
    public habilitarZonas(zonas) {
        this.zonas = zonas;
        this.listaNombreZonas = [];
        let arrayName: any;
        for (let i = 1; i <= this.zonas; i++) {
            arrayName = { id: i };
            this.pictures[i] = []
            this.listaNombreZonas.push(arrayName);
        }
    }
    public habilitarZonasCAE(zonas) {
        this.zonasCAE = zonas;
        this.listaNombreZonasCAE = [];
        let arrayName: any;
        for (let i = 1; i <= this.zonasCAE; i++) {
            arrayName = { id: i };
            console.log(arrayName.id)
            this.listaNombreZonasCAE.push(arrayName);
        }
    }
    public habilitarZonasAlarmas(zonas) {
        this.zonasAlarmas = zonas;
        this.listaNombreZonasAlarmas = [];
        let arrayName: any;
        for (let i = 1; i <= this.zonasAlarmas; i++) {
            arrayName = { id: i };
            this.listaNombreZonasAlarmas.push(arrayName);
        }
    }
    public habilitarZonasIncendios(zonas) {
        this.zonasIncendios = zonas;
        this.listaNombreZonasIncendios = [];
        let arrayName: any;
        for (let i = 1; i <= this.zonasIncendios; i++) {
            arrayName = { id: i };
            this.listaNombreZonasIncendios.push(arrayName);
        }
    }
    public habilita_formulario(necesidad) {
        this.toolbar = true;
        for (let nec of necesidad) {
            switch (nec) {
                //cctv
                case "6":
                    this.div_cctv = true;
                    this.get_productos(nec);
                    break;
                //eps
                case "8":
                    this.div_eps = true;
                    this.get_productos(nec);
                    break;
                //cae
                case "7":
                    this.div_cae = true;
                    this.get_productos(nec);
                    break;
                case "17":
                    this.div_els = true;
                    this.get_productos(nec);
                    break;
                case "3":
                    this.div_alarmas = true;
                    this.get_productos(nec);
                    break;
                case "18":
                    this.div_incendios = true;
                    this.get_productos(nec);
                    break;
                default:
                    this.div_els = false;
                    this.div_cctv = false;
                    this.div_eps = false;
                    this.toolbar = false;
                    break;
            }
        }
    }
    private take_pictures(carProd, picturezona) {
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
            switch (carProd) {
                case 'cctv':
                    this.pictures[picturezona].push(`data:image/jpeg;base64,${imageData}`);
                    break;

                default:
                    break;
            }
        }, (err) => {
            console.error(err);
        });
    }
    private cambiaPestania() {
        this.pestanias = 'cotizacion'
    }
    private get_productos(nec = "") {
        let loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        // let domain = (nec != "") ? [['categ_id', '=', +nec], ['qty_available', '>', 0]] : [['qty_available', '>', 0]]
        let domain = (nec != "") ? [['categ_id', '=', +nec]] : []
        let table = "product.template"
        this.odooRpc.searchRead(table, domain, [], 0, 0, "").then((items: any) => {
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
    public agregaCarrito(item) {
        this.list_items_carrito.push(item)
        this.cambiaUtilidad();
    }
    public cambiaUtilidad() {
        this.subTotal = 0;
        this.total = 0;
        for (let itc of this.list_items_carrito) {
            if (this.porcentajeUtilidad[itc.id] !== undefined) {
                this.subTotal += (itc.list_price + (itc.list_price * this.porcentajeUtilidad[itc.id] / 100));
            } else {
                this.subTotal += itc.list_price;
            }
        }
        this.total = (this.subTotal + (this.subTotal * 19 / 100));

    }


}
