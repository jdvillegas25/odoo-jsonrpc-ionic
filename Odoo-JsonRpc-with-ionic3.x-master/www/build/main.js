webpackJsonp([0],{

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetallePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__prospecto_prospecto__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__servicio_servicio__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DetallePage = (function () {
    function DetallePage(navCtrl, navParams, plt, odooRpc, alertCtrl, sanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.plt = plt;
        this.odooRpc = odooRpc;
        this.alertCtrl = alertCtrl;
        this.sanitizer = sanitizer;
        this.destino = "";
        /*
         * ubicationStart = Ubicacion desde donde el tecnico arranca para realizar el servicio.
         * ubicationToGo = Ubicacion a la cual se dirige el tecnico
         */
        this.ubicationStart = '';
        this.ubicationToGo = '';
        /*Data para almacenar lo data que obtenemos de la base de datos*/
        this.data = [];
        /* Data que vamos a usar para el paso de informacion al acta digital*/
        this.dataMantenimiento = [];
        /*Variables para habilitar modulo de comercial o modulo de mantenimientos*/
        this.homeComercial = false;
        this.homeMantenimiento = false;
        this.session = JSON.parse(localStorage.getItem('token'));
        this.oportunity = navParams.get("id");
        this.valida_session();
    }
    DetallePage.prototype.ionViewDidLoad = function () {
        this.display();
    };
    DetallePage.prototype.carge_map = function (end) {
        var _self = this;
        _self.plt.ready().then(function (readySource) {
            // Platform now ready, execute any required native code
            _self.loadMap();
            var currentposition = navigator.geolocation;
            if (currentposition) {
                currentposition.getCurrentPosition(function (position) {
                    var start = position.coords.latitude + ',' + position.coords.longitude;
                    _self.startNavigating(start, end);
                });
            }
        });
    };
    DetallePage.prototype.startNavigating = function (start, end) {
        /*
         * asignamos ubicationStart y ubicationToGo para luego poder enviarla al acta digital y que esta se encarge de hacer la insercion de dicha informacion para que podamos tener un control de los desplazamientos del tecnico
         */
        if (start != '' && end != '') {
            if (this.ubicationStart == '' && this.ubicationToGo == '') {
                this.ubicationStart = start;
                this.ubicationToGo = end;
            }
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay_1 = new google.maps.DirectionsRenderer();
            directionsDisplay_1.setMap(this.map);
            directionsDisplay_1.setPanel(this.directionsPanel.nativeElement);
            directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode["DRIVING"],
                provideRouteAlternatives: true,
                drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: 'pessimistic'
                },
                unitSystem: google.maps.UnitSystem.METRIC
            }, function (res, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay_1.setDirections(res);
                }
                else {
                    console.warn(status);
                }
            });
        }
    };
    DetallePage.prototype.valida_session = function () {
        if (this.session.salesman) {
            this.homeComercial = true;
            this.homeMantenimiento = false;
        }
        else if (this.session.technician) {
            this.homeMantenimiento = true;
            this.homeComercial = false;
        }
        else {
            console.log('NO ESTA DEFINIDO EL ROL');
        }
    };
    DetallePage.prototype.loadMap = function () {
        // let latLng = new google.maps.LatLng(-34.929, 138.601);
        var pos;
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        }, function (error) {
            console.log(error);
        });
        var mapOptions = {
            center: pos,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    };
    DetallePage.prototype.sanitize = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    DetallePage.prototype.display = function () {
        if (this.session.salesman) {
            this.getOportunidad();
        }
        else if (this.session.technician) {
            this.getMantenimiento();
        }
        else {
            console.log('¡PARAMETRO DESCONOCIDO!');
        }
    };
    DetallePage.prototype.addProspecto = function () {
        var params = {
            id: this.oportunity
        };
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__prospecto_prospecto__["a" /* ProspectoPage */], params);
    };
    DetallePage.prototype.getOportunidad = function () {
        var _this = this;
        var partner = "crm.lead";
        var fields = ["id", "date_closed", "create_date", "probability", "country_id", "day_close", "write_uid", "team_id", "partner_id", "city", "partner_name", "contact_name", "company_id", "description", "create_uid", "title_action", "phone", "name", "stage_id", "mobile", "street", "state_id", "email_from", "title"];
        var domain = [["id", "=", this.oportunity]];
        var sort = "";
        var limit = 0;
        var offset = 0;
        this.odooRpc.searchRead(partner, domain, fields, limit, offset, sort).then(function (res) {
            var data = JSON.parse(res._body)["result"].records;
            for (var record in data) {
                _this.name = data[record].name == false ? "N/A" : data[record].name;
                _this.email = data[record].email_from == false ? "N/A" : data[record].email;
                _this.data.push({
                    id: data[record].id == false ? "" : data[record].id,
                    date_closed: data[record].date_closed == false ? "" : data[record].date_closed,
                    create_date: data[record].create_date == false ? "" : data[record].create_date,
                    probability: data[record].probability == false ? "" : data[record].probability,
                    country_id: data[record].country_id == false ? "" : data[record].country_id,
                    day_close: data[record].day_close == false ? "" : data[record].day_close,
                    write_uid: data[record].write_uid == false ? "" : data[record].write_uid,
                    team_id: data[record].team_id == false ? "" : data[record].team_id,
                    partner_id: data[record].partner_id == false ? "" : data[record].partner_id,
                    city: data[record].city == false ? "" : data[record].city,
                    partner_name: data[record].partner_name == false ? "" : data[record].partner_name,
                    company_id: data[record].company_id == false ? "" : data[record].company_id,
                    description: data[record].description == false ? "" : data[record].description,
                    create_uid: data[record].create_uid == false ? "" : data[record].create_uid,
                    title_action: data[record].title_action == false ? "" : data[record].title_action,
                    phone: data[record].phone == false ? "" : data[record].phone,
                    name: data[record].name == false ? "" : data[record].name,
                    stage_id: data[record].stage_id == false ? "" : data[record].stage_id,
                    mobile: data[record].mobile == false ? "" : data[record].mobile,
                    street: data[record].street == false ? "" : data[record].street,
                    state_id: data[record].state_id == false ? "" : data[record].state_id,
                    email_from: data[record].email_from == false ? "" : data[record].email_from,
                    title: data[record].title == false ? "" : data[record].title,
                    colorDanger: data[record].probability < 30 ? true : false,
                    colorwarning: data[record].probability >= 30 && data[record].probability < 70 ? true : false,
                    colorSuccess: data[record].probability > 70 ? true : false,
                    contact_name: data[record].contact_name == false ? "" : data[record].contact_name,
                });
            }
        });
    };
    DetallePage.prototype.getMantenimiento = function () {
        var _this = this;
        var partner = "project.task";
        var fields = [];
        var domain = [["id", "=", this.oportunity]];
        var sort = "";
        var limit = 0;
        var offset = 0;
        this.odooRpc.searchRead(partner, domain, fields, limit, offset, sort).then(function (res) {
            var data = JSON.parse(res._body)["result"].records;
            for (var record in data) {
                _this.name = data[record].name == false ? "N/A" : data[record].name;
                _this.email = data[record].email_from == false ? "N/A" : data[record].email;
                _this.dataMantenimiento.push({
                    id: data[record].id == false ? "N/A" : data[record].id,
                    issue_id: data[record].issue_id == false ? "N/A" : data[record].issue_id,
                    name: data[record].name == false ? "N/A" : data[record].name,
                    categs_ids: data[record].categs_ids == false ? [] : data[record].categs_ids,
                    city_id: data[record].city_id == false ? [] : data[record].city_id,
                    request_source: data[record].request_source == false ? "N/A" : data[record].request_source,
                    branch_type: data[record].location_type_id == false ? "N/A" : data[record].location_type_id,
                    partner_id: data[record].partner_id == false ? [] : data[record].partner_id,
                    location_id: data[record].location_id == false ? [] : data[record].location_id,
                    user_id: data[record].user_id == false ? [] : data[record].user_id,
                    date_start: data[record].date_start == false ? "N/A" : data[record].date_start,
                    date_finish: data[record].date_finish == false ? "N/A" : data[record].date_finish,
                    description: data[record].issue_description == false ? "N/A" : data[record].issue_description,
                    sec: data[record].issue_sec == false ? "N/A" : data[record].issue_sec,
                    customer_sign_image: data[record].customer_sign_image,
                    notes: data[record].notes,
                    functionary_vat: data[record].functionary_vat,
                    functionary_name: data[record].functionary_name,
                    functionary_email: data[record].functionary_email,
                    finished: data[record].finished,
                    number_sap: data[record].number_sap,
                    coordinate: data[record].coordinate
                });
                _this.carge_map(data[record].coordinate);
                if (data[record].customer_asset_ids.length > 0) {
                    _this.get_detalle_task(data[record].id);
                }
            }
        });
    };
    DetallePage.prototype.get_detalle_task = function (idTask) {
        var _this = this;
        var partner = "project.customer.asset";
        var fields = [];
        var domain = [["task_id", "=", idTask]];
        var sort = "";
        var limit = 0;
        var offset = 0;
        this.odooRpc.searchRead(partner, domain, fields, limit, offset, sort).then(function (res) {
            var data = JSON.parse(res._body)["result"].records;
            _this.dataMantenimiento[0]['customer_asset_ids'] = data;
        });
    };
    DetallePage.prototype.continuarServicio = function () {
        var params = {};
        var date = new Date();
        //console.log(new Date().toLocaleString("es-CO", {timeZone: "America/Bogota"}));
        var day = date.getDate();
        var month = (date.getMonth() + 1 < 10) ? "0" + Number(date.getMonth() + 1) : date.getMonth() + 1;
        var year = date.getFullYear();
        params = this.dataMantenimiento[0];
        params["origin_tech_coord"] = this.ubicationStart;
        //params["entry_time"] = date;
        params["entry_time"] = year + "-" + month + "-" + day + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__servicio_servicio__["a" /* ServicioPage */], params);
    };
    DetallePage.prototype.NotificarLlegada = function () {
    };
    return DetallePage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_14" /* ViewChild */])("map"),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ElementRef */])
], DetallePage.prototype, "mapElement", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_14" /* ViewChild */])("directionsPanel"),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ElementRef */])
], DetallePage.prototype, "directionsPanel", void 0);
DetallePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: "page-detalle",template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\detalle\detalle.html"*/'<ion-header>\n  <ion-navbar *ngIf="homeComercial" color="secondary">\n    <ion-title>Detalle Oportunidad {{name}}</ion-title>\n  </ion-navbar>\n  <ion-navbar *ngIf="homeMantenimiento" color="primary">\n    <ion-title>Detalle Mantenimiento {{name}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<!--Vista para comercial-->\n<ion-content *ngIf="homeComercial">\n  <ion-list>\n    <ion-card *ngFor="let item of data">\n      <ion-card-content>\n        <ion-row>\n          <ion-col col-12>\n            <h1><strong>Información Probabilidad:</strong></h1>\n          </ion-col>\n          <ion-col>\n            <strong>Oportunidad: </strong>\n            <p>{{item.name}}</p>\n          </ion-col>\n          <ion-col>\n            <strong>Probabilidad: </strong>\n            <h1 *ngIf="item.colorDanger">\n              <p style="color:#F44336;"> {{item.probability}}% </p>\n            </h1>\n            <h1 *ngIf="item.colorwarning">\n              <p style="color:#FF9800;"> {{item.probability}}% </p>\n            </h1>\n            <h1 *ngIf="item.colorSuccess">\n              <p style="color:#4CAF50;"> {{item.probability}}% </p>\n            </h1>\n          </ion-col>\n          <ion-col col-12>\n            <strong>Descripción: </strong>\n            <p>{{item.description}}</p>\n          </ion-col>\n          <ion-col col-6>\n            <strong>Fecha Creación:</strong>\n            <p>{{item.create_date}}</p>\n          </ion-col>\n          <ion-col col-6>\n            <strong>Fecha de Cierre:</strong>\n            <p>{{item.date_closed}}</p>\n          </ion-col>\n          <ion-col col-6>\n            <strong>Dias de Cierre:</strong>\n            <p>{{item.day_close}}</p>\n          </ion-col>\n          <ion-col col-6>\n            <strong>Ciudad:</strong>\n            <p>{{item.city}}</p>\n          </ion-col>\n          <ion-col col-12>\n            <strong>Acción:</strong>\n            <p>{{item.title_action}}</p>\n          </ion-col>\n        </ion-row>\n      </ion-card-content>\n      <ion-card-content>\n        <ion-row>\n          <ion-col col-12>\n            <h1><strong>Información Cliente:</strong></h1>\n          </ion-col>\n          <ion-col col-12>\n            <strong>Cliente: </strong>\n            <p>{{item.partner_name}}</p>\n          </ion-col>\n          <ion-col col-12>\n            <strong>Contacto: </strong>\n            <p>{{item.contact_name}}</p>\n          </ion-col>\n          <ion-col col-12>\n            <strong>eMail: </strong>\n            <p>{{item.email_from}}</p>\n          </ion-col>\n          <ion-col col-6>\n            <strong>Teléfono: </strong>\n            <p>{{item.phone}}</p>\n          </ion-col>\n          <ion-col col-6>\n            <strong>Celular: </strong>\n            <p>{{item.mobile}}</p>\n          </ion-col>\n          <ion-col col-12>\n            <strong>Dirección: </strong>\n            <p>{{item.street}}</p>\n          </ion-col>\n        </ion-row>\n        <ion-row>\n          <ion-col>\n            <button ion-fab color="secondary" (click)="addProspecto()">\n              <ion-icon name="md-add"></ion-icon>\n            </button>\n          </ion-col>\n        </ion-row>\n      </ion-card-content>\n    </ion-card>\n  </ion-list>\n</ion-content>\n\n<!--Vista para manenimiento-->\n<ion-content *ngIf="homeMantenimiento">\n  <div #map id="map"></div>\n  <ion-card id="direccion" #direccion>\n    <ion-card-content>\n      <div #directionsPanel></div>\n    </ion-card-content>\n  </ion-card>\n  <ion-list>\n    <ion-card *ngFor="let i of dataMantenimiento">\n      <ion-card-header>\n        <h1><strong>{{ i.name }}</strong></h1>\n      </ion-card-header>\n      <ion-card-content>\n        <h1 *ngIf="i.finished"><strong>Información General</strong></h1>\n        <p><strong>Resumen: </strong>{{i.issue_id[1]}}</p>\n        <p><strong>Número SAP: </strong>{{i.number_sap}}</p>\n        <p><strong>Identificación: </strong>{{i.sec}}</p>\n        <p><strong>Ciudad: </strong>{{i.city_id}}</p>\n        <p><strong>Tipo de Establecimiento: </strong>{{i.branch_type}}</p>\n        <p><strong>Cliente: </strong>{{i.partner_id[1]}}</p>\n        <p><strong>Locación: </strong>{{i.location_id}}</p>\n        <p><strong>Usuario: </strong>{{i.user_id[1]}}</p>\n        <p><strong>Fecha Inicial: </strong>{{i.date_start}}</p>\n        <p><strong>Descripción: </strong>{{i.description}}</p>\n        <br>\n        <h1 *ngIf="i.finished"><strong>Información del Sistema</strong></h1>\n        <p *ngIf="i.customer_asset_ids">\n          <strong>Sistema Afectado</strong>\n          {{i.customer_asset_ids[0].product_category_id[1]}}\n        </p>\n        <hr style="color: #212121 !important">\n        <div *ngFor="let p of i.customer_asset_ids">\n          <p *ngIf="i.finished">\n            <strong>Subsistema Afectado: </strong>\n            {{p.product_service_cat_id[1]}}\n          </p>\n          <p *ngIf="i.finished">\n            <strong>Equipo Afectado Afectado: </strong>\n            {{p.product_id[1]}}\n          </p>\n          <p *ngIf="p.replaced" style="color: #FF9800;">\n            <strong>Equipo Reparado</strong>\n          </p>\n          <p *ngIf="!p.replaced" style="color: #4CAF50;">\n            <strong>Equipo Nuevo</strong>\n          </p>\n          <hr style="color: #212121 !important">\n        </div>\n        <br>\n        <h1 *ngIf="i.finished"><strong>Información Del Funcionario</strong></h1>\n        <p *ngIf="i.finished"><strong>Observaciones: </strong>{{i.notes}}</p>\n        <p *ngIf="i.finished"><strong>Id Funcionario: </strong>{{i.functionary_vat}}</p>\n        <p *ngIf="i.finished"><strong>Funcionario: </strong>{{i.functionary_name}}</p>\n        <p *ngIf="i.finished"><strong>Email Funcionario: </strong>{{i.functionary_email}}</p>\n        <p *ngIf="i.finished">\n          <strong>Firma del Responsable: </strong>\n          <img [src]="sanitize(\'data:image/png;base64,\'+i.customer_sign_image)">\n        </p>\n        <p *ngFor="let p of i.customer_asset_ids">\n          <strong>Sistema Afectado</strong>\n        </p>\n      </ion-card-content>\n      <ion-row no-padding *ngIf="!i.finished">\n        <ion-col text-right>\n          <button ion-button clear small color="primary" icon-start *ngIf="!i.finished" (click)="continuarServicio()">\n            <ion-icon name=\'share-alt\'></ion-icon>\n            Continuar Servicio\n          </button>\n          <!-- <button ion-button clear small color="danger" icon-start *ngIf="!i.finished" (click)="NotificarLlegada()">\n            <ion-icon name=\'notifications\'></ion-icon>\n            Notificar llegada\n          </button> -->\n        </ion-col>\n      </ion-row>\n    </ion-card>\n  </ion-list>\n  <!-- <div #map id="map"></div> -->\n</ion-content>\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\detalle\detalle.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["c" /* DomSanitizer */]])
], DetallePage);

//# sourceMappingURL=detalle.js.map

/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActaDigitalPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__home_home__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modal_modal__ = __webpack_require__(361);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__add_customer_add_customer__ = __webpack_require__(99);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};











