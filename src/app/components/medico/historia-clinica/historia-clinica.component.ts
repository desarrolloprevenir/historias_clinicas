import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import * as jsPDF from 'jspdf';
import { AppService } from '../../../services/app.service';
import { MedicoService } from 'src/app/services/medico.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('contentRemision', { static: false }) contentRemision: ElementRef;
  @ViewChild('contentDiagnostico', { static: false }) contentDiagnostico: ElementRef;
  @ViewChild('contentObservaciones', { static: false }) contentObservaciones: ElementRef;


  public mymodel;
  public tituloModal;
  public estadoModal;
  public estadoModalAtras;
  public datosUsuario: FormGroup;
  public datosOptometria: FormGroup;
  public loading;
  public departamentos;
  public municipios;
  public status;
  public statusText;
  public edad = null;
  public today;
  public parentescos;
  public tipoDocumento;
  public estadoCivil;
  public infoUser;
  public infoUserFb;
  public infoHcFb;
  public idUsuario;
  public infoHc;
  public infoHistoriaClinica;
  public infoHistoriaGeneral;
  public idServicio;
  public res;
  public imagen;
  public generos;
  public idCategoria;
  public modal;

  constructor(private formBuilder: FormBuilder,
              private aplicationService: AppService,
              private route: ActivatedRoute,
              private medicoService: MedicoService,
              private userService: UserService,
              location: PlatformLocation) {
                this.mymodel = 'informacion';
                this.tituloModal = 'Datos del usuario';
                this.estadoModal = 'datos';
                this.estadoModalAtras = 'cerrar';
                this.today = moment(new Date().toISOString()).format('DD-MM-YYYY');

                location.onPopState(() => {
                document.getElementById('cerrar-modal-hc').click();
                document.getElementById('btn-cerrar-moda-ver-hc').click();
                });


    // console.log(this.today);

    // setInterval(() => {
    //   this.oe();
    //   }, 5000);
               }

  ngOnInit() {
    this.getDepartamentos();
    this.getParentescos();
    this.tpDocumento();
    this.loadPage();
  }

  loadPage() {
    this.route.params.subscribe(params => {
      this.idUsuario = params['id'];
      this.idServicio = params['id_servicio'];
      this.idCategoria = params['idCategoria'];
      // console.log(id);
      this.getUser(this.idUsuario);
      this.getHistoriasClinicas(this.idUsuario, this.idServicio);
      // this.getActiveHist(this.id_servicio);
    });
  }

  getActiveHist(idServicio) {
    this.medicoService.getActiveHist(idServicio).subscribe( (response) => {
      // console.log(response);
    }, () => {
      // console.log(err);
    } );
  }

  getHistoriasClinicas(idUsuario, idServicio) {
      this.getHistoriasClinicasGeneral(idUsuario, idServicio);
    }

  getHistoriasClinicasGeneral(idUsuario, idServicio) {
    this.loading = true;
    this.medicoService.getHistoriaClinicaGeneral(idUsuario, idServicio).subscribe( (response) => {
      this.loading = false;
      console.log('historia clinica general', response);
      this.infoHc = response;
    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
    } );

  }

  getHistoriaGeneral2(idHistoriaCl) {
    this.loading = true;
    this.medicoService.getHistoriaGeneral2(idHistoriaCl).subscribe( (response) => {
      this.loading = false;
      this.infoHc = response;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
    });
  }

  getHistoriasClinicasOptometria(idUsuario, idServicio) {
    this.medicoService.getHistoriaClinicaPorServicio(idUsuario, idServicio).subscribe( (response) => {
      // console.log(response);
      this.infoHc = response;
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
      // console.log(err);
    });
  }

  getUser(id) {
    this.loading = true;
    this.aplicationService.getUser(id).subscribe( (response) => {
      // console.log(response);
      this.infoUser = response;
      let user = {nombres : this.infoUser.nombres, avatar: this.infoUser.avatar, cedula: this.infoUser.cedula,
                  fecha_nacimiento: this.infoUser.fecha_nacimiento, id_servicio : this.idServicio, id_usuario: this.infoUser.id };
      localStorage.setItem('user', JSON.stringify(user));
      this.validaciones();
      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
      // console.log(err);
    });
  }


  tpDocumento() {
    this.tipoDocumento = [{tipo : 'CC' , nombre : 'Cédula de Ciudadanía'},
                          {tipo : 'CE' , nombre : 'Cédula de Extranjería'},
                          {tipo : 'PA' , nombre : 'Pasaporte'},
                          {tipo : 'RC' , nombre : 'Registro Civil'},
                          {tipo : 'TI' , nombre : 'Tarjeta de Identidad'}];

    this.estadoCivil = [{tipo : 'Solter@' , nombre : 'Solter@'},
                        {tipo : 'Comprometid@' , nombre : 'Comprometid@'},
                        {tipo : 'Casad@' , nombre : 'Casad@'},
                        {tipo : 'Union libre' , nombre : 'Union libre'},
                        {tipo : 'Separad@' , nombre : 'Separad@'},
                        {tipo : 'Divorciad@' , nombre : 'Divorciad@'},
                        {tipo : 'Viud@' , nombre : 'Viud@'},
                        {tipo : 'Noviazgo' , nombre : 'Noviazgo'}];

    this.generos = [{tipo : 'Masculino' , nombre : 'Masculino'},
                        {tipo : 'Femenino' , nombre : 'Femenino'},
                        {tipo : 'Otro' , nombre : 'Otro'}];
  }

  pestana(tipo) {
    this.mymodel = tipo;
  }

  modalHistoriaClinica(tipo) {
    let bol = true;

    switch (bol === true) {
      case tipo === 'datos' :
        this.tituloModal = 'Anamnesis';
        this.estadoModal = 'anamnesis';
        this.estadoModalAtras = 'vacio';
        this.formUsuario();
        break;

      case tipo === 'anamnesis' :
          this.tituloModal = 'Optometría';
          this.estadoModal = 'optometria';
          this.estadoModalAtras = 'vacio';
          break;

      case tipo === 'optometria':
          this.estadoModal = 'optometria2';
          this.estadoModalAtras = 'vacio';
          break;

    }

  }

  validaciones() {

    this.edad = this.infoUser.edad;
    // console.log(this.infoUser);
    this.getMunicipios(this.infoUser.id_departamento);

    this.datosUsuario = this.formBuilder.group({

      nombresYapellidos : [this.infoUser.nombres, [Validators.required, Validators.pattern('[a-z A-z ñ]*')]],
      tipoDocumento : [this.infoUser.tipoDocumento, [Validators.required]],
      // tipoDocumentoStr : [this.infoUser.tipoDocumento, [Validators.required]],
      numeroDocumento : [this.infoUser.cedula, [Validators.required, Validators.pattern('[0-9]*'),
                                                Validators.minLength(7), Validators.maxLength(15)]],
      estadoCivil : [this.infoUser.estadoCivil, [Validators.required]],
      // estadoCivilStr : [this.infoUser.estadoCivil, [Validators.required]],
      edad : [''],
      fechaNacimiento : [this.infoUser.fecha_nacimiento, [Validators.required]],
      // fechaNacimientoStr : ['', [Validators.required]],
      departamento : [this.infoUser.id_departamento, [Validators.required]],
      // departamentoStr : [this.infoUser.nomDepa, [Validators.required]],
      municipio : [this.infoUser.id_municipio, [Validators.required]],
      // municipioStr : [this.infoUser.nomMuni, [Validators.required]],
      ocupacion : [this.infoUser.ocupacion, [Validators.required, Validators.pattern('[a-z A-z ñ]*')]],
      direccion : [this.infoUser.direccion , [Validators.required]],
      barrio : [this.infoUser.barrio, [Validators.required]],
      telefono : [this.infoUser.telefono, [Validators.required, Validators.pattern('[0-9]*')]],
      eps : [this.infoUser.eps,],
      acompanante : [this.infoUser.acompanante, Validators.pattern('[a-z A-z ñ]*')],
      parentesco : [this.infoUser.pareentesco, ],
      // parentescoStr : ['', ],
      genero : [this.infoUser.genero, ],
      telefonoAcompanante : [this.infoUser.telefonoAcompanante, [Validators.pattern('[0-9 ]*')]]

    });


    this.datosOptometria = this.formBuilder.group({

      tipoConsulta : ['', [Validators.required]],
      motivoConsulta : ['', [Validators.required]],
      antecedentes : ['', [Validators.required]],
      lensometriaOd : ['', [Validators.required]],
      lensometriaOi : ['', [Validators.required]],
      agudezaVisualOd : ['', [Validators.required]],
      agudezaVisualOi : ['', [Validators.required]],
      visionLejanaOd : ['', [Validators.required]],
      visionLejanaOi : ['', [Validators.required]],
      visionCercanaOd : ['', [Validators.required]],
      visionCercanaOi : ['', [Validators.required]],
      adicion : ['', [Validators.required]],
      tipoLente : ['', [Validators.required]],
      examenExternoOd : ['', [Validators.required]],
      examenExternoOi : ['', [Validators.required]],
      oftalmologiaOd : ['', [Validators.required]],
      oftalmologiaOi : ['', [Validators.required]],
      examenMotorOd : ['', [Validators.required]],
      examenMotorOi : ['', [Validators.required]],
      queratometriaOd : ['', [Validators.required]],
      queratometriaOi : ['', [Validators.required]],
      refracionOd : ['', [Validators.required]],
      refracionOi : ['', [Validators.required]],
      formulaFinalOd : ['', [Validators.required]],
      formulaFinalOi : ['', [Validators.required]],
      avvlOd : ['', [Validators.required]],
      avvlOi : ['', [Validators.required]],
      avvpOd : ['', [Validators.required]],
      avvpOi : ['', [Validators.required]],
      adicionOd : ['', [Validators.required]],
      adicionOi : ['', [Validators.required]],
      dnpOd : ['', [Validators.required]],
      dnpOi : ['', [Validators.required]],
      testIshihara : ['', [Validators.required]],
      testEstereopsis : ['', [Validators.required]],
      diagnosticoInicial : ['', [Validators.required]],
      conducta : ['', [Validators.required]],
      medicamentos : ['', [Validators.required]],
      remision : ['', [Validators.required]],
      observaciones : ['', [Validators.required]],
      rips : [''],


      // Datos refracion y formular fina
      // refraccion ojo derecho
      selectOdRefraccion : ['', [Validators.required]],
      esferaRefraccion : ['', [Validators.required]],
      selectRefracion1 : ['', [Validators.required]],
      cilindroRefracion : ['', [Validators.required]],
      selectRefracion2 : ['', [Validators.required]],
      ejeRefracion : ['', [Validators.required]],

      // refraccion ojo izquierdo
      selectOiRefraccion : ['', [Validators.required]],
      esferaRefraccionoi : ['', [Validators.required]],
      selectRefracion1Oi : ['', [Validators.required]],
      cilindroRefracionOi : ['', [Validators.required]],
      selectRefracion2Oi : ['', [Validators.required]],
      ejeRefracionOi : ['', [Validators.required]],


      // Formula final Ojo derecho
      selectOdFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinalOd : ['', [Validators.required]],
      selecFormulaFinal1Od : ['', [Validators.required]],
      cilindrFormulaFinalOd : ['', [Validators.required]],
      selecFormulaFinal2Od : ['', [Validators.required]],
      ejFormulaFinalOd: ['', [Validators.required]],

      // Formula final Ojo Izquierdo
      selectOiFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinalOi : ['', [Validators.required]],
      selecFormulaFinal1Oi : ['', [Validators.required]],
      cilindrFormulaFinalOi : ['', [Validators.required]],
      selecFormulaFinal2Oi : ['', [Validators.required]],
      ejFormulaFinalOi: ['', [Validators.required]],

      // option adicion
      adicionOption : ['', [Validators.required]]

    });
  }

  modalHistoriaClinicaAtras(tipo) {
    let bol = true;

    switch (bol === true) {
      case tipo === 'anamnesis' :
      this.estadoModal = 'datos';
      this.estadoModalAtras = 'cerrar';
      break;

      case tipo === 'optometria' :
      this.estadoModal = 'anamnesis';
      this.estadoModalAtras = 'vacio';
      break;

      case tipo === 'optometria2' :
      this.estadoModal = 'optometria';
      this.estadoModalAtras = 'vacio';
      break;
    }
  }


  getDepartamentos() {
    this.loading = true;

    this.aplicationService.getDepartamento().subscribe( (response) => {
      // console.log(response);
      this.departamentos = response;
      this.loading = false;
    }, (err) => {
      // console.log(err);
      this.loading = false;
    });
  }

  getMunicipios(id) {

    this.loading = true;
    this.aplicationService.getMunicipio(id).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      this.municipios = response;
    }, () => {
      this.loading = false;
      // console.log(err);
    });
  }

  departSelec(ev) {
    // console.log(ev.target.value);
    // console.log(this.datosUsuario.value.departamento);
    this.getMunicipios(this.datosUsuario.value.departamento);
  }

  // prueba() {
  //   console.log(this.datosUsuario.value.fechaNacimiento);
  // }

  calcularEdad() {
    // fecha de nacimiento
    let fecha1 = moment(this.datosUsuario.value.fechaNacimiento);
    // fecha actual
    let fecha2 = moment(this.today);
    let years = fecha2.diff(fecha1, 'years');

    // console.log(years);

    this.edad = years;
  }

  formPrueba() {

    this.loading = true;

    let adicion = '+' + ' ' + this.datosOptometria.value.adicion;
    // console.log('adocion' + adicion);

    // this.datosOptometria.value.selectRefracion1 this.datosOptometria.value.selectRefracion2
    let refraccionOd = this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
     'X' + ' ' + this.datosOptometria.value.ejeRefracion;

    //  this.datosOptometria.value.selectRefracion1Oi this.datosOptometria.value.selectRefracion2Oi
    let refraccionOi = this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejeRefracionOi;

    //  this.datosOptometria.value.selecFormulaFinal1Od this.datosOptometria.value.selecFormulaFinal2Od
    let ffod = this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejFormulaFinalOd;

    //  this.datosOptometria.value.selecFormulaFinal1Oi this.datosOptometria.value.selecFormulaFinal2Oi
    let ffoi = this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi + ' ' +
    'X' + ' ' + this.datosOptometria.value.ejFormulaFinalOi;

    // console.log ('refraccion od ' + refraccionOd);
    // console.log ('refraccion oi ' + refraccionOi);
    // console.log ('ff od ' + ffod);
    // console.log ('ff oi ' + ffoi);

    this.infoHcFb = {motivoConsulta: this.datosOptometria.value.motivoConsulta,
      antecedentes : this.datosOptometria.value.antecedentes, lensometriaOd : this.datosOptometria.value.lensometriaOd,
      lensometriaOi : this.datosOptometria.value.lensometriaOi, agudezaVisualOd : this.datosOptometria.value.agudezaVisualOd,
      agudezaVisualOi : this.datosOptometria.value.agudezaVisualOi, visionLejanaOd : this.datosOptometria.value.visionLejanaOd,
      visionLejanaOi : this.datosOptometria.value.visionLejanaOi, visionCercanaOd : this.datosOptometria.value.visionCercanaOd,
      visionCercanaOi : this.datosOptometria.value.visionCercanaOi, adicion, tipoLente : this.datosOptometria.value.tipoLente,
      examenExternoOd : this.datosOptometria.value.examenExternoOd, examenExternoOi : this.datosOptometria.value.examenExternoOi,
      oftalmologiaOd : this.datosOptometria.value.oftalmologiaOd, oftalmologiaOi : this.datosOptometria.value.oftalmologiaOi,
      examenMotorOd : this.datosOptometria.value.examenMotorOd, examenMotorOi : this.datosOptometria.value.examenMotorOi,
      queratometriaOd : this.datosOptometria.value.queratometriaOd, queratometriaOi : this.datosOptometria.value.queratometriaOi,
      refracionOd : refraccionOd, refraccionOi, formulaFinalOd : ffod, formulaFinalOi : ffoi,
      avvlOd : this.datosOptometria.value.avvlOd, avvlOi : this.datosOptometria.value.avvlOi,
      avvpOd : this.datosOptometria.value.avvpOd, avvpOi : this.datosOptometria.value.avvpOi,
      adicionOd : this.datosOptometria.value.adicionOd, adicionOi : this.datosOptometria.value.adicionOi,
      dnpOd : this.datosOptometria.value.dnpOd, dnpOi : this.datosOptometria.value.dnpOi,
      testIshihara : this.datosOptometria.value.testIshihara, testEstereopsis : this.datosOptometria.value.testEstereopsis,
      diagnosticoInicial : this.datosOptometria.value.diagnosticoInicial, conducta : this.datosOptometria.value.conducta,
      medicamentos : this.datosOptometria.value.medicamentos, remision : this.datosOptometria.value.remision,
      observaciones : this.datosOptometria.value.observaciones, id_usuario: this.idUsuario, id_servicio: this.idServicio,
      tipoConsulta: this.datosOptometria.value.tipoConsulta, rips : this.datosOptometria.value.rips};


      // console.log(this.infoHcFb);

      // this.enviarDatosUsuario();

  }

  // enviarDatosUsuario() {
  //   this.loading = true;
  //   let token = this._userService.getToken();
  //   this._aplicationService.editUser(this.infoUserFb, token).subscribe( (response) => {
  //     this.res = response;
  //     // console.log('usu', this.res);
  //     this.enviarDatosHistoriaC();
  //     if (this.res.update === true) {
  //       //  this.datosUsuario.reset();
  //     }
  //   }, (err) => {
  //     // console.log(err);
  //     this.loading = false;
  //     this.status = 'error';
  //     this.statusText = 'Error al guardar la historia clinica, por favor revisa tu conexión o intentalo más tarde.';
  //   });
  // }

  enviarDatosHistoriaC() {
    this.loading = true;
    // console.log('aqui');
    this.medicoService.putHistoriaClinica(this.infoHcFb).subscribe( (response) => {
      // console.log('hc', response);

      if (response === true) {
        this.status = 'success';
        this.statusText = 'Historia clinica guarda con exito.';
        this.datosOptometria.reset();
        this.tituloModal = 'Datos del usuario';
        this.estadoModal = 'datos';
        this.estadoModalAtras = 'cerrar';
        document.getElementById('cerrar-modal-hc').click();
        this.loading = false;
        this.getUser(this.idUsuario);
        this.getHistoriasClinicas(this.idUsuario, this.idServicio);
      }

    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error al guardar la historia clinica, por favor revisa tu conexión o intentalo más tarde.';
      document.getElementById('cerrar-modal-hc').click();
      this.loading = false;
      return false;
    });

  }

  formUsuario() {
  //  var inputValue = (<HTMLInputElement>document.getElementById('oe')).value;

  // console.log('El valor del campo es:' +  inputValue);

  //  if (this.infoUser.tipoDocumento) {
  //     this.datosUsuario.value.tipoDocumento = this.infoUser.tipoDocumento;
  //  }

  //  if (this.infoUser.estadoCivil) {
  //     this.datosUsuario.value.estadoCivil = this.infoUser.estadoCivil;
  //  }

  //  if (this.infoUser.fecha_nacimiento) {
  //     this.datosUsuario.value.fechaNacimiento = this.infoUser.fecha_nacimiento;
  //  }

  //  if (this.infoUser.nomDepa) {
  //     this.datosUsuario.value.departamento = this.infoUser.id_departamento;
  //  }

  //  if (this.infoUser.nomMuni) {
  //   this.datosUsuario.value.municipio = this.infoUser.id_municipio;
  //  }

      this.loading = true;

      this.infoUserFb = { nombres : this.datosUsuario.value.nombresYapellidos, tipoDocumento: this.datosUsuario.value.tipoDocumento,
      cedula : this.datosUsuario.value.numeroDocumento, estadoCivil : this.datosUsuario.value.estadoCivil,
      edad : this.edad, fecha_nacimiento : this.datosUsuario.value.fechaNacimiento,
      id_departamento : this.datosUsuario.value.departamento, id_municipio : this.datosUsuario.value.municipio,
      ocupacion : this.datosUsuario.value.ocupacion, direccion : this.datosUsuario.value.direccion,
      barrio : this.datosUsuario.value.barrio, telefono : this.datosUsuario.value.telefono,
      eps : this.datosUsuario.value.eps, acompanante : this.datosUsuario.value.acompanante,
      parentesco : this.datosUsuario.value.parentesco, telefonoAcompanante : this.datosUsuario.value.telefonoAcompanante ,
      genero : this.datosUsuario.value.genero,
      id: this.idUsuario, apellidos : this.infoUser.apellidos, nombre : this.infoUser.nombre,
      telefonowatshapp : this.infoUser.telefonowatshapp
  };
  // console.log('info user', this.infoUserFb);

      let token = this.userService.getToken();
      this.aplicationService.editUser(this.infoUserFb, token).subscribe( (response) => {
      this.res = response;
      this.loading = false;
    // console.log('usu', this.res);
      if (this.res.update === true) {
      //  this.datosUsuario.reset();
      this.status = 'success';
      this.statusText = 'Datos de usuario actualizados con exito.';

    }
  }, () => {
    // console.log(err);
    this.loading = false;
    this.status = 'error';
    this.statusText = 'Error al guardar la historia clinica, por favor revisa tu conexión o intentalo más tarde.';
  });


  }

  verHistoriaClinica(info) {

      this.getHistoriaClinica(info.id_historiacl);
  }

  getHistoriaClinica(idHistoriaClinica) {


    // this.loading = true;
    // console.log('oe', idHistoriaClinica);
    this.loading = true;
    window.scroll(0, 0);
    this.medicoService.getHistoriaGeneral2(idHistoriaClinica).subscribe( (response) => {
        this.loading = false;
        console.log('info hist opto hst', response);
        if (this.idCategoria === '3') {
          this.infoHistoriaClinica = response;
          document.getElementById('btn-ver-hc').click();
          // this.modal = 'optometria';
        } else {
           this.infoHistoriaGeneral = response;
          //  console.log('bvhgi', this.infoHistoriaGeneral);
           document.getElementById('btn-ver-hg').click();
        }

    }, () => {
      this.loading = false;
      document.getElementById('btn-cerrar-moda-ver-hc').click();
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde';
      this.loading = false;
    } );
  }

  getParentescos() {
    this.aplicationService.getParentescos().subscribe( (response) => {
      // console.log(response);
      this.parentescos = response;
    }, () => {
      // console.log(err);
    });
  }


  cerrarAlerta() {
    this.status = null;
    this.statusText = null;
  }

  pdfMedicamentos() {
    var doc = new jsPDF();

    let content = this.content.nativeElement;
    let specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    doc.addImage(this.imagen, 'JPEG', 0, 0, 210, 250);

    doc.setFont('courier');
    doc.setFontStyle('normal');
    doc.setFontSize(12);
    doc.text(132, 55, this.today);
    doc.text(42, 70, this.datosUsuario.value.nombresYapellidos);
    doc.fromHTML(content.innerHTML, 45, 85, {
      'width': 140,
      'elementHandlers': specialElementHandlers
    });


    doc.save('medicamentos_' + this.infoUser.nombres + '.pdf');
  }

  // pdfRemision() {

  //   var doc = new jsPDF();

  //   let content = this.contentRemision.nativeElement;
  //   let specialElementHandlers = {
  //     '#editor': function(element, renderer) {
  //       return true;
  //     }
  //   };

  //   doc.addImage(this.imagen, 'JPEG', 0,0,210,250);

  //   doc.setFont("courier");
  //   doc.setFontStyle("normal");
  //   doc.setFontSize(12);
  //   doc.text(132, 55, this.today);
  //   doc.text(42, 70, this.datosUsuario.value.nombresYapellidos);
  //   doc.fromHTML(content.innerHTML, 45, 85, {
  //     'width': 140,
  //     'elementHandlers': specialElementHandlers
  //   });


  //     doc.save('remision_' + this.infoUser.nombres + '.pdf');

  // }

  // pdfCertificado() {

  //   var doc = new jsPDF();
  //   let content = this.contentDiagnostico.nativeElement;
  //   let specialElementHandlers = {
  //     '#editor': function(element, renderer) {
  //       return true;
  //     }
  //   };

  //   let content2 = this.contentObservaciones.nativeElement;
  //   let specialElementHandlers2 = {
  //     '#editor': function(element, renderer) {
  //       return true;
  //     }
  //   };


  //   doc.addImage(img, 'JPEG', 0,0,210,250);

  //   doc.setFont("courier");
  //   doc.setFontStyle("normal");
  //   doc.setFontSize(12);
  //   doc.text(43, 40, this.today);
  //   doc.text(43, 48, this.datosUsuario.value.nombresYapellidos);
  //   doc.text(43, 56, this.datosUsuario.value.numeroDocumento.toString());
  //   // doc.text(1, 1, identificacion);


  //   //  // this.datosOptometria.value.selectRefracion1 this.datosOptometria.value.selectRefracion2
  //   //  let refraccionOd = this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
  //   //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
  //   //   'X' + ' ' + this.datosOptometria.value.ejeRefracion;

  //   //  //  this.datosOptometria.value.selectRefracion1Oi this.datosOptometria.value.selectRefracion2Oi
  //   //  let refraccionOi = this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
  //   //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
  //   //   + ' ' + this.datosOptometria.value.ejeRefracionOi;

  //   //  //  this.datosOptometria.value.selecFormulaFinal1Od this.datosOptometria.value.selecFormulaFinal2Od
  //   //  let ffod = this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd +
  //   //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd + ' ' + 'X'
  //   //   + ' ' + this.datosOptometria.value.ejFormulaFinalOd;

  //   //  //  this.datosOptometria.value.selecFormulaFinal1Oi this.datosOptometria.value.selecFormulaFinal2Oi
  //   //  let ffoi = this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi +
  //   //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi + ' ' +
  //   //  'X' + ' ' + this.datosOptometria.value.ejFormulaFinalOi;


  //   // esfera
  //   doc.text(53, 86, this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd); //OD
  //   doc.text(53, 95, this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi); //OI

  //   // cilindro
  //   doc.text(81, 86,  '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd); //OD
  //   doc.text(81, 95, '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi); //OI

  //   // eje
  //   doc.text(109, 86, this.datosOptometria.value.ejFormulaFinalOd); //OD
  //   doc.text(109, 95, this.datosOptometria.value.ejFormulaFinalOi); //OI

  //   // Add
  //   doc.text(136, 86, this.datosOptometria.value.adicionOd); //OD
  //   doc.text(136, 95, this.datosOptometria.value.adicionOi); //OI

  //   // Dp
  //   doc.text(164, 86, this.datosOptometria.value.dnpOd); //OD
  //   doc.text(164, 95, this.datosOptometria.value.dnpOi); //OI

  //   //Oftalmologia
  //   doc.text(73, 120, this.datosOptometria.value.oftalmologiaOd); //OD
  //   doc.text(73, 125, this.datosOptometria.value.oftalmologiaOi); //OI

  //   //Examen motor
  //   doc.text(73, 130, this.datosOptometria.value.examenMotorOd); //OD
  //   doc.text(73, 135, this.datosOptometria.value.examenMotorOi); //OI


  //   // //Refraccion
  //   doc.text(73, 139, this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
  //   ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
  //    'X' + ' ' + this.datosOptometria.value.ejeRefracion); //OD

  //   doc.text(73, 144, this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
  //   ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
  //    + ' ' + this.datosOptometria.value.ejeRefracionOi); //OI

  //   // //Test ishihara
  //   doc.text(73, 148, this.datosOptometria.value.testIshihara);

  //   // //test de estereopsis
  //   doc.text(73, 153, this.datosOptometria.value.testEstereopsis);

  //   // //Diagnostico
  //   // doc.text(73, 180, '43/43/43');

  //   doc.fromHTML(content.innerHTML, 73, 149, {
  //     'width': 118,
  //     'elementHandlers': specialElementHandlers
  //   });

  //   doc.fromHTML(content2.innerHTML, 73, 176, {
  //     'width': 118,
  //     'elementHandlers': specialElementHandlers2
  //   });

  //   doc.save('certificado_' + this.infoUser.nombres + '.pdf');

  // }

}
