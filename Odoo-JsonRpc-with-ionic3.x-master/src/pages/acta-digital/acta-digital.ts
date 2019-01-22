import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content, AlertController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/**
 * Generated class for the ActaDigitalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
const STORAGE_KEY = 'IMAGE_LIST';
@Component({
  selector: 'page-acta-digital',
  templateUrl: 'acta-digital.html',
})
export class ActaDigitalPage {

  /***************************************
   * Autor: Brian Gonzalez Bolaños
   * Descripcion:Variables para el canvas(Firma Digital)
  ***************************************/
  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;
  storedImages = [];
  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;
  selectedColor = '#000000';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3', '#000000'];

  /***********************************************************************
   * Autor: Brayan Gonzalez
   * Descripcion: Variables necesarios para el proceso de acta digital
   **********************************************************************/
  private dataMantenimiento: any = [];
  private necesidad: Array<any> = [];
  private servicios: Array<any> = [];
  private productos: Array<any> = [];
  private firma: String;
  private observation_user: any;
  private username: any = JSON.parse(localStorage.getItem('token'))['username'];
  public showCanvas: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform, public alertCtrl: AlertController, private rendere: Renderer2) {
    /*********************************** 
     * Autor: Brian Gonzalez
     * Descripcion: Se instancia el sqlite
     ***********************************/
    this.storage.ready().then(() => {
      this.storage.get(STORAGE_KEY).then(data => {
        if (data != null) {
          this.storedImages = data;
        }
      });
    });
    /**********************************************************************
     * Autor: Brayan Gonzalez
     * Descripcion:Asignaremos las variables que llegan desde ServicioPage
     ***********************************************************************/
    this.dataMantenimiento = (navParams.get("dataMantenimiento")) ? navParams.get("dataMantenimiento") : {};
    this.necesidad = (navParams.get("necesidad")) ? navParams.get("necesidad") : {};
    this.servicios = (navParams.get("servicios")) ? navParams.get("servicios") : {};
    this.productos = (navParams.get("productos")) ? navParams.get("productos") : {};
    this.firma = "";
  }

  ionViewDidLoad() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 300;
  }

  ionViewDidEnter() {
    let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    let scroll = this.content.getScrollElement();

    itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
    scroll.style.margin = 'auto';
  }
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
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  saveCanvasImage() {
    this.firma = this.canvasElement.toDataURL();
    this.showCanvas = false;
    this.clearCanvasImage();
  }
  clearCanvasImage() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
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
  limpiarFimar() {
    this.firma = "";
  }

  getImagePath(imageName) {
    let path = this.file.dataDirectory + imageName;
    // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
    path = normalizeURL(path);
    return path;
  }
  private save_acta() {
    if (this.firma !== "") {
      if (this.update_task()) {
        if (this.insert_services_task()) {
          this.navCtrl.push(HomePage);
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
    } else {
      const alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Por favor agregue la firma del encargado',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  private update_task() {
    if (this.firma != "") {

      let table = "project.task"
      let data = {
        notes: this.observation_user,
        customer_sign_image: this.firma,
        finished: true,
        kanban_state: 'done'
      }
      if (this.odooRpc.updateRecord(table, this.dataMantenimiento.id, data)) {
        return true;
      }
    } else {
      return false;
    }

  }
  private insert_services_task() {
    let contador = 0;
    let table = 'project.customer.asset';
    this.productos.forEach(pro => {
      let data = {
        task_id: this.dataMantenimiento.id,
        product_category_id: this.necesidad['id'],
        product_service_cat_id: pro.service[0],
        product_id: pro.id,
        quantity: pro.cantidad,
        replaced: (pro.accion == 1) ? true : false,
        asset_location: pro.ubication,
        asset_image: pro.pictures
      }
      this.odooRpc.createRecord(table, data).then((res: any) => {
        if (res.ok === true) {
          contador++;
          if (contador == this.productos.length) {
            return true;
          }
        }
      }).catch((err: any) => {
        return false;
      })
    });
    return true
  }

}
