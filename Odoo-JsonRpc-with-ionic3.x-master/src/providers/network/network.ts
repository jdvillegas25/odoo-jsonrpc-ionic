import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {

  contador: number = 0;
  constructor(public http: HttpClient, public network: Network) { }

  validarConexion(callback, rowback) {
    this.network.onDisconnect().subscribe(() => {
      console.log('Estamos desconectados');
      rowback();
    });
    this.network.onConnect().subscribe(() => {
      console.log('Estamos Conectados');
      callback;
    });
  }

}
