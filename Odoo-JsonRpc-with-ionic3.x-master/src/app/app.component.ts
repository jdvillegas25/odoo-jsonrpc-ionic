import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { ProspectoPage } from "../pages/prospecto/prospecto";
import { OdooJsonRpc } from "../services/odoojsonrpc";
import { Component, ViewChild } from "@angular/core";
import { AlertController, Platform, Nav } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Network } from "@ionic-native/network";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Utils } from "../services/utils";
import { ProfilePage } from "../pages/profile/profile";
import { ActaDigitalPage } from "../pages/acta-digital/acta-digital"

@Component({
  templateUrl: "app.html",
  providers: [OdooJsonRpc, Utils]
})
export class MyApp {

  public homeComercial:boolean = false;
  public homeMantenimiento:boolean = false;
  
  @ViewChild(Nav) nav: Nav;
  //rootPage: any = ProspectoPage;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any, icon: any }>;
  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen, public odooRpc: OdooJsonRpc, public alert: AlertController, private network: Network) {
    platform.ready().then(() => {
      splashScreen.hide();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      this.statusBar.backgroundColorByHexString("#3ebffb");
    });

    if (localStorage.getItem("token")) {


      let response = window.localStorage.getItem("token");
      let jsonData = JSON.parse(response);
      let username = jsonData["username"];
      let pass = jsonData["password"];
      let url = (jsonData["web.base.url"]) ? jsonData["web.base.url"] : "https://tudirectorio.com.co";
      let db = jsonData["db"];
      switch (jsonData.uid) {
        case 1:
          this.homeComercial = true;
          this.homeMantenimiento = false;
          // used for an example of ngFor and navigation
          this.pages = [
            { title: 'Oportunidades', component: HomePage, icon: 'stats' },
            { title: 'Perfil', component: ProfilePage, icon: 'contact' }
          ];
          break;
        case 20:
          // used for an example of ngFor and navigation
          this.pages = [
            { title: 'Mantenimientos', component: HomePage, icon: 'stats' },
            { title: 'Perfil', component: ProfilePage, icon: 'contact' },
            { title: 'Acta Digital', component: ActaDigitalPage, icon: 'document' }
          ];
          this.homeMantenimiento = true;
          this.homeComercial = false;
          break;
        default:
          break;
      }


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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}