/**
 * Generated class for the ActaDigitalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ActaDigitalPage = (function () {
    function ActaDigitalPage(navCtrl, navParams, odooRpc, loadingCtrl, platform, toastCtrl, camera, sanitizer, fileChooser, file, storage, renderer, plt, alertCtrl, rendere, modal) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.sanitizer = sanitizer;
        this.fileChooser = fileChooser;
        this.file = file;
        this.storage = storage;
        this.renderer = renderer;
        this.plt = plt;
        this.alertCtrl = alertCtrl;
        this.rendere = rendere;
        this.modal = modal;
        /***********************************************************************
         * Autor: Brayan Gonzalez
         * Descripcion: Variables necesarios para el proceso de acta digital
         **********************************************************************/
        this.dataMantenimiento = [];
        this.necesidad = [];
        this.servicios = [];
        this.productos = [];
        /*Esta variable solo se usa cuando se genera acta digital desde cita fallida*/
        this.data = [];
        this.firma = "";
        this.Datafirma = "";
        this.username = JSON.parse(localStorage.getItem('token'))['username'];
        this.finish = false;
        /**********************************************************************
         * Autor: Brayan Gonzalez
         * Descripcion:Asignaremos las variables que llegan desde ServicioPage
         ***********************************************************************/
        this.dataMantenimiento = (navParams.get("dataMantenimiento")) ? navParams.get("dataMantenimiento") : [];
        this.necesidad = (navParams.get("necesidad")) ? navParams.get("necesidad") : [];
        this.servicios = (navParams.get("servicios")) ? navParams.get("servicios") : [];
        this.productos = (navParams.get("productos")) ? navParams.get("productos") : [];
        /*Esta variable solo se usa cuando se genera acta digital desde cita fallida*/
        this.data = (navParams.get("data")) ? navParams.get("data") : [];
        this.firma = "";
        this.getClientes();
    }
    ActaDigitalPage.prototype.openModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var myModal;
            return __generator(this, function (_a) {
                myModal = this.modal.create(__WEBPACK_IMPORTED_MODULE_9__modal_modal__["a" /* ModalPage */]);
                myModal.present();
                myModal.onDidDismiss(function (data) {
                    _this.firma = data.firma;
                    _this.Datafirma = data.Datafirma;
                    _this.finish = data.finish;
                });
                myModal.onWillDismiss(function (data) {
                    _this.firma = data.firma;
                    _this.Datafirma = data.Datafirma;
                    _this.finish = data.finish;
                });
                return [2 /*return*/];
            });
        });
    };
    ActaDigitalPage.prototype.save_acta = function () {
        if (Object.keys(this.necesidad).length > 0 && Object.keys(this.servicios).length > 0 && Object.keys(this.productos).length > 0) {
            this.acta_servicio();
        }
        else if (Object.keys(this.data).length > 0) {
            this.acta_cita_fallida();
        }
    };
    ActaDigitalPage.prototype.acta_servicio = function () {
        if (this.Datafirma == "") {
            var alert_1 = this.alertCtrl.create({
                title: 'ERROR',
                subTitle: 'Por favor agregue la firma del encargado',
                buttons: ['OK']
            });
            alert_1.present();
        }
        else if (this.functionary_vat === undefined) {
            var alert_2 = this.alertCtrl.create({
                title: 'ERROR',
                subTitle: 'Por favor el documento del encargado',
                buttons: ['OK']
            });
            alert_2.present();
        }
        else if (this.functionary_name === undefined) {
            var alert_3 = this.alertCtrl.create({
                title: 'ERROR',
                subTitle: 'Por favor agregue el nombre del encargado',
                buttons: ['OK']
            });
            alert_3.present();
        }
        else if (this.functionary_email === undefined) {
            var alert_4 = this.alertCtrl.create({
                title: 'ERROR',
                subTitle: 'Por favor agregue el email del encargado',
                buttons: ['OK']
            });
            alert_4.present();
        }
        else {
            /*************Data a almacenar para equipos electronicos***********/
            if (this.update_task()) {
                if (this.insert_services_task()) {
                    this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */]);
                }
                else {
                    var alert_5 = this.alertCtrl.create({
                        title: 'ERROR',
                        subTitle: 'Se han presentado fallas para generar los productos en el acta digital',
                        buttons: ['OK']
                    });
                    alert_5.present();
                }
            }
            else {
                var alert_6 = this.alertCtrl.create({
                    title: 'ERROR',
                    subTitle: 'Se han presentado fallas para generar la firma digital',
                    buttons: ['OK']
                });
                alert_6.present();
            }
        }
    };
    ActaDigitalPage.prototype.acta_cita_fallida = function () {
        var _this = this;
        var table = "";
        var data = {
            fail_cause_id: this.data['fail_cause_id'][1],
            assignment_status: this.data['assignment_status'],
            fail_description_id: this.data['fail_description_id'][1],
            finished: this.data['finished'],
            kanban_state: this.data['kanban_state']
        };
        this.odooRpc.updateRecord(table, this.dataMantenimiento.id, data).then(function () {
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__home_home__["a" /* HomePage */]);
        });
    };
    ActaDigitalPage.prototype.update_task = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _self, salida, date, day, month, year, table_1, data_1, geocoder, latlngStr, latlng;
            return __generator(this, function (_a) {
                _self = this;
                salida = true;
                date = new Date();
                day = date.getDate();
                month = (date.getMonth() + 1 < 10) ? "0" + Number(date.getMonth() + 1) : date.getMonth() + 1;
                year = date.getFullYear();
                if (this.firma != "") {
                    table_1 = "project.task";
                    data_1 = {
                        notes: this.observation_user,
                        customer_sign_image: this.Datafirma,
                        finished: true,
                        kanban_state: 'done',
                        functionary_vat: this.functionary_vat,
                        functionary_name: this.functionary_name,
                        functionary_email: this.functionary_email,
                        origin_tech_coord: this.dataMantenimiento.origin_tech_coord,
                        entry_time: this.dataMantenimiento.entry_time,
                        departure_time: year + "-" + month + "-" + day + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                    };
                    geocoder = new google.maps.Geocoder;
                    latlngStr = this.dataMantenimiento.origin_tech_coord.split(',', 2);
                    latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
                    geocoder.geocode({ 'location': latlng }, function (results, status) {
                        data_1['origin_address'] = results[0].formatted_address;
                        _self.odooRpc.updateRecord(table_1, _self.dataMantenimiento.id, data_1).then(function (query) {
                            if (query.ok) {
                                salida = true;
                            }
                        }).catch(function (err) {
                            salida = false;
                        });
                    });
                }
                else {
                    salida = false;
                }
                return [2 /*return*/, salida];
            });
        });
    };
    ActaDigitalPage.prototype.insert_services_task = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var salida, contador, table;
            return __generator(this, function (_a) {
                salida = true;
                contador = 0;
                table = 'project.customer.asset';
                this.productos.forEach(function (pro) {
                    var data = {
                        task_id: _this.dataMantenimiento.id,
                        product_category_id: null,
                        product_service_cat_id: null,
                        product_id: pro.id,
                        quantity: pro.cantidad,
                        replaced: (pro.accion == 1) ? true : false,
                        asset_location: pro.ubication,
                        serial_number: pro.serial_number,
                        asset_image: pro.pictures,
                        spare_location_id: null,
                        equipment_type_id: null,
                        equipment_id: null
                    };
                    switch (_this.dataMantenimiento.typeMaintenance) {
                        case 'electronico':
                            data.product_category_id = _this.necesidad['id'];
                            data.product_service_cat_id = pro.service[0];
                            break;
                        case 'metalmecanico':
                            data.product_category_id = pro.categ_id;
                            data.spare_location_id = pro.location_id;
                            data.equipment_type_id = pro.equipment_id;
                            break;
                        default:
                            break;
                    }
                    _this.odooRpc.createRecord(table, data).then(function (res) {
                        if (res.ok === true) {
                            contador++;
                            if (contador == _this.productos.length) {
                                salida = true;
                            }
                        }
                    }).catch(function (err) {
                        salida = false;
                    });
                });
                salida = true;
                return [2 /*return*/, salida];
            });
        });
    };
    ActaDigitalPage.prototype.getClientes = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var table_cliente = "res.partner";
        var domain = [["active", "=", "t"], ["parent_id", "=", this.dataMantenimiento.partner_id[0]]];
        this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then(function (partner) {
            var json = JSON.parse(partner._body);
            if (!json.error) {
                _this.listaClientes = json["result"].records;
                loading.dismiss();
            }
        });
    };
    ActaDigitalPage.prototype.persistCliente = function () {
        var _this = this;
        if (this.cliente == 'addCustomer') {
            var alert_7 = this.alertCtrl.create({
                title: 'Confirmación de crear cliente',
                message: '¿Esta seguro que quiere crear un cliente nuevo?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Si',
                        handler: function () {
                            _this.addCustomer();
                        }
                    }
                ]
            });
            alert_7.present();
        }
        else {
            this.parseoClientes();
        }
    };
    ActaDigitalPage.prototype.parseoClientes = function () {
        for (var _i = 0, _a = this.listaClientes; _i < _a.length; _i++) {
            var client = _a[_i];
            if (this.cliente == client.id) {
                this.functionary_vat = client.vat_vd ? client.vat_vd : 'N/A';
                this.functionary_name = client.name ? client.name : 'N/A';
                this.functionary_email = client.email ? client.email : 'N/A';
            }
        }
    };
    ActaDigitalPage.prototype.addCustomer = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__add_customer_add_customer__["a" /* AddCustomerPage */]);
    };
    return ActaDigitalPage;
}());
ActaDigitalPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: 'page-acta-digital',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\acta-digital\acta-digital.html"*/'<!--\n\n  Generated template for the ActaDigitalPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>Acta Digital</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n<ion-content padding no-bounce>\n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col>\n\n        <h1 align="center">Acta Digital</h1>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Nombre Aviso:</strong></ion-col>\n\n      <ion-col>{{dataMantenimiento.name}}</ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Número Aviso:</strong></ion-col>\n\n      <ion-col>{{dataMantenimiento.sec}}</ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Cliente:</strong></ion-col>\n\n      <ion-col>{{dataMantenimiento.partner_id[1]}}</ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Ciudad del Aviso:</strong></ion-col>\n\n      <ion-col>{{dataMantenimiento.city_id}}</ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Código Oficina:</strong></ion-col>\n\n      <ion-col>827</ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Nombre Oficina:</strong></ion-col>\n\n      <ion-col>{{dataMantenimiento.branch_type}} {{dataMantenimiento.location_id}}</ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col><strong>Falla Reportada:</strong></ion-col>\n\n      <ion-col>{{dataMantenimiento.description}}</ion-col>\n\n    </ion-row>\n\n\n\n\n\n    <div *ngIf="necesidad.length == 0; else elseNec">\n\n      <ion-row>\n\n        <ion-col><strong>Motivo de cita fallida: </strong></ion-col>\n\n        <ion-col>{{data.fail_cause_id[1]}}</ion-col>\n\n      </ion-row>\n\n      <ion-row>\n\n        <ion-col><strong>Detalle de cita fallida : </strong></ion-col>\n\n        <ion-col>{{data.fail_description_id[1]}}</ion-col>\n\n      </ion-row>\n\n      <ion-row>\n\n        <ion-col><strong>Nombre del Técnico:</strong></ion-col>\n\n        <ion-col>{{username}}</ion-col>\n\n      </ion-row>\n\n    </div>\n\n\n\n    <ng-template #elseNec>\n\n      <ion-row>\n\n        <ion-col><strong>Trabajo Realizado sobre: </strong></ion-col>\n\n        <ion-col>{{necesidad.name}}</ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row>\n\n        <ion-col><strong>Trabajo Realizado:</strong></ion-col>\n\n        <ion-col>\n\n          <p *ngFor="let ser of servicios">{{ser.name}}</p>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row>\n\n        <ion-col><strong>Repuestos y/o suministros Reparados:</strong></ion-col>\n\n        <ion-col>\n\n          <ion-row *ngFor="let prod of productos">\n\n            <ion-col *ngIf="prod.accion == 1"><strong>Producto: </strong>{{prod.name}}</ion-col>\n\n            <ion-col *ngIf="prod.accion == 1"><strong>Cantidad: </strong>{{prod.cantidad}}</ion-col>\n\n          </ion-row>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row>\n\n        <ion-col><strong>Repuestos y/o suministros nuevos:</strong></ion-col>\n\n        <ion-col>\n\n          <ion-row *ngFor="let pro of productos">\n\n            <ion-col *ngIf="pro.accion == 2"><strong>Producto: </strong>{{pro.name}}</ion-col>\n\n            <ion-col *ngIf="pro.accion == 2"><strong>Cantidad: </strong>{{pro.cantidad}}</ion-col>\n\n          </ion-row>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row>\n\n        <ion-col><strong>Nombre del Técnico:</strong></ion-col>\n\n        <ion-col>{{username}}</ion-col>\n\n      </ion-row>\n\n    </ng-template>\n\n  </ion-grid>\n\n  <div align="left" *ngIf="necesidad.length != 0">\n\n    <ion-item>\n\n      <ion-label stacked>Observaciones del Técnico</ion-label>\n\n      <ion-input type="text" [(ngModel)]="observation_user"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label stacked>Cliente</ion-label>\n\n      <ion-select [(ngModel)]="cliente" #cli id="cli" (ionChange)="persistCliente()">\n\n        <ion-option value="addCustomer">\n\n          <--CREAR CLIENTE NUEVO-->\n\n        </ion-option>\n\n        <ion-option *ngFor="let i of listaClientes" value="{{i.id}}">{{i.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label stacked>Identificación del Contacto</ion-label>\n\n      <ion-input type="number" [(ngModel)]="functionary_vat"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label stacked>Nombre del Funcionario</ion-label>\n\n      <ion-input type="text" [(ngModel)]="functionary_name"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label stacked>Email del Funcionario</ion-label>\n\n      <ion-input type="email" [(ngModel)]="functionary_email"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="!finish">\n\n      <button ion-button color="danger" full (click)="openModal()">Crear Firma</button>\n\n    </ion-item>\n\n  </div>\n\n  <ion-list *ngIf="firma">\n\n    <ion-list-header>Firma del Responsable</ion-list-header>\n\n    <ion-card>\n\n      <ion-card-content>\n\n        <img src="{{firma}}">\n\n      </ion-card-content>\n\n    </ion-card>\n\n  </ion-list>\n\n  <button ion-button color="secondary" full (click)="save_acta()">Finalizar Proceso</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\acta-digital\acta-digital.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__["a" /* FileChooser */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["_0" /* Renderer */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["_1" /* Renderer2 */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* ModalController */]])
], ActaDigitalPage);

//# sourceMappingURL=acta-digital.js.map

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__login_login__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_utils__ = __webpack_require__(43);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ProfilePage = (function () {
    function ProfilePage(navCtrl, navParams, odooRpc, utils) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.utils = utils;
        this.homeComercial = false;
        this.homeMantenimiento = false;
        this.data = [];
    }
    ProfilePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (JSON.parse(localStorage.getItem('token'))['salesman']) {
            this.homeComercial = true;
            this.homeMantenimiento = false;
        }
        else {
            this.homeMantenimiento = true;
            this.homeComercial = false;
        }
        var response = localStorage.getItem('token');
        var jsonData = JSON.parse(response);
        this.name = jsonData['name'];
        this.partnerId = jsonData['partner_id'];
        this.db = jsonData['db'];
        this.serverUrl = jsonData['web.base.url'];
        var resUser = "res.partner";
        var fields = [
            "name", "email", "mobile", "phone", "title", "street",
            "street2", "city", "state_id", "country_id", "zip", "website", "image"
        ];
        var domain = [
            ["id", "=", this.partnerId]
        ];
        var offset = 0;
        var limit = 0;
        var sort = "";
        this.odooRpc.searchRead(resUser, domain, fields, limit, offset, sort).then(function (res) {
            _this.fillData(res);
        });
    };
    ProfilePage.prototype.fillData = function (data) {
        var json = JSON.parse(data._body)["result"].records;
        for (var record in json) {
            this.imageSrc = json[record].image;
            this.email = json[record].email;
            this.data.push({
                id: json[record].id,
                name: json[record].name,
                email: json[record].email == false ? "N/A" : json[record].email,
                mobile: json[record].mobile == false ? "N/A" : json[record].mobile,
                phone: json[record].phone == false ? "N/A" : json[record].phone,
                title: json[record].title == false ? "N/A" : json[record].title[1],
                street: json[record].street == false ? "" : json[record].street,
                street2: json[record].street2 == false ? "" : json[record].street2,
                city: json[record].city == false ? "" : json[record].city,
                state_id: json[record].state_id == false ? "" : json[record].state_id[1],
                country_id: json[record].country_id == false ? "" : json[record].country_id[1],
                zip: json[record].zip == false ? "" : json[record].zip,
                website: json[record].website == false ? "N/A" : json[record].website
            });
        }
    };
    ProfilePage.prototype.logout = function () {
        var _this = this;
        this.utils.presentAlert("Cerrar Sesión", "¿Esta seguro de cerra la sesión?", [{
                text: "Cancelar"
            },
            {
                text: "Cerrar Sesión",
                handler: function () {
                    localStorage.clear();
                    console.log(localStorage);
                    _this.odooRpc.destroy();
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__login_login__["a" /* LoginPage */]);
                }
            }]);
    };
    return ProfilePage;
}());
ProfilePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: 'page-profile',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\profile\profile.html"*/'<ion-header>\n\n\n\n  <ion-navbar *ngIf="homeComercial" hideBackButton="true" color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Profile</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (click)="logout()">\n\n        <ion-icon name="exit"></ion-icon>\n\n        <!-- <ion-icon ios="ios-exit" md="ios-exit"></ion-icon> -->\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n  <ion-navbar *ngIf="homeMantenimiento" hideBackButton="true" color="primary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Profile</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (click)="logout()">\n\n        <ion-icon name="exit"></ion-icon>\n\n        <!-- <ion-icon ios="ios-exit" md="ios-exit"></ion-icon> -->\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n\n\n  <div *ngIf="homeComercial" class="profile-background_green">\n\n\n\n    <ion-img src="data:image/*;base64,{{imageSrc}}" class="round-image" style="\n\n      height: 150px !important;\n\n      width: 150px !important;\n\n      margin-top: 12%;\n\n      background: none !important;\n\n      background-color :none !important;" (click)="presentActionSheet()"></ion-img>\n\n    <h1 style="color: #fff">{{name}}</h1>\n\n    <h6 style="color: #fff">{{email}}</h6>\n\n\n\n  </div>\n\n  <div *ngIf="homeMantenimiento" class="profile-background_blue">\n\n\n\n    <ion-img src="data:image/*;base64,{{imageSrc}}" class="round-image" style="\n\n      height: 150px !important;\n\n      width: 150px !important;\n\n      margin-top: 12%;\n\n      background: none !important;\n\n      background-color :none !important;" (click)="presentActionSheet()"></ion-img>\n\n    <h1 style="color: #fff">{{name}}</h1>\n\n    <h6 style="color: #fff">{{email}}</h6>\n\n\n\n  </div>\n\n\n\n  <div>\n\n\n\n    <ion-row *ngFor="let item of data">\n\n      <ion-grid>\n\n        <ion-item>\n\n          <ion-row>\n\n            <ion-col class="spec">Movil</ion-col>\n\n            <ion-col>{{item.mobile}}</ion-col>\n\n          </ion-row>\n\n        </ion-item>\n\n\n\n        <ion-item>\n\n          <ion-row>\n\n            <ion-col class="spec">Teléfono</ion-col>\n\n            <ion-col>{{item.phone}}</ion-col>\n\n          </ion-row>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-row>\n\n            <ion-col class="spec">Dirección</ion-col>\n\n            <ion-col>{{item.street}} {{item.street2}} {{item.city}}</ion-col>\n\n            <ion-col>{{item.state_id}} {{item.country_id}} {{item.zip}}</ion-col>\n\n          </ion-row>\n\n        </ion-item>\n\n\n\n        <ion-item>\n\n          <ion-row>\n\n            <ion-col class="spec">Sitio Web</ion-col>\n\n            <ion-col>{{item.website}}</ion-col>\n\n          </ion-row>\n\n        </ion-item>\n\n\n\n      </ion-grid>\n\n    </ion-row>\n\n  </div>\n\n\n\n\n\n</ion-content>'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\profile\profile.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_4__services_utils__["a" /* Utils */]])
], ProfilePage);

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_utils__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_onesignal__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_network_network__ = __webpack_require__(166);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoginPage = (function () {
    function LoginPage(menu, navCtrl, navParams, odooRpc, utils, oneSignal, loadingCtrl, alertCtrl, network, proNet) {
        this.menu = menu;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.utils = utils;
        this.oneSignal = oneSignal;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.network = network;
        this.proNet = proNet;
        // private listForProtocol: Array<{protocol: string;}> = [];
        this.perfectUrl = true;
        this.dbList = [];
        this.selectedDatabase = "allservice";
        this.getNetwork();
        this.menu.enable(false, 'salesman');
        this.menu.enable(false, 'technician');
    }
    LoginPage.prototype.getNetwork = function () {
        this.proNet.validarConexion(this.checkUrl(), function () { console.log('Funcion de desconexion'); });
    };
    LoginPage.prototype.checkUrl = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "Estamos preparando todo..."
        });
        loading.present();
        this.odooRpc.init({
            odoo_server: "https://erp.allser.com.co",
            http_auth: "username:password" // optional
        });
        this.odooRpc.getDbList().then(function (dbList) {
            _this.fillData(dbList);
            _this.perfectUrl = true;
            loading.dismiss();
        }).catch(function (err) {
            loading.dismiss();
        });
        loading.dismiss();
    };
    LoginPage.prototype.fillData = function (res) {
        var body = JSON.parse(res._body);
        var json = body["result"];
        this.dbList.length = 0;
        for (var key in json) {
            this.dbList.push({ dbName: json[key] });
        }
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "Estamos preparando todo..."
        });
        loading.present();
        this.odooRpc.login(this.selectedDatabase, this.email, this.password).then(function (res) {
            /**Asigna la variable de sesion */
            _this.logiData = JSON.parse(res._body)["result"];
            if (_this.logiData.uid !== false) {
                _this.logiData.password = _this.password;
                localStorage.setItem("token", JSON.stringify(_this.logiData));
                loading.dismissAll();
                _this.initOneSignal();
                _this.permisos();
            }
            else {
                loading.dismissAll();
                _this.utils.presentAlert("Error", "Usuario o Contraseña Incorrecta", [
                    {
                        text: "Ok"
                    }
                ]);
            }
        }).catch(function (err) {
            loading.dismissAll();
            _this.utils.presentAlert("Error", "Usuario o Contraseña Incorrecta", [
                {
                    text: "Ok"
                }
            ]);
        });
    };
    LoginPage.prototype.permisos = function () {
        var _this = this;
        var domain = [['partner_id', '=', this.logiData["partner_id"]]];
        var table = "res.users";
        this.odooRpc.searchRead(table, domain, [], 0, 0, "").then(function (items) {
            var json = JSON.parse(items._body);
            if (!json.error && json["result"].records != []) {
                for (var _i = 0, _a = json["result"].records; _i < _a.length; _i++) {
                    var i = _a[_i];
                    //en la variable sesion creamos dos variables nuevas, salesman y technician
                    _this.logiData.technician = i.technician;
                    _this.logiData.salesman = i.salesman;
                    //reasignamos la variable sesion con las nuevas variables
                    localStorage.setItem("token", JSON.stringify(_this.logiData));
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */]);
                }
            }
        });
    };
    LoginPage.prototype.initOneSignal = function () {
        var _this = this;
        this.oneSignal.startInit('24193be6-3c15-4975-8f5c-102ea593a5a3');
        // this.oneSignal.startInit('24193be6-3c15-4975-8f5c-102ea593a5a3', 'AIzaSyBghyYsGpX9d58LuDy9tItjX5Pk4z68n4A');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived()
            .subscribe(function () {
            console.log('Notification Recived.');
        });
        this.oneSignal.handleNotificationOpened()
            .subscribe(function () {
            console.log('Notification Opened.');
        });
        this.oneSignal.endInit();
        this.oneSignal.getIds().then(function (id) {
            var uid = JSON.parse(localStorage.getItem('token'))['uid'];
            var table = "res.users";
            var data = {
                player_id: id.userId,
            };
            _this.odooRpc.updateRecord(table, uid, data);
        });
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({
        selector: "page-login",template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\login\login.html"*/'<ion-content class="background grid-basic-page" text-center align-center>\n\n  <ion-grid style="margin:25% 0 25% 0">\n\n    <ion-row align-items-start>\n\n      <ion-col>\n\n        <div>\n\n          <ion-img chache bounds class="img-logo" src="assets/imgs/logo_login.png" alt="Logo All Service"></ion-img>\n\n        </div>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row text-center>\n\n      <ion-col col-12>\n\n        <ion-card>\n\n          <ion-card-content>\n\n            <div class="spacer" style="height: 10px;"></div>\n\n            <div [hidden]="!perfectUrl">\n\n              <form (ngSubmit)="login()" #registerForm="ngForm">\n\n                <div class="spacer" style="height: 10px;"></div>\n\n                <ion-item>\n\n                  <ion-input type="email" [(ngModel)]="email" name="email" placeholder="Correo o Usuario" required></ion-input>\n\n                </ion-item>\n\n                <div class="spacer" style="height: 5px;"></div>\n\n                <ion-item>\n\n                  <ion-input type="password" [(ngModel)]="password" name="pass" placeholder="Contraseña" required></ion-input>\n\n                </ion-item>\n\n                <div class="spacer" style="height: 10px;"></div>\n\n                <div class="spacer" style="height: 10px;"></div>\n\n                <!-- <ion-item>\n\n                  <ion-label style="color: #818181">Seleccion Base de Datos</ion-label>\n\n                  <ion-select [(ngModel)]="selectedDatabase" name="selectDatabase" style="color: #818181" required>\n\n                    <ion-option *ngFor="let item of dbList" value="{{item.dbName}}">{{item.dbName}}</ion-option>\n\n                  </ion-select>\n\n                </ion-item> -->\n\n                <button ion-button block round color="secondary" [disabled]="!registerForm.form.valid" (click)="login()">Ingresar</button>\n\n              </form>\n\n            </div>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\login\login.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* MenuController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_4__services_utils__["a" /* Utils */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_7__providers_network_network__["a" /* NetworkProvider */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NetworkProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__ = __webpack_require__(68);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var NetworkProvider = (function () {
    function NetworkProvider(http, network) {
        this.http = http;
        this.network = network;
        this.contador = 0;
    }
    NetworkProvider.prototype.validarConexion = function (callback, rowback) {
        this.network.onDisconnect().subscribe(function () {
            console.log('Estamos desconectados');
            rowback();
        });
        this.network.onConnect().subscribe(function () {
            console.log('Estamos Conectados');
            callback;
        });
    };
    return NetworkProvider;
}());
NetworkProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_network__["a" /* Network */]])
], NetworkProvider);

