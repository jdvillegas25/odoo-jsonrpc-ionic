import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
import { DomSanitizer,SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'page-prospecto',
    templateUrl: 'prospecto.html',
})
export class ProspectoPage {
    private pestanias: string = "prospecto";
    private tipoGama: string = "baja";
    private listaNombreZonas: Array<number> = [];
    private nombreZona: Array<any> = [];
    private camarasZona: Array<any> = [];
    private aproMts: Array<any> = [];
    private altMts: Array<any> = [];
    private oportunity: any;
    private list_necesidades: any;
    private necCliente: any;
    private div_cctv: boolean;
    private zonas: any;
    private pictures: Array<any> = [];
    private list_items: any;
    private list_items_carrito: Array<any> = [];
    private porcentajeUtilidad: Array<any> = []

    constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera,private sanitizer: DomSanitizer) {
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
        console.log(this.listaNombreZonas);
    }
    public habilita_formulario(necesidad) {
        if (necesidad == 6) {
            this.div_cctv = true;
            this.get_productos();
        } else {
            this.div_cctv = false;
        }
    }
    private take_pictures(picturezona) {
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
            this.pictures[picturezona].push(`data:image/jpeg;base64,${imageData}`);
        }, (err) => {
            console.error(err);
        });
    }
    private cambiaPestania() {
        this.pestanias = 'cotizacion'
    }
    private get_productos() {
        let loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        let table = "product.template"
        this.odooRpc.searchRead(table, [], [], 0, 0, "").then((items: any) => {
            let json = JSON.parse(items._body);
            if (!json.error) {
                this.list_items = json["result"].records;
                loading.dismiss();
            }
        });
    }
    public sanitize(url){
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    public agregaCarrito(item){
        this.list_items_carrito.push(item)
        console.log(this.list_items_carrito)
    }


}
