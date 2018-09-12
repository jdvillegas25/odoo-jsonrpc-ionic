import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { OdooJsonRpc } from "../services/odoojsonrpc";
import { Component, ViewChild } from "@angular/core";
import { AlertController, Platform, Nav } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Network } from "@ionic-native/network";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Utils } from "../services/utils";
import { ProfilePage } from "../pages/profile/profile";

@Component({
  templateUrl: "app.html",
  providers: [OdooJsonRpc, Utils]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any, icon: any}>;
  constructor(
    platform: Platform,
    private statusBar: StatusBar,
    splashScreen: SplashScreen,
    public odooRpc: OdooJsonRpc,
    public alert: AlertController,
    private network: Network
  ) {
    platform.ready().then(() => {
      splashScreen.hide();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      this.statusBar.backgroundColorByHexString("#3ebffb");
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Oportunidades', component: HomePage, icon: 'stats' },
      { title: 'Perfil', component: ProfilePage, icon: 'contact' }
    ];

    if (localStorage.getItem("token")) {
      let response = window.localStorage.getItem("token");

      let jsonData = JSON.parse(response);
      let username = jsonData["username"];
      let pass = jsonData["password"];
      let url = jsonData["web.base.url"];
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}