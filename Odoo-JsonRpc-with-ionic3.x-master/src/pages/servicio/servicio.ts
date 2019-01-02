import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ServicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
/* const STORAGE_KEY = 'IMAGE_LIST' */
@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  /*@ViewChild('imageCanvas') canvas: any;
   canvasElement: any;
 
   saveX: number;
   saveY: number;
 
   storedImages = [];
 
   @ViewChild(Content) content: Content;
   @ViewChild('fixedContainer') fixedContainer: any;
 
 
 
   //make canvas sticky at the top stuff
   // @ViewChild(Content) content: Content;
   // @ViewChild('fixedContainer') fixedContainer: any;
 
   //Color Stuff
   selectedColor = '#9e2956';
 
   colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3'];*/

  public oportunity: any;
  public list_necesidades: any;
  public list_items: Array<any> = [];
  public toolbar: boolean;
  public div_els: boolean;
  public div_cctv: boolean;
  public div_eps: boolean;
  public div_alarmas: boolean;
  public div_incendios: boolean;
  public div_cae: boolean;
  public pestanias: string = "mantenimiento";

  public habitacionesCCTV: any;
  public picturesCCTV: Array<any> = [];
  public listaHabitacionesCCTV: any;
  public nombreHabitacionCCTV: Array<any> = [];
  public tipoParedHabitacionCCTV: Array<any> = [];
  public camarasCCTV: Array<any> = [];
  public aproMtsCCTV: Array<any> = [];
  public altMtsCCTV: Array<any> = [];
  public obserZonaCCTV: Array<any> = [];

  public habitacionesCAE: any;
  public listaHabitacionesCAE: any;
  public picturesCAE: Array<any> = [];
  public nombreHabitacionCAE: Array<any> = [];
  public tipoPuertaHabitacionCAE: Array<any> = [];

  public habitacionesAlarmas: any;
  public listaHabitacionesAlarmas: any;
  public picturesAlarmas: Array<any> = [];
  public nombreHabitacionAlarmas: Array<any> = [];
  public tipoPuertaHabitacionAlarma: Array<any> = [];
  public tipoParedHabitacionAlarma: Array<any> = [];
  public alarmasHabitacion: Array<any> = []
  public aproMtsAlarmas: Array<any> = [];
  public altMtsAlarmas: Array<any> = [];
  public obserZonaAlarmas: Array<any> = [];

  public habitacionesIncendios: any;
  public listaHabitacionesIncendios: any;
  public picturesIncendio: Array<any> = [];
  public nombreHabitacionIncendios: Array<any> = [];
  public tipoParedHabitacionIncendio: Array<any> = [];
  public sensoresIncendio: Array<any> = []
  public aproMtsIncendio: Array<any> = [];
  public altMtsIncendio: Array<any> = [];
  public obserZonaIncendio: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform) {
    /*// Load all stored images when tha app is ready
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != null) {
          this.storedImages = data;
        }
      });
    });*/
    this.oportunity = navParams.get("id");
    this.get_necesidad_cliente();


  }
  /*ionViewDidLoad() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
  }
  ionViewDidEnter() {
    setTimeout(() => {
      let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
      let scroll = this.content.getScrollElement();

      itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
      scroll.style.marginTop = itemHeight + 'px';
    }, 3000)
  }

  // ionViewDidLoad() {
  //   this.canvasElement = this.canvas.nativeElement;
  //   this.canvasElement.width = this.plt.width() + '';
  //   this.canvasElement.height = 200;
  // }
  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  saveCanvasImage() {
    var dataUrl = this.canvasElement.toDataURL();

    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

    let name = new Date().getTime() + '.png';
    let path = this.file.dataDirectory;
    let options: IWriteOptions = { replace: true };

    var data = dataUrl.split(',')[1];
    let blob = this.b64toBlob(data, 'image/png');

    this.file.writeFile(path, name, blob, options).then(res => {
      this.storeImage(name);
    }, err => {
      console.log('error: ', err);
    });
  }

  // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  storeImage(imageName) {
    let saveObj = { img: imageName };
    this.storedImages.push(saveObj);
    this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 500);
    });
  }

  removeImageAtIndex(index) {
    let removed = this.storedImages.splice(index, 1);
    this.file.removeFile(this.file.dataDirectory, removed[0].img).then(res => {
    }, err => {
      console.log('remove err; ', err);
    });
    this.storage.set(STORAGE_KEY, this.storedImages);
  }

  getImagePath(imageName) {
    let path = this.file.dataDirectory + imageName;
    // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
    path = normalizeURL(path);
    return path;
  }*/



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
      }
    });
    loading.dismiss();
  }
  public sanitize(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
    switch (necesidad) {
      //cctv
      case "6":
        this.div_cctv = true;
        this.div_els = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //eps
      case "8":
        this.div_eps = true;
        this.div_els = false;
        this.div_cctv = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //cae
      case "7":
        this.div_cae = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.get_productos(necesidad);
        break;
      //Equipo loviano
      case "17":
        this.div_els = true;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //Alarmas
      case "3":
        this.div_alarmas = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_incendios = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      //Incendios
      case "18":
        this.div_incendios = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_cae = false;
        this.get_productos(necesidad);
        break;
      default:
        break;
    }
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
    console.log(this.list_items)
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

}
