import { HomePage } from "../home/home";
import { ServicioPage } from "../servicio/servicio";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController, AlertController, MenuController } from "ionic-angular";
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
  private selectedDatabase: any = "allservice";
  private email;
  private password;
  private arregloPermisos: any;
  public logiData: any;

  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, private odooRpc: OdooJsonRpc, private utils: Utils, private androidPermissions: AndroidPermissions, private oneSignal: OneSignal, private loadingCtrl: LoadingController, private alertCtrl: AlertController, ) {
    this.checkUrl();
    this.menu.enable(false,'salesman');
    this.menu.enable(false,'technician');
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
      // this.utils.presentAlert("Error", "Por favor revice su conexión a internet", [
      //   {
      //     text: "Ok"
      //   }
      // ]);
      // this.utils.dismissLoading();
      loading.dismiss();
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
        loading.dismissAll();
        this.initOneSignal();
        this.permisos();
      } else {
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
      }
    }).catch(err => {
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
  private permisos(): void {
    let domain = [['partner_id', '=', this.logiData["partner_id"]]]
    let table = "res.users"
    this.odooRpc.searchRead(table, domain, [], 0, 0, "").then((items: any) => {
      let json = JSON.parse(items._body);
      if (!json.error && json["result"].records != []) {
        for (let i of json["result"].records) {
          //en la variable sesion creamos dos variables nuevas, salesman y technician
          this.logiData.technician = i.technician;
          this.logiData.salesman = i.salesman;
          //reasignamos la variable sesion con las nuevas variables
          localStorage.setItem("token", JSON.stringify(this.logiData));
          this.navCtrl.setRoot(HomePage);
        }
      }
    });
  }
  initOneSignal() {

    this.oneSignal.startInit('24193be6-3c15-4975-8f5c-102ea593a5a3');
    // this.oneSignal.startInit('24193be6-3c15-4975-8f5c-102ea593a5a3', 'AIzaSyBghyYsGpX9d58LuDy9tItjX5Pk4z68n4A');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);


    this.oneSignal.handleNotificationReceived()
      .subscribe(() => {
        console.log('Notification Recived.')
      });

    this.oneSignal.handleNotificationOpened()
      .subscribe(() => {
        console.log('Notification Opened.');
      });
    this.oneSignal.endInit();
    this.oneSignal.getIds().then((id) => {
      const uid = JSON.parse(localStorage.getItem('token'))['uid'];
      const table = "res.users"
      const data = {
        player_id: id.userId,
      }
      this.odooRpc.updateRecord(table, uid, data);
    });
  }
}