//# sourceMappingURL=network.js.map

/***/ }),

/***/ 177:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 177;

/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OdooJsonRpc; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_toPromise__ = __webpack_require__(178);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(374);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var OdooJsonRpc = (function () {
    function OdooJsonRpc(http, utils) {
        this.http = http;
        this.utils = utils;
        this.jsonRpcID = 0;
        this.list = "/web/database/list";
        this.get_list = "/web/database/get_list";
        this.jsonrpc = "/jsonrpc";
        this.http = http;
    }
    /**
     * Builds a request for odoo server
     * @param url Odoo Server URL
     * @param params Object
     */
    OdooJsonRpc.prototype.buildRequest = function (url, params) {
        this.jsonRpcID += 1;
        return JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            id: this.jsonRpcID,
            params: params,
        });
    };
    /**
     * Returns the error message
     * @param response Error response from server
     */
    OdooJsonRpc.prototype.handleOdooErrors = function (response) {
        var err = response.error.data.message;
        var msg = err.split("\n");
        var errMsg = msg[0];
        this.utils.presentAlert("Error", errMsg, [{
                text: "Ok",
                role: "cancel"
            }]);
    };
    /**
     * Handles HTTP errors
     */
    OdooJsonRpc.prototype.handleHttpErrors = function (error) {
        return Promise.reject(error.message || error);
    };
    /**
     * Sends a JSON request to the odoo server
     * @param url Url of odoo
     * @param params Object
     */
    OdooJsonRpc.prototype.sendRequest = function (url, params) {
        var options = this.buildRequest(url, params);
        this.headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json; charset=utf-8',
        });
        var result = this.http.post(this.odoo_server + url, options, { headers: this.headers }).toPromise();
        return result;
    };
    OdooJsonRpc.prototype.init = function (configs) {
        this.odoo_server = configs.odoo_server;
        this.http_auth = configs.http_auth || null;
    };
    OdooJsonRpc.prototype.setOdooServer = function (odoo_server) {
        this.odoo_server = odoo_server;
    };
    OdooJsonRpc.prototype.setHttpAuth = function (http_auth) {
        this.http_auth = http_auth;
    };
    /**
     * Gets the server info
     */
    OdooJsonRpc.prototype.getServerInfo = function () {
        return this.sendRequest("/web/webclient/version_info", {});
    };
    /**
     * Gets the session info
     */
    OdooJsonRpc.prototype.getSessionInfo = function () {
        return this.sendRequest("/web/session/get_session_info", {});
    };
    /**
     * Gets the Odoo Server Version Number
     */
    OdooJsonRpc.prototype.getServerVersionNumber = function () {
        return this.getServerInfo().then(function (res) {
            return new Promise(function (resolve) {
                resolve(JSON.parse(res._body)["result"]["server_version_info"][0]);
            });
        });
    };
    /**
     * Get the database list
     */
    OdooJsonRpc.prototype.getDbList = function () {
        var _this = this;
        var dbParams = {
            context: {}
        };
        return this.getServerVersionNumber().then(function (data) {
            if (data <= 9) {
                return _this.sendRequest(_this.get_list, dbParams);
            }
            else if (data == 10) {
                return _this.sendRequest(_this.jsonrpc, dbParams);
            }
            else {
                return _this.sendRequest(_this.list, dbParams);
            }
        });
    };
    /**
     * Returns all modules that are installed in your database
     */
    OdooJsonRpc.prototype.modules = function () {
        var params = {
            context: {}
        };
        return this.sendRequest("/web/session/modules", params);
    };
    /**
     * Login to the database
     * @param db Database name of odoo
     * @param login Username
     * @param password password
     */
    OdooJsonRpc.prototype.login = function (db, login, password) {
        var params = {
            db: db,
            login: login,
            password: password,
            base_location: this.odoo_server,
            context: {}
        };
        return this.sendRequest("/web/session/authenticate", params);
    };
    /**
     * Check whether the session is live or not
     */
    OdooJsonRpc.prototype.check = function () {
        var params = {
            context: this.getContext()
        };
        return this.sendRequest("/web/session/check", params);
    };
    /**
     * Destroy the session
     */
    OdooJsonRpc.prototype.destroy = function () {
        var params = {
            context: {}
        };
        return this.sendRequest("/web/session/destroy", params);
    };
    /**
     * Fires query in particular model with fields and conditions
     * @param model Model name
     * @param domain Conditions that you want to fire on your query
     *              (e.g) let domain = [
     *                         ["id","=",11]
     *                    ]
     * @param fields Fields names which you want to bring from server
     *              (e.g) let fields = [
     *                         ["id","name","email"]
     *                    ]
     * @param limit limit of the record
     * @param offset
     * @param sort sorting order of data (e.g) let sort = "ascending"
     */
    OdooJsonRpc.prototype.searchRead = function (model, domain, fields, limit, offset, sort) {
        //console.log(domain)
        var params = {
            model: model,
            fields: fields,
            domain: domain,
            offset: offset,
            limit: limit,
            sort: sort,
            context: this.getContext()
        };
        return this.sendRequest("/web/dataset/search_read", params);
    };
    /**
     * Calls the method of that particular model
     * @param model Model name
     * @param method Method name of particular model
     * @param args Array of fields
     * @param kwargs Object
     */
    OdooJsonRpc.prototype.call = function (model, method, args, kwargs) {
        kwargs = kwargs || {};
        var params = {
            model: model,
            method: method,
            args: args,
            kwargs: kwargs == false ? {} : kwargs,
            context: this.getContext()
        };
        return this.sendRequest("/web/dataset/call_kw", params);
    };
    /**
     * Reads that perticular fields of that particular ID
     * @param model Model Name
     * @param id Id of that record which you want to read
     * @param mArgs Array of fields which you want to read of the particular id
     */
    OdooJsonRpc.prototype.read = function (model, id, mArgs) {
        var args = [
            id, mArgs
        ];
        return this.call(model, 'read', args);
    };
    /**
     * Loads all data of the paricular ID
     * @param model Model name
     * @param id Id of that particular data which you want to load
     */
    OdooJsonRpc.prototype.load = function (model, id) {
        var params = {
            model: model,
            id: id,
            fields: [],
            context: this.getContext()
        };
        return this.sendRequest("/web/dataset/load", params);
    };
    /**
     * Provide the name that you want to search
     * @param model Model name
     * @param name Name that you want to search
     */
    OdooJsonRpc.prototype.nameSearch = function (model, name) {
        var kwargs = {
            name: name,
            args: [],
            operator: "ilike",
            limit: 0
        };
        return this.call(model, 'name_search', [], kwargs);
    };
    /**
     * Provide the IDs and you will get the names of that paticular IDs
     * @param model Model name
     * @param mArgs Array of IDs that you want to pass
     */
    OdooJsonRpc.prototype.nameGet = function (model, mArgs) {
        var args = [mArgs];
        return this.call(model, 'name_get', args);
    };
    /**
     * Create a new record
     * @param model Model name
     * @param mArgs Object of fields and value
     */
    OdooJsonRpc.prototype.createRecord = function (model, mArgs) {
        var args = [mArgs];
        return this.call(model, "create", args, null);
    };
    /**
     * Delete the record of particular ID
     * @param model Model Name
     * @param id Id of record that you want to delete
     */
    OdooJsonRpc.prototype.deleteRecord = function (model, id) {
        var mArgs = [id];
        return this.call(model, "unlink", mArgs, null);
    };
    /**
     * Updates the record of particular ID
     * @param model Model Name
     * @param id Id of record that you want to update the.
     * @param mArgs The Object of fields and value that you want to update
     *              (e.g)
     *              let args = {
     *                 "name": "Mtfa"
     *              }
     */
    OdooJsonRpc.prototype.updateRecord = function (model, id, mArgs) {
        var args = [
            [id], mArgs
        ];
        return this.call(model, "write", args, null);
    };
    /**
     * Get the User Context from the response of odoo server
     */
    OdooJsonRpc.prototype.getContext = function () {
        var response = localStorage.getItem("token");
        var jsonData = JSON.parse(response);
        var context = jsonData["user_context"];
        return context;
    };
    return OdooJsonRpc;
}());
OdooJsonRpc = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Utils */]])
], OdooJsonRpc);

//# sourceMappingURL=odoojsonrpc.js.map

/***/ }),

/***/ 317:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 317;

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FormProbabilidadPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_utils__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__add_customer_add_customer__ = __webpack_require__(99);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







