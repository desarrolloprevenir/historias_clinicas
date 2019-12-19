import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../services/app.service';
import { ProvedorService } from 'src/app/services/provedor.service';
import { UserService } from 'src/app/services/user.service';
import { SucursalService } from 'src/app/services/sucursal.service';

@Component({
  selector: 'app-crear-sucursal',
  templateUrl: './crear-sucursal.component.html',
  styleUrls: ['./crear-sucursal.component.css']
})
export class CrearSucursalComponent implements OnInit {
  public mymodel;
  public departamentos;
  public municipios;
  public medicos = [];
  public medics;
  public consultorios = [];
  public infoConsultorios = [];
  public posicionEliminar;
  public medicoId;
  public servicios;
  public idProvedor;
  public status;
  public statusText;

  // variables horarios para consultorios
  public horasDesdeHastaManana;
  public horasDesdeHastaTarde;
  public diasH1;
  public diasH2;
  public diasH3;
  public ds = [];
  public mananaH1 = false;
  public mananaH2 = false;
  public mananaH3 = false;
  public tardeH1 = false;
  public tardeH2 = false;
  public tardeH3 = false;
  public horario2 = false;
  public horario3 = false;
  public btnHorario = true;
  public btnEliminarHorario = false;
  public disableH1;
  public disableH2;
  public mananaDesdeH1: any;
  public mananaHastaH1: any;
  public tardeDesdeH1: any;
  public tardeHastaH1: any;
  public mananaDesdeH2: any;
  public mananaHastaH2: any;
  public tardeDesdeH2: any;
  public tardeHastaH2: any;
  public mananaDesdeH3: any;
  public mananaHastaH3: any;
  public tardeDesdeH3: any;
  public tardeHastaH3: any;
  public horario1;
  public idSucursal;
  public ver;
  public campo;
  public infoSucursal;
  public consultorioSelect;
  public consultorioEliminar;
  public idConsultorio;
  public infoEliminar;

