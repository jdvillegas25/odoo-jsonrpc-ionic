import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavParams, Content, Platform, normalizeURL } from 'ionic-angular';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
const STORAGE_KEY = 'IMAGE_LIST';
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;
  storedImages = [];
  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;
  selectedColor = '#000000';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3', '#000000'];

  private firma: String = "";
  private Datafirma: String = "";


  constructor(private view: ViewController, private navParams: NavParams,private plt: Platform, private file: File, private storage: Storage) {
  }

  // ionViewWillLoad() {
  //   const data = this.navParams.get('data');
  //   console.log(data);
  // }
  closeModal(){
    this.saveCanvasImage();
    const data = {
      firma:"",
      Datafirma:"",
      finish:false
    }
    this.view.dismiss(data);
  }
  

  ionViewDidLoad() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    // this.canvasElement.height = '600%';
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
    this.clearCanvasImage();

    let name = new Date().getTime() + '.png';
    let path = this.file.dataDirectory;
    let options: IWriteOptions = { replace: true };

    var data = this.firma.split(',')[1];
    let blob = this.b64toBlob(data, 'image/png');
    this.Datafirma = data;
    const a = {
      firma:this.firma,
      Datafirma: this.Datafirma,
      finish: true
    }
    this.view.dismiss(a);
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

}