// import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController } from 'ionic-angular';
var FormProbabilidadPage = (function () {
    function FormProbabilidadPage(navCtrl, navParams, odooRpc, loadingCtrl, platform, toastCtrl, utils, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.utils = utils;
        this.alertCtrl = alertCtrl;
        this.InfoVendedor = JSON.parse(localStorage.getItem('token'));
        this.vendedor = this.InfoVendedor['username'].charAt(0).toUpperCase() + this.InfoVendedor['username'].slice(1);
        this.pestanias = "oportunidad";
        this.isAndroid = false;
        this.idOportunidad = '';
        // validamos si es actualizar o crear una oportunidad
        if (navParams.get("tipo") == 'update') {
            //si es modificar una oportunidad, consultamos toda la informacion de la oportunidad y asigamos idOportunidad al id que viene por get
            this.idOportunidad = navParams.get("id");
            this.getOportunidad(this.idOportunidad);
        }
        else {
            this.name = '';
            this.probabilidad = '';
            this.email = '';
            this.telefono = '';
            this.mobil = '';
            this.nextAcitivity = '';
            this.fechaActividad = '';
            this.cierrePrevisto = '';
            this.website = '';
            this.calificacion = '';
            this.tags = '';
            this.city = '';
            this.cliente = '';
            this.dirContact = '';
            this.nameContact = '';
            this.functionContact = '';
            this.movilContact = '';
            this.emailContact = '';
            this.notaInterna = '';
            this.titleAction = '';
            this.namePartner = '';
            this.listaTags = '';
            this.getClientes();
        }
        this.getTags();
        this.getCity();
        this.isAndroid = platform.is('android');
    }
    FormProbabilidadPage.prototype.ionViewDidLoad = function () {
    };
    FormProbabilidadPage.prototype.getOportunidad = function (idOportunidad) {
        var _this = this;
        this.getClientes();
        var table_oportunidad = "crm.lead";
        var domain = [["id", "=", idOportunidad]];
        this.odooRpc
            .searchRead(table_oportunidad, domain, [], 0, 0, "")
            .then(function (partner) {
            var loading = _this.loadingCtrl.create({
                content: "Estamos preparando todo..."
            });
            loading.present();
            var json = JSON.parse(partner._body);
            if (!json.error) {
                var query = json["result"].records;
                for (var i in query) {
                    _this.name = query[i].name;
                    _this.probabilidad = query[i].probability;
                    _this.email = query[i].email_from;
                    _this.telefono = query[i].phone;
                    _this.mobil = query[i].mobile;
                    _this.nextAcitivity = query[i].next_activity_id[0];
                    _this.fechaActividad = query[i].date_action;
                    _this.cierrePrevisto = query[i].date_closed;
                    _this.city = query[i].state_id;
                    _this.cliente = query[i].partner_id[0];
                    _this.dirContact = query[i].street;
                    _this.nameContact = query[i].contact_name;
                    _this.functionContact = query[i].function;
                    _this.movilContact = query[i].phone;
                    _this.emailContact = query[i].email_from;
                    _this.notaInterna = query[i].description;
                    _this.titleAction = query[i].title_action;
                    _this.namePartner = query[i].partner_name;
                }
            }
            loading.dismiss();
        });
    };
    FormProbabilidadPage.prototype.getClientes = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var table_cliente = "res.partner";
        var domain = [["active", "=", "t"], ["customer", "=", "t"]];
        this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then(function (partner) {
            var json = JSON.parse(partner._body);
            if (!json.error) {
                _this.listaClientes = json["result"].records;
                loading.dismiss();
            }
        });
    };
    FormProbabilidadPage.prototype.getTags = function () {
        var _this = this;
        var tableTags = "crm.lead.tag";
        this.odooRpc.searchRead(tableTags, [], [], 0, 0, "").then(function (tags) {
            var json = JSON.parse(tags._body);
            if (!json.error) {
                _this.listaTags = json["result"].records;
            }
        });
    };
    FormProbabilidadPage.prototype.getCity = function () {
        var _this = this;
        var tableCity = "res.country.state";
        this.odooRpc.searchRead(tableCity, [["country_id", "=", 50]], [], 0, 0, "").then(function (city) {
            var json = JSON.parse(city._body);
            if (!json.error) {
                _this.listCity = json["result"].records;
            }
        });
    };
    FormProbabilidadPage.prototype.saveData = function () {
        var _this = this;
        if (!this.name) {
            var toast = this.toastCtrl.create({
                message: 'Por favor agrege un nombre para la oportunidad.',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.probabilidad) {
            var toast = this.toastCtrl.create({
                message: 'Por favor seleccione un rango de probabilidad',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.cliente) {
            var toast = this.toastCtrl.create({
                message: 'Por favor seleccione un cliente',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.email) {
            var toast = this.toastCtrl.create({
                message: 'Por favor agregue un correo para el cliente',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.telefono) {
            var toast = this.toastCtrl.create({
                message: 'Por favor agregue un teléfono para el cliente',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.nextAcitivity) {
            var toast = this.toastCtrl.create({
                message: 'Por favor seleccione una siguiente actividad',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (this.nextAcitivity && !this.fechaActividad) {
            var toast = this.toastCtrl.create({
                message: 'Por favor seleccione una fecha para la proxima actividad',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.nameContact) {
            var toast = this.toastCtrl.create({
                message: 'Por favor agregue un nombre de contacto',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.movilContact) {
            var toast = this.toastCtrl.create({
                message: 'Por favor agregue un telefono de contacto',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else if (!this.emailContact) {
            var toast = this.toastCtrl.create({
                message: 'Por favor agregue un email de contacto',
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "OK"
            });
            toast.present();
        }
        else {
            var loading = this.loadingCtrl.create({
                content: "Por Favor Espere..."
            });
            loading.present();
            var params = {
                date_closed: this.cierrePrevisto,
                probability: this.probabilidad,
                country_id: 50,
                write_uid: JSON.parse(localStorage.getItem('token'))['uid'],
                contact_name: this.nameContact,
                partner_id: this.cliente,
                partner_name: this.namePartner,
                company_id: 1,
                next_activity_id: this.nextAcitivity,
                type: "opportunity",
                function: this.functionContact,
                description: (!this.notaInterna) ? '' : this.notaInterna,
                create_uid: JSON.parse(localStorage.getItem('token'))['uid'],
                title_action: this.titleAction,
                phone: this.movilContact,
                user_id: JSON.parse(localStorage.getItem('token'))['uid'],
                date_action: this.fechaActividad,
                name: this.name,
                day_open: 0,
                planned_revenue: 0,
                stage_id: 1,
                date_deadline: new Date,
                mobile: this.mobil,
                street: this.dirContact,
                state_id: this.city[0],
                city: this.city[1],
                email_from: this.email,
                cat_names: null
            };
            var model = "crm.lead";
            if (this.idOportunidad == '') {
                this.odooRpc.createRecord(model, params).then(function (res) {
                    var json = JSON.parse(res._body);
                    if (!json.error) {
                        _this.utils.presentToast("Oportunidad Creada Correctamente", 3000, false, 'top');
                        _this.navCtrl.pop();
                    }
                }).catch(function (err) {
                    alert(err);
                });
                loading.dismiss();
                this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */]);
            }
            else {
                this.odooRpc.updateRecord(model, this.idOportunidad, params).then(function (res) {
                    var json = JSON.parse(res._body);
                    if (!json.error) {
                        _this.utils.presentToast("Oportunidad Modificada Correctamente", 3000, false, 'top');
                        _this.navCtrl.pop();
                    }
                }).catch(function (err) {
                    alert(err);
                });
                loading.dismiss();
                this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */]);
            }
        }
    };
    FormProbabilidadPage.prototype.persistCliente = function () {
        var _this = this;
        if (this.cliente == 'addCustomer') {
            var alert_1 = this.alertCtrl.create({
                title: 'Confirmación de crear cliente',
                message: '¿Esta seguro que quiere crear un cliente nuevo?',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Si',
                        handler: function () {
                            _this.addCustomer();
                        }
                    }
                ]
            });
            alert_1.present();
        }
        else {
            this.parseoClientes();
        }
    };
    FormProbabilidadPage.prototype.parseoClientes = function () {
        for (var _i = 0, _a = this.listaClientes; _i < _a.length; _i++) {
            var client = _a[_i];
            if (this.cliente == client.id) {
                this.email = (client.email == false) ? '' : client.email;
                this.telefono = client.phone;
                this.mobil = client.mobil;
                this.namePartner = client.name;
                this.dirContact = client.street;
                this.city = client.state_id;
            }
        }
    };
    FormProbabilidadPage.prototype.addCustomer = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__add_customer_add_customer__["a" /* AddCustomerPage */]);
    };
    return FormProbabilidadPage;
}());
FormProbabilidadPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["n" /* Component */])({
        selector: 'page-form-probabilidad',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\form-probabilidad\form-probabilidad.html"*/'<!-- Header-->\n\n<ion-header>\n\n\n\n  <!-- navegador-->\n\n  <ion-navbar color="secondary">\n\n    <ion-title>Formulario de Oportunidad</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only clear (click)="saveData()">\n\n        Guardar\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n  <!-- fin del navegador-->\n\n  <!-- Segmentos o pestañas-->\n\n  <ion-toolbar no-border-top no-border-button color="no-color">\n\n    <ion-segment [(ngModel)]="pestanias" color="secondary">\n\n      <ion-segment-button value="oportunidad">\n\n        Oportunidad\n\n      </ion-segment-button>\n\n      <ion-segment-button value="infoContacto">\n\n        Información de Contacto\n\n      </ion-segment-button>\n\n      <ion-segment-button value="notasInt">\n\n        Notas Internas\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n  </ion-toolbar>\n\n  <!-- Final de Segmentos o pestañas-->\n\n</ion-header>\n\n<!-- Final de header-->\n\n\n\n<ion-content padding>\n\n  <div [ngSwitch]="pestanias">\n\n    <ion-list no-lines *ngSwitchCase="\'oportunidad\'">\n\n      <ion-item>\n\n        <ion-label>Nombre Oportunidad</ion-label>\n\n        <ion-input [(ngModel)]="name" name="name"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Probabilidad</ion-label>\n\n        <ion-range min="0" max="100" step="25" [(ngModel)]="probabilidad">\n\n          <ion-label range-left>0%</ion-label>\n\n          <ion-label range-right>100%</ion-label>\n\n        </ion-range>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label stacked>Cliente</ion-label>\n\n        <ion-select [(ngModel)]="cliente" #cli id="cli" (ionChange)="persistCliente()">\n\n          <ion-option value="addCustomer"> <--CREAR CLIENTE NUEVO--> </ion-option>\n\n          <ion-option *ngFor="let i of listaClientes" value="{{i.id}}">{{i.name}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label stacked>Correo</ion-label>\n\n        <ion-input type="email" [(ngModel)]="email" name="email"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Telefono</ion-label>\n\n        <ion-input type="tel" [(ngModel)]="telefono" name="telefono"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Telefono movil</ion-label>\n\n        <ion-input type="tel" [(ngModel)]="mobil" name="mobil"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Siguiente Actividad</ion-label>\n\n        <ion-select [(ngModel)]="nextAcitivity">\n\n          <ion-option value="1">Correo</ion-option>\n\n          <ion-option value="2">Llamar</ion-option>\n\n          <ion-option value="3">Tarea</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Fecha de Actividad</ion-label>\n\n        <ion-datetime displayFormat="DD-MM-YYYY" pickerFormat="DD-MM-YYYY" [(ngModel)]="fechaActividad" name="fechaActividad"></ion-datetime>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Actividad</ion-label>\n\n        <ion-input [(ngModel)]="titleAction" name="titleAction"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-list radio-group [(ngModel)]="tipoOportunidad">\n\n          <ion-list-header>\n\n            Tipo de Oportunidad\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Intalación</ion-label>\n\n            <ion-radio value="instalacion"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Mantenimiento</ion-label>\n\n            <ion-radio value="mantenimiento"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Suministro</ion-label>\n\n            <ion-radio value="suministro"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Cierre Previsto</ion-label>\n\n        <ion-datetime displayFormat="DD-MM-YYYY" pickerFormat="DD-MM-YYYY" [(ngModel)]="cierrePrevisto" name="cierrePrevisto"></ion-datetime>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>URL</ion-label>\n\n        <ion-input type="url" [(ngModel)]="website" name="website"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Vendedor</ion-label>\n\n        <ion-input [(ngModel)]="vendedor" class="capitalize" name="vendedor" readonly="true" style="text-transform: capitalize;"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Calificación</ion-label>\n\n        <ion-range min="0" max="3" step="1" [(ngModel)]="calificacion">\n\n          <ion-icon small range-left name="star" style="color: #FFEA00;"></ion-icon>\n\n          <ion-icon large range-right name="star" style="color: #FFEA00;"></ion-icon>\n\n        </ion-range>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Etiquetas</ion-label>\n\n        <ion-select [(ngModel)]="tags" multiple="true">\n\n          <ion-option *ngFor="let tag of listaTags" value="{{tag.id}}">{{tag.name}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n    </ion-list>\n\n\n\n    <ion-list no-lines *ngSwitchCase="\'infoContacto\'">\n\n      <ion-item>\n\n        <ion-label>Dirección</ion-label>\n\n        <ion-input [(ngModel)]="dirContact" name="dirContact"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Ciudad</ion-label>\n\n        <ion-select [(ngModel)]="city">\n\n          <ion-option *ngFor="let city of listCity" value="{{city.id}}">{{city.name}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Nombre Contacto</ion-label>\n\n        <ion-input [(ngModel)]="nameContact" name="nameContact"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Función</ion-label>\n\n        <ion-input [(ngModel)]="functionContact" name="functionContact"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Móvil</ion-label>\n\n        <ion-input type="number" [(ngModel)]="movilContact" name="movilContact"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Correo</ion-label>\n\n        <ion-input type="email" [(ngModel)]="emailContact" name="emailContact"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n\n\n    <ion-list no-lines *ngSwitchCase="\'notasInt\'">\n\n      <ion-item>\n\n        <ion-label>Notas Internas</ion-label>\n\n        <ion-input placeholder="Text Input" [(ngModel)]="notaInterna" name="notaInterna"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\form-probabilidad\form-probabilidad.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__services_utils__["a" /* Utils */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["b" /* AlertController */]])
], FormProbabilidadPage);

//# sourceMappingURL=form-probabilidad.js.map

/***/ }),

/***/ 358:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProspectoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ProspectoPage = (function () {
    function ProspectoPage(navCtrl, navParams, odooRpc, loadingCtrl, platform, toastCtrl, camera, sanitizer, fileChooser, file) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.sanitizer = sanitizer;
        this.fileChooser = fileChooser;
        this.file = file;
        //Nombre de las zonas
        this.nombreHabitacionCCTV = [];
        this.nombreHabitacionCAE = [];
        this.nombreHabitacionAlarmas = [];
        this.nombreHabitacionIncendios = [];
        //tipo pared o muro
        this.tipoParedHabitacionCCTV = [];
        this.tipoPuertaHabitacionCAE = [];
        this.tipoPuertaHabitacionAlarma = [];
        this.tipoParedHabitacionAlarma = [];
        this.tipoParedHabitacionIncendio = [];
        //Lista de nombres
        this.listaHabitacionesCCTV = [];
        this.listaHabitacionesCAE = [];
        this.listaHabitacionesAlarmas = [];
        this.listaHabitacionesIncendios = [];
        this.pestanias = "prospecto";
        this.tipoGama = "baja";
        this.camarasCCTV = [];
        this.aproMtsCCTV = [];
        this.altMtsCCTV = [];
        this.picturesCCTV = [];
        this.adjuntosCCTV = [];
        this.obserZonaCCTV = [];
        this.alarmasHabitacion = [];
        this.aproMtsAlarmas = [];
        this.altMtsAlarmas = [];
        this.picturesAlarmas = [];
        this.adjuntosAlarmas = [];
        this.obserZonaAlarmas = [];
        this.sensoresIncendio = [];
        this.aproMtsIncendio = [];
        this.altMtsIncendio = [];
        this.picturesIncendio = [];
        this.adjuntosIncendio = [];
        this.obserZonaIncendio = [];
        this.entradaHabitacionCAE = [];
        this.salidaHabitacionCAE = [];
        this.adjuntosCAE = [];
        this.obserZonaCAE = [];
        this.list_items = [];
        this.list_items_carrito = [];
        this.porcentajeUtilidad = [];
        this.subTotal = 0;
        this.total = 0;
        this.oportunity = navParams.get("id");
        this.get_necesidad_cliente();
    }
    ProspectoPage.prototype.get_necesidad_cliente = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var table = "product.category";
        this.odooRpc.searchRead(table, [], [], 0, 0, "").then(function (tags) {
            var json = JSON.parse(tags._body);
            if (!json.error) {
                _this.list_necesidades = json["result"].records;
                loading.dismiss();
            }
        });
    };
    ProspectoPage.prototype.habilitarHabitacionesCCTV = function (zonas) {
        this.habitacionesCCTV = zonas;
        this.listaHabitacionesCCTV = [];
        var arrayName;
        for (var i = 1; i <= this.habitacionesCCTV; i++) {
            arrayName = { id: i };
            this.picturesCCTV[i] = [];
            this.listaHabitacionesCCTV.push(arrayName);
        }
    };
    ProspectoPage.prototype.habilitarHabitacionesCAE = function (zonas) {
        this.habitacionesCAE = zonas;
        this.listaHabitacionesCAE = [];
        var arrayName;
        for (var i = 1; i <= this.habitacionesCAE; i++) {
            arrayName = { id: i };
            this.listaHabitacionesCAE.push(arrayName);
        }
    };
    ProspectoPage.prototype.habilitarHabitacionesAlarmas = function (zonas) {
        this.habitacionesAlarmas = zonas;
        this.listaHabitacionesAlarmas = [];
        var arrayName;
        for (var i = 1; i <= this.habitacionesAlarmas; i++) {
            arrayName = { id: i };
            this.picturesAlarmas[i] = [];
            this.listaHabitacionesAlarmas.push(arrayName);
        }
    };
    ProspectoPage.prototype.habilitarHabitacionesIncendios = function (zonas) {
        this.habitacionesIncendios = zonas;
        this.listaHabitacionesIncendios = [];
        var arrayName;
        for (var i = 1; i <= this.habitacionesIncendios; i++) {
            arrayName = { id: i };
            this.picturesIncendio[i] = [];
            this.listaHabitacionesIncendios.push(arrayName);
        }
    };
    ProspectoPage.prototype.habilita_formulario = function (necesidad) {
        this.toolbar = true;
        this.div_els = false;
        this.div_cctv = false;
        this.div_eps = false;
        this.toolbar = false;
        this.div_alarmas = false;
        this.div_incendios = false;
        this.div_cae = false;
        if (necesidad.length > 0) {
            for (var _i = 0, necesidad_1 = necesidad; _i < necesidad_1.length; _i++) {
                var nec = necesidad_1[_i];
                switch (nec) {
                    //cctv
                    case "7":
                        this.div_cctv = true;
                        this.get_productos(nec);
                        break;
                    //eps
                    case "8":
                        this.div_eps = true;
                        this.get_productos(nec);
                        break;
                    //cae
                    case "5":
                        this.div_cae = true;
                        this.get_productos(nec);
                        break;
                    //Equipo liviano
                    case "9":
                        this.div_els = true;
                        this.get_productos(nec);
                        break;
                    //Alarmas
                    case "4":
                        this.div_alarmas = true;
                        this.get_productos(nec);
                        break;
                    //Incendios
                    case "6":
                        this.div_incendios = true;
                        this.get_productos(nec);
                        break;
                    default:
                        this.div_els = false;
                        this.div_cctv = false;
                        this.div_eps = false;
                        this.toolbar = false;
                        this.div_alarmas = false;
                        this.div_incendios = false;
                        this.list_items = [];
                        break;
                }
            }
        }
        else {
            this.div_els = false;
            this.div_cctv = false;
            this.div_eps = false;
            this.toolbar = false;
            this.div_alarmas = false;
            this.div_incendios = false;
            this.list_items = [];
        }
    };
    ProspectoPage.prototype.take_pictures = function (carProd, picturezona) {
        var _this = this;
        var options = {
            // quality: 70,
            // destinationType: this.camera.DestinationType.FILE_URI,
            // encodingType: this.camera.EncodingType.JPEG,
            // mediaType: this.camera.MediaType.PICTURE
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
        };
        this.camera.getPicture(options).then(function (imageData) {
            switch (carProd) {
                case 'cctv':
                    _this.picturesCCTV[picturezona].push(imageData);
                    break;
                case 'alarma':
                    _this.picturesAlarmas[picturezona].push(imageData);
                    break;
                case 'incendio':
                    _this.picturesIncendio[picturezona].push(imageData);
                    break;
                default:
                    break;
            }
        }, function (err) {
            console.error(err);
        });
    };
    ProspectoPage.prototype.cambiaPestania = function () {
        this.pestanias = 'cotizacion';
    };
    ProspectoPage.prototype.get_productos = function (nec) {
        var _this = this;
        if (nec === void 0) { nec = ""; }
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        // let domain = (nec != "") ? [['categ_id', '=', +nec], ['qty_available', '>', 0]] : [['qty_available', '>', 0]]
        this.list_items = [];
        var domain = (nec != "") ? [['categ_id', '=', +nec]] : [];
        var table = "product.template";
        this.odooRpc.searchRead(table, domain, [], 0, 0, "").then(function (items) {
            var json = JSON.parse(items._body);
            if (!json.error && json["result"].records != []) {
                for (var _i = 0, _a = json["result"].records; _i < _a.length; _i++) {
                    var i = _a[_i];
                    _this.list_items.push(i);
                }
                loading.dismiss();
            }
        });
    };
    ProspectoPage.prototype.sanitize = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    ProspectoPage.prototype.agregaCarrito = function (item) {
        this.list_items_carrito.push(item);
        this.cambiaUtilidad();
    };
    ProspectoPage.prototype.cambiaUtilidad = function () {
        this.subTotal = 0;
        this.total = 0;
        for (var _i = 0, _a = this.list_items_carrito; _i < _a.length; _i++) {
            var itc = _a[_i];
            if (this.porcentajeUtilidad[itc.id] !== undefined) {
                this.subTotal += (itc.list_price + (itc.list_price * this.porcentajeUtilidad[itc.id] / 100));
            }
            else {
                this.subTotal += itc.list_price;
            }
        }
        this.total = (this.subTotal + (this.subTotal * 19 / 100));
    };
    ProspectoPage.prototype.adjuntar_archivo = function ($event, tipo) {
        this.readThis($event.target, tipo);
    };
    ProspectoPage.prototype.readThis = function (inputValue, tipo) {
        var _this = this;
        var file = inputValue.files[0];
        var myReader = new FileReader();
        myReader.onloadend = function (e) {
            _this.base64 = myReader.result;
            switch (tipo) {
                case 'cctv':
                    _this.adjuntosCCTV.push(_this.base64);
                    break;
                case 'cae':
                    _this.adjuntosCAE.push(_this.base64);
                    break;
                case 'alarma':
                    _this.adjuntosAlarmas.push(_this.base64);
                    break;
                case 'incendio':
                    _this.adjuntosIncendio.push(_this.base64);
                    break;
                default:
                    console.log('PARAMETRO PARA ADJUNTAR ARCHIVO NO ESTA DEFINIDO');
                    break;
            }
            console.log(_this.base64);
        };
        myReader.readAsDataURL(file);
    };
    ProspectoPage.prototype.habilitarSensor = function (camaraZona) {
        console.log(camaraZona);
    };
    return ProspectoPage;
}());
ProspectoPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: 'page-prospecto',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\prospecto\prospecto.html"*/'<ion-header>\n\n  <ion-navbar color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Prospecto</ion-title>\n\n  </ion-navbar>\n\n  <ion-toolbar no-border-top no-border-button color="no-color">\n\n    <ion-segment [(ngModel)]="pestanias" color="secondary">\n\n      <ion-segment-button value="prospecto">\n\n        Prospecto\n\n      </ion-segment-button>\n\n      <ion-segment-button value="catalogo">\n\n        Catálogo\n\n      </ion-segment-button>\n\n      <ion-segment-button value="cotizacion">\n\n        Cotización\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <ion-item>\n\n      <ion-label stacked>Necesidad del Cliente</ion-label>\n\n      <ion-select [(ngModel)]="necCliente" cancelText="Cancelar" #necesidad\n\n        (ngModelChange)="habilita_formulario(necesidad.value)" multiple="true">\n\n        <ion-option *ngFor="let necesidad of list_necesidades" value="{{necesidad.id}}">{{necesidad.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n  </ion-list>\n\n  <div [ngSwitch]="pestanias">\n\n    <ion-list no-list *ngSwitchCase="\'prospecto\'">\n\n      <ion-list *ngIf="div_cctv">\n\n        <h3>CCTV</h3><br>\n\n        <ion-item>\n\n          <ion-label stacked>Habitaciones a Proteger</ion-label>\n\n          <ion-input type="number" min="0" [(ngModel)]="habitacionesCCTV" #zona\n\n            (change)="habilitarHabitacionesCCTV(zona.value)" name="habitacionesCCTV"></ion-input>\n\n        </ion-item>\n\n\n\n        <div *ngFor="let i of listaHabitacionesCCTV">\n\n          <strong style="color:#E53935">Habitación #{{i.id}}</strong>\n\n          <ion-item>\n\n            <ion-label floating>Nombre de la Habitación #{{i.id}}</ion-label>\n\n            <ion-input [(ngModel)]="nombreHabitacionCCTV[i.id]" name="nombreHabitacionCCTV_{{i.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Tipo de muro de la Habitación #{{i.id}}</ion-label>\n\n            <ion-input [(ngModel)]="tipoParedHabitacionCCTV[i.id]" name="tipoParedHabitacionCCTV_{{i.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Cuantas Camaras Necesita en Habitacion #{{i.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="camarasCCTV[i.id]" name="camarasCCTV_{{i.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Aproximidad en Mts² Habitación #{{i.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="aproMtsCCTV[i.id]" name="aproMtsCCTV_{{i.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Altura Maxima en Mts² Habitación #{{i.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="altMtsCCTV[i.id]" name="altMtsCCTV_{{i.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Observaciones para la zona.</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="obserZonaCCTV[i.id]" name="obserZonaCCTV_{{i.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <button ion-button (click)="take_pictures(\'cctv\',i.id)">Tomar Fotos para Zona #{{i.id}}</button>\n\n          </ion-item>\n\n          <ion-grid>\n\n            <ion-row>\n\n              <ion-col col-4 *ngFor="let image of picturesCCTV[i.id]">\n\n                <img src="data:image/jpeg;base64,{{image}}" alt="picture{{i.id}}">\n\n              </ion-col>\n\n            </ion-row>\n\n          </ion-grid>\n\n        </div>\n\n\n\n        <ion-list radio-group [(ngModel)]="lugarImplementacion">\n\n          <ion-list-header>\n\n            Lugar Implementación\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Residencial</ion-label>\n\n            <ion-radio value="residencial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Comercial</ion-label>\n\n            <ion-radio value="comercial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Empresarial</ion-label>\n\n            <ion-radio value="empresarial"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list radio-group [(ngModel)]="sistemaMonitoreo">\n\n          <ion-list-header>\n\n            Sistema de Monitoreo\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Radio</ion-label>\n\n            <ion-radio value="radio"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>ADSL</ion-label>\n\n            <ion-radio value="adsl"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>APPS</ion-label>\n\n            <ion-radio value="apps"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>IP</ion-label>\n\n            <ion-radio value="ip"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-item>\n\n          <ion-label stacked>Canales para Unidad Central de Proceso</ion-label>\n\n          <ion-select [(ngModel)]="canalUnidadCentralProceso" cancelText="Cancelar" value="">\n\n            <ion-option value="0">Seleccione...</ion-option>\n\n            <ion-option value="4">x4CH</ion-option>\n\n            <ion-option value="8">x8CH</ion-option>\n\n            <ion-option value="12">x12CH</ion-option>\n\n            <ion-option value="16">x16CH</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n        <ion-list radio-group [(ngModel)]="sistemaMonitoreo">\n\n          <ion-list-header>\n\n            ¿Desea que su sistema sea monitoreado?\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Deseo que el sistema sea monitoreado</ion-label>\n\n            <ion-radio value="1"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>No deseo que el sistema sea monitoreado</ion-label>\n\n            <ion-radio value="0"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-item>\n\n          <label class="item item-input"><input type="file" id="" (change)="adjuntar_archivo($event,\'cctv\')"\n\n              name="uploadfile" clear color="danger"></label>\n\n        </ion-item>\n\n        <ion-grid>\n\n          <ion-row>\n\n            <ion-col col-4 *ngFor="let adcctv of adjuntosCCTV">\n\n              <!-- <img src="assets/imgs/document.png" alt="{{adcctv}}">{{adcctv}} -->\n\n              <img src="{{adcctv}}" alt="{{adcctv}}">\n\n            </ion-col>\n\n          </ion-row>\n\n        </ion-grid>\n\n      </ion-list>\n\n\n\n      <ion-list *ngIf="div_cae">\n\n        <h3>Control de Acceso Electronico</h3>\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Puntos que Desea Controlar</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="habitacionesCAE" #habitacionCAE\n\n              (change)="habilitarHabitacionesCAE(habitacionCAE.value)" name="zonasControlar"></ion-input>\n\n          </ion-item>\n\n\n\n\n\n          <div *ngFor="let l of listaHabitacionesCAE">\n\n            <strong style="color:#E53935">Habitación # {{ l.id }}</strong>\n\n            <ion-item>\n\n              <ion-label stacked>Nombre de Habitación a Protejer # {{ l.id }}</ion-label>\n\n              <ion-input [(ngModel)]="nombreHabitacionCAE[l.id]" name="nombreHabitacionCAE_{{l.id}}"></ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label stacked>Tipo Puerta de la Habitación a Protejer # {{ l.id }}</ion-label>\n\n              <ion-input [(ngModel)]="tipoPuertaHabitacionCAE[l.id]" name="tipoPuertaHabitacionCAE_{{l.id}}">\n\n              </ion-input>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label floating>Entrada Habitación #{{l.id}}</ion-label>\n\n              <ion-select [(ngModel)]="entradaHabitacionCAE[l.id]" multiple="true">\n\n                <ion-option value="biometrico">Biometrico</ion-option>\n\n                <ion-option value="mecanico">Mecánico</ion-option>\n\n                <ion-option value="boton">Boton</ion-option>\n\n                <ion-option value="password">Password</ion-option>\n\n                <ion-option value="sensor">Sensor</ion-option>\n\n              </ion-select>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label floating>Salida Habitación #{{l.id}}</ion-label>\n\n              <ion-select [(ngModel)]="salidaHabitacionCAE[l.id]" multiple="true">\n\n                <ion-option value="biometrico">Biometrico</ion-option>\n\n                <ion-option value="mecanico">Mecánico</ion-option>\n\n                <ion-option value="boton">Boton</ion-option>\n\n                <ion-option value="password">Password</ion-option>\n\n                <ion-option value="sensor">Sensor</ion-option>\n\n              </ion-select>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-label floating>Observaciones para la zona.</ion-label>\n\n              <ion-input type="number" min="0" [(ngModel)]="obserZonaCAE[l.id]" name="obserZonaCAE_{{l.id}}">\n\n              </ion-input>\n\n            </ion-item>\n\n          </div>\n\n          <ion-item>\n\n            <ion-label stacked> Cantidad de Accesos o Usuarios</ion-label>\n\n            <ion-input type="number" [(ngModel)]="cantAccesosHabitacion" name="cantAccesosHabitacion"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <label class="item item-input"><input type="file" id="" (change)="adjuntar_archivo($event,\'cae\')"\n\n                name="uploadfile" clear color="danger"></label>\n\n          </ion-item>\n\n        </ion-list>\n\n      </ion-list>\n\n\n\n      <ion-list *ngIf=div_alarmas>\n\n        <h3>Alarmas</h3>\n\n        <ion-item>\n\n          <ion-label stacked>Habitaciones a Cuidar</ion-label>\n\n          <ion-input type="number" min="0" [(ngModel)]="habitacionesAlarmas" #habitacionAlarmas\n\n            (change)="habilitarHabitacionesAlarmas(habitacionAlarmas.value)" name="habitacionesAlarmas"></ion-input>\n\n        </ion-item>\n\n\n\n        <div *ngFor="let a of listaHabitacionesAlarmas">\n\n          <strong style="color:#E53935">Habitación #{{a.id}}</strong>\n\n          <ion-item>\n\n            <ion-label floating>Nombre de Habitacion a Cuidar #{{a.id}}</ion-label>\n\n            <ion-input [(ngModel)]="nombreHabitacionAlarmas[a.id]" name="nombreHabitacionAlarmas_{{a.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Cuantos Sensores Necesita la Habitación #{{a.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="alarmasHabitacion[a.id]" name="alarmasHabitacion_{{a.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Tipo de Pared de la Habitación #{{a.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="tipoParedHabitacionAlarma[a.id]"\n\n              name="tipoParedHabitacionAlarma_{{a.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Tipo de Puerta de la Habitación #{{a.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="tipoPuertaHabitacionAlarma[a.id]"\n\n              name="tipoPuertaHabitacionAlarma_{{a.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Aproximidad en Mts² Habitación #{{a.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="aproMtsAlarmas[a.id]" name="aproMtsAlarmas_{{a.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>ALtura Maxima en Mts² Habitación #{{a.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="altMtsAlarmas[a.id]" name="altMtsAlarmas_{{a.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Observaciones para la zona.</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="obserZonaAlarmas[a.id]" name="obserZonaAlarmas_{{a.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <button ion-button (click)="take_pictures(\'alarma\',a.id)">Tomar Fotos para Zona #{{a.id}}</button>\n\n          </ion-item>\n\n          <ion-grid>\n\n            <ion-row>\n\n              <ion-col col-4 *ngFor="let imageA of picturesAlarmas[a.id]">\n\n                <img src="data:image/jpeg;base64,{imageA}}" alt="picture{{a.id}}">\n\n              </ion-col>\n\n            </ion-row>\n\n          </ion-grid>\n\n        </div>\n\n\n\n        <ion-list radio-group [(ngModel)]="lugarImplementacionAlarmas">\n\n          <ion-list-header>\n\n            Lugar Implementación\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Residencial</ion-label>\n\n            <ion-radio value="residencial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Comercial</ion-label>\n\n            <ion-radio value="comercial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Empresarial</ion-label>\n\n            <ion-radio value="empresarial"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-item>\n\n          <ion-label stacked> Sistema de Monitoreo</ion-label>\n\n          <ion-select [(ngModel)]="sisMonitoreo" multiple="true">\n\n            <ion-option value="sirena">Sirena</ion-option>\n\n            <ion-option value="luz">Luz</ion-option>\n\n            <ion-option value="lan">LAN</ion-option>\n\n            <ion-option value="gprs">GPRS</ion-option>\n\n            <ion-option value="discadoTelefonico">Discado Telefónico</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n\n\n        <ion-item>\n\n          <ion-label stacked>Canales para Unidad Central de Proceso</ion-label>\n\n          <ion-select [(ngModel)]="canalUnidadCentralProcesoAlarmas" cancelText="Cancelar" value="">\n\n            <ion-option value="0">Seleccione...</ion-option>\n\n            <ion-option value="4">x4CH</ion-option>\n\n            <ion-option value="8">x8CH</ion-option>\n\n            <ion-option value="12">x12CH</ion-option>\n\n            <ion-option value="16">x16CH</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n        <ion-list radio-group [(ngModel)]="sistemaMonitoreoAlarmas">\n\n          <ion-list-header>\n\n            ¿Desea que su sistema sea monitoreado?\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Deseo que el sistema sea monitoreado</ion-label>\n\n            <ion-radio value="1"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>No deseo que el sistema sea monitoreado</ion-label>\n\n            <ion-radio value="0"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-item>\n\n          <label class="item item-input"><input type="file" id="" (change)="adjuntar_archivo($event,\'alarma\')"\n\n              name="uploadfile" clear color="danger"></label>\n\n        </ion-item>\n\n      </ion-list>\n\n\n\n      <ion-list *ngIf=div_incendios>\n\n        <h3>Incendios</h3>\n\n        <ion-item>\n\n          <ion-label stacked>Zonas a Cuidar</ion-label>\n\n          <ion-input type="number" min="0" [(ngModel)]="habitacionesIncendios" #habitacionIncendios\n\n            (change)="habilitarHabitacionesIncendios(habitacionIncendios.value)" name="habitacionesIncendios">\n\n          </ion-input>\n\n        </ion-item>\n\n\n\n        <div *ngFor="let in of listaHabitacionesIncendios">\n\n          <strong style="color:#E53935">Habitaciones #{{in.id}}</strong>\n\n          <ion-item>\n\n            <ion-label floating>Nombre de Habitación a Cuidar #{{in.id}}</ion-label>\n\n            <ion-input [(ngModel)]="nombreHabitacionIncendios[in.id]" name="nombreHabitacionIncendios_{{in.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label stacked>Cuantos Sensores Necesita la Habitacion #{{in.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="sensoresIncendio[in.id]" name="sensoresIncendio_{{in.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label stacked>Tipo de Pared de la Habitacion #{{in.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="tipoParedHabitacionIncendio[in.id]"\n\n              name="tipoParedHabitacionIncendio_{{in.id}}"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Aproximidad en Mts² de la Habitación #{{in.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="aproMtsIncendio[in.id]" name="aproMtsIncendio_{{in.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>ALtura Maxima en Mts² de la Habitación #{{in.id}}</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="altMtsIncendio[in.id]" name="altMtsIncendio_{{in.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label floating>Observaciones para la zona.</ion-label>\n\n            <ion-input type="number" min="0" [(ngModel)]="obserZonaIncendio[in.id]" name="obserZonaIncendio_{{in.id}}">\n\n            </ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <button ion-button (click)="take_pictures(\'incendio\',in.id)">Tomar Fotos para Zona #{{in.id}}</button>\n\n          </ion-item>\n\n          <ion-grid>\n\n            <ion-row>\n\n              <ion-col col-4 *ngFor="let image of picturesIncendio[in.id]">\n\n                <img src="data:image/jpeg;base64,{{image}}" alt="picture{{in.id}}">\n\n              </ion-col>\n\n            </ion-row>\n\n          </ion-grid>\n\n        </div>\n\n\n\n        <ion-list radio-group [(ngModel)]="lugarImplementacionAlarmas">\n\n          <ion-list-header>\n\n            Lugar Implementación\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Residencial</ion-label>\n\n            <ion-radio value="residencial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Comercial</ion-label>\n\n            <ion-radio value="comercial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Empresarial</ion-label>\n\n            <ion-radio value="empresarial"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list radio-group [(ngModel)]="sistemaMonitoreoAlarmas">\n\n          <ion-list-header>\n\n            Sistema de Monitoreo\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Radio</ion-label>\n\n            <ion-radio value="radio"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>ADSL</ion-label>\n\n            <ion-radio value="adsl"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>APPS</ion-label>\n\n            <ion-radio value="apps"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-item>\n\n          <ion-label stacked>Canales para Unidad Central de Proceso</ion-label>\n\n          <ion-select [(ngModel)]="canalUnidadCentralProcesoAlarmas" cancelText="Cancelar" value="">\n\n            <ion-option value="0">Seleccione...</ion-option>\n\n            <ion-option value="4">x4CH</ion-option>\n\n            <ion-option value="8">x8CH</ion-option>\n\n            <ion-option value="12">x12CH</ion-option>\n\n            <ion-option value="16">x16CH</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n        <ion-list radio-group [(ngModel)]="sistemaMonitoreoAlarmas">\n\n          <ion-list-header>\n\n            ¿Desea que su sistema sea monitoreado?\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Deseo que el sistema sea monitoreado</ion-label>\n\n            <ion-radio value="1"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>No deseo que el sistema sea monitoreado</ion-label>\n\n            <ion-radio value="0"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-item>\n\n          <label class="item item-input"><input type="file" id="" (change)="adjuntar_archivo($event,\'incendio\')"\n\n              name="uploadfile" clear color="danger"></label>\n\n        </ion-item>\n\n      </ion-list>\n\n\n\n      <ion-list *ngIf="div_eps">\n\n        <h3>Equipo Pesado de Seguridad</h3><br>\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Tipo de Valor a Almacenar</ion-label>\n\n            <ion-select [(ngModel)]="tipoAlmacenar" cancelText="Cancelar" value="" multiple="true">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="docs">Documentos</ion-option>\n\n              <ion-option value="money">Dinero</ion-option>\n\n              <ion-option value="otro">Otro</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Otro:</ion-label>\n\n            <ion-input [(ngModel)]="taOtro" name="taOtro"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label floating>Lugar de Instalación</ion-label>\n\n            <ion-input [(ngModel)]="tipoAlmacenarCual" name="tipoAlmacenarCual"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Elementos Necesarios para Instalación</ion-label>\n\n            <ion-select [(ngModel)]="elementosNecesariosInstalacion" cancelText="Cancelar" value="" multiple="true">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="1">Cerradura Digital</ion-option>\n\n              <ion-option value="2">Cerradura Mecánica</ion-option>\n\n              <ion-option value="3">Motorizado</ion-option>\n\n              <ion-option value="4">Tarjeta Temporizado</ion-option>\n\n              <ion-option value="5">Tarjeta Sensor</ion-option>\n\n              <ion-option value="6">Contacto Magnetico</ion-option>\n\n              <ion-option value="7">Otro</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Otro:</ion-label>\n\n            <ion-input [(ngModel)]="eniOtro" name="eniOtro"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label>¿Desea Blindaje para su equipo?</ion-label>\n\n            <ion-toggle [(ngModel)]="desaBlindaje"></ion-toggle>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-list radio-group [(ngModel)]="nivelBlindaje" *ngIf="desaBlindaje">\n\n          <ion-list-header>\n\n            Nivel de Blindaje\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Nivel 1</ion-label>\n\n            <ion-radio value="1"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Nivel 2</ion-label>\n\n            <ion-radio value="2"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Nivel 3</ion-label>\n\n            <ion-radio value="3"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Color</ion-label>\n\n            <ion-select [(ngModel)]="colorBlindaje" cancelText="Cancelar" value="">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="gris">Gris</ion-option>\n\n              <ion-option value="Blanco">Blanco</ion-option>\n\n              <ion-option value="negro">Negro</ion-option>\n\n              <ion-option value="cafe">Café</ion-option>\n\n              <ion-option value="otro">Otro</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Otro:</ion-label>\n\n            <ion-input [(ngModel)]="cbOtro" name="cbOtro"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-list-header>\n\n            Dimenciones para su Equipo\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Frente: </ion-label>\n\n            <ion-input [(ngModel)]="frente"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Fondo: </ion-label>\n\n            <ion-input [(ngModel)]="fondo"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Alto: </ion-label>\n\n            <ion-input [(ngModel)]="alto"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n        <ion-item>\n\n          <label class="item item-input"><input type="file" id="" (change)="adjuntar_archivo($event,\'epc\')"\n\n              name="uploadfile" clear color="danger"></label>\n\n        </ion-item>\n\n\n\n      </ion-list>\n\n\n\n      <ion-list *ngIf="div_els">\n\n        <h3>Equipo Livano de Seguridad</h3><br>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label floating>Cantidad de Dinero a Almacenar:</ion-label>\n\n            <ion-input [(ngModel)]="cantDineroAl" name="cantDineroAl"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list radio-group [(ngModel)]="lugarInstEquipo">\n\n          <ion-list-header>\n\n            Lugar Instalación Equipo\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Residencial</ion-label>\n\n            <ion-radio value="residencial"></ion-radio>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Comercial</ion-label>\n\n            <ion-radio value="comercial"></ion-radio>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Tipo de Equipo que Desea</ion-label>\n\n            <ion-select [(ngModel)]="tipoEquipo" cancelText="Cancelar" value="" multiple="true">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="cofre">Cofre</ion-option>\n\n              <ion-option value="cofredvr">Cofre DVR</ion-option>\n\n              <ion-option value="billetero">Billetero</ion-option>\n\n              <ion-option value="otro">Billetero</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Otro:</ion-label>\n\n            <ion-input [(ngModel)]="teOtro" name="taOtro"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Elementos Necesarios para Instalación</ion-label>\n\n            <ion-select [(ngModel)]="elementosNecesariosInstalacion" cancelText="Cancelar" value="" multiple="true">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="1">Cerradura Digital</ion-option>\n\n              <ion-option value="2">Cerradura Mecánica</ion-option>\n\n              <ion-option value="3">Motorizado</ion-option>\n\n              <ion-option value="4">Tarjeta Temporizado</ion-option>\n\n              <ion-option value="5">Tarjeta Sensor</ion-option>\n\n              <ion-option value="6">Contacto Magnetico</ion-option>\n\n              <ion-option value="7">Otro</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Otro:</ion-label>\n\n            <ion-input [(ngModel)]="eniOtro" name="eniOtro"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-item>\n\n            <ion-label stacked>Color</ion-label>\n\n            <ion-select [(ngModel)]="colorBlindaje" cancelText="Cancelar" value="">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="gris">Gris</ion-option>\n\n              <ion-option value="Blanco">Blanco</ion-option>\n\n              <ion-option value="negro">Negro</ion-option>\n\n              <ion-option value="cafe">Café</ion-option>\n\n              <ion-option value="otro">Otro</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Otro:</ion-label>\n\n            <ion-input [(ngModel)]="cbOtro" name="cbOtro"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <ion-list>\n\n          <ion-list-header>\n\n            Dimenciones para su Equipo\n\n          </ion-list-header>\n\n          <ion-item>\n\n            <ion-label>Frente: </ion-label>\n\n            <ion-input [(ngModel)]="frente"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Fondo: </ion-label>\n\n            <ion-input [(ngModel)]="fondo"></ion-input>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label>Alto: </ion-label>\n\n            <ion-input [(ngModel)]="alto"></ion-input>\n\n          </ion-item>\n\n        </ion-list>\n\n      </ion-list>\n\n    </ion-list>\n\n    <ion-list no-list *ngSwitchCase="\'catalogo\'">\n\n      <h1>Posibles Opciones</h1>\n\n      <div *ngIf="list_items.length > 0; else elseItems">\n\n\n\n\n\n        <ion-card *ngFor="let item of list_items">\n\n          <ion-card-content>\n\n            <div *ngIf="item.image_medium;else elseimg">\n\n              <img [src]="sanitize(\'data:image/jpeg;base64,\'+item.image_medium)" alt="{{item.name}}">\n\n            </div>\n\n            <ng-template #elseimg>\n\n              <img src="assets/imgs/picture.png" width="50%">\n\n            </ng-template>\n\n            <ion-item>\n\n              <ion-icon name="information" color="danger" item-start></ion-icon>\n\n              Nombre:\n\n              <ion-badge color="danger" item-end>{{item.name}}</ion-badge>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-icon name="checkmark" color="danger" item-start></ion-icon>\n\n              Disponibles:\n\n              <ion-badge color="danger" item-end>{{item.qty_available}}</ion-badge>\n\n            </ion-item>\n\n            <ion-item>\n\n              <ion-icon name="logo-usd" color="danger" item-start></ion-icon>\n\n              Precio:\n\n              <ion-badge color="danger" item-end>{{ item.currency_id[1] }} {{ item.list_price | number:\'3.2-5\'}}\n\n              </ion-badge>\n\n            </ion-item>\n\n            <button ion-button color="danger" (click)="agregaCarrito(item)">\n\n              <ion-icon name="cart"></ion-icon>\n\n            </button>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </div>\n\n      <ng-template #elseItems>\n\n        <h1>Por favor seleccione mínimo una necesidad del cliente</h1>\n\n      </ng-template>\n\n\n\n    </ion-list>\n\n    <ion-list no-list *ngSwitchCase="\'cotizacion\'">\n\n      <h1>Cotización</h1>\n\n      <ion-card *ngFor="let itc of list_items_carrito">\n\n        <div *ngIf="itc.image_medium;else elseimgc">\n\n          <img [src]="sanitize(\'data:image/jpeg;base64,\'+itc.image_medium)" alt="{{itc.name}}">\n\n        </div>\n\n        <ng-template #elseimgc>\n\n          <img src="assets/imgs/picture.png" width="50%">\n\n        </ng-template>\n\n        <ion-card-content>\n\n          <ion-item>\n\n            <ion-icon name="information" color="danger" item-start></ion-icon>\n\n            Nombre:\n\n            <ion-badge color="danger" item-end>{{itc.name}}</ion-badge>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-icon name="checkmark" color="danger" item-start></ion-icon>\n\n            Disponibles:\n\n            <ion-badge color="danger" item-end>{{itc.qty_available}}</ion-badge>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-icon name="logo-usd" color="danger" item-start></ion-icon>\n\n            Costo:\n\n            <ion-badge color="danger" item-end>{{ itc.currency_id[1] }} {{ itc.list_price | number:\'3.2-5\'}}</ion-badge>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-label stacked> % Utilidad</ion-label>\n\n            <ion-select [(ngModel)]="porcentajeUtilidad[itc.id]" cancelText="Cancelar" #sdefdef\n\n              (ngModelChange)="cambiaUtilidad()" value="0">\n\n              <ion-option value="0">Seleccione...</ion-option>\n\n              <ion-option value="25">25%</ion-option>\n\n              <ion-option value="50">50%</ion-option>\n\n              <ion-option value="75">75%</ion-option>\n\n              <ion-option value="100">100%</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-icon name="logo-usd" color="danger" item-start></ion-icon>\n\n            Precio:\n\n            <ion-badge color="danger" item-end *ngIf="porcentajeUtilidad[itc.id]">{{itc.list_price + (itc.list_price *\n\n              porcentajeUtilidad[itc.id] / 100) | number:\'3.2-5\'}}</ion-badge>\n\n            <ion-badge color="danger" item-end *ngIf="!porcentajeUtilidad[itc.id]">{{itc.list_price | number:\'3.2-5\'}}\n\n            </ion-badge>\n\n          </ion-item>\n\n        </ion-card-content>\n\n      </ion-card>\n\n      <ion-card *ngIf="list_items_carrito.length > 0; else elseItemsCarrito">\n\n        <ion-card-content>\n\n          <ion-item>\n\n            <ion-icon name="logo-usd" color="danger" item-start></ion-icon>\n\n            SubTotal:\n\n            <ion-badge color="danger" item-end>{{subTotal | number:\'3.2-5\'}}</ion-badge>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-icon name="logo-usd" color="danger" item-start></ion-icon>\n\n            Impuesto:\n\n            <ion-badge color="danger" item-end>19%</ion-badge>\n\n          </ion-item>\n\n          <ion-item>\n\n            <ion-icon name="logo-usd" color="danger" item-start></ion-icon>\n\n            Total:\n\n            <ion-badge color="danger" item-end>{{total | number:\'3.2-5\'}}</ion-badge>\n\n          </ion-item>\n\n          <ion-item>\n\n          </ion-item>\n\n        </ion-card-content>\n\n      </ion-card>\n\n      <ng-template #elseItemsCarrito>\n\n        <h1>El carrito esta vacío</h1>\n\n      </ng-template>\n\n\n\n    </ion-list>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\prospecto\prospecto.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__["a" /* FileChooser */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */]])
], ProspectoPage);

//# sourceMappingURL=prospecto.js.map

/***/ }),

/***/ 360:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServicioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__acta_digital_acta_digital__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_api_api__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ionic_angular_util_util__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var ServicioPage = (function () {
    function ServicioPage(navCtrl, navParams, odooRpc, loadingCtrl, platform, toastCtrl, camera, sanitizer, fileChooser, file, storage, renderer, plt, alert, api, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.sanitizer = sanitizer;
        this.fileChooser = fileChooser;
        this.file = file;
        this.storage = storage;
        this.renderer = renderer;
        this.plt = plt;
        this.alert = alert;
        this.api = api;
        this.alertCtrl = alertCtrl;
        this.list_necesidades = [];
        this.list_items = [];
        this.arregloExtra = [];
        this.list_service_category = [];
        this.list_spare_location = [];
        this.listProducts = [];
        this.dataServicio = {
            id: navParams.get("id"),
            issue_id: navParams.get("issue_id"),
            name: navParams.get("name"),
            categs_ids: navParams.get("categs_id"),
            city_id: navParams.get("city_id"),
            request_type: navParams.get("request_type"),
            request_source: navParams.get("request_source"),
            branch_type: navParams.get("branch_type"),
            partner_id: navParams.get("partner_id"),
            location_id: navParams.get("location_id"),
            user_id: navParams.get("user_id"),
            date_start: navParams.get("date_start"),
            date_finish: navParams.get("date_finish"),
            description: navParams.get("description"),
            sec: navParams.get("sec"),
            origin_tech_coord: navParams.get("origin_tech_coord"),
            entry_time: navParams.get("entry_time")
        };
        // this.get_necesidad_cliente();
    }
    ServicioPage.prototype.ionViewDidLoad = function () {
        /**
         * Función para generar al ubicacion real del tecnico y que no este mintiendo en su ubicacion
         */
        /* this.getLocation(); */
    };
    /**
     * Función para generar al ubicacion real del tecnico y que no este mintiendo en su ubicacion
     */
    /* private getLocation(){
      var _self = this;
      _self.plt.ready().then(readySource => {
        const currentposition = navigator.geolocation;
        if (currentposition) {
            currentposition.getCurrentPosition(function (position) {
              _self.pointC = position.coords.latitude+','+position.coords.longitude;
              _self.dataServicio["pointC"] = _self.pointC;
            });
          }
      });
    } */
    /*******Primer Filtro********/
    ServicioPage.prototype.get_necesidad_cliente = function () {
        var _this = this;
        this.list_service_category = [];
        this.list_items = [];
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var where = [];
        var table = "product.category";
        switch (this.typeMaintenance) {
            case 'electronico':
                where = [['is_electronic', '=', true], ['is_metalworking', '=', false]];
                break;
            case 'metalmecanico':
                where = [['is_metalworking', '=', true], ['is_electronic', '=', false]];
                break;
            default:
                break;
        }
        if (where != []) {
            this.odooRpc.searchRead(table, where, ["id", "name"], 0, 0, "").then(function (tags) {
                var json = JSON.parse(tags._body);
                if (!json.error) {
                    _this.list_necesidades = json["result"].records;
                    loading.dismiss();
                }
            });
        }
    };
    /*******Segundo Filtro**************/
    ServicioPage.prototype.getServiceCategory = function (category) {
        var _this = this;
        this.list_items = [];
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var domain = [];
        var table = "";
        switch (this.typeMaintenance) {
            case 'electronico':
                domain = [['product_category_id', '=', +category]];
                table = "product.service.category";
                break;
            case 'metalmecanico':
                domain = [['equipment_category', '=', +category]];
                table = "project.spare.equipment.type";
                break;
            default:
                break;
        }
        this.odooRpc.searchRead(table, domain, ["id", "name"], 0, 0, "").then(function (items) {
            var json = JSON.parse(items._body);
            if (!json.error && json["result"].records.length > 0) {
                _this.list_service_category = json["result"].records;
                loading.dismiss();
            }
        });
    };
    /*Traemos la locaciones de los productos para equipo metalmecanicos (filtro intermedio entre filtro dos y tres)*/
    ServicioPage.prototype.get_spare_location = function (subsistemas) {
        var _this = this;
        if (subsistemas === void 0) { subsistemas = ""; }
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        this.list_spare_location = [];
        var domain = [];
        domain = [['equipment_type', '=', +subsistemas]];
        this.odooRpc.searchRead("project.equipment.spare.location", domain, [], 0, 0, "").then(function (items) {
            var json = JSON.parse(items._body);
            if (!json.error && json["result"].records.length > 0) {
                json["result"].records.forEach(function (el) {
                    _this.list_spare_location.push(el);
                });
            }
        });
        loading.dismiss();
    };
    /************Tercer Filtro*****************/
    ServicioPage.prototype.get_productos = function (nec) {
        var _this = this;
        if (nec === void 0) { nec = []; }
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var table = "";
        var domain = [];
        this.list_items = [];
        switch (this.typeMaintenance) {
            case 'electronico':
                for (var index = 0; index < nec.length; index++) {
                    domain = [['service_cat_id', '=', +nec[index]]];
                    this.odooRpc.searchRead("product.template", domain, [], 0, 0, "").then(function (items) {
                        var json = JSON.parse(items._body);
                        if (!json.error && json["result"].records.length > 0) {
                            json["result"].records.forEach(function (element) {
                                _this.list_items.push(element);
                            });
                        }
                    });
                }
                break;
            case 'metalmecanico':
                this.list_items = [];
                var url = "https://erp.allser.com.co/web/dataset/spare_list";
                var parametros = { "params": { "product_categ_id": +this.necCliente, "equipment_type_id": +this.idServicio, "spare_location_id": +this.spare_location } };
                this.api.getData(url, parametros).subscribe(function (data) {
                    data['result'].records.forEach(function (pro) {
                        var a = {
                            'id': pro.product_id,
                            'display_name': pro.product_name + ' [' + pro.location_name + '] [' + pro.equipment_name + ']',
                            'name': pro.product_name,
                            'categ_id': pro.categ_id,
                            'categ_name': pro.categ_name,
                            'equipment_id': pro.equipment_id,
                            'equipment_name': pro.equipment_name,
                            'location_id': pro.location_id,
                            'location_name': pro.location_name,
                        };
                        _this.list_items.push(a);
                    });
                }, function (error) {
                    console.log(error);
                });
                break;
            default:
                break;
        }
        loading.dismiss();
    };
    ServicioPage.prototype.getElementoMetalmecanico = function (category_line) {
        var _this = this;
        var where = [['id', '=', category_line.product_id[0]]];
        this.odooRpc.searchRead("product.template", where, [], 0, 0, "").then(function (j) {
            var consulta = JSON.parse(j._body);
            if (!consulta.error && consulta["result"].records.length > 0) {
                consulta["result"].records.forEach(function (el) {
                    if (!(el in _this.list_items)) {
                        _this.list_items.push(el);
                    }
                });
            }
        });
    };
    ServicioPage.prototype.sanitize = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    ServicioPage.prototype.setCantidadItem = function (item) {
        var _this = this;
        var alerta = this.alert.create();
        alerta.setTitle('Cantidad de items');
        alerta.addInput({
            type: 'number',
            min: 0,
            name: 'cant'
        });
        alerta.addButton('Cancelar');
        alerta.addButton({
            text: 'Agregar',
            handler: function (cantidad) {
                _this.addProduct(item, cantidad);
            }
        });
        alerta.present();
    };
    ServicioPage.prototype.addProduct = function (items, cantidad) {
        var _this = this;
        for (var i = 1; i <= +cantidad.cant; i++) {
            this.list_items.forEach(function (a) {
                if (a.id == items) {
                    _this.listProducts.push({
                        id: a.id,
                        name: a.name,
                        display_name: a.display_name,
                        image: a.image_medium,
                        pictures: '',
                        accion: 0,
                        cantidad: 1,
                        service: a.service_cat_id ? a.service_cat_id : a.equipment_type,
                        ubication: "",
                        categ_id: a.categ_id ? a.categ_id : null,
                        categ_name: a.categ_name ? a.categ_name : null,
                        equipment_id: a.equipment_id ? a.equipment_id : null,
                        equipment_name: a.equipment_name ? a.equipment_name : null,
                        location_id: a.location_id ? a.location_id : null,
                        location_name: a.location_name ? a.location_name : null,
                        serial_number: ""
                    });
                }
            });
        }
    };
    ServicioPage.prototype.take_pictures = function (i) {
        var _this = this;
        var options = {
            // quality: 70,
            // destinationType: this.camera.DestinationType.FILE_URI,
            // encodingType: this.camera.EncodingType.JPEG,
            // mediaType: this.camera.MediaType.PICTURE
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.listProducts[i].pictures = imageData;
        }, function (err) {
            console.error(err);
        });
    };
    ServicioPage.prototype.change_action = function (value, position) {
        this.listProducts[position].accion = value;
    };
    ServicioPage.prototype.change_cant = function (value, position) {
        this.listProducts[position].cantidad = value;
    };
    ServicioPage.prototype.change_ubication = function (value, position) {
        this.listProducts[position].ubication = value;
    };
    ServicioPage.prototype.change_serial = function (value, position) {
        this.listProducts[position].serial_number = value;
    };
    ServicioPage.prototype.continue_process = function () {
        var _this = this;
        var bandera = true;
        var params = {};
        params["necesidad"] = [];
        params["servicios"] = [];
        /*data basica que ya viene del mantenimiento*/
        params["dataMantenimiento"] = this.dataServicio;
        /*checknox de si es Electronico o metal mecanico*/
        params["dataMantenimiento"]["typeMaintenance"] = this.typeMaintenance;
        /*lista de los productos que hace referencia a los equipos afectados*/
        params["productos"] = this.listProducts;
        this.listProducts.forEach(function (produc) {
            if (produc.pictures == "" || produc.accion == 0 || produc.ubication == "" || produc.serial_number == "")
                bandera = false;
        });
        if (bandera) {
            /*Si es metalmecanico, agrega un campo que se llama locacion que hace referencia al tercer filtro de metalmecanicos*/
            if (this.typeMaintenance == 'metalmecanico') {
                params["locacion"] = this.spare_location;
            }
            /*Necesidad del cliente o categoria del servicio que hace referencia al filtro de sistemas intervenidos*/
            this.list_necesidades.forEach(function (nec) {
                if (nec.id == _this.necCliente) {
                    params["necesidad"] = nec;
                }
            });
            /*servicios del cliente o subsistemas intervenidos que hace referencia al filtro de subsistemas intervenidos*/
            this.list_service_category.forEach(function (ser) {
                if (Object(__WEBPACK_IMPORTED_MODULE_10_ionic_angular_util_util__["e" /* isArray */])(_this.idServicio)) {
                    _this.idServicio.forEach(function (idser) {
                        if (ser.id == idser) {
                            params["servicios"].push(ser);
                        }
                    });
                }
                else {
                    if (ser.id == _this.idServicio) {
                        params["servicios"].push(ser);
                    }
                }
            });
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__acta_digital_acta_digital__["a" /* ActaDigitalPage */], params);
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: 'ERROR',
                subTitle: 'Por favor agregue la firma del encargado',
                buttons: ['OK']
            });
            alert_1.present();
        }
    };
    return ServicioPage;
}());
ServicioPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: 'page-servicio',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\servicio\servicio.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Servicio</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding class="cards-bg">\n\n  <ion-list radio-group [(ngModel)]="typeMaintenance" #mantenimiento (ngModelChange)="get_necesidad_cliente()">\n\n    <ion-label>\n\n      Tipo De Mantenimiento\n\n    </ion-label>\n\n    <ion-item>\n\n      <ion-label>Electronico</ion-label>\n\n      <ion-radio value="electronico"></ion-radio>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label>Metal Mecanico</ion-label>\n\n      <ion-radio value="metalmecanico"></ion-radio>\n\n    </ion-item>\n\n  </ion-list>\n\n  <ion-list>\n\n\n\n    <!--Sistema Intervenido-->\n\n    <ion-item *ngIf="list_necesidades?.length > 0">\n\n      <ion-label stacked>Sistema Intervenido: </ion-label>\n\n      <ion-select [(ngModel)]="necCliente" cancelText="Cancelar" #necesidad\n\n        (ngModelChange)="getServiceCategory(necesidad.value)">\n\n        <ion-option *ngFor="let necesidad of list_necesidades" value="{{necesidad.id}}">{{necesidad.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n    <!--Subsistema Intervenido-->\n\n\n\n    <!--Para electronicos-->\n\n    <ion-item *ngIf="list_service_category?.length > 0 && typeMaintenance == \'electronico\'">\n\n      <ion-label stacked>Subsistema Intervenido: </ion-label>\n\n      <ion-select [(ngModel)]="idServicio" cancelText="Cancelar" #servicioCatego\n\n        (ngModelChange)="get_productos(servicioCatego.value)" multiple="true">\n\n        <ion-option *ngFor="let servicio of list_service_category" value="{{servicio.id}}">{{servicio.name}}\n\n        </ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n    <!--Para metalmecanicos-->\n\n    <ion-item *ngIf="list_service_category?.length > 0 && typeMaintenance == \'metalmecanico\'">\n\n      <ion-label stacked>Subsistema Intervenido: </ion-label>\n\n      <ion-select [(ngModel)]="idServicio" cancelText="Cancelar" #servicioCatego\n\n        (ngModelChange)="get_spare_location(servicioCatego.value)">\n\n        <ion-option *ngFor="let servicio of list_service_category" value="{{servicio.id}}">{{servicio.name}}\n\n        </ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n    <!--Tercer Filtro en caso de ser equipos metalmecanicos-->\n\n    <ion-item *ngIf="list_spare_location?.length > 0 && typeMaintenance == \'metalmecanico\'">\n\n      <ion-label stacked> Locación del Subsistema Intervenido: </ion-label>\n\n      <ion-select [(ngModel)]="spare_location" cancelText="Cancelar" #idspare_location\n\n        (ngModelChange)="get_productos(idspare_location.value)">\n\n        <ion-option *ngFor="let sq of list_spare_location" value="{{sq.id}}">{{sq.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n\n\n    <!--Equipo Afectado-->\n\n    <!-- <ion-item> -->\n\n    <ion-item *ngIf="list_items.length > 0">\n\n      <ion-label stacked>Equipo Afectado: </ion-label>\n\n      <ion-select [(ngModel)]="products" cancelText="Cancelar" #product id="product"\n\n        (ngModelChange)="setCantidadItem(product.value)">\n\n        <ion-option *ngFor="let item of list_items" value="{{item.id}}">{{item.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n  </ion-list>\n\n  <hr>\n\n  <!--Tarjetas de los productos usados-->\n\n  <ion-card *ngFor="let item of listProducts; let i = index">\n\n    <img *ngIf="item.image" [src]="sanitize(\'data:image/jpeg;base64,\'+item.image)" alt="{{item.name}}" />\n\n    <ion-card-content>\n\n      <ion-card-title>\n\n        {{item.name}}\n\n      </ion-card-title>\n\n      <p>\n\n        {{item.display_name}}\n\n      </p>\n\n      <ion-list radio-group>\n\n        <ion-list-header>\n\n          Acción\n\n        </ion-list-header>\n\n        <ion-item>\n\n          <ion-label>Reparación</ion-label>\n\n          <ion-radio value="1" (click)="change_action(1,i)"></ion-radio>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-label>Cambio</ion-label>\n\n          <ion-radio value="2" (click)="change_action(2,i)"></ion-radio>\n\n        </ion-item>\n\n      </ion-list>\n\n      <ion-list>\n\n        <ion-item>\n\n          <ion-label floating>Observaciones: </ion-label>\n\n          <ion-input type="text" #ubication (change)="change_ubication(ubication.value,i)"></ion-input>\n\n        </ion-item>\n\n      </ion-list>\n\n    </ion-card-content>\n\n    <ion-row no-padding>\n\n      <ion-col col-12>\n\n        <button ion-button clear full color="danger" icon-start (click)="take_pictures(i)">\n\n          <ion-icon name=\'camera\'></ion-icon>\n\n          Tomar Fotos\n\n        </button>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <!-- <ion-col col-4 *ngFor="let image of item.pictures">\n\n        <img src="data:image/jpeg;base64,{{image}}">\n\n      </ion-col> -->\n\n      <ion-col col-12>\n\n        <img *ngIf="item.pictures.length" src="data:image/jpeg;base64,{{item.pictures}}">\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-list>\n\n        <ion-item>\n\n          <ion-label floating>Serial: </ion-label>\n\n          <ion-input type="text" #serial (change)="change_serial(serial.value,i)"></ion-input>\n\n        </ion-item>\n\n      </ion-list>\n\n    </ion-row>\n\n  </ion-card>\n\n  <button *ngIf="listProducts?.length > 0" ion-button full color="secundary" (click)="continue_process()">Continuar\n\n    Proceso <ion-icon name=\'share-alt\'></ion-icon></button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\servicio\servicio.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file_chooser__["a" /* FileChooser */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["_0" /* Renderer */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_9__providers_api_api__["a" /* ApiProvider */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* AlertController */]])
], ServicioPage);