  // form control
  departSelect = new FormControl('', Validators.required);
  muniSelect = new FormControl('', Validators.required);
  nombreSucursal = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
  Validators.pattern('[a-z A-z ñ]*')]);
  direccionSucursal = new FormControl('', Validators.required);
  telefonoSucursal = new FormControl('', [Validators.required , Validators.pattern('[0-9]*'), 
                                          Validators.minLength(7), Validators.maxLength(12)]);
  nombreConsultorio = new FormControl('', Validators.required);
  pssw = new FormControl('', [Validators.required, Validators.minLength(8)]);
  psswConfirm = new FormControl('', [Validators.required, Validators.minLength(8)]);
  username = new FormControl('', [Validators.required, Validators.pattern('[a-zA-z_0-9]*')]);
  extensionConsultorio = new FormControl('');
  medicoSelect = new FormControl('', Validators.required);
  servicioSelect = new FormControl('', Validators.required);

  // loading
  public loading;

  constructor(private aplicationService: AppService,
              private provedorService: ProvedorService,
              private userService: UserService,
              private route: ActivatedRoute,
              private sucursalService: SucursalService) {
                this.mymodel = 'informacion';
                this.horario1 = '1';
              }

  ngOnInit() {
    this.idProvedor = this.userService.getIdentity().id_provedor;

    if (this.route.params) {
      this.route.params.subscribe(params => {
        if (params['id_sucursal']) {
          this.idSucursal = params['id_sucursal'];
          //  console.log(params['id_sucursal']);
          this.getInfoSucursal(this.idSucursal);
        }
    });
    }

    this.getMedicos(this.idProvedor);
    this.getServicios(this.idProvedor);
    this.getDepartamentos();
    this.horas();
    this.diasSemana();


    // this.meds();
  }

  getInfoSucursal(idSucursal) {
    // console.log('oi');
      this.provedorService.getConsultoriosSucursal(idSucursal).subscribe( (response) => {
      // console.log('sucu',response);
      this.infoSucursal = response;
      this.nombreSucursal.setValue(this.infoSucursal.nombre);
      this.telefonoSucursal.setValue(this.infoSucursal.telefono);
      this.direccionSucursal.setValue(this.infoSucursal.direccion);
    }, () => {
        // console.log(err);
    } );
  }

  // meds() {

  //   this.medicos = [{nombre: 'pepe perez', select: false, id: '1'},
  //                   {nombre: 'elvio lao', select: false, id: '2'},
  //                   {nombre: 'ana conda', select: false, id: '3'},
  //                   {nombre: 'elba sofia', select: false, id: '4'},
  //                   {nombre: 'rosamel fierro', select: false, id: '5'}];

  // }

  getDepartamentos() {

    this.aplicationService.getDepartamento().subscribe( (response) => {
      this.departamentos = response;
      // console.log(this.departamentos);
    }, () => {
    });
  }

  departamentoSelect(ev?) {

    this.aplicationService.getMunicipio(this.departSelect.value).subscribe( (response) => {
      this.municipios = response;
    }, () => {

    });
  }

  // municipioSelect(){
  //   console.log(this.muniSelect.value);
  // }

  getServicios(idProvedor){
    this.provedorService.getPublications(idProvedor).subscribe( (response) => {
      this.servicios = response;
      // console.log(response);
    }, () => {

    });
  }

  siguiente() {

    this.mymodel = 'consultorios';
    document.getElementById('info').className = 'list-group-item';
    document.getElementById('consul').className = 'list-group-item active';
  }

  // atras(){
  //   this.mymodel = 'informacion';
  //   document.getElementById('info').className = 'list-group-item active';
  //   document.getElementById('consul').className = 'list-group-item';

  // }


  atras(tipo) {
    // console.log(this.diasH1);

    let bol = true;

    switch (bol === true) {

      case this.diasH1 === undefined:

          if(tipo === false) {
          this.horario1 = '1';
          this.mymodel = 'informacion';
          document.getElementById('info').className = 'list-group-item active';
          document.getElementById('consul').className = 'list-group-item';
          }

          break;

      case (this.diasH1 !== undefined) && (this.diasH1.length >= 1 && this.horario2 === false) :
      // console.log('h1');
      if ( this.enabledDiasH1() === true ) {
         this.diasH1 = undefined;
         this.mananaDesdeH1 = undefined;
         this.mananaDesdeH2 = undefined;
         this.mananaDesdeH3 = undefined;
         this.tardeDesdeH1 = undefined;
         this.tardeDesdeH2 = undefined;
         this.tardeDesdeH3 = undefined;
         this.mananaH1 = false;
         this.tardeH1 = false;
         this.status = false;
         this.disableH1 = false;
         this.btnHorario = true;
         if (this.horario1 === '1') {
            this.horario1 = '2';
            // console.log('aqui 2');
         } else {
            this.horario1 = '1';
            // console.log('aqui 1');
         }

         if (tipo === false) {

          if (this.horario1 === '1') {
            this.horario1 = '2';
         } else {
            this.horario1 = '1';
         }
          this.mymodel = 'informacion';
          document.getElementById('info').className = 'list-group-item active';
          document.getElementById('consul').className = 'list-group-item';
         }

        //  console.log(this.diasH1);
      }
      break;

      case (this.diasH1 !== undefined) && (this.horario2 === true && this.horario3 === false):
      // console.log('h1 y h2');
      if (this.enabledDiasH1() === true) {
        this.diasH1 = undefined;
        this.mananaDesdeH1 = undefined;
        this.mananaDesdeH2 = undefined;
        this.mananaDesdeH3 = undefined;
        this.tardeDesdeH1 = undefined;
        this.tardeDesdeH2 = undefined;
        this.tardeDesdeH3 = undefined;
        this.mananaH1 = false;
        this.tardeH1 = false;
        this.status = false;
        this.disableH1 = false;
        this.btnHorario = true;
        this.diasH2 = undefined;
        this.mananaDesdeH2 = undefined;
        this.mananaHastaH2 = undefined;
        this.tardeDesdeH2 = undefined;
        this.tardeHastaH2 = undefined;
        this.horario2 = false;
        this.status = false;
        this.disableH2 = false;
      // console.log(this.diasH2);
        if(this.horario1 === '1') {
            this.horario1 = '2';
         } else {
            this.horario1 = '1';
         }
        if (tipo === false) {
        if(this.horario1 === '1') {
          this.horario1 = '2';
       } else {
          this.horario1 = '1';
       }
        this.mymodel = 'informacion';
        document.getElementById('info').className = 'list-group-item active';
        document.getElementById('consul').className = 'list-group-item';
        }
      }

      break;

      case (this.diasH1 !== undefined) && (this.horario2 === true && this.horario3 === true):
      // console.log('h1 h2 h3');
        if (this.enabledDiasH1() === true && this.enabledDiasH2() === true && this.enabledDiasH3() === true) {

          this.diasH1 = undefined;
          this.mananaDesdeH1 = undefined;
          this.mananaDesdeH2 = undefined;
          this.mananaDesdeH3 = undefined;
          this.tardeDesdeH1 = undefined;
          this.tardeDesdeH2 = undefined;
          this.tardeDesdeH3 = undefined;
          this.mananaH1 = false;
          this.tardeH1 = false;
          this.status = false;
          this.disableH1 = false;
          this.btnHorario = true;
          this.diasH2 = undefined;
          this.mananaDesdeH2 = undefined;
          this.mananaHastaH2 = undefined;
          this.tardeDesdeH2 = undefined;
          this.tardeHastaH2 = undefined;
          this.horario2 = false;
          this.status = false;
          this.disableH2 = false;
          this.horario3 = false;
          this.mananaDesdeH3 = undefined;
          this.mananaHastaH3 = undefined;
          this.tardeDesdeH3 = undefined;
          this.tardeHastaH3 = undefined;
          this.mananaH3 = false;
          this.tardeH3 = false;
          // console.log(this.diasH3);
          if (this.horario1 === '1') {
            this.horario1 = '2';
         } else {
            this.horario1 = '1';
         }
          if (tipo === false) {
            if (this.horario1 === '1') {
              this.horario1 = '2';
           } else {
              this.horario1 = '1';
           }
            this.mymodel = 'informacion';
            document.getElementById('info').className = 'list-group-item active';
            document.getElementById('consul').className = 'list-group-item';
            }
        }
        break;
    }

  }

  getMedicos(idProvedor) {
    this.medics = undefined;

    // this.medicos = [{nombre: 'pepe perez', select: false, id: '1'},
    // {nombre: 'elvio lao', select: false, id: '2'},
    // {nombre: 'ana conda', select: false, id: '3'},
    // {nombre: 'elba sofia', select: false, id: '4'},
    // {nombre: 'rosamel fierro', select: false, id: '5'}];


    this.provedorService.getMedicosProvedor(idProvedor).subscribe( (response) => {
        // console.log('med', response);
        this.medics = response;

        this.medicosDisabled();

        // console.log('med oe', this.medicos);

    }, () => {

    });
  }

  medicosDisabled() {

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.medics.length; i++) {

      let apellidos = this.medics[i].apellidos;
      let avatar = this.medics[i].avatar;
      let cedula = this.medics[i].cedula;
      let id_provedor = this.medics[i].id_provedor;
      let medico_id = this.medics[i].medico_id;
      let members_id = this.medics[i].members_id;
      let nombre = this.medics[i].nombre;
      let nombres = this.medics[i].nombres;
      let tarj_profecional = this.medics[i].tarj_profecional;
      let telefono = this.medics[i].telefono;
      let titulo = this.medics[i].titulo;
      let whatsapp = this.medics[i].whatsapp;
      let activo = this.medics[i].activo;
      let select = false;

      this.medicos.push({apellidos, avatar, cedula, id_provedor, medico_id,
                         members_id, nombre, nombres, tarj_profecional, telefono,
                         titulo, whatsapp, select, activo});
    }

    // console.log(this.medicos);
  }

  crearConsultorio(bol) {

     // console.log(bol);
     let siguiente = true;

     switch (siguiente === true) {
       case (this.horario2 === false && this.horario3 === false):
       if (this.validacionesH1(bol) === true) {
          this.crearConsul();
       }
       break;

       case (this.horario2 === true && this.horario3 === false):
       if (this.validacionesH2(bol) === true) {
          this.crearConsul();
       }
       break;

       case (this.horario2 === true && this.horario3 === true):
       if (this.validacionesH3() === true) {
          this.crearConsul();
       }
       break;

     }

    // console.log(this.infoConsultorios);
  }


  crearConsul() {
    var h1;
    var h2;
    var h3;

    let hor = true;
    switch (hor === true) {
      // horario 1
      case (this.mananaH1 === true && this.tardeH1 === false):
      h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: undefined,
      t_hasta: undefined, semana : this.diasH1, id_servicio: this.servicioSelect.value.id_servicios};
      break;

      case (this.mananaH1 === false && this.tardeH1 === true):
      h1 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH1 + ':00',
      t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1, id_servicio: this.servicioSelect.value.id_servicios};
      break;

      case (this.mananaH1 === true && this.tardeH1 === true):
      h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: this.tardeDesdeH1 + ':00',
      t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1, id_servicio: this.servicioSelect.value.id_servicios};
      break;
    }

    if (this.horario2 === true) {
          if (this.mananaH2 === true && this.tardeH2 === false) {
            // console.log('solo mañana 2');
          h2 = { m_de: this.mananaDesdeH2 + ':00', m_hasta: this.mananaHastaH2 + ':00', t_de: undefined,
          t_hasta: undefined, semana : this.diasH2, id_servicio: this.servicioSelect.value.id_servicios};
          }

          if (this.mananaH2 === false && this.tardeH2 === true) {
            // console.log('solo tarde 2');
            h2 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH2 + ':00',
          t_hasta: this.tardeHastaH2 + ':00', semana : this.diasH2, id_servicio: this.servicioSelect.value.id_servicios};
          }

          if (this.mananaH2 === true && this.tardeH2 === true) {
            // console.log('mañana tarde 2');
            h2 = { m_de: this.mananaDesdeH2 + ':00', m_hasta: this.mananaHastaH2 + ':00', t_de: this.tardeDesdeH2 + ':00',
          t_hasta: this.tardeHastaH2 + ':00', semana : this.diasH2, id_servicio: this.servicioSelect.value.id_servicios};
          }
        } else {
          h2 = { m_de: this.mananaDesdeH2, m_hasta: this.mananaHastaH2, t_de: this.tardeDesdeH2,
          t_hasta: this.tardeHastaH2, semana : this.diasH2, id_servicio: this.servicioSelect.value.id_servicios};
        }

    if (this.horario3 === true) {

          if (this.mananaH3 === true && this.tardeH3 === false) {
            h3 = { m_de: this.mananaDesdeH3 + ':00', m_hasta: this.mananaHastaH3 + ':00', t_de: undefined,
                t_hasta: undefined, semana : this.diasH3, id_servicio: this.servicioSelect.value.id_servicios};
          }

          if (this.mananaH3 === false && this.tardeH3 === true) {
            h3 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH3  + ':00',
                t_hasta: this.tardeHastaH3  + ':00', semana : this.diasH3, id_servicio: this.servicioSelect.value.id_servicios};
          }

          if (this.mananaH3 === true && this.tardeH3 === true) {
            h3 = { m_de: this.mananaDesdeH3 + ':00', m_hasta: this.mananaHastaH3 + ':00', t_de: this.tardeDesdeH3  + ':00',
                t_hasta: this.tardeHastaH3  + ':00', semana : this.diasH3, id_servicio: this.servicioSelect.value.id_servicios};
          }

        } else {
          h3 = { m_de: this.mananaDesdeH3 , m_hasta: this.mananaHastaH3 , t_de: this.tardeDesdeH3 ,
                t_hasta: this.tardeHastaH3 , semana : this.diasH3, id_servicio: this.servicioSelect.value.id_servicios};
        }

    let horario = [h1, h2, h3];
      // let h4 = {horario: horario};
    let horarios = horario;

      // console.log(horarios);

    this.infoConsultorios.push({medico_id: this.medicoSelect.value.medico_id, nombre: this.nombreConsultorio.value,
        extension: this.extensionConsultorio.value, nombreMedico: this.medicoSelect.value.nombre, id_sucursal : this.idSucursal,
        nombreServicio : this.servicioSelect.value.nombre, horarios,
        id_servicio: this.servicioSelect.value.id_servicios, id_provedor: this.idProvedor});

        // let info =  [{ medico_id: this.medicoSelect.value, nombre: this.nombreConsultorio.value, id_sucursal : identity,
      // extension: this.extensionConsultorio.value, horarios, id_servicio: this.servicioSelect.value }];

    this.medicoFalse();
    this.limpiarForms();
    this.atras('crearConsul');
  }

  limpiarForms() {
    this.medicoSelect.reset();
    this.nombreConsultorio.reset();
    this.extensionConsultorio.reset();
    this.servicioSelect.reset();

    // console.log('aqui',this.nombreConsultorio.value);
  }

  // crear sucursal
  medicoFalse() {

    // console.log()

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.medicos.length; i++) {

      // console.log(this.medicos[i].nombre);

      if (this.medicoSelect.value.medico_id === this.medicos[i].medico_id ){
        this.medicos[i].select = true;
      }
    }

    // console.log(this.medicos);

  }

  // crear sucursal
  medicoTrue() {

    // console.log(this.medico_id);
    // tslint:disable-next-line: prefer-for-of
    for(let i = 0; i < this.medicos.length; i++) {
      // console.log(this.medicos[i].nombre);
      if(this.medicoId === this.medicos[i].id ) {
        // console.log(this.medicos[i].nombre )
        this.medicos[i].select = false;
      }
    }

  }

  posisionAEliminar(i, idMedico) {
    this.posicionEliminar = i;
    this.medicoId = idMedico;
    // console.log(this.infoConsultorios);
  }

  eliminarConsultorio(){
    this.infoConsultorios.splice(this.posicionEliminar, 1);
    this.medicoTrue();
  }

  guardarConsultorio() {
      // let info =  [{ medico_id: this.medicoSelect.value, nombre: this.nombreConsultorio.value, id_sucursal : identity,
      // extension: this.extensionConsultorio.value, horarios, id_servicio: this.servicioSelect.value }];
      // console.log(this.infoConsultorios);

      this.loading = true;
      this.sucursalService.postConsultorioSucursal(this.infoConsultorios).subscribe( (response)=>{
        this.loading = false;
        window.scroll(0, 0);
        if (response === true){
          this.getInfoSucursal(this.idSucursal);
          this.infoConsultorios = [];
          this.status = 'success';
          this.statusText = 'Consultorios creados exitosamente.';
        }
      }, () => {
        window.scroll(0, 0);
        this.status = 'error';
        this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde';
        this.loading = false;
      });
  }

  guardar() {

    this.loading = true;
    window.scroll(0,0);
    // let password = CryptoJS.SHA512(this.pssw.value).toString(CryptoJS.enc.Hex);

    let info = {nombre: this.nombreSucursal.value, telefono: this.telefonoSucursal.value, id_municipio: this.muniSelect.value,
      direccion: this.direccionSucursal.value , id_provedor: this.idProvedor, consultorios: this.infoConsultorios, 
      pssw: this.aplicationService.encriptar(this.pssw.value), usuario : this.username.value};

    // console.log(info);

    this.provedorService.crearSucursal(info).subscribe( (response) => {
      // console.log('respuesta', response);
      this.loading = false;
      if(response === true) {
        document.getElementById('btn-publicacion-exitosa').click();
      } else {
        this.status = 'error';
        this.statusText = 'El nombre de usuario ya existe, por favor escribe otro.'
      }

    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion por favor revisa tu conexion o intentalo mas tarde.'
      this.loading = false;
    } );
  }


  // Metodos horarios

  horas() {
    this.horasDesdeHastaManana = [
      { hora : '6 a.m', value : '6:00' },
      { hora : '7 a.m', value : '7:00' },
      { hora : '8 a.m', value : '8:00' },
      { hora : '9 a.m', value : '9:00' },
      { hora : '10 a.m', value : '10:00' },
      { hora : '11 a.m', value : '11:00' },
      { hora : '12 a.m', value : '12:00' },
    ];

    this.horasDesdeHastaTarde = [
      { hora : '1 p.m', value : '13:00' },
      { hora : '2 p.m', value : '14:00' },
      { hora : '3 p.m', value : '15:00' },
      { hora : '4 p.m', value : '16:00' },
      { hora : '5 p.m', value : '17:00' },
      { hora : '6 p.m', value : '18:00' },
      { hora : '7 p.m', value : '19:00' },
    ];
  }

  diasSemana() {
    let lunes = {nombre: 'lunes',  disponible: true};
    let martes = {nombre: 'martes', disponible: true};
    let miercoles = {nombre: 'miércoles', disponible: true};
    let jueves = {nombre: 'jueves', disponible: true};
    let viernes = {nombre: 'viernes', disponible: true};
    let sabado = {nombre: 'sábado', disponible: true};
    let domingo = {nombre: 'domingo', disponible: true};

    let days = [lunes, martes, miercoles, jueves, viernes, sabado, domingo];

    // tslint:disable-next-line: prefer-for-of
    for ( var i = 0; i < days.length; i++) {
      let dia = days[i];
      this.ds.push({dia});
    }

  }

  // Dias seleccionados en el horario 1
  diasHorario1(ev) {
    this.diasH1 = ev.value;
    // console.log(this.diasH1);
  }

  // Dias seleccionados en el horario 2
  diasHorario2(ev) {
    this.diasH2 = ev.value;
    // console.log(this.diasH2);
  }

  // Dias seleccionados en el horario 3
  diasHorario3(ev) {
    this.diasH3 = ev.value;
    // console.log(this.diasH3);
  }

  checktManana(ev, h) {

    if (ev.checked === true && h === 'h1') {
      this.mananaH1 = true;
    }

    if (ev.checked === false && h === 'h1') {
      this.mananaH1 = false;
      this.mananaDesdeH1 = undefined;
      this.mananaHastaH1 = undefined;
    }

    if (ev.checked === true && h === 'h2') {
      this.mananaH2 = true;
    }

    if (ev.checked === false && h === 'h2') {
      this.mananaH2 = false;
      this.mananaHastaH2 = undefined;
      this.mananaDesdeH2 = undefined;
    }

    if (ev.checked === true && h === 'h3') {
      this.mananaH3 = true;
    }

    if (ev.checked === false && h === 'h3') {
      this.mananaH3 = false;
      this.mananaDesdeH3 = undefined;
      this.mananaHastaH3 = undefined;
    }
  }


  horasHorarios(ev, info) {
    // console.log(ev, info);

    // H1

    if (info === 'mdesde_h1') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH1 = parseInt(ev.value);
      // console.log(this.mananaDesdeH1);
    }

    if (info === 'mhasta_h1') {
      // tslint:disable-next-line:radix
      this.mananaHastaH1 = parseInt(ev.value);
      // console.log(this.mananaHastaH1);
    }

    if (info === 'tdesde_h1') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH1 = parseInt(ev.value);
      // console.log(this.tardeDesdeH1);
    }

    if (info === 'thasta_h1') {
      // tslint:disable-next-line:radix
      this.tardeHastaH1 = parseInt(ev.value);
      // console.log(this.tardeHastaH1);
    }

    // H2

    if (info === 'mdesde_h2') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH2 = parseInt(ev.value);
    }

    if (info === 'mhasta_h2') {
      // tslint:disable-next-line:radix
      this.mananaHastaH2 = parseInt(ev.value);
    }

    if (info === 'tdesde_h2') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH2 = parseInt(ev.value);
    }

    if (info === 'thasta_h2') {
      // tslint:disable-next-line:radix
      this.tardeHastaH2 = parseInt(ev.value);
    }


    // H3

    if (info === 'mdesde_h3') {
      // tslint:disable-next-line:radix
      this.mananaDesdeH3 = parseInt(ev.value);
    }

    if (info === 'mhasta_h3') {
      // tslint:disable-next-line:radix
      this.mananaHastaH3 = parseInt(ev.value);
    }

    if (info === 'tdesde_h3') {
      // tslint:disable-next-line:radix
      this.tardeDesdeH3 = parseInt(ev.value);
    }

    if (info === 'thasta_h3') {
      // console.log('aquiii');
      // tslint:disable-next-line:radix
      this.tardeHastaH3 = parseInt(ev.value);
      // console.log(this.tardeHastaH3);
    }
  }

  checktTarde(ev, h) {
    if (ev.checked === true && h === 'h1') {
      this.tardeH1 = true;
    }

    if (ev.checked === false && h === 'h1') {
      this.tardeH1 = false;
      this.tardeDesdeH1 = undefined;
      this.tardeHastaH1 = undefined;
    }

    if (ev.checked === true && h === 'h2') {
      this.tardeH2 = true;
    }

    if (ev.checked === false && h === 'h2') {
      this.tardeH2 = false;
      this.tardeDesdeH2 = undefined;
      this.tardeHastaH2 = undefined;
    }

    if (ev.checked === true && h === 'h3') {
      this.tardeH3 = true;
    }

    if (ev.checked === false && h === 'h3') {
      this.tardeH3 = false;
      this.tardeDesdeH3 = undefined;
      this.tardeHastaH3 = undefined;
    }
  }

  mostrarHorario(bol) {
    // console.log(bol);
    let mostrar = true;

    switch (mostrar === true) {

      case this.horario2 === false:
      // console.log('aqui');
      this.validacionesH1(bol);
      break;

      case (this.horario2 === true && this.horario3 === false):
      // console.log('aqui 2');
      this.status = false;
      this.validacionesH2(bol);
      break;
    }
  }


  // Validaciones horario 1
  validacionesH1(bol): boolean {

    // console.log('aqui val1')

    if (this.diasH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 1.';
        return false;
    } else {

      let val = true;
      switch (val === true) {

      case (this.mananaH1 === true && this.tardeH1 === false) :
      if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH1 > this.mananaHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
          // console.log('<aqui>');
          return false;
        } else {

          if ( bol === 'false' ) {

            if (this.diasH1.length >= 7) {
              this.status = 'warning';
              this.statusText = 'No hay dias disponibles para el horario 2.';
            } else {
             this.horario2 = true;
            //  console.log('aqui agregar');
             this.btnEliminarHorario = true;
             this.disabledDiasH1();
             this.disableH1 = true;
             return true;
            }
            } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH1 === false && this.tardeH1 === true) :
      if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
          this.status = 'warning';
          this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 1.';
          return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH1 > this.tardeHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
          return false;
        } else {

          if ( bol === 'false' ) {

           if (this.diasH1.length >= 7) {
              this.status = 'warning';
              this.statusText = 'No hay dias disponibles para el horario 2.';
            } else {
             this.horario2 = true;
            //  console.log('aqui agregar');
             this.btnEliminarHorario = true;
             this.disabledDiasH1();
             this.disableH1 = true;
             return true;
            }


            } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH1 === true && this.tardeH1 === true) :

      if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
        return false;
      } else if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde del horario 1.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH1 > this.mananaHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
          return false;
        } else if (this.tardeDesdeH1 > this.tardeHastaH1) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
          return false;
        } else {

          if ( bol === 'false' ) {


            if (this.diasH1.length >= 7) {
              this.status = 'warning';
              this.statusText = 'No hay dias disponibles para el horario 2.';
            } else {
             this.horario2 = true;
            //  console.log('aqui agregar');
             this.btnEliminarHorario = true;
             this.disabledDiasH1();
             this.disableH1 = true;
             return true;
            }


            } else {
            return true;
          }
        }

      }
      break;

      case (this.mananaH1 === false && this.tardeH1 === false) :
        this.status = 'warning';
        this.statusText = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
        return false;
        break;
    }

    }
  }

  validacionesH2(bol): boolean {

    // console.log('aquiii');

    if (this.diasH2 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 2.';
        return false;
    } else {

      let val = true;
      switch (val === true) {

      case (this.mananaH2 === true && this.tardeH2 === false) :
      if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH2 > this.mananaHastaH2) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
          return false;
        } else {

          if (bol === 'false') {

            if ( (this.diasH1.length + this.diasH2.length) >= 7) {
              this.status = 'warning';
              this.statusText = 'No hay dias disponibles para el horario 3.';
            } else {

              this.horario3 = true;
              this.btnHorario = false;
              this.disabledDiasH2();
              this.disableH2 = true;
              return true;
            }


          //   this.horario3 = true;
          // this.btnHorario = false;
          // this.disabledDiasH2();
          // this.disableH2 = true;
          // return true;


          } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH2 === false && this.tardeH2 === true) :
      if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
          this.status = 'warning';
          this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 2.';
          return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH2 > this.tardeHastaH2) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
          return false;
        } else {

          if (bol === 'false') {

            if ( (this.diasH1.length + this.diasH2.length) >= 7) {
              this.status = 'warning';
              this.statusText = 'No hay dias disponibles para el horario 3.';
            } else {

              this.horario3 = true;
              this.btnHorario = false;
              this.disabledDiasH2();
              this.disableH2 = true;
              return true;
            }


          } else {
            return true;
          }

        }
      }
      break;

      case (this.mananaH2 === true && this.tardeH2 === true) :

      if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
        return false;
      } else if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde del horario 2.';
        return false;
      } else {
         // Validacion de las horas de inicio y final
         if (this.mananaDesdeH2 > this.mananaHastaH2) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
          return false;
        } else if (this.tardeDesdeH2 > this.tardeHastaH2) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
          return false;
        } else {

          if (bol === 'false') {

           if ( (this.diasH1.length + this.diasH2.length) >= 7) {
              this.status = 'warning';
              this.statusText = 'No hay dias disponibles para el horario 3.';
            } else {

              this.horario3 = true;
              this.btnHorario = false;
              this.disabledDiasH2();
              this.disableH2 = true;
              return true;
            }

          } else {
            return true;
          }
        }
      }
      break;

      case (this.mananaH2 === false && this.tardeH2 === false) :
        this.status = 'warning';
        this.statusText = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
        return false;
        break;
    }

    }
  }

  validacionesH3(): boolean {

    if (this.diasH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa los dias de atención en el horario 3.';
    } else {

      let val = true;
      switch (val === true) {

      case (this.mananaH3 === true && this.tardeH3 === false) :
      if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 3.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.mananaDesdeH3 > this.mananaHastaH3) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
          return false;
        } else {
          // console.log('mañana bn h3');
          return true;
        }
      }
      break;

      case (this.mananaH3 === false && this.tardeH3 === true) :
      if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 3.';
        return false;
      } else {

        // Validacion de las horas de inicio y final
        if (this.tardeDesdeH3 > this.tardeHastaH3) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 3.';
          return false;
        } else {
          // console.log('tarde bn h3');
          return true;
        }
      }
      break;

      case (this.mananaH3 === true && this.tardeH3 === true) :

      if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la mañana del horario 3.';
        return false;
      } else if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
        // console.log(this.tardeDesdeH3, this.tardeHastaH3);
        this.status = 'warning';
        this.statusText = 'Por favor completa una hora de inicio y terminación en la tarde del horario 3.';
        return false;
      } else {
         // Validacion de las horas de inicio y final
         if (this.mananaDesdeH3 > this.mananaHastaH3) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
          return false;
        } else if (this.tardeDesdeH3 > this.tardeHastaH3) {
          this.status = 'warning';
          this.statusText = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 3.';
          return false;
        } else {
          return true;
        }
      }
      break;

      case (this.mananaH3 === false && this.tardeH3 === false) :
        this.status = 'warning';
        this.statusText = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
        return false;
        break;
    }

    }
  }

  // desabilitar dias escogidos en el horario 1
  disabledDiasH1() {

    // console.log(this.diasH1);

   // tslint:disable-next-line: prefer-for-of
   for (var i = 0; i < this.diasH1.length; i++) {
     var nombre = this.diasH1[i];

     // tslint:disable-next-line: prefer-for-of
     for (var j = 0; j < this.ds.length; j++) {

      if (nombre === this.ds[j].dia.nombre) {
        this.ds[j].dia.disponible = false;
      }
     }

   }
  }

  // desabilitar dias escogidos en el horario 2
  disabledDiasH2() {

    // console.log(this.diasH1);

    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < this.diasH2.length; i++) {
      var nombre = this.diasH2[i];

      // tslint:disable-next-line: prefer-for-of
      for (var j = 0; j < this.ds.length; j++) {

       if (nombre === this.ds[j].dia.nombre) {
         this.ds[j].dia.disponible = false;
       }
      }

    }
   }

   // habilitar dias horario 1 cuando se elimina el horario 2
   enabledDiasH1() {

    // console.log(this.diasH1);

      // tslint:disable-next-line: prefer-for-of
      for (var i = 0; i < this.diasH1.length; i++) {
        var nombre = this.diasH1[i];

      // tslint:disable-next-line: prefer-for-of
        for (var j = 0; j < this.ds.length; j++) {

         if (nombre === this.ds[j].dia.nombre) {
           this.ds[j].dia.disponible = true;
         }
        }

      }
      return true;
      // console.log(this.ds);
   }

   // habilitar dias horario 2 cuando se elimina el horario 3
   enabledDiasH2() {

    if (this.diasH3) {
      // tslint:disable-next-line: prefer-for-of
      for (var i = 0; i < this.diasH3.length; i++) {
        var nombre = this.diasH3[i];
        // tslint:disable-next-line: prefer-for-of
        for (var j = 0; j < this.ds.length; j++) {
         if (nombre === this.ds[j].dia.nombre) {
           this.ds[j].dia.disponible = true;
         }
        }
      }
      return true;
    } else {
      return true;
    }
    // console.log(this.ds);

   }

   // habilitar dias seleccionados en el horario 2
   enabledDiasH3() {
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < this.diasH2.length; i++) {
      var nombre = this.diasH2[i];

      // tslint:disable-next-line: prefer-for-of
      for (var j = 0; j < this.ds.length; j++) {

       if (nombre === this.ds[j].dia.nombre) {
         this.ds[j].dia.disponible = true;
       }
      }
    }

    return true;
  }

  eliminarHorario() {

    let bol = true;

    switch (bol === true) {

      case this.horario2 === true && this.horario3 === false:
      this.horario2 = false;
      this.btnEliminarHorario = false;
      this.enabledDiasH1();
      this.disableH1 = false;
      this.diasH2 = undefined;
      this.mananaDesdeH2 = undefined;
      this.mananaHastaH2 = undefined;
      this.tardeDesdeH2 = undefined;
      this.tardeHastaH2 = undefined;
      break;

      case this.horario2 === true && this.horario3 === true:
      this.horario3 = false;
      this.btnHorario = true;
      this.disableH2 = false;
      this.enabledDiasH2();
      this.enabledDiasH3();
      this.diasH3 = undefined;
      this.mananaDesdeH3 = undefined;
      this.mananaHastaH3 = undefined;
      this.tardeDesdeH3 = undefined;
      this.tardeHastaH3 = undefined;
      break;
    }

  }

  cerrarAlerta() {
    this.status = false;
  }

  // ------------------------------------ METODOS EDITAR SUCURSAL  ----------------------------------------------------

  mouseEnter(campo) {
    this.ver = campo;
    // console.log('campo');
  }
 
  mouseLeave() {
    this.ver = '';
  }

  editar(campo) {
    this.campo = document.getElementById(campo);
    this.campo.readOnly = false;
  }

  cambio(campo) {
    this.campo = document.getElementById(campo);
    this.campo.readOnly = true;
  }

  verConsultorio(info){
    this.consultorioSelect = info;
    // console.log(this.consultorioSelect);
    document.getElementById('modal-ver-consultorio').click();
  }

  confirmacionEliminarConsulApi(info) {
    // this.eliminarConsultorio = info;
    // console.log(this.eliminarConsultorio);
    // document.getElementById('confi-eliminar-api').click();
    this.loading = true;
    this.idConsultorio = info.id_consultorio;
    this.sucursalService.getEventsConsul(info.id_consultorio).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      window.scroll(0, 0);
      if(response[0].eventsC <= 0 ) {
      //  console.log('elimianr');
       this.infoEliminar = true;
       document.getElementById('confi-eliminar-api').click();
      } else {
        // console.log('no se puse eliminar');
        this.infoEliminar = false;
        document.getElementById('confi-eliminar-api').click();
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
    } );
  }

  eliConsul() {

    this.loading = true;
    this.sucursalService.dltConsultorio(this.idConsultorio).subscribe( (response) => {
      this.loading = false;
      window.scroll(0,0);
      if(response === true){
        this.status = 'success';
        this.statusText = 'Consultorio eliminado exitosamente.';
        this.getInfoSucursal(this.idSucursal);
        this.getMedicos(this.idProvedor);
      }
      // console.log(response);
    }, () => {
      window.scroll(0, 0);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
      // console.log(err);
    } );
  }

  guardarInfoSucursal() {
    this.loading = true;
    let info = {nombre: this.nombreSucursal.value, direccion: this.direccionSucursal.value, telefono: this.telefonoSucursal.value, 
                id_sucursal: this.idSucursal};
    // console.log(info);
    this.sucursalService.editInfoSucursal(info).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      if(response === true) {
        this.status = 'success';
        this.statusText = 'Datos actualizados con exito.';
      } else {
        this.status = 'error';
        this.statusText = 'Error al actualizar los datos';
      }
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde';
      this.loading = false;
      // console.log(err);
    });
  }

}
