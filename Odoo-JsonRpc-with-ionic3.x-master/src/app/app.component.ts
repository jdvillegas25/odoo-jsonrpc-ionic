import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { OdooJsonRpc } from "../services/odoojsonrpc";
import { Component, ViewChild } from "@angular/core";
import { AlertController, Platform, Nav, MenuController, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Network } from "@ionic-native/network";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Utils } from "../services/utils";
import { ProfilePage } from "../pages/profile/profile";
import { HistorialServiciosPage } from "../pages/historial-servicios/historial-servicios";
import { DataBaseProvider } from '../providers/data-base/data-base';
import { NetworkProvider } from '../providers/network/network';

@Component({
  templateUrl: "app.html",
  providers: [OdooJsonRpc, Utils]
})
export class MyApp {

  public homeComercial: boolean = false;
  public homeMantenimiento: boolean = false;

  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;;
  pagesSalesman: Array<{ title: string, component: any, icon: any }>;
  pagesTechnician: Array<{ title: string, component: any, icon: any }>;
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, public odooRpc: OdooJsonRpc, public alert: AlertController, private network: Network, public menu: MenuController, public events: Events, private database: DataBaseProvider, private proNet: NetworkProvider) {

    this.getNetwork();
    this.initLogin();
    this.pagesTechnician = [
      { title: 'Perfil', component: ProfilePage, icon: 'contact' },
      { title: 'Mantenimientos', component: HomePage, icon: 'stats' },
      { title: 'Historial de Servicios', component: HistorialServiciosPage, icon: 'time' }
    ];
    this.pagesSalesman = [
      { title: 'Perfil', component: ProfilePage, icon: 'contact' },
      { title: 'Oportunidades', component: HomePage, icon: 'stats' }
    ];
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }

  initLogin() {
    if (localStorage.getItem("token")) {
      let response = window.localStorage.getItem("token");
      let jsonData = JSON.parse(response);
      let username = jsonData["username"];
      let pass = jsonData["password"];
      let url = (jsonData["web.base.url"]) ? jsonData["web.base.url"] : "https://erp.allser.com.co";
      let db = jsonData["db"];
      this.odooRpc.init({
        odoo_server: url,
        http_auth: "username:password"
      });
      this.odooRpc.login(db, username, pass).catch((error: any) => {
        let alrt = this.alert.create({
          title: "Server Status",
          message: "La conexión a  " + url + " fue rechazada!!",
          buttons: ["Ok"]
        });
        alrt.present();
      });
      this.rootPage = HomePage;
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      this.statusBar.backgroundColorByHexString("#00FFFFFF");
    });
  }
  getNetwork() {
    this.proNet.validarConexion(this.initializeApp(), function () { console.log('Función de desconexión'); });

  }
  /* getuser() {
    let dataUser = '';
    DataBaseProvider.select('res_user',[],'','').then(res => {
      dataUser = res;

      if (dataUser[0]['id'] != null) {
        //	  alert('array con datos')
        this.rootPage.setRoot(HomePage);
      } else {
        //	alert('array vacio')

        //this.navCtrl.setRoot(LoginPage);
      }
    }).catch(e => {
      console.log(e);
    });
  } */

}