//# sourceMappingURL=servicio.js.map

/***/ }),

/***/ 361:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(93);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var STORAGE_KEY = 'IMAGE_LIST';
var ModalPage = (function () {
    function ModalPage(view, navParams, plt, file, storage) {
        this.view = view;
        this.navParams = navParams;
        this.plt = plt;
        this.file = file;
        this.storage = storage;
        this.storedImages = [];
        this.selectedColor = '#000000';
        this.colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3', '#000000'];
        this.firma = "";
        this.Datafirma = "";
    }
    // ionViewWillLoad() {
    //   const data = this.navParams.get('data');
    //   console.log(data);
    // }
    ModalPage.prototype.closeModal = function () {
        this.saveCanvasImage();
        var data = {
            firma: "",
            Datafirma: "",
            finish: false
        };
        this.view.dismiss(data);
    };
    ModalPage.prototype.ionViewDidLoad = function () {
        this.canvasElement = this.canvas.nativeElement;
        this.canvasElement.width = this.plt.width() + '';
        // this.canvasElement.height = '600%';
    };
    ModalPage.prototype.ionViewDidEnter = function () {
        var itemHeight = this.fixedContainer.nativeElement.offsetHeight;
        var scroll = this.content.getScrollElement();
        itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
        scroll.style.margin = 'auto';
    };
    ModalPage.prototype.selectColor = function (color) {
        this.selectedColor = color;
    };
    ModalPage.prototype.startDrawing = function (ev) {
        var canvasPosition = this.canvasElement.getBoundingClientRect();
        this.saveX = ev.touches[0].pageX - canvasPosition.x;
        this.saveY = ev.touches[0].pageY - canvasPosition.y;
    };
    ModalPage.prototype.moved = function (ev) {
        var canvasPosition = this.canvasElement.getBoundingClientRect();
        var ctx = this.canvasElement.getContext('2d');
        var currentX = ev.touches[0].pageX - canvasPosition.x;
        var currentY = ev.touches[0].pageY - canvasPosition.y;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.selectedColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.saveX, this.saveY);
        ctx.lineTo(currentX, currentY);
        ctx.closePath();
        ctx.stroke();
        this.saveX = currentX;
        this.saveY = currentY;
    };
    ModalPage.prototype.saveCanvasImage = function () {
        this.firma = this.canvasElement.toDataURL();
        this.clearCanvasImage();
        var name = new Date().getTime() + '.png';
        var path = this.file.dataDirectory;
        var options = { replace: true };
        var data = this.firma.split(',')[1];
        var blob = this.b64toBlob(data, 'image/png');
        this.Datafirma = data;
        var a = {
            firma: this.firma,
            Datafirma: this.Datafirma,
            finish: true
        };
        this.view.dismiss(a);
    };
    ModalPage.prototype.clearCanvasImage = function () {
        var ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
    };
    // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
    ModalPage.prototype.b64toBlob = function (b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    ModalPage.prototype.storeImage = function (imageName) {
        var _this = this;
        var saveObj = { img: imageName };
        this.storedImages.push(saveObj);
        this.storage.set(STORAGE_KEY, this.storedImages).then(function () {
            setTimeout(function () {
                _this.content.scrollToBottom();
            }, 500);
        });
    };
    ModalPage.prototype.removeImageAtIndex = function (index) {
        var removed = this.storedImages.splice(index, 1);
        this.file.removeFile(this.file.dataDirectory, removed[0].img).then(function (res) {
        }, function (err) {
            console.log('remove err; ', err);
        });
        this.storage.set(STORAGE_KEY, this.storedImages);
    };
    ModalPage.prototype.limpiarFimar = function () {
        this.firma = "";
    };
    ModalPage.prototype.getImagePath = function (imageName) {
        var path = this.file.dataDirectory + imageName;
        // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
        path = Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* normalizeURL */])(path);
        return path;
    };
    return ModalPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('imageCanvas'),
    __metadata("design:type", Object)
], ModalPage.prototype, "canvas", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Content */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Content */])
], ModalPage.prototype, "content", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('fixedContainer'),
    __metadata("design:type", Object)
], ModalPage.prototype, "fixedContainer", void 0);
ModalPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-modal',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\modal\modal.html"*/'<!--\n\n  Generated template for the ModalPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>modalPage</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button (click)="closeModal()">\n\n        <ion-icon name="close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding no-bounce>\n\n  <div #fixedContainer ion-fixed>\n\n    <canvas #imageCanvas (touchstart)="startDrawing($event)" (touchmove)="moved($event)" height="500%"></canvas>\n\n    <button ion-button color="primary" style="width: 48%;float: left;" (click)="saveCanvasImage()">Guardar Firma</button>\n\n    <button ion-button color="danger" style="width: 48%;float: right;" (click)="clearCanvasImage()">Limpiar Firma</button>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\modal\modal.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */]])
], ModalPage);

