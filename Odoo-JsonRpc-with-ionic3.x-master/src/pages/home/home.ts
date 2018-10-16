import { FormProbabilidadPage } from "../form-probabilidad/form-probabilidad";
import { Utils } from "../../services/utils";
import { ViewPage } from "../view/view";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { NavController, AlertController, LoadingController } from "ionic-angular";
import { Network } from "@ionic-native/network";
import { ProfilePage } from "../profile/profile";


@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  // splash = true;

  private partnerArray: Array<{
    id: number;
    probability: number;
    partner_id: string;
    name: string;
    colorDanger: boolean;
    colorwarning: boolean;
    colorSuccess: boolean;
  }> = [];

  private items: Array<{
    id: number;
    probability: number;
    partner_id: string;
    name: string;
    colorDanger: boolean;
    colorwarning: boolean;
    colorSuccess: boolean;
  }> = [];

  private partner = "crm.lead";

  constructor(private navCtrl: NavController, private odooRpc: OdooJsonRpc, private alertCtrl: AlertController, private network: Network, private alert: AlertController, private utils: Utils, public loadingCtrl: LoadingController) {
    this.display();
  }

  private display(): void {

    let domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
    this.odooRpc
      .searchRead(this.partner, domain, [], 0, 0, "")
      .then((partner: any) => {
        this.fillParners(partner);
      });
  }

  private fillParners(partners: any): void {
    let loading = this.loadingCtrl.create({
      content: "Estamos preparando todo..."
    });
    loading.present();
    let json = JSON.parse(partners._body);
    if (!json.error) {
      let query = json["result"].records;
      for (let i in query) {
        this.partnerArray.push({
          id: query[i].id,
          probability: query[i].probability == false ? "N/A" : query[i].probability,
          name: query[i].name == false ? "N/A" : query[i].name,
          partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_name,
          colorDanger: query[i].probability < 30 ? true : false,
          colorwarning: query[i].probability >= 30 && query[i].probability < 70 ? true : false,
          colorSuccess: query[i].probability >= 70 ? true : false,
        });
      }
    }
    loading.dismiss();
  }

  private view(idx: number): void {
    let params = {
      id: this.partnerArray[idx].id
    };
    this.navCtrl.push(ViewPage, params);
  }

  initializeItems(): void {
    this.partnerArray = this.items;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.partnerArray = this.partnerArray.filter(v => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  private delete(idx: number) {
    const confirm = this.alertCtrl.create({
      title: '¡Atención!',
      message: '¿Esta seguro de Eliminar el Registro?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.odooRpc.updateRecord(this.partner, this.partnerArray[idx].id, { active: false });
            this.utils.presentToast(
              this.partnerArray[idx].name + " se Elimino con Exito",
              5000,
              true,
              "top"
            );
            this.partnerArray.splice(idx, 1);
          }
        }
      ]
    });
    confirm.present();

  }
  viewProfile(): void {
    this.navCtrl.push(ProfilePage);
  }

  FormProbabilidad(tipo:any, idx:any = ""): void {
    let params = {
      tipo: tipo
    }
    if(idx !== ""){
      params['id'] = this.partnerArray[idx].id;
    }else{
      params['id'] = "";
    }
    this.navCtrl.push(FormProbabilidadPage,params);
  }
}
