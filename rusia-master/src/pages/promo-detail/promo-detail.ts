import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PromoDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-promo-detail',
  templateUrl: 'promo-detail.html',
})
export class PromoDetailPage {

  promo = '';
  image = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.promo = this.navParams.data.promo;
  	this.image = this.navParams.data.image;
  }

  ionViewDidLoad() {
  }

}