//# sourceMappingURL=modal.js.map

/***/ }),

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ApiProvider = (function () {
    function ApiProvider(http) {
        this.http = http;
    }
    ApiProvider.prototype.getData = function (url, parametros) {
        return this.http.post(url, parametros);
    };
    return ApiProvider;
}());
ApiProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
], ApiProvider);

//# sourceMappingURL=api.js.map

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HistorialServiciosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__detalle_detalle__ = __webpack_require__(160);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the HistorialServiciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// @IonicPage()
var HistorialServiciosPage = (function () {
    function HistorialServiciosPage(navCtrl, navParams, odooRpc, loadinCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.loadinCtrl = loadinCtrl;
        this.list_servicios = [];
        this.homeMantemimiento = false;
        this.homeComercial = false;
    }
    HistorialServiciosPage.prototype.ionViewDidLoad = function () {
        this.loginData = JSON.parse(localStorage.getItem('token'));
        this.get_mantenimientos();
        if (this.loginData['technician']) {
            this.homeMantemimiento = true;
            this.homeComercial = false;
        }
        else {
            this.homeMantemimiento = false;
            this.homeComercial = true;
        }
    };
    HistorialServiciosPage.prototype.get_mantenimientos = function () {
        var _this = this;
        var table = '';
        var domain = [];
        var filter = [];
        if (this.loginData['technician']) {
            table = 'project.task';
            domain = [['user_id', '=', this.loginData['uid']], ['finished', '=', 'true']];
        }
        this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then(function (query) {
            _this.llenar_servicios(query);
        }).catch(function (err) {
            console.log(err);
        });
    };
    HistorialServiciosPage.prototype.llenar_servicios = function (data) {
        var _this = this;
        var loading = this.loadinCtrl.create({
            content: 'Estamos preparando todo...'
        });
        loading.present();
        var json = JSON.parse(data._body);
        if (!json.error) {
            json["result"].records.forEach(function (e) {
                _this.list_servicios.push({
                    id: e.id,
                    issue_id: e.issue_id,
                    name: e.name == false ? "N/A" : e.name,
                    categs_ids: e.categs_ids == false ? "N/A" : e.categs_ids,
                    request_type: e.request_type == false ? "N/A" : e.request_type,
                    city_id: e.city_id == false ? "N/A" : e.city_id,
                    request_source: e.request_source == false ? "N/A" : e.request_source,
                    branch_type: e.location_type_id == false ? "N/A" : e.location_type_id,
                    partner_id: e.partner_id == false ? "N/A" : e.partner_id,
                    location_id: e.location_id == false ? "N/A" : e.location_id,
                    contact_id: e.contact_id == false ? "N/A" : e.contact_id,
                    user_id: e.user_id == false ? "N/A" : e.user_id,
                    date_start: e.date_start == false ? "N/A" : e.date_start,
                    date_finish: e.date_finish == false ? "N/A" : e.date_finish,
                    description: e.issue_description == false ? "N/A" : e.issue_description,
                    priority: e.priority == false ? "N/A" : e.priority,
                    sec: e.issue_sec == false ? "N/A" : e.issue_sec,
                    finished: e.finished,
                    kanban_state: e.kanban_state
                });
            });
        }
        loading.dismiss();
    };
    HistorialServiciosPage.prototype.view = function (idx) {
        var params = {};
        //Validacion para cargar causas de rol mantenimiento3
        if (this.loginData['technician']) {
            params['id'] = this.list_servicios[idx].id;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__detalle_detalle__["a" /* DetallePage */], params);
    };
    return HistorialServiciosPage;
}());
HistorialServiciosPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-historial-servicios',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\historial-servicios\historial-servicios.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>historial Servicios</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n  <ion-list *ngIf="homeMantemimiento" no-lines [virtualScroll]="list_servicios">\n\n    <ion-item-sliding *virtualItem="let item; let i = index">\n\n      <ion-item (click)="view(i)">\n\n        <h1>{{item.name}}</h1>\n\n        <p style="color:grey"><strong>Cliente: </strong> {{item.partner_id[1]}}</p>\n\n        <p style="color:grey"><strong>Identificación: </strong>{{item.sec}}</p>\n\n        <p style="color:grey"><strong>Ubicación: </strong>{{item.city_id}}<br>{{item.location_id}}|{{item.branch_type}}</p>\n\n        <h2 *ngIf="item.kanban_state == \'blocked\'">\n\n          <p style="color: #F44336;"><strong>Estado:</strong> Bloqueado</p>\n\n        </h2>\n\n        <h2 *ngIf="item.kanban_state == \'done\'">\n\n          <p style="color:#4CAF50;"><strong>Estado:</strong> Listo</p>\n\n        </h2>\n\n        <h2 *ngIf="item.kanban_state == \'normal\'">\n\n            <p style="color: #039BE5;"><strong>Estado:</strong> Normal</p>\n\n          </h2>\n\n      </ion-item>\n\n    </ion-item-sliding>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\historial-servicios\historial-servicios.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */]])
], HistorialServiciosPage);

