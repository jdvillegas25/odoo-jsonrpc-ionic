import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { ProspectoPage } from "../pages/prospecto/prospecto";
import { OdooJsonRpc } from "../services/odoojsonrpc";
import { Component, ViewChild } from "@angular/core";
import { AlertController, Platform, Nav, MenuController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Network } from "@ionic-native/network";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Utils } from "../services/utils";
import { ProfilePage } from "../pages/profile/profile";
import { ActaDigitalPage } from "../pages/acta-digital/acta-digital"
import { HistorialServiciosPage } from "../pages/historial-servicios/historial-servicios";

@Component({
  templateUrl: "app.html",
  providers: [OdooJsonRpc, Utils]
})
export class MyApp {

  public homeComercial: boolean = false;
  public homeMantenimiento: boolean = false;

  @ViewChild(Nav) nav: Nav;
  //rootPage: any = ProspectoPage;
  rootPage: any = LoginPage;
  pagesSalesman: Array<{ title: string, component: any, icon: any }>;
  pagesTechnician: Array<{ title: string, component: any, icon: any }>;
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, public odooRpc: OdooJsonRpc, public alert: AlertController, private network: Network, public menu: MenuController) {

    this.initializeApp();
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
          message: "The connection to " + url + " is refused!!",
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}