import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the DataBaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const database = "allservice.db";
@Injectable()
export class DataBaseProvider {
  constructor(public http: HttpClient, public sqlite: SQLite) {
    this.createDataBase();
  }
  createDataBase() {
    let list_tables = "";
    list_tables += "CREATE TABLE IF NOT EXISTS res_users (id integer primary key, active boolean, login text, password text, company_id integer, partner_id integer, create_date text, create_uid integer, share boolean,  write_uid integer, write_date text, signature text, action_uid, password_crypt text, alias_id integer, chatter_needaction_auto booblean, sale_team_id integer, target_sales_done integer, target_sales_won integer, target_sales_invoiced integer, salesman boolean, technician boolean, player_id text, coordinator boolean)";
    return this.sqlite.create({
      name: database,
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql(list_tables, []).then(res => {
        return Promise.resolve(res);
      }).catch(e => {
        return Promise.resolve(e);
      });
    }).catch(e => {
      return Promise.resolve(e);
    });
  }

  select(table, data: Array<String>, where: String, limit: any) {
    let set = '';
    let cont = 1;
    let valor: Array<any> = [];
    let query = 'SELECT';

    if (data.length > 0) {
      let select = "";
      data.forEach(element => {
        if (cont < data.length) {
          select += element + ","
          cont++;
        } else {
          select += element
        }
      });
      query += select + " FROM" + table;
    } else {
      query += '* FROM' + table
    }

    if (where != "")
      query += " WHERE" + where + " ";

    if (limit != "")
      query += " " + limit + " "

    return this.sqlite.create({
      name: database,
      location: 'dafult'
    }).then((db: SQLiteObject) => {
      return db.executeSql(query, []).then(res => {
        return Promise.resolve(res);
      }).catch(e => {
        return Promise.resolve(e);
      });
    }).catch(e => {
      return Promise.resolve(e);
    });
  }

  insert(table, data) {

    let columna = '';
    let valor: Array<any> = [];
    let comodin = '';
    let cont = 1;


    data.forEach(function (key, value) {
      valor.push(value);
      if (cont < data.length) {
        columna += key + ',';
        comodin += '?,';
        cont++;
      } else {
        columna += key;
        comodin += '?';
      }
    });

    return this.sqlite.create({
      name: database,
      location: 'dafult'
    }).then((db: SQLiteObject) => {
      return db.executeSql("INSERT INTO " + table + " (" + columna + ") VALUES (" + comodin + ")", valor).then(res => {
        return Promise.resolve(res);
      }).catch(e => {
        return Promise.resolve(e);
      });
    }).catch(e => {
      return Promise.resolve(e);
    });
  }
  update(table, data, where) {
    let set = '';
    let cont = 1;
    let valor: Array<any> = [];


    data.forEach(function (key, value) {
      if (cont == data.length) {
        valor.push(value);
        set += key + ' = ?';
      } else {
        set += key + ' = ?,';
        cont++;
      }
    });

    return this.sqlite.create({
      name: database,
      location: 'dafult'
    }).then((db: SQLiteObject) => {
      return db.executeSql("UPDATE " + table + " SET " + set + " WHERE " + where, valor).then(res => {
        return Promise.resolve(res);
      }).catch(e => {
        return Promise.resolve(e);
      });
    }).catch(e => {
      return Promise.resolve(e);
    });
  }
  delete(table, where: string) {
    let deleteQuery = "DELETE FROM "+ table +" WHERE "+ where;
    return this.sqlite.create({
      name: database,
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql(deleteQuery, []).then(res => {
        return Promise.resolve(res);
      }).catch(e => {
        return Promise.resolve(e);
      });
    }).catch(e => {
      return Promise.resolve(e);
    });
  }
}