//# sourceMappingURL=historial-servicios.js.map

/***/ }),

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataBaseProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_sqlite__ = __webpack_require__(367);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/*
  Generated class for the DataBaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var database = "allservice.db";
var DataBaseProvider = (function () {
    function DataBaseProvider(http, sqlite) {
        this.http = http;
        this.sqlite = sqlite;
        this.createDataBase();
    }
    DataBaseProvider.prototype.createDataBase = function () {
        var list_tables = "";
        list_tables += "CREATE TABLE IF NOT EXISTS res_users (id integer primary key, active boolean, login text, password text, company_id integer, partner_id integer, create_date text, create_uid integer, share boolean,  write_uid integer, write_date text, signature text, action_uid, password_crypt text, alias_id integer, chatter_needaction_auto booblean, sale_team_id integer, target_sales_done integer, target_sales_won integer, target_sales_invoiced integer, salesman boolean, technician boolean, player_id text, coordinator boolean)";
        return this.sqlite.create({
            name: database,
            location: 'default'
        }).then(function (db) {
            return db.executeSql(list_tables, []).then(function (res) {
                return Promise.resolve(res);
            }).catch(function (e) {
                return Promise.resolve(e);
            });
        }).catch(function (e) {
            return Promise.resolve(e);
        });
    };
    DataBaseProvider.prototype.select = function (table, data, where, limit) {
        var set = '';
        var cont = 1;
        var valor = [];
        var query = 'SELECT';
        if (data.length > 0) {
            var select_1 = "";
            data.forEach(function (element) {
                if (cont < data.length) {
                    select_1 += element + ",";
                    cont++;
                }
                else {
                    select_1 += element;
                }
            });
            query += select_1 + " FROM" + table;
        }
        else {
            query += '* FROM' + table;
        }
        if (where != "")
            query += " WHERE" + where + " ";
        if (limit != "")
            query += " " + limit + " ";
        return this.sqlite.create({
            name: database,
            location: 'dafult'
        }).then(function (db) {
            return db.executeSql(query, []).then(function (res) {
                return Promise.resolve(res);
            }).catch(function (e) {
                return Promise.resolve(e);
            });
        }).catch(function (e) {
            return Promise.resolve(e);
        });
    };
    DataBaseProvider.prototype.insert = function (table, data) {
        var columna = '';
        var valor = [];
        var comodin = '';
        var cont = 1;
        data.forEach(function (key, value) {
            valor.push(value);
            if (cont < data.length) {
                columna += key + ',';
                comodin += '?,';
                cont++;
            }
            else {
                columna += key;
                comodin += '?';
            }
        });
        return this.sqlite.create({
            name: database,
            location: 'dafult'
        }).then(function (db) {
            return db.executeSql("INSERT INTO " + table + " (" + columna + ") VALUES (" + comodin + ")", valor).then(function (res) {
                return Promise.resolve(res);
            }).catch(function (e) {
                return Promise.resolve(e);
            });
        }).catch(function (e) {
            return Promise.resolve(e);
        });
    };
    DataBaseProvider.prototype.update = function (table, data, where) {
        var set = '';
        var cont = 1;
        var valor = [];
        data.forEach(function (key, value) {
            if (cont == data.length) {
                valor.push(value);
                set += key + ' = ?';
            }
            else {
                set += key + ' = ?,';
                cont++;
            }
        });
        return this.sqlite.create({
            name: database,
            location: 'dafult'
        }).then(function (db) {
            return db.executeSql("UPDATE " + table + " SET " + set + " WHERE " + where, valor).then(function (res) {
                return Promise.resolve(res);
            }).catch(function (e) {
                return Promise.resolve(e);
            });
        }).catch(function (e) {
            return Promise.resolve(e);
        });
    };
    DataBaseProvider.prototype.delete = function (table, where) {
        var deleteQuery = "DELETE FROM " + table + " WHERE " + where;
        return this.sqlite.create({
            name: database,
            location: 'default'
        }).then(function (db) {
            return db.executeSql(deleteQuery, []).then(function (res) {
                return Promise.resolve(res);
            }).catch(function (e) {
                return Promise.resolve(e);
            });
        }).catch(function (e) {
            return Promise.resolve(e);
        });
    };
    return DataBaseProvider;
}());
DataBaseProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_sqlite__["a" /* SQLite */]])
], DataBaseProvider);

//# sourceMappingURL=data-base.js.map

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(373);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 373:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_add_customer_add_customer__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_home_home__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(697);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_network__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__directives_parallax_parallax__ = __webpack_require__(698);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_profile_profile__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_splash_screen__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_status_bar__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_form_probabilidad_form_probabilidad__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_prospecto_prospecto__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_servicio_servicio__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_camera__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_file_chooser__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_file_transfer__ = __webpack_require__(699);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_file__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_storage__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_acta_digital_acta_digital__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_historial_servicios_historial_servicios__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_onesignal__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_modal_modal__ = __webpack_require__(361);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_google_maps__ = __webpack_require__(700);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__angular_common_http__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__providers_api_api__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_detalle_detalle__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__providers_data_base_data_base__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__providers_network_network__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_native_sqlite__ = __webpack_require__(367);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

































