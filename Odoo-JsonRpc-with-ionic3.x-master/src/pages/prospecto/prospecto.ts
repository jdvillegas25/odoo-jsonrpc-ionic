import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';

@Component({
    selector: 'page-prospecto',
    templateUrl: 'prospecto.html',
})
export class ProspectoPage {
    base64: any;
    //Div a habilitar segun categoria del producto
    public div_cctv: boolean;
    public div_eps: boolean;
    public div_cae: boolean;
    public div_els: boolean;
    public div_alarmas: boolean;
    public div_incendios: boolean;

    //Nombre de las zonas
    public nombreHabitacionCCTV: Array<any> = [];
    public nombreHabitacionCAE: Array<any> = [];
    public nombreHabitacionAlarmas: Array<any> = [];
    public nombreHabitacionIncendios: Array<any> = [];

    //tipo pared o muro
    public tipoParedHabitacionCCTV: Array<any> = [];
    public tipoPuertaHabitacionCAE: Array<any> = [];
    public tipoPuertaHabitacionAlarma: Array<any> = [];
    public tipoParedHabitacionAlarma: Array<any> = [];
    public tipoParedHabitacionIncendio: Array<any> = [];

    //Zonas
    public habitacionesCCTV: any;
    public habitacionesCAE: any;
    public habitacionesAlarmas: any;
    public habitacionesIncendios: any;

    //Lista de nombres
    public listaHabitacionesCCTV: Array<number> = [];
    public listaHabitacionesCAE: Array<number> = [];
    public listaHabitacionesAlarmas: Array<number> = [];
    public listaHabitacionesIncendios: Array<number> = [];

    public pestanias: string = "prospecto";
    public tipoGama: string = "baja";

    public camarasCCTV: Array<any> = [];
    public aproMtsCCTV: Array<any> = [];
    public altMtsCCTV: Array<any> = [];
    public picturesCCTV: Array<any> = [];
    public adjuntosCCTV: Array<any> = []
    public obserZonaCCTV: Array<any> = [];

    public alarmasHabitacion: Array<any> = []
    public aproMtsAlarmas: Array<any> = [];
    public altMtsAlarmas: Array<any> = [];
    public picturesAlarmas: Array<any> = [];
    public adjuntosAlarmas: Array<any> = []
    public obserZonaAlarmas: Array<any> = [];

    public sensoresIncendio: Array<any> = []
    public aproMtsIncendio: Array<any> = [];
    public altMtsIncendio: Array<any> = [];
    public picturesIncendio: Array<any> = [];
    public adjuntosIncendio: Array<any> = []
    public obserZonaIncendio: Array<any> = [];

    public oportunity: any;
    public list_necesidades: any;
    public necCliente: any;
    public toolbar: boolean;

    public entradaHabitacionCAE: Array<any> = [];
    public salidaHabitacionCAE: Array<any> = [];
    public cantAccesosHabitacion: any;
    public adjuntosCAE: Array<any> = []
    public obserZonaCAE: Array<any> = [];

    public list_items: Array<any> = [];
    public list_items_carrito: Array<any> = [];
    public porcentajeUtilidad: Array<any> = []
    public subTotal: number = 0;
    public total: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File) {
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
    public habilitarHabitacionesCCTV(zonas) {
        this.habitacionesCCTV = zonas;
        this.listaHabitacionesCCTV = [];
        let arrayName: any;
        for (let i = 1; i <= this.habitacionesCCTV; i++) {
            arrayName = { id: i };
            this.picturesCCTV[i] = []
            this.listaHabitacionesCCTV.push(arrayName);
        }
    }
    public habilitarHabitacionesCAE(zonas) {
        this.habitacionesCAE = zonas;
        this.listaHabitacionesCAE = [];
        let arrayName: any;
        for (let i = 1; i <= this.habitacionesCAE; i++) {
            arrayName = { id: i };
            this.listaHabitacionesCAE.push(arrayName);
        }
    }
    public habilitarHabitacionesAlarmas(zonas) {
        this.habitacionesAlarmas = zonas;
        this.listaHabitacionesAlarmas = [];
        let arrayName: any;
        for (let i = 1; i <= this.habitacionesAlarmas; i++) {
            arrayName = { id: i };
            this.picturesAlarmas[i] = []
            this.listaHabitacionesAlarmas.push(arrayName);
        }
    }
    public habilitarHabitacionesIncendios(zonas) {
        this.habitacionesIncendios = zonas;
        this.listaHabitacionesIncendios = [];
        let arrayName: any;
        for (let i = 1; i <= this.habitacionesIncendios; i++) {
            arrayName = { id: i };
            this.picturesIncendio[i] = []
            this.listaHabitacionesIncendios.push(arrayName);
        }
    }
    public habilita_formulario(necesidad) {
        this.toolbar = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        if (necesidad.length > 0) {
            for (let nec of necesidad) {
                switch (nec) {
                    //cctv
                    case "7":
                        this.div_cctv = true;
                        this.get_productos(nec);
                        break;
                    //eps
                    case "8":
                        this.div_eps = true;
                        this.get_productos(nec);
                        break;
                    //cae
                    case "5":
                        this.div_cae = true;
                        this.get_productos(nec);
                        break;
                    //Equipo liviano
                    case "9":
                        this.div_els = true;
                        this.get_productos(nec);
                        break;
                    //Alarmas
                    case "4":
                        this.div_alarmas = true;
                        this.get_productos(nec);
                        break;
                    //Incendios
                    case "6":
                        this.div_incendios = true;
                        this.get_productos(nec);
                        break;
                    default:
                        this.div_els = false;
                        this.div_cctv = false;
                        this.div_eps = false;
                        this.toolbar = false;
                        this.div_alarmas = false;
                        this.div_incendios = false;
                        this.list_items = [];
                        break;

                }
            }
        } else {
            this.div_els = false;
            this.div_cctv = false;
            this.div_eps = false;
            this.toolbar = false;
            this.div_alarmas = false;
            this.div_incendios = false;
            this.list_items = [];
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
                    this.picturesCCTV[picturezona].push(imageData);
                    break;
                case 'alarma':
                    this.picturesAlarmas[picturezona].push(imageData);
                    break;
                case 'incendio':
                    this.picturesIncendio[picturezona].push(imageData);
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
        this.list_items = [];
        let domain = (nec != "") ? [['categ_id', '=', +nec]] : [];
        let table = "product.template";
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
    public adjuntar_archivo($event, tipo): void {
        this.readThis($event.target, tipo);
    }
    readThis(inputValue: any, tipo: String): void {
        var file = inputValue.files[0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.base64 = myReader.result;
            switch (tipo) {
                case 'cctv':
                    this.adjuntosCCTV.push(this.base64);
                    break;
                case 'cae':
                    this.adjuntosCAE.push(this.base64);
                    break;
                case 'alarma':
                    this.adjuntosAlarmas.push(this.base64);
                    break;
                case 'incendio':
                    this.adjuntosIncendio.push(this.base64);
                    break;

                default:
                    console.log('PARAMETRO PARA ADJUNTAR ARCHIVO NO ESTA DEFINIDO');
                    break;
            }
            console.log(this.base64);
        }
        myReader.readAsDataURL(file);
    }
    public habilitarSensor(camaraZona) {
        console.log(camaraZona)
    }


}
