import { OdooJsonRpc } from '../../services/odoojsonrpc';
import { Component, ViewChild, Renderer, ElementRef, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController, normalizeURL, Content, AlertController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ModalPage } from '../modal/modal';

/**
 * Generated class for the ActaDigitalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-acta-digital',
  templateUrl: 'acta-digital.html',
})
export class ActaDigitalPage {

  /***********************************************************************
   * Autor: Brayan Gonzalez
   * Descripcion: Variables necesarios para el proceso de acta digital
   **********************************************************************/
  private dataMantenimiento: any = [];
  private necesidad: Array<any> = [];
  private servicios: Array<any> = [];
  private productos: Array<any> = [];
  private firma: String = "";
  private Datafirma: String = "";
  private observation_user: any;
  private functionary_vat: any;
  private functionary_name: any;
  private functionary_email: any;
  private username: any = JSON.parse(localStorage.getItem('token'))['username'];
  public finish: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, public loadingCtrl: LoadingController, platform: Platform, public toastCtrl: ToastController, private camera: Camera, private sanitizer: DomSanitizer, private fileChooser: FileChooser, private file: File, private storage: Storage, public renderer: Renderer, private plt: Platform, public alertCtrl: AlertController, private rendere: Renderer2, private modal: ModalController) {
    
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
  async openModal (){
    // const myModalData = {
    //   name:'Pedro Perez',
    //   occupation: 'Developer'
    // };
    const myModal: Modal = this.modal.create(ModalPage);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.firma = data.firma;
      this.Datafirma = data.Datafirma;
      this.finish = data.finish;
    });
    myModal.onWillDismiss((data)=>{
      this.firma = data.firma;
      this.Datafirma = data.Datafirma;
      this.finish = data.finish;
    });
  }
  private save_acta() {
    if (this.Datafirma != "") {
      if (this.update_task()) {
        if (this.insert_services_task()) {
          this.navCtrl.setRoot(HomePage);
          // this.navCtrl.push(HomePage);
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
 async update_task() {
    let salida = true;
    if (this.firma != "") {

      let table = "project.task"
      let data = {
        notes: this.observation_user,
        customer_sign_image: this.Datafirma,
        finished: true,
        kanban_state: 'done',
        functionary_vat: this.functionary_vat,
        functionary_name: this.functionary_name,
        functionary_email: this.functionary_email,
      }
      this.odooRpc.updateRecord(table, this.dataMantenimiento.id, data).then((query: any) => {
        if (query.ok) {
          salida = true;
        }
      }).catch((err: any) => {
        salida = false;
      });
    } else {
      salida = false;
    }
    return salida;

  }
  async insert_services_task() {
    let salida = true;
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
            salida = true;
          }
        }
      }).catch((err: any) => {
        salida = false;
      })
    });
    salida = true
    return salida;
  }

}