var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_25__pages_modal_modal__["a" /* ModalPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_10__directives_parallax_parallax__["a" /* ParallaxDirective */],
            __WEBPACK_IMPORTED_MODULE_0__pages_add_customer_add_customer__["a" /* AddCustomerPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_form_probabilidad_form_probabilidad__["a" /* FormProbabilidadPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_prospecto_prospecto__["a" /* ProspectoPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_servicio_servicio__["a" /* ServicioPage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_acta_digital_acta_digital__["a" /* ActaDigitalPage */],
            __WEBPACK_IMPORTED_MODULE_23__pages_historial_servicios_historial_servicios__["a" /* HistorialServiciosPage */],
            __WEBPACK_IMPORTED_MODULE_29__pages_detalle_detalle__["a" /* DetallePage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["g" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */], {}, {
                links: []
            }),
            __WEBPACK_IMPORTED_MODULE_21__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_27__angular_common_http__["b" /* HttpClientModule */],
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["e" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_3__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_25__pages_modal_modal__["a" /* ModalPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_0__pages_add_customer_add_customer__["a" /* AddCustomerPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_form_probabilidad_form_probabilidad__["a" /* FormProbabilidadPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_prospecto_prospecto__["a" /* ProspectoPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_servicio_servicio__["a" /* ServicioPage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_acta_digital_acta_digital__["a" /* ActaDigitalPage */],
            __WEBPACK_IMPORTED_MODULE_23__pages_historial_servicios_historial_servicios__["a" /* HistorialServiciosPage */],
            __WEBPACK_IMPORTED_MODULE_29__pages_detalle_detalle__["a" /* DetallePage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_13__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_9__services_odoojsonrpc__["a" /* OdooJsonRpc */],
            { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["f" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_20__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_18__ionic_native_file_chooser__["a" /* FileChooser */],
            __WEBPACK_IMPORTED_MODULE_19__ionic_native_file_transfer__["a" /* FileTransfer */],
            __WEBPACK_IMPORTED_MODULE_19__ionic_native_file_transfer__["b" /* FileTransferObject */],
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_24__ionic_native_onesignal__["a" /* OneSignal */],
            __WEBPACK_IMPORTED_MODULE_26__ionic_native_google_maps__["a" /* GoogleMaps */],
            __WEBPACK_IMPORTED_MODULE_28__providers_api_api__["a" /* ApiProvider */],
            __WEBPACK_IMPORTED_MODULE_30__providers_data_base_data_base__["a" /* DataBaseProvider */],
            __WEBPACK_IMPORTED_MODULE_31__providers_network_network__["a" /* NetworkProvider */],
            __WEBPACK_IMPORTED_MODULE_32__ionic_native_sqlite__["a" /* SQLite */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 43:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utils; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(18);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Utils = (function () {
    function Utils(alrtCtrl, loadingCtrl, toastCtrl, actionSheetCtrl) {
        this.alrtCtrl = alrtCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
    }
    Utils.prototype.presentAlert = function (title, message, buttons, subtitle, enableBackdropDismiss, inputs) {
        var alrt = this.alrtCtrl.create({
            title: title,
            subTitle: subtitle,
            message: message,
            buttons: buttons,
            enableBackdropDismiss: enableBackdropDismiss,
            inputs: inputs
        });
        alrt.present();
    };
    Utils.prototype.presentToast = function (message, duration, dissmissOnPageChange, position, showCloseButton, closeButtonText) {
        var toast = this.toastCtrl.create({
            message: message,
            position: position,
            dismissOnPageChange: dissmissOnPageChange,
            duration: duration,
            showCloseButton: showCloseButton,
            closeButtonText: closeButtonText
        });
        toast.present();
    };
    Utils.prototype.presentLoading = function (content, duration, dissmissOnPageChange, enableBackDropDismiss, showBackDrop, spinner) {
        this.loading = this.loadingCtrl.create({
            content: content,
            dismissOnPageChange: dissmissOnPageChange,
            duration: duration,
            enableBackdropDismiss: enableBackDropDismiss,
            showBackdrop: showBackDrop,
            spinner: spinner
        });
        this.loading.present();
    };
    Utils.prototype.dismissLoading = function () {
        this.loading.dismiss();
    };
    Utils.prototype.presentActionSheet = function (buttons, title, subtitle, enableBackdropDismiss) {
        var actionCtrl = this.actionSheetCtrl.create({
            buttons: buttons,
            subTitle: subtitle,
            title: title,
            enableBackdropDismiss: enableBackdropDismiss
        });
        actionCtrl.present();
    };
    return Utils;
}());
Utils = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
], Utils);

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__form_probabilidad_form_probabilidad__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_utils__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__detalle_detalle__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__profile_profile__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_onesignal__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__acta_digital_acta_digital__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var HomePage = (function () {
    function HomePage(navCtrl, odooRpc, alertCtrl, network, alert, utils, loadingCtrl, oneSignal, menu) {
        this.navCtrl = navCtrl;
        this.odooRpc = odooRpc;
        this.alertCtrl = alertCtrl;
        this.network = network;
        this.alert = alert;
        this.utils = utils;
        this.loadingCtrl = loadingCtrl;
        this.oneSignal = oneSignal;
        this.menu = menu;
        this.listaOportunidades = [];
        this.oportunidades = [];
        this.listaServicios = [];
        this.servicios = [];
        this.tableOportunidades = "crm.lead";
        // private tableServicios = "project.issue";
        this.tableServicios = "project.task";
        // private tableServicios = "mantenimientos";
        this.homeComercial = false;
        this.homeMantemimiento = false;
    }
    // splash = true;
    HomePage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.listaOportunidades = [];
        this.listaServicios = [];
        setTimeout(function () {
            _this.display();
            refresher.complete();
        }, 1000);
    };
    HomePage.prototype.ionViewDidLoad = function () {
        var loading = this.loadingCtrl.create({
            content: "Estamos preparando todo..."
        });
        loading.present();
        this.listaOportunidades = [];
        this.listaServicios = [];
        /*Trae los servicios de mantenimiento o las oportunidades creadas; todo esto segun el rol*/
        this.logiData = JSON.parse(localStorage.getItem('token'));
        //Consultamos los permisos o interfase para el usuario logeado
        // this.permisos();
        this.display();
        //Validacion para cargar causas de rol mantenimiento
        if (JSON.parse(localStorage.getItem('token'))['technician']) {
            this.get_causas();
        }
        loading.dismiss();
    };
    HomePage.prototype.display = function () {
        var _this = this;
        var table = '';
        var domain = [];
        var filter = [];
        //Validacion para cargar causas de rol mantenimiento
        if (JSON.parse(localStorage.getItem('token'))['salesman']) {
            domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
            table = this.tableOportunidades;
            this.homeComercial = true;
            this.homeMantemimiento = false;
            this.menu.enable(true, 'salesman');
        }
        else {
            // domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']]];
            domain = [["user_id", "=", JSON.parse(localStorage.getItem('token'))['uid']], ['finished', '!=', 'true']];
            table = this.tableServicios;
            filter = [];
            this.homeComercial = false;
            this.homeMantemimiento = true;
            this.menu.enable(true, 'technician');
        }
        this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then(function (query) {
            _this.fillParners(query);
        });
    };
    HomePage.prototype.fillParners = function (data) {
        var json = JSON.parse(data._body);
        if (!json.error) {
            var query = json["result"].records;
            for (var i in query) {
                //Validacion para cargar causas de rol mantenimiento
                if (JSON.parse(localStorage.getItem('token'))['salesman']) {
                    this.listaOportunidades.push({
                        id: query[i].id,
                        probability: query[i].probability == false ? "N/A" : query[i].probability,
                        name: query[i].name == false ? "N/A" : query[i].name,
                        partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_name,
                        colorDanger: query[i].probability < 30 ? true : false,
                        colorwarning: query[i].probability >= 30 && query[i].probability < 70 ? true : false,
                        colorSuccess: query[i].probability >= 70 ? true : false,
                    });
                }
                else {
                    this.listaServicios.push({
                        id: query[i].id,
                        issue_id: query[i].issue_id,
                        name: query[i].name == false ? "N/A" : query[i].name,
                        categs_ids: query[i].categs_ids == false ? "N/A" : query[i].categs_ids,
                        request_type: query[i].request_type == false ? "N/A" : query[i].request_type,
                        city_id: query[i].city_id == false ? "N/A" : query[i].city_id,
                        request_source: query[i].request_source == false ? "N/A" : query[i].request_source,
                        branch_type: query[i].location_type_id == false ? "N/A" : query[i].location_type_id,
                        partner_id: query[i].partner_id == false ? "N/A" : query[i].partner_id,
                        location_id: query[i].location_id == false ? "N/A" : query[i].location_id,
                        contact_id: query[i].contact_id == false ? "N/A" : query[i].contact_id,
                        user_id: query[i].user_id == false ? "N/A" : query[i].user_id,
                        date_start: query[i].date_start == false ? "N/A" : query[i].date_start,
                        date_finish: query[i].date_finish == false ? "N/A" : query[i].date_finish,
                        description: query[i].issue_description == false ? "N/A" : query[i].issue_description,
                        priority: query[i].priority == false ? "N/A" : query[i].priority,
                        sec: query[i].issue_sec == false ? "N/A" : query[i].issue_sec,
                        number_sap: query[i].number_sap == false ? "N/A" : query[i].number_sap
                    });
                }
            }
        }
    };
    HomePage.prototype.view = function (idx) {
        var params = {};
        //Validacion para cargar causas de rol mantenimiento
        if (this.logiData.salesman) {
            params['id'] = this.listaOportunidades[idx].id;
        }
        else if (this.logiData.technician) {
            params['id'] = this.listaServicios[idx].id;
        }
        else {
            console.log('NO ESTA DEFINIDO EL ROL');
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__detalle_detalle__["a" /* DetallePage */], params);
    };
    HomePage.prototype.initializeItems = function () {
        this.listaOportunidades = this.oportunidades;
    };
    HomePage.prototype.getItems = function (searchbar) {
        // Reset items back to all of the items
        this.initializeItems();
        // set q to the value of the searchbar
        var q = searchbar.srcElement.value;
        // if the value is an empty string don't filter the items
        if (!q) {
            return;
        }
        this.listaOportunidades = this.listaOportunidades.filter(function (v) {
            if (v.name && q) {
                if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            }
        });
    };
    HomePage.prototype.delete = function (idx) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: '¡Atención!',
            message: '¿Esta seguro de Eliminar el Registro?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: function () {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Confirmar',
                    handler: function () {
                        _this.odooRpc.updateRecord(_this.tableOportunidades, _this.listaOportunidades[idx].id, { active: false });
                        _this.utils.presentToast(_this.listaOportunidades[idx].name + " se Elimino con Exito", 5000, true, "top");
                        _this.listaOportunidades.splice(idx, 1);
                    }
                }
            ]
        });
        confirm.present();
    };
    HomePage.prototype.viewProfile = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__profile_profile__["a" /* ProfilePage */]);
    };
    HomePage.prototype.FormProbabilidad = function (tipo, idx) {
        if (idx === void 0) { idx = ""; }
        var params = {
            tipo: tipo
        };
        if (idx !== "") {
            params['id'] = this.listaOportunidades[idx].id;
        }
        else {
            params['id'] = "";
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__form_probabilidad_form_probabilidad__["a" /* FormProbabilidadPage */], params);
    };
    HomePage.prototype.cancelarCita = function (servicio) {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('Motivos de Cita Cancelada');
        for (var _i = 0, _a = this.list_cause; _i < _a.length; _i++) {
            var cause = _a[_i];
            if (cause.assignment_status == 'cancel') {
                alert.addInput({
                    type: 'radio',
                    label: cause.name,
                    value: cause.id,
                    checked: false
                });
            }
        }
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: function (data) {
                _this.get_description(data);
                var alerta = _this.alertCtrl.create();
                alerta.setTitle('Descripción de Cita Cancelada');
                for (var _i = 0, _a = _this.list_description; _i < _a.length; _i++) {
                    var desc = _a[_i];
                    alerta.addInput({
                        type: 'radio',
                        label: desc.name,
                        value: desc.id,
                        checked: false
                    });
                }
                alerta.addButton('Cancel');
                alerta.addButton({
                    text: 'OK',
                    handler: function (dataDesc) {
                        _this.generateActaDigital('cancel', data, dataDesc, servicio);
                    }
                });
                alerta.present();
            }
        });
        alert.present();
    };
    HomePage.prototype.citaFallida = function (servicio) {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('Motivos de Cita Fallida');
        for (var _i = 0, _a = this.list_cause; _i < _a.length; _i++) {
            var cause = _a[_i];
            if (cause.assignment_status == 'fail') {
                alert.addInput({
                    type: 'radio',
                    label: cause.name,
                    value: cause.id,
                    checked: false
                });
            }
        }
        alert.addButton('Cancelar');
        alert.addButton({
            text: 'OK',
            handler: function (data) {
                _this.get_description(data);
                var alerta = _this.alertCtrl.create();
                alerta.setTitle('Descripción de Cita Fallida');
                for (var _i = 0, _a = _this.list_description; _i < _a.length; _i++) {
                    var desc = _a[_i];
                    alerta.addInput({
                        type: 'radio',
                        label: desc.name,
                        value: desc.id,
                        checked: false
                    });
                }
                alerta.addButton('Cancelar');
                alerta.addButton({
                    text: 'OK',
                    handler: function (dataDesc) {
                        _this.generateActaDigital('fail', data, dataDesc, servicio);
                    }
                });
                alerta.present();
            }
        });
        alert.present();
    };
    HomePage.prototype.get_causas = function () {
        var _this = this;
        var table = 'project.task.fail.cause';
        var domain = [];
        var filter = [];
        this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then(function (query) {
            var json = JSON.parse(query._body);
            if (!json.error) {
                _this.list_cause = json["result"].records;
            }
        });
    };
    HomePage.prototype.get_description = function (cause) {
        var _this = this;
        var table = 'project.task.fail.description';
        var domain = [['fail_cause_id', '=', cause]];
        var filter = [];
        this.odooRpc.searchRead(table, domain, filter, 0, 0, "").then(function (query) {
            var json = JSON.parse(query._body);
            if (!json.error) {
                _this.list_description = json["result"].records;
            }
        });
    };
    HomePage.prototype.generateActaDigital = function (motivo, causa, detalleCausa, servicio) {
        var infoCausa = [];
        var infoDetalleCausa = [];
        for (var i = 0; i < this.list_cause.length; i++) {
            if (this.list_cause[i].id == causa) {
                infoCausa[0] = this.list_cause[i].id;
                infoCausa[1] = this.list_cause[i].name;
            }
        }
        for (var j = 0; j < this.list_description.length; j++) {
            if (this.list_description[j].id == detalleCausa) {
                infoDetalleCausa[0] = this.list_description[j].id;
                infoDetalleCausa[1] = this.list_description[j].name;
            }
        }
        var data = {
            fail_cause_id: infoCausa,
            assignment_status: motivo,
            fail_description_id: infoDetalleCausa,
            finished: 'true',
            kanban_state: 'blocked'
        };
        var params = [];
        params['dataMantenimiento'] = this.listaServicios[servicio];
        params['data'] = data;
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__acta_digital_acta_digital__["a" /* ActaDigitalPage */], params);
    };
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["n" /* Component */])({
        selector: "page-home",template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\home\home.html"*/'<ion-header *ngIf="homeComercial">\n\n  <ion-toolbar color="secondary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      Oportunidades\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (click)="viewProfile()">\n\n        <ion-icon name="person"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n\n\n<ion-header *ngIf="homeMantemimiento">\n\n  <ion-toolbar color="primary">\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      Mantenimientos\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only (click)="viewProfile()">\n\n        <ion-icon name="person"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n\n    <ion-refresher-content></ion-refresher-content>\n\n  </ion-refresher>\n\n  <!-- <button ion-button secondary menuToggle>Toggle Menu</button> -->\n\n  <ion-list *ngIf="homeComercial" no-lines [virtualScroll]="listaOportunidades">\n\n    <ion-item-sliding *virtualItem="let item; let i = index">\n\n      <ion-item (click)="view(i)">\n\n        <h1>{{item.name}}</h1>\n\n        <p>{{item.partner_id}}</p>\n\n        <h2 *ngIf="item.colorDanger">\n\n          <p style="color:#F44336;">{{item.probability}}%</p>\n\n        </h2>\n\n        <h2 *ngIf="item.colorwarning">\n\n          <p style="color: #FF9800;">{{item.probability}}%</p>\n\n        </h2>\n\n        <h2 *ngIf="item.colorSuccess">\n\n          <p style="color:#4CAF50;">{{item.probability}}%</p>\n\n        </h2>\n\n      </ion-item>\n\n      <ion-item-options>\n\n        <button ion-button color="primary" (click)="FormProbabilidad(\'update\',i)">\n\n          Actualizar\n\n        </button>\n\n        <button ion-button color="danger" (click)="delete(i)">\n\n          Eliminar\n\n        </button>\n\n      </ion-item-options>\n\n    </ion-item-sliding>\n\n  </ion-list>\n\n\n\n\n\n  <ion-list *ngIf="homeMantemimiento" no-lines [virtualScroll]="listaServicios">\n\n    <ion-item-sliding *virtualItem="let item; let i = index">\n\n      <ion-item (click)="view(i)">\n\n        <h1>{{item.name}}</h1>\n\n        <p>{{item.partner_id[1]}}</p>\n\n        <p style="color:grey"><strong>{{item.sec}}</strong></p>\n\n        <p style="color:grey"><strong>Número SAP: </strong>{{item.number_sap}}</p>\n\n        <p style="color:grey"><strong>{{item.city_id}}<br>{{item.location_id}}|{{item.branch_type}}</strong></p>\n\n      </ion-item>\n\n      <ion-item-options>\n\n        <button ion-button color="danger" (click)="citaFallida(i)">\n\n          Cita Fallida\n\n        </button>\n\n        <!-- <button ion-button color="danger" (click)="cancelarCita(i)">\n\n          Cita Cancelada\n\n        </button> -->\n\n      </ion-item-options>\n\n    </ion-item-sliding>\n\n  </ion-list>\n\n\n\n  \n\n    <button *ngIf="homeComercial" ion-fab color="secondary" (click)="FormProbabilidad(\'create\')">\n\n      <ion-icon name="md-add"></ion-icon>\n\n    </button>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1__services_utils__["a" /* Utils */], __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["i" /* MenuController */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 697:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_home_home__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pages_login_login__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_utils__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_historial_servicios_historial_servicios__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_data_base_data_base__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__providers_network_network__ = __webpack_require__(166);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, odooRpc, alert, network, menu, events, database, proNet) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.odooRpc = odooRpc;
        this.alert = alert;
        this.network = network;
        this.menu = menu;
        this.events = events;
        this.database = database;
        this.proNet = proNet;
        this.homeComercial = false;
        this.homeMantenimiento = false;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_1__pages_login_login__["a" /* LoginPage */];
        this.getNetwork();
        this.initLogin();
        this.pagesTechnician = [
            { title: 'Perfil', component: __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["a" /* ProfilePage */], icon: 'contact' },
            { title: 'Mantenimientos', component: __WEBPACK_IMPORTED_MODULE_0__pages_home_home__["a" /* HomePage */], icon: 'stats' },
            { title: 'Historial de Servicios', component: __WEBPACK_IMPORTED_MODULE_10__pages_historial_servicios_historial_servicios__["a" /* HistorialServiciosPage */], icon: 'time' }
        ];
        this.pagesSalesman = [
            { title: 'Perfil', component: __WEBPACK_IMPORTED_MODULE_9__pages_profile_profile__["a" /* ProfilePage */], icon: 'contact' },
            { title: 'Oportunidades', component: __WEBPACK_IMPORTED_MODULE_0__pages_home_home__["a" /* HomePage */], icon: 'stats' }
        ];
    }
    ;
    MyApp.prototype.openPage = function (page) {
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.initLogin = function () {
        var _this = this;
        if (localStorage.getItem("token")) {
            var response = window.localStorage.getItem("token");
            var jsonData = JSON.parse(response);
            var username = jsonData["username"];
            var pass = jsonData["password"];
            var url_1 = (jsonData["web.base.url"]) ? jsonData["web.base.url"] : "https://erp.allser.com.co";
            var db = jsonData["db"];
            this.odooRpc.init({
                odoo_server: url_1,
                http_auth: "username:password"
            });
            this.odooRpc.login(db, username, pass).catch(function (error) {
                var alrt = _this.alert.create({
                    title: "Server Status",
                    message: "La conexión a  " + url_1 + " fue rechazada!!",
                    buttons: ["Ok"]
                });
                alrt.present();
            });
            this.rootPage = __WEBPACK_IMPORTED_MODULE_0__pages_home_home__["a" /* HomePage */];
        }
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            // let status bar overlay webview
            _this.statusBar.overlaysWebView(false);
            // set status bar to white
            _this.statusBar.backgroundColorByHexString("#00FFFFFF");
        });
    };
    MyApp.prototype.getNetwork = function () {
        this.proNet.validarConexion(this.initializeApp(), function () { console.log('Función de desconexión'); });
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["k" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["k" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\app\app.html"*/'<ion-menu [content]="content" side="start" id="salesman">\n\n  <ion-header>\n\n    <ion-toolbar color="secondary">\n\n      <ion-title>Menú</ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n  <ion-content>\n\n    <ion-list>\n\n      <button menuClose ion-item *ngFor="let p of pagesSalesman" (click)="openPage(p)">\n\n        <ion-label stacked icon-start>\n\n          <h2>\n\n            <ion-icon [name]="p.icon" item-left></ion-icon>{{p.title}}\n\n          </h2>\n\n        </ion-label>\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n</ion-menu>\n\n\n\n<ion-menu [content]="content" side="start" id="technician">\n\n  <ion-header>\n\n    <ion-toolbar color="primary">\n\n      <ion-title>Menú</ion-title>\n\n    </ion-toolbar>\n\n  </ion-header>\n\n  <ion-content>\n\n    <ion-list>\n\n      <button menuClose ion-item *ngFor="let q of pagesTechnician" (click)="openPage(q)">\n\n        <ion-label stacked icon-start>\n\n          <h2>\n\n            <ion-icon [name]="q.icon" item-left></ion-icon>{{q.title}}\n\n          </h2>\n\n        </ion-label>\n\n      </button>\n\n    </ion-list>\n\n  </ion-content>\n\n</ion-menu>\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\app\app.html"*/,
        providers: [__WEBPACK_IMPORTED_MODULE_2__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_8__services_utils__["a" /* Utils */]]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["n" /* Platform */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_2__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__["a" /* Network */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["i" /* MenuController */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* Events */], __WEBPACK_IMPORTED_MODULE_11__providers_data_base_data_base__["a" /* DataBaseProvider */], __WEBPACK_IMPORTED_MODULE_12__providers_network_network__["a" /* NetworkProvider */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 698:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ParallaxDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ParallaxDirective = (function () {
    function ParallaxDirective(el, re) {
        this.el = el;
        this.re = re;
    }
    ParallaxDirective.prototype.ngOnInit = function () {
        var cnt = this.el.nativeElement.getElementsByClassName('scroll-content')[0];
        this.header = cnt.getElementsByClassName('bg-image')[0];
        this.main_cnt = cnt.getElementsByClassName('main-cnt')[0];
        this.re.setElementStyle(this.header, 'webTransformOrigin', 'center bottom');
        this.re.setElementStyle(this.header, 'background-size', 'cover');
        this.re.setElementStyle(this.main_cnt, 'position', 'absolute');
    };
    ParallaxDirective.prototype.onCntScroll = function (ev) {
        var _this = this;
        ev.domWrite(function () {
            _this.update(ev);
        });
    };
    ParallaxDirective.prototype.update = function (ev) {
        if (ev.scrollTop > 0) {
            this.ta = ev.scrollTop / 2;
        }
        this.re.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,' + this.ta + 'px,0) scale(1,1)');
    };
    return ParallaxDirective;
}());
ParallaxDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* Directive */])({
        selector: '[parallax]',
        host: {
            '(ionScroll)': 'onCntScroll($event)'
        }
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer */]])
], ParallaxDirective);

//# sourceMappingURL=parallax.js.map

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddCustomerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_utils__ = __webpack_require__(43);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AddCustomerPage = (function () {
    function AddCustomerPage(navCtrl, navParams, odooRpc, utils, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.odooRpc = odooRpc;
        this.utils = utils;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.homeComercial = false;
        this.homeMantenimiento = false;
        this.getCity();
        if (JSON.parse(localStorage.getItem('token'))['salesman']) {
            this.homeComercial = true;
            this.homeMantenimiento = false;
        }
        else {
            this.homeComercial = false;
            this.homeMantenimiento = true;
        }
    }
    AddCustomerPage.prototype.saveData = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Confirmación de crear cliente',
            message: '¿Esta seguro que quiere crear un cliente nuevo?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Si',
                    handler: function () {
                        _this.saveCustomer();
                    }
                }
            ]
        });
        alert.present();
    };
    AddCustomerPage.prototype.saveCustomer = function () {
        var _this = this;
        var city = [];
        for (var i = 0; i < this.listCity.length; i++) {
            if (this.listCity[i]['code'] == this.state_id) {
                city = this.listCity[i];
            }
        }
        var model = "res.partner";
        var params = {
            name: this.firstname + ' ' + this.lastname,
            company_type: this.company_type,
            phone: this.phone,
            mobile: this.mobile,
            email: this.email,
            vat_type: this.vat_type,
            vat_vd: this.vat_vd,
            street: this.street,
            city: (city['code']) ? city['code'] : '',
            state_id: (city['code']) ? city['code'] : '',
            country_id: 50,
            customer: true,
            supplier: false,
            parent_id: this.parent_id,
            write_uid: JSON.parse(localStorage.getItem('token'))['uid'],
            create_uid: JSON.parse(localStorage.getItem('token'))['uid'],
            type: "contact"
        };
        this.odooRpc.createRecord(model, params).then(function (res) {
            _this.utils.presentToast("Creacion Exitosa", 1000, false, 'top');
            _this.navCtrl.pop();
        }).catch(function (err) {
            alert(err);
        });
    };
    AddCustomerPage.prototype.getCity = function () {
        var _this = this;
        var tableCity = "res.country.state";
        this.odooRpc.searchRead(tableCity, [["country_id", "=", 50]], [], 0, 0, "").then(function (city) {
            var json = JSON.parse(city._body);
            if (!json.error) {
                _this.listCity = json["result"].records;
            }
        });
    };
    AddCustomerPage.prototype.getClientes = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: "Por Favor Espere..."
        });
        loading.present();
        var table_cliente = "res.partner";
        var domain = [["active", "=", "t"], ["parent_id", "=", null]];
        this.odooRpc.searchRead(table_cliente, domain, [], 0, 0, "").then(function (partner) {
            var json = JSON.parse(partner._body);
            if (!json.error) {
                _this.listaClientes = json["result"].records;
                loading.dismiss();
            }
        });
    };
    return AddCustomerPage;
}());
AddCustomerPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
        selector: 'page-add-customer',template:/*ion-inline-start:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\add-customer\add-customer.html"*/'<ion-header>\n\n  <ion-navbar *ngIf="homeComercial" color="secondary">\n\n    <ion-title>Agregar Cliente</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button clear (click)="saveData()">\n\n        Guardar Cliente\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n  <ion-navbar *ngIf="homeMantenimiento" color="primary">\n\n    <ion-title>Agregar Cliente</ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button clear (click)="saveData()">\n\n        Guardar Cliente\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n\n\n  <ion-list no-lines>\n\n\n\n    <ion-list radio-group [(ngModel)]="company_type">\n\n      <ion-list-header>\n\n        Tipo Cliente\n\n      </ion-list-header>\n\n      <ion-item>\n\n        <ion-label>Natural</ion-label>\n\n        <ion-radio value="person"></ion-radio>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Jurdica</ion-label>\n\n        <ion-radio value="company"></ion-radio>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label stacked>Cliente Principal</ion-label>\n\n        <ion-select [(ngModel)]="parent_id" #cli id="cli">\n\n          <ion-option value=""></ion-option>\n\n          <ion-option *ngFor="let i of listaClientes" value="{{i.id}}">{{i.name}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n    </ion-list>\n\n    <ion-item>\n\n      <ion-label floating>Nombre</ion-label>\n\n      <ion-input type="text" [(ngModel)]="firstname" name="firstname"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Apellido</ion-label>\n\n      <ion-input type="text" [(ngModel)]="lastname" name="lastname"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label staced>Tipo Identificación</ion-label>\n\n      <ion-select [(ngModel)]="vat_type">\n\n        <ion-option value="13">Cédula Ciudadania</ion-option>\n\n        <ion-option value="22">Cédula Extranjeria</ion-option>\n\n        <ion-option value="31">NIT/RUT</ion-option>\n\n        <ion-option value="41">Pasaporte</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Identificación</ion-label>\n\n      <ion-input type="text" [(ngModel)]="vat_vd" name="vat_vd"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Dirección</ion-label>\n\n      <ion-input type="text" [(ngModel)]="street" name="street"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Ciudad</ion-label>\n\n      <ion-select [(ngModel)]="state_id">\n\n        <ion-option *ngFor="let city of listCity" value="{{city.code}}">{{city.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Teléfono</ion-label>\n\n      <ion-input type="number" [(ngModel)]="phone" name="phone"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Móvil</ion-label>\n\n      <ion-input type="number" [(ngModel)]="mobile" name="mobile"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>Correo</ion-label>\n\n      <ion-input type="email" [(ngModel)]="email" name="email"></ion-input>\n\n    </ion-item>\n\n\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\xampp\htdocs\odoo-jsonrpc-ionic\Odoo-JsonRpc-with-ionic3.x-master\src\pages\add-customer\add-customer.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_0__services_odoojsonrpc__["a" /* OdooJsonRpc */], __WEBPACK_IMPORTED_MODULE_3__services_utils__["a" /* Utils */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* LoadingController */]])
], AddCustomerPage);

//# sourceMappingURL=add-customer.js.map

/***/ })

},[368]);
//# sourceMappingURL=main.js.map