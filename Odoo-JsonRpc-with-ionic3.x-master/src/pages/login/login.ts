import { HomePage } from "../home/home";
import { ServicioPage } from "../servicio/servicio";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { Utils } from "../../services/utils";
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { OneSignal } from '@ionic-native/onesignal';

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  // private listForProtocol: Array<{protocol: string;}> = [];
  public perfectUrl: boolean = false;
  public odooUrl;
  public selectedProtocol;
  private dbList: Array<{ dbName: string; }> = [];
  private selectedDatabase: any = "Pruebas_Mantenimiento";
  private email;
  private password;
  private arregloPermisos: any;
  public logiData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, private utils: Utils, private androidPermissions: AndroidPermissions, private oneSignal: OneSignal, private loadingCtrl: LoadingController) {
    this.checkUrl();
  }
  public checkUrl() {
    let loading = this.loadingCtrl.create({
      content: "Estamos preparando todo..."
    });
    loading.present();
    this.odooRpc.init({
      odoo_server: "https://erp.allser.com.co",
      http_auth: "username:password" // optional
    });
    this.odooRpc.getDbList().then((dbList: any) => {
      this.perfectUrl = true;
      this.utils.dismissLoading();
      this.fillData(dbList);
    }).catch((err: any) => {
      this.utils.presentAlert("Error", "Por favor revice su conexión a internet", [
        {
          text: "Ok"
        }
      ]);
      this.utils.dismissLoading();
    });
    loading.dismiss();
  }

  public fillData(res: any) {
    let body = JSON.parse(res._body);
    let json = body["result"];
    this.dbList.length = 0;
    for (var key in json) {
      this.dbList.push({ dbName: json[key] });
    }
  }
  private login() {
    let loading = this.loadingCtrl.create({
      content: "Estamos preparando todo..."
    });
    loading.present();
    this.odooRpc.login(this.selectedDatabase, this.email, this.password).then((res: any) => {

      /**Asigna la variable de sesion */
      this.logiData = JSON.parse(res._body)["result"];
      if (this.logiData.uid !== false) {

        this.logiData.password = this.password;
        localStorage.setItem("token", JSON.stringify(this.logiData));

        /**Redirige al HomePage */
        this.navCtrl.setRoot(HomePage);

        /**Inicializa el plugin de las notificaciones */
        this.initOneSignal();
        loading.dismissAll();
      } else {
        this.utils.dismissLoading();
        this.utils.presentAlert(
          "Error",
          "Usuario o Contraseña Incorrecta",
          [
            {
              text: "Ok"
            }
          ]
        );
        loading.dismissAll();
      }
    })
      .catch(err => {
        loading.dismissAll();
        this.utils.presentAlert(
          "Error",
          "Usuario o Contraseña Incorrecta",
          [
            {
              text: "Ok"
            }
          ]
        );
      });
  }
  initOneSignal() {

    this.oneSignal.startInit('24193be6-3c15-4975-8f5c-102ea593a5a3', 'AIzaSyBghyYsGpX9d58LuDy9tItjX5Pk4z68n4A');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);


    this.oneSignal.handleNotificationReceived()
      .subscribe(() => {
        console.log('Notification Recived.')
      });

    this.oneSignal.handleNotificationOpened()
      .subscribe(() => {
        console.log('Notification Opened.');
      });
    this.oneSignal.getIds

    console.log(this.oneSignal.getIds());
  }
}
