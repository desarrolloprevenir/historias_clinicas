import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
// import {
//   ChangeDetectionStrategy,
//   ViewChild,
//   TemplateRef
// } from '@angular/core';
import {
  startOfDay,
  // endOfDay,
  // subDays,
  // addDays,
  // endOfMonth,
  // isSameDay,
  // isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  // CalendarEventAction,
  // CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from 'angular-calendar';

import * as moment from 'moment';

const colors: any = {
   prevenir: {
    primary: '#00AEEF',
    secondary: '#75c6e6'
  } , historial: {
    primary: '#6c757d',
    secondary: '#6c757d'
  }
};

// Validaciones
import {FormControl, Validators} from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { UserService } from 'src/app/services/user.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { ProvedorService } from 'src/app/services/provedor.service';
import { MedicoService } from 'src/app/services/medico.service';

// Servicios


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
   // Variables calendario
   view: CalendarView = CalendarView.Month;
   CalendarView = CalendarView;
   viewDate: Date = new Date();
   selectedMonthViewDay: CalendarMonthViewDay;
   refresh: Subject<any> = new Subject();
   events: CalendarEvent[] = [];
   activeDayIsOpen = false;
   // Variables App
   title = 'cal';
   locale = 'es';
   md = false;
   ced: string;
   dia;
   days;
   serviciosSelect;
   servicios: any;
   datosUser = {nombre: '', apellidos: '', cedula: '', fecha_nacimiento: '', telefono: '', id : null, usuariosBf_id: null,
               masc : { nombre : '', apellidos : '', cedula: '', fecha_nacimiento: '', telefono: '', id: '', usuariosBf_id: ''}};
   existe: string;
   mostrar: any;
   horarioCita;
   botonDisabled = false;
   mascotas: string;
   mascotaSlt;
   information;
   status;
   statusT;
   statusW;
   statusText;
   public loading = false;
   info;
   mascota: any = false;
   eliminar = false;
   public tipoCuenta;
   public tipoDocumentoFor;
   public estadoCivilFor;
   public parentescos;
   public formBene;
   public entro;
   public numeroCedula;
   public infoConsultorio;

   // fechas de hoy
   public today;
   // FormsControls
   nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   confirmarIdentificacion = new FormControl('', [Validators.required, Validators.min(6), Validators.pattern('[0-9]*')]);
   apellidos = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   cedula = new FormControl('', [Validators.required, Validators.min(6), Validators.pattern('[0-9]*')]);
   fechaNacimiento = new FormControl('', Validators.required);
   email = new FormControl('', [Validators.required, Validators.email,
                                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]);
   confirmacionEmail = new FormControl('', [Validators.required, Validators.email,
     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]);
   telefono = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
   barrio = new FormControl('');
   direccion = new FormControl('');
   estadoCivil = new FormControl('');
   tipoDocumento = new FormControl('', [Validators.required]);
   ocupacion = new FormControl('', [Validators.pattern('[A-Z a-z ñ]*')]);
   eps = new FormControl('');
   acompanante = new FormControl('', [Validators.pattern('[A-Z a-z ñ]*')]);
   parentesco = new FormControl('');
   telAcompanante = new FormControl('', [Validators.pattern('[0-9]*')]);

   // datos mascota
   nombreMascota = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   especieMascota = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   raza = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   color = new FormControl('', Validators.pattern('[A-Z a-z ñ]*'));
   fechaNacimientoMascota =  new FormControl('', Validators.required);
   esterilizado = new FormControl('', Validators.required);
   sexoMascota = new FormControl('', Validators.required);
   peludito = new FormControl('', Validators.required);

   // datos beneficiario
   nombresBeneficiario = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   apellidosBeneficiario = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z ñ]*')]);
   fechaBeneficiario = new FormControl('', Validators.required);
   noIdentificacionBeneficiario = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
   telefonoBeneficiario = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
   parentescoBeneficiario = new FormControl('', Validators.required);

   // variable cambio de model de historia a agenda
   // public mymodel;
   public resHistorial;
   public res;
   public medicos;
   public nombreAgenda;
   public consultorioSelecionado;
   public idConsultorio;

  constructor(private aplicatioService: AppService,
              private userService: UserService,
              private sucursalService: SucursalService,
              private provedorService: ProvedorService,
              private medicoService: MedicoService,
              location: PlatformLocation) {
                location.onPopState(() => {
                  document.getElementById('btn-cerrar-modal-ver-cita').click();
                  document.getElementById('btn-cerrar-agregar-cita').click();
                  document.getElementById('btn-cerrar-ver-cita-medico').click();
            });
               }

  ngOnInit() {
    let identity = this.userService.getIdentity();
    if (identity.medico_id) {
      this.tipoCuenta = 'medico';
      let anio = moment(new Date()).format('YYYY');
      let mes =  moment(new Date()).format('M');
      this.getEventos(anio, mes);
      this.nombreAgenda = identity.nombres + ' ' + identity.apellidos;
    }

    if (identity.id_provedor && !identity.id_sucursales) {
      this.tipoCuenta = 'provedor';
      this.getPublicacionesProvedor();
    }

    if (identity.id_provedor && identity.id_sucursales) {
      // console.log('es sucursal');
      this.tipoCuenta = 'sucursal';
      this.getServiciosSucursal(identity.id_sucursales);
      this.nombreAgenda = identity.nombre;
    }
  }


  getServiciosSucursal(id) {
    // console.log('susc');
    this.loading = true;
    this.sucursalService.getServiciosSucursal(id).subscribe( (response) => {
      // console.log(response);
      // console.log('susc2');
      this.servicios = response;
      this.loading = false;
      // if(this.servicios.length <= 0) {
      // }
    }, () => {
      // console.log(err);
      this.status = true;
      this.statusText = 'Error en la conexión, intentalo mas tarde o revisa tu conexión.';
      this.loading = false;
    });
  }


  // tslint:disable-next-line:use-life-cycle-interface
  // ngOnDestroy() {
  //   // cerrar modales cuando salga del componente
  //   document.getElementById('btn-cerrar-modal-ver-cita').click();
  //   document.getElementById('btn-cerrar-agregar-cita').click();
  //   document.getElementById('btn-cerrar-ver-cita-medico').click();
  // }



  getPublicacionesProvedor() {
    this.loading = true;
    let identity = this.userService.getIdentity();
    this.aplicatioService.getPublicacionesProveedor(identity.id_provedor).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      if (response[0].vacio === true) {
        // console.log('vacio');
      } else {
        this.servicios = response;
        // console.log(this.servicios);
      }

    }, () => {
      this.status = true;
      this.statusText = 'Error en la conexión, intentalo mas tarde o revisa tu conexión.';
      this.loading = false;
      // console.log(err);
    });
  }


  getServiciosMedico(id) {
    this.medicoService.getServicios(id).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
    }, () => {
      // console.log(err);
      this.loading = false;
    });
  }

  // adelante() {
  //   this.activeDayIsOpen = false;
  // }

  // hoy() {
  //   this.activeDayIsOpen = false;
  //   // console.log(this.events);
  // }

  // atras() {
  //   this.activeDayIsOpen = false;
  // }

  dayClicked(dia) {
    // console.log(dia.day.isPast);
    if (dia.day.isPast === true) {
      // console.log('es un dia pasado');
    } else {
      this.viewDate = dia.day.date;
      this.view = CalendarView.Day;

    }
  }


  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   console.log(date);
  //   if (isSameMonth(date, this.viewDate)) {
  //     this.viewDate = date;
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //     }
  //   }
  // }

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd
  // }: CalendarEventTimesChangedEvent): void {
  //   console.log('aqui');
  //   this.events = this.events.map(iEvent => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd
  //       };
  //     }
  //     return iEvent;
  //   });
  //   // this.handleEvent('Dropped or resized', event);
  // }


  // Metodo pcuando se clikea un evento
  handleEvent(action: string, event: CalendarEvent): void {

    // console.log(action, event);
    this.eliminar = false;
    this.info = event.id;
    this.status = false;
    this.statusT = false;


    if (this.info.tipo === 'mascota') {
      this.provedorService.getMascotaInfo(this.info.id).subscribe((response) => {
        // console.log('infoooo', this.info);
        this.mascota = response[0];
        this.mascota.dueno = this.mascota.dueño;
        this.mascota.id_eventos = this.info.id_eventos;
        this.mascota.id_consultorio = this.info.id_consultorio;
        // console.log('mascotaaa', this.mascota);
      }, () => {
        // console.log(err);
      });
      document.getElementById('btn-modal-evento').click();
    } else {
      this.mascota = false;
      document.getElementById('btn-modal-evento').click();
    }

  }

  addEvent(title, start, end, horaInicio, horaFinal, info): void {
    // console.log(info);
    this.loading = true;
    // console.log('aqui add event');
    this.events = [
      ...this.events,
      {
        title,
        start:  addHours(startOfDay(start), horaInicio),
        end:  addHours(startOfDay(end), horaFinal),
        color: info.color,
        id : info,
        draggable: false,
        // resizable: {
        //   beforeStart: true,
        //   afterEnd: true
        // }
      }
    ];

    this.loading = false;
    // this.events = [
    //   ...this.events,
    //   {
    //     title: 'New event',
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     color: colors.red,
    //     draggable: true,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true
    //     }
    //   }
    // ];
    // console.log(this.events);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
    this. activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    console.log(view);
    this.view = view;
  }


  agregarCita() {
    this.status = null;
    this.statusT = null;
    this.statusW = null;
    this.loading = true;
    var token = this.userService.getToken();
    var date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');
    var datos = {};
    var benef = {};

    if (this.existe === 'false') {

      // if (!this.apellidos.valid) {
      //   console.log('apellido invalido');
      // } else if (!this.telefono.valid) {
      //   console.log('telefono invalido');
      // } else if (!this.fechaNacimiento.value) {
      //   console.log('fecha nacimiento invalido');
      // } else if (!this.nombre.valid) {
      //   console.log('nombre invalido');
      // }
      // cedula
      // {color:"#07a9df" , start:start,usuario:id,servicio:this.id_servicio ,
      // consultorio : this.medicoSelect.value.consultorio, mascota : this.mascota};

      if (this.formBene === true) {

        benef = {fecha_n: this.fechaBeneficiario.value, nombre: this.nombresBeneficiario.value,
                 apellidos: this.apellidosBeneficiario.value, ident: this.noIdentificacionBeneficiario.value,
                 parent : this.parentescoBeneficiario.value, tel : this.telefonoBeneficiario.value,
                 id_usu: this.datosUser.id, pais: 47, nuevo : true};

        datos = {  apellidos: this.apellidos.value.toUpperCase(), color : '#07a9df', existe : false, mascota: undefined,
        servicio : this.serviciosSelect.value.id_servicios, fecha_nacimiento: this.fechaNacimiento.value,
        start: date, contacto: this.telefono.value, nombres: this.nombre.value.toUpperCase(), usuario: this.numeroCedula,
        correo: this.email.value, tipoDocumento: this.tipoDocumento.value, estadoCivil : this.estadoCivil.value,
        ocupacion : this.ocupacion.value.toUpperCase(), direccion : this.direccion.value.toUpperCase(),
        barrio : this.barrio.value.toUpperCase(),
        eps : this.eps.value.toUpperCase(), acompanante : this.acompanante.value, consultorio : this.consultorioSelecionado.id_consultorio,
        parentesco : this.parentesco.value, telefonoAcompanante : this.telAcompanante.value, benef};

      } else {

        datos = {  apellidos: this.apellidos.value.toUpperCase(), color : '#07a9df', existe : false, mascota: undefined,
        servicio : this.serviciosSelect.value.id_servicios, fecha_nacimiento: this.fechaNacimiento.value,
        start: date, contacto: this.telefono.value, nombres: this.nombre.value.toUpperCase(), usuario: this.numeroCedula,
        correo: this.email.value, tipoDocumento: this.tipoDocumento.value, estadoCivil : this.estadoCivil.value,
        ocupacion : this.ocupacion.value.toUpperCase(), direccion : this.direccion.value.toUpperCase(),
        barrio : this.barrio.value.toUpperCase(),
        eps : this.eps.value.toUpperCase(), acompanante : this.acompanante.value, consultorio : this.consultorioSelecionado.id_consultorio,
        parentesco : this.parentesco.value, telefonoAcompanante : this.telAcompanante.value, benef};

      }
      // console.log(datos);
      this.loading = true;
      this.provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log('no existe', response);
        this.loading = false;
        let res = response[0];

        if (response[0].correo !== undefined && response[0].correo === false) {
          // console.log('correo repetido');
          this.statusW = 'warning';
          this.statusText = 'Este correo ya se encuentra registrado.';
          this.loading = false;
        }

        if (response[0].cedula !== undefined && response[0].cedula === true) {
          // console.log('correo repetido');
          this.statusW = 'warning';
          this.statusText = 'El número de identificación del beneficiario ya se encuentra registrado.';
          this.loading = false;
        }

        if (response[0].agregado !== undefined && response[0].agregado === true) {
            // console.log('agregada');
            let anio = moment(new Date).format('YYYY');
            let mes =  moment(new Date).format('M');
            this.getEventosSucursal(mes, anio);
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            window.scroll(0, 0);
            document.getElementById('btn-cerrar-agregar-cita').click();
            this.loading = false;
        }

        // else {
        //   console.log('aqui');
        //     this.status = true;
        //     this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        //     window.scroll(0, 0);
        //     this.loading = false;
        // }

        if (response[0].reservado !== undefined && response[0].reservado === true) {
          this.status = true;
          this.statusText = 'No se puede sacar la cita, el usuario ' + this.nombre.value + ' '
                             + this.apellidos.value + ' ya tiene una cita reservada para este dia.';
          window.scroll(0, 0);
          document.getElementById('btn-cerrar-agregar-cita').click();
          this.loading = false;
        }


      }, () => {
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        window.scroll(0, 0);
        this.loading = false;
      });

    } else {

      if (this.formBene === true) {

        benef = {fecha_n: this.fechaBeneficiario.value, nombre: this.nombresBeneficiario.value.toUpperCase(),
          apellidos: this.apellidosBeneficiario.value.toUpperCase(), ident: this.noIdentificacionBeneficiario.value,
        parent : this.parentescoBeneficiario.value, tel : this.telefonoBeneficiario.value,
        id_usu: this.datosUser.id, pais: 47, nuevo : true};

        datos = { color : '#07a9df', existe : true, mascota: undefined, servicio : this.serviciosSelect.value.id_servicios,
        start: date, usuario: this.datosUser.id, benef, consultorio : this.consultorioSelecionado.id_consultorio};

      } else {

        datos = { color : '#07a9df', existe : true, mascota: undefined, servicio : this.serviciosSelect.value.id_servicios,
        start: date, usuario: this.datosUser.id, benef, consultorio : this.consultorioSelecionado.id_consultorio};

      }

      // console.log(datos);
      this.provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        // console.log('existe', response);

        if ( response[0].agregado !== undefined && response[0].agregado === true) {
          // this.getEventos();
          let anio = moment(new Date).format('YYYY');
          let mes =  moment(new Date).format('M');
          this.getEventosSucursal(mes, anio);
          this.statusT = true;
          this.statusText = 'Cita agregado con exito.';
          window.scroll(0, 0);
          this.loading = false;
          document.getElementById('btn-cerrar-agregar-cita').click();
      }
      // else {
      //     this.status = true;
      //     this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
      //     window.scroll(0, 0);
      //     this.loading = false;
      // }

        if (response[0].cedula !== undefined && response[0].cedula === true) {
        // console.log('cedula repetido');
        this.statusW = 'warning';
        this.statusText = 'El número de identificación del beneficiario ya se encuentra registrado.';
        this.loading = false;
      }

        if (response[0].reservado !== undefined && response[0].reservado === true) {
        this.status = true;
        this.statusText = 'No se puede sacar la cita, el usuario ' + this.datosUser.nombre + ' '
                        + this.datosUser.apellidos + ' ya tiene una cita reservada para este dia.';
        window.scroll(0, 0);
        this.loading = false;
      }
      }, () => {
        // console.log(err);
        // console.log('aqui err');
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        window.scroll(0, 0);
        this.loading = false;
      });

    }
  }

  hourSegmentClicked(ev) {

    if (this.tipoCuenta === 'provedor' || this.tipoCuenta === 'sucursal') {
      window.scroll(0, 0);

    // let today = moment(new Date().toISOString()).format('YYYY-M-DD HH:mm:ss');
    // let today2 = moment(today);
    // let f = moment(ev.date).format('YYYY-MM-DD HH:mm:ss ');
    // let st = moment(f);
    // let hours = st.diff(today2, 'days');
    // console.log(ev);

      if (!this.consultorioSelecionado) {
      window.scroll(0, 0);
      this.statusW = true;
      this.statusText = 'Antes de sacar una cita por favor escoge un médico.';
    } else {

      if (new Date() < ev.date) {
        // console.log('es futuro');
        this.statusW = false;
        this.existe = undefined;
        this.formBene = undefined;
        this.horarioCita = ev.date;
        this.mascotaSlt = undefined;
        this.nombre.reset();
        this.apellidos.reset();
        // this.identificacion.reset();
        this.fechaNacimiento.reset();
        this.email.reset();
        this.telefono.reset();
        this.cedula.reset();
        this.nombreMascota.reset();
        this.sexoMascota.reset();
        this.especieMascota.reset();
        this.esterilizado.reset();
        this.ocupacion.reset();
        this.tipoDocumento.reset();
        this.direccion.reset();
        this.barrio.reset();
        this.estadoCivil.reset();
        this.eps.reset();
        this.acompanante.reset();
        this.parentesco.reset();
        this.telAcompanante.reset();

        this.noIdentificacionBeneficiario.reset();
        this.nombresBeneficiario.reset();
        this.apellidosBeneficiario.reset();
        this.telefonoBeneficiario.reset();
        this.parentescoBeneficiario.reset();
        this.fechaBeneficiario.reset();

        this.mostrar = false;
        let date = ev.date.toString();
        date = date.split(' ');
        date = date[0];
        // console.log(this.dias(date));
        // console.log(moment(ev.date).format('DD-MM-YYYY'));
        // console.log(moment(ev.date).format('h:mm:ss a'));
        this.dia = {dia: this.dias(date), fecha: moment(ev.date).format('DD-MM-YYYY'), hora: moment(ev.date).format('h:mm:ss a')};
        // console.log(this.dia);
        this.horarios(this.dias(date));

      } else {
        // console.log('es pasado');
        this.status = true;
        this.statusText = 'No puedes elegir una hora o fecha que ya paso, por favor escoge otro horario';
        window.scroll(0, 0);
      }
    }
    }
  }

  horarios(dia?) {

    this.loading = true;
    let date = moment(this.horarioCita).format('YYYY-MM-D');
    var hora = moment(this.horarioCita).format('h:mm:ss a').toString();
    // console.log(hora);
    var h = hora.split(' ');
    var horaInicio;
    var horaFinal;

    // console.log('consultorio id', this.consultorioSelecionado.id_consultorio);
    // console.log(date, this.serviciosSelect.value.id_servicios, this.serviciosSelect.value.id_categoria);
    this.provedorService.getHorario(date, this.consultorioSelecionado.id_consultorio, this.serviciosSelect.value.id_categoria).
        subscribe((response) => {
          // console.log('horariosssssss');
          console.log('horarios', response);
          this.information = response;
          this.loading = false;
          let bol = true;

          switch (bol === true) {
          case (this.information[0].maniana.length <= 1) && (this.information[1].tardes.length <= 1):

          this.status = true;
          this.statusText = 'El dia ' + dia + ' no tienes ningun horario de atencion.' ;
          window.scroll(0, 0);
          break;

          case (this.information[0].maniana.length <= 1) && (this.information[1].tardes.length >= 1):
          // console.log('Solo horario en la tarde');
          if (h[1] === 'am') {
            this.status = true;
            this.statusText = 'El dia ' + dia + ' Solo tienes horario en la tarde.';
            window.scroll(0, 0);
          } else {

            let num = this.information[1].tardes.length;
            horaInicio = this.information[1].tardes[0].hora;
            var coincide;

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.information[1].tardes.length; i++) {

              if (parseInt(hora) === parseInt(this.information[1].tardes[i].hora)  ) {
                // console.log('coincide', hora, this.information[1].tardes[i].hora);
                coincide = true;

                if ( this.information[1].tardes[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[1].tardes[i]
                                    + ', por favor intenta en otra hora';
                                    window.scroll(0, 0);
                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                break;
              }

              if (num = this.information[1].tardes.length) {
                horaFinal = this.information[1].tardes[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
              this.status = true;
              this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de '  + horaInicio + ' - '
              + horaFinal + ', por favor escoge otro horario';
              window.scroll(0, 0);
            }


          }

          this.loading = false;
          break;

          case (this.information[0].maniana.length >= 1) && (this.information[1].tardes.length <= 1):
          // console.log('Solo horario en la mañana');

          if (h[1] === 'am') {

            let num = this.information[0].maniana.length;
            horaInicio = this.information[0].maniana[0].hora;
            var coincide;

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.information[0].maniana.length; i++) {

              if( parseInt(hora) === parseInt(this.information[0].maniana[i].hora)  ) {
                // console.log('coincide', hora, this.information[0].maniana[i].hora);
                coincide = true;

                if ( this.information[0].maniana[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[0].maniana[i].hora
                                    + ', por favor intenta en otra hora';
                  window.scroll(0, 0);
                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                this.loading = false;
                break;
              }

              if (num = this.information[0].maniana.length) {
                horaFinal = this.information[0].maniana[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
               this.status = true;
               this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de '  + horaInicio + ' - '
               + horaFinal + ', por favor escoge otro horario';
               window.scroll(0, 0);
            }


          } else {
            this.status = true;
            this.statusText = 'El dia ' + dia + ' Solo tienes horario en la mañana.';
            window.scroll(0, 0);
          }
          this.loading = false;
          break;

          case (this.information[0].maniana.length >= 1) && (this.information[1].tardes.length >= 1):
          // console.log('horario todo el dia');

          horaInicio = this.information[0].maniana[0].hora;

          if (h[1] === 'am') {

            let num = this.information[0].maniana.length;
            horaInicio = this.information[0].maniana[0].hora;
            var coincide;

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.information[0].maniana.length; i++) {

              if ( parseInt(hora) === parseInt(this.information[0].maniana[i].hora)  ) {
                // console.log('coincide', hora, this.information[0].maniana[i].hora);
                coincide = true;

                if ( this.information[0].maniana[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[0].maniana[i].hora
                                    + ', por favor intenta en otra hora';
                  window.scroll(0, 0);

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                this.loading = false;
                break;
              }

              if (num = this.information[0].maniana.length) {
                horaFinal = this.information[0].maniana[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
               this.status = true;
               this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de'  + horaInicio + ' - '
               + horaFinal + ', por favor escoge otro horario';
               window.scroll(0, 0);
            }

          } else {

            let num = this.information[1].tardes.length;
            horaInicio = this.information[1].tardes[0].hora;
            var coincide;

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.information[1].tardes.length; i++) {

              if( parseInt(hora) === parseInt(this.information[1].tardes[i].hora)  ) {
                // console.log('coincide', hora, this.information[1].tardes[i].hora);
                coincide = true;

                if ( this.information[1].tardes[i].disponible === true ) {
                  // console.log('puede sacar cita');
                  document.getElementById('openModalButton').click();

                } else {
                  this.status = true;
                  this.statusText = 'horario lleno no puede sacar cita a las ' + this.information[1].tardes[i].hora
                                    + ', por favor intenta en otra hora';

                }
              } else {
                coincide = false;
              }

              if (coincide === true) {
                this.loading = false;
                break;
              }

              if (num = this.information[1].tardes.length) {
                horaFinal = this.information[1].tardes[i].hora;
              }
            }

            // console.log(horaInicio, horaFinal);

            if (coincide === false) {
              this.status = true;
              this.statusText = 'No se puede sacar cita por fuera del horario de atención de este servicio de '  + horaInicio + ' - '
              + horaFinal + ', por favor escoge otro horario';
              window.scroll(0, 0);
            }

          }
          this.loading = false;
          break;
        }

        }, () => {
          this.loading = false;
          // console.log(err);
          this.status = true;
          this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
          window.scroll(0, 0);
        });

  }

  dias(dia): string {

    let bol = true;
    switch (bol === true) {

      case (dia === 'Mon'):
      return 'Lunes';
      break;

      case (dia === 'Sun'):
      return 'Domingo';
      break;

      case (dia === 'Tue'):
      return 'Martes';
      break;

      case (dia === 'Wed'):
      return 'Miércoles';
      break;

      case (dia === 'Thu'):
      return 'Jueves';
      break;

      case (dia === 'Fri'):
      return 'Viernes';
      break;

      case (dia === 'Sat'):
      return 'Sabado';
      break;
    }
  }

  buscarCedula() {
    // console.log(this.cedula.value);
    this.status = null;

    if (this.serviciosSelect.value.id_categoria === 20) {
      this.mostrar = false;
      this.existe = undefined;
      this.peludito.reset();
      this.mascotaSlt = undefined;
      this.provedorService.cedula(this.cedula.value, true).subscribe( (response) => {
        // console.log(response);
        if (response === false) {
          this.mostrar = true;
          this.mascotas = 'false';
          this.datosUser.cedula = this.cedula.value;
        } else {
          // console.log('aqui');
          this.mostrar = true;
          this.mascotas = 'true';
          this.datosUser = response[0];
          // console.log(this.datosUser);
        }
      }, (err) => {
        // console.log(err);
      });

    } else {

      this.mostrar = false;
      this.mascotas = undefined;
      this.provedorService.cedula(this.cedula.value, false).subscribe( (response) => {
      this.numeroCedula = this.cedula.value;
      // console.log(response);
      if (response === false) {
        // this.valdiacionesExiste();
        this.tpDocumento();
        this.getParentescos();
        this.existe = 'false';
        this.mostrar = true;
        this.datosUser = {nombre: '', apellidos: '', cedula: '', fecha_nacimiento: '', telefono: '', id : null, usuariosBf_id: null,
                          masc : { nombre : '', apellidos : '', cedula: '', fecha_nacimiento: '', telefono: '', id: '', usuariosBf_id: ''}};
        // console.log(this.datosUser);

      } else {
        this.datosUser = response[0];
        // console.log(this.datosUser);
        this.existe = 'true';
        this.mostrar = true;
      }
    }, (err) => {
      // console.log(err);
    });
    }
  }

  getParentescos() {
    this.aplicatioService.getParentescos().subscribe( (response) => {
      // console.log(response);
      this.parentescos = response;
    }, (err) => {
      // console.log(err);
    });
  }

  tpDocumento() {
    this.tipoDocumentoFor = [{tipo : 'CC' , nombre : 'Cédula de Ciudadanía'},
                          {tipo : 'CE' , nombre : 'Cédula de Extranjería'},
                          {tipo : 'PA' , nombre : 'Pasaporte'},
                          {tipo : 'RC' , nombre : 'Registro Civil'},
                          {tipo : 'TI' , nombre : 'Tarjeta de Identidad'}];

    this.estadoCivilFor = [{tipo : 'Solter@' , nombre : 'Solter@'},
                        {tipo : 'Comprometid@' , nombre : 'Comprometid@'},
                        {tipo : 'Casad@' , nombre : 'Casad@'},
                        {tipo : 'Union libre' , nombre : 'Union libre'},
                        {tipo : 'Separad@' , nombre : 'Separad@'},
                        {tipo : 'Divorciad@' , nombre : 'Divorciad@'},
                        {tipo : 'Viud@' , nombre : 'Viud@'},
                        {tipo : 'Noviazgo' , nombre : 'Noviazgo'}];
  }

  serviciosSelecionado(ev) {

    // console.log(ev);
    this.events = [];
    this.serviciosSelect = ev;

    let date = new Date();
    this.viewDate = date;
    this.view = CalendarView.Month;
    this.status = false;
    this.statusT = false;
    this.consultorioSelecionado = undefined;
    // console.log(this.id_consultorio);
    if (this.tipoCuenta === 'provedor') {

        // this.getEventos();
        // let anio = moment(new Date).format('YYYY');
        // let mes =  moment(new Date).format('M');
        // this.getEventosHistorial(mes,anio);
    }

    if (this.tipoCuenta === 'sucursal') {
        this.getConsultoriosSucursalPorServicio();
        let anio = moment(new Date).format('YYYY');
        let mes =  moment(new Date).format('M');
        this.getHistorialSucursal(mes, anio);
        this.getEventosSucursal(mes, anio);
    }
  }

  closeOpenMonthViewDay(ev) {
    // console.log(ev);
    this.getHistorialSucursal(moment(ev).format('M'), moment(ev).format('YYYY'));
    this.getEventosSucursal(moment(ev).format('M'), moment(ev).format('YYYY'));
  }

  getHistorialSucursal(mes, anio) {
    // console.log(this.id_consultorio);
    this.events = [];
    // console.log('hist');
    let identity = this.userService.getIdentity().id_sucursales;

    // console.log(this.consultorioSelecionado);
    if(!this.consultorioSelecionado) {
      // console.log('1');
      this.idConsultorio = 0;
    } else {
      this.idConsultorio =  this.consultorioSelecionado.id_consultorio;
    }

    // console.log('info his suc', mes,anio,this.serviciosSelect.value.id_servicios,this.serviciosSelect.value.id_categoria,
    // identity, this.id_consultorio)

    // tslint:disable-next-line: max-line-length
    this.sucursalService.getHistorialSucursal(mes, anio, this.serviciosSelect.value.id_servicios, this.serviciosSelect.value.id_categoria, identity, this.idConsultorio).subscribe( (response) => {
      // console.log('sucu', response);

      this.resHistorial = response;

      if (this.resHistorial.length >= 1) {

        for (let i = 0; i < this.resHistorial.length; i++) {

          let title = this.resHistorial[i].title;

          let diaS = moment(this.resHistorial[i].start).format('ddd');
          let mesS = moment(this.resHistorial[i].start).format('MMM');
          let fechaS = moment(this.resHistorial[i].start).format('DD-YYYY');
          let horaS = moment.utc(this.resHistorial[i].start).format('h:mm:ss');
          let horaSs = moment.utc(this.resHistorial[i].start).format('H');
          let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
              // d = horaS;

          let diaE = moment(this.resHistorial[i].end).format('ddd');
          let mesE = moment(this.resHistorial[i].end).format('MMM');
          let fechaE = moment(this.resHistorial[i].end).format('DD-YYYY');
          let horaE = moment.utc(this.resHistorial[i].end).format('h:mm:ss');
          let horaEe = moment.utc(this.resHistorial[i].end).format('H');

          let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;
          let info = {};

          let apellidos = response[i].apellidos;
          let avatar = response[i].avatar;
          let cedula = response[i].cedula;
          let fecha_nacimiento = response[i].fecha_nacimiento;
          let nombre = response[i].nombre;
          let telefono = response[i].telefono;

          info = {id : this.resHistorial[i].id, tipo : 'usuario', historial : true,  apellidos, avatar,
          cedula, fecha_nacimiento, nombre, telefono, color : colors.historial } ;

          // console.log('eventos', horaSs, horaEe);
          this.addEvent(title, Date.parse(start), Date.parse(start), horaSs, horaEe, info );
        }
      }
    }, () => {
      // console.log(err);
    } );

  }

  getConsultoriosSucursalPorServicio() {

    let identity = this.userService.getIdentity().id_sucursales;
    this.sucursalService.getConsultoriosSegunServicio(identity, this.serviciosSelect.value.id_servicios).subscribe( (response)=> {
      // console.log('consuls', response);
      this.medicos = response;
    }, () => {
      // console.log(err);
    } );
  }

  consultorioSelect(ev) {
    // console.log(ev);
    this.nombreAgenda = ev.value.medico;
    this.consultorioSelecionado = ev.value;
    // this.getEventosHistorial();
    let anio = moment(new Date).format('YYYY');
    let mes =  moment(new Date).format('M');
    this.getHistorialSucursal(mes, anio);
    this.getEventosSucursal(mes, anio);
    // this.horarios();
    this.getInfoConsultorio(this.consultorioSelecionado.id_consultorio);
  }

  getInfoConsultorio(idConsultorio) {
    this.loading = true;
    this.sucursalService.getInfoConsultorio(idConsultorio).subscribe( (response) => {
      console.log('info_cc', response);
      this.infoConsultorio = response[0];
    }, () => {
      // console.log(err);
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexion, Por favor revisa tu conexion o intentalo mas tarde.';
    } );
  }

  mascotaSelect(ev) {
    // console.log(ev.target.value);
    if (ev.target.value === 'agregarOtra') {
      this.mascotaSlt = ev.target.value;
    } else {
      this.mascotaSlt = ev.target.value;
    }

  }


  // metodo para agregar citas a servicios de veterianaria
  // parametro : tipo de cita, agregar, existe, nueva.
  agregarCitaMascota(tipo) {
    window.scroll(0, 0);
    var date = moment(this.horarioCita).format('YYYY-M-DD') + ' ' + moment(this.horarioCita).format('h:mm:ss a');
    var token = this.userService.getToken();
    var anio = moment(new Date).format('YYYY');
    var mes =  moment(new Date).format('M');

    if (tipo === 'agregar') {
      let datos = {apellidos : this.datosUser.apellidos, color : '#07a9df', colorMascota : this.color.value,
                   contacto : this.datosUser.telefono , especie: this.especieMascota.value, esterilizado: this.esterilizado.value,
                   existe : true , existem : false, fecha_nacimiento : this.fechaNacimientoMascota.value, mascota : true,
                   nombreMascota : this.nombreMascota.value, nombres : this.datosUser.nombre, raza : this.raza.value,
                   servicio : this.serviciosSelect.value.id_servicios, sexo : this.sexoMascota.value, start : date,
                   usuario : this.datosUser.id, correo: this.email.value, consultorio : this.consultorioSelecionado.id_consultorio};

      console.log('agregar', datos);
      this.loading = true;
      this.provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        // console.log(response);
        window.scroll(0, 0);
        if (response[0].agregado === true) {
            this.getEventosSucursal(mes, anio);
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            this.loading = false;
        }

        if (response[0].reservado !== undefined && response[0].reservado === true) {
          this.status = true;
          this.statusText = 'No se puede sacar la cita, el usuario ya tiene una cita reservada para este dia.';
          this.loading = false;
        }
      }, () => {
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
        // console.log(err);
      });
    }

    if (tipo === 'existe') {
      // tslint:disable-next-line:radix
      let idMascota = parseInt(this.peludito.value);
      let datos = {apellidos: this.datosUser.apellidos, color: '#07a9df', contacto: this.datosUser.telefono, existe: true, existem: true,
                   idMascota , mascota: true, nombres: this.datosUser.nombre,
                   servicio: this.serviciosSelect.value.id_servicios, start : date, usuario: this.datosUser.id,
                   consultorio : this.consultorioSelecionado.id_consultorio};
      console.log('existe', datos);
      this.loading = true;
      this.provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        console.log(response);
        window.scroll(0, 0);
        if (response[0].agregado === true) {

            this.getEventosSucursal(mes, anio);
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            this.loading = false;
        }

        if (response[0].reservado !== undefined && response[0].reservado === true) {
          this.status = true;
          this.statusText = 'No se puede sacar la cita, el usuario ya tiene una cita reservada para este dia.';
          this.loading = false;
        }

      }, (err) => {
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
        // console.log(err);
      });

    }

    if (tipo === 'nueva') {
      let datos = {apellidos: this.apellidos.value, color : '#07a9df', contacto: this.telefono.value, especie: this.especieMascota.value,
                   esterilizado : this.esterilizado.value, existe : false, mascota : true, nombreMascota: this.nombreMascota.value,
                   nombres : this.nombre.value, servicio : this.serviciosSelect.value.id_servicios, sexo : this.sexoMascota.value,
                   start : date, usuario : this.datosUser.cedula, consultorio : this.consultorioSelecionado.id_consultorio};
      // console.log('nueva', datos);
      this.loading = true;
      this.provedorService.postCitasProvedor(datos, token).subscribe ((response) => {
        window.scroll(0, 0);
        // console.log(response);
        if (response[0].agregado === true) {
            this.statusT = true;
            this.statusText = 'Cita agregado con exito.';
            this.getEventosSucursal(mes, anio);
            this.loading = false;
        } else {
            this.status = true;
            this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
            this.loading = false;
        }
      }, () => {
        this.status = true;
        this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
        this.loading = false;
        // console.log(err);
      });
    }
  }

  cerrarAlerta() {
    this.status = false;
    this.statusT = false;
    this.statusW = false;
  }

  getEventos (anio, mes) {
    // console.log('aqui get ev citas');
    this.events = [];
    var id_consultorio;
    var id_categoria;

    if (this.tipoCuenta === 'medico') {
        let inf = localStorage.getItem('calendar-medico');
        let jinf = JSON.parse(inf);
        id_consultorio = jinf.id_consultorio;
        id_categoria = jinf.id_categoria;
    }

    if (this.tipoCuenta === 'provedor') {
      id_consultorio = this.serviciosSelect.value.id_consultorio;
      id_categoria =  this.serviciosSelect.value.id_categoria;
    }


    // console.log(this.serviciosSelect);
    // console.log(anio, mes);

    this.provedorService.getEventos(mes, anio, id_consultorio , id_categoria)
        .subscribe( (response) => {
          // console.log('aqui 2, eventos');
          console.log(response);
          var respuesta = response;

          if (respuesta.length <= 0) {
            // console.log('no hay eventos');
          }  else {
            // var d;
            for (let i = 0; i < respuesta.length; i++) {

              let title = respuesta[i].title;

              let diaS = moment(respuesta[i].start).format('ddd');
              let mesS = moment(respuesta[i].start).format('MMM');
              let fechaS = moment(respuesta[i].start).format('DD-YYYY');
              let horaS = moment.utc(respuesta[i].start).format('h:mm:ss');
              let horaSs = moment.utc(respuesta[i].start).format('H');
              let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
              // d = horaS;

              let diaE = moment(respuesta[i].end).format('ddd');
              let mesE = moment(respuesta[i].end).format('MMM');
              let fechaE = moment(respuesta[i].end).format('DD-YYYY');
              let horaE = moment.utc(respuesta[i].end).format('h:mm:ss');
              let horaEe = moment.utc(respuesta[i].end).format('H');

              let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;
              let id_eventos = respuesta[i].id_eventos;
              let info = {};


              if (respuesta[i].id_mascotas) {

              let id_usuarios = respuesta[i].id_usuarios;
              // let color = respuesta[i].color;
              let especie = respuesta[i].especie;
              let esterilizado = respuesta[i].esterilizado;
              let fecha_nacimineto = respuesta[i].fecha_nacimineto;
              let nombre = respuesta[i].nombre ;
              let raza = respuesta[i].raza;
              let sexo = respuesta[i].sexo;
              let avatar = response[i].avatar;

              info = {id : respuesta[i].id_mascotas , tipo : 'mascota' , id_usuarios, especie,
                 esterilizado, fecha_nacimineto, nombre, raza, sexo,
                 avatar, id_eventos, color : colors.prevenir};
              this.addEvent(title, Date.parse(start), Date.parse(start), horaSs, horaEe, info );
              } else {

              let apellidos = response[i].apellidos;
              let avatar = response[i].avatar;
              let cedula = response[i].cedula;
              let fecha_nacimiento = response[i].fecha_nacimiento;
              let nombre = response[i].nombre;
              let telefono = response[i].telefono;

              info = {id : respuesta[i].usuarios_id, tipo : 'usuario', apellidos, avatar , cedula,
                        fecha_nacimiento, nombre, telefono, id_eventos ,
                         color : colors.prevenir} ;
              this.addEvent(title, Date.parse(start), Date.parse(start), horaSs, horaEe, info );
              }

            }
            // console.log(d);
          }

          // this.addEvent();
        }, () => {
          // console.log(err);
        });
  }

  getEventosSucursal(mes, anio) {
    // console.log('aqui ev sucu', this.serviciosSelect);
    // this._sucursalService.getServiciosSucursal()
    // return this.http.get(this.url + '/eventser/' + mes + '/' + anio + '/' + id_serv + '/'+ id_sucursal+ '/' + id_cate, );
    this.events = [];
    let consultorio;
    if (!this.consultorioSelecionado) {
      consultorio = 0;
    } else {
      consultorio = this.consultorioSelecionado.id_consultorio;
    }

    // let anio = moment(new Date).format('YYYY');
    // let mes =  moment(new Date).format('M');
    let identity = this.userService.getIdentity();
    // tslint:disable-next-line: max-line-length
    this.sucursalService.getEventsSucursal(mes, anio, this.serviciosSelect.value.id_servicios, identity.id_sucursales, this.serviciosSelect.value.id_categoria, consultorio).subscribe( (response) =>{
      console.log('res ev', response);
      this.res = response;

      if (this.res.length >= 1) {
        // console.log('kk');
        // var d;
        for (let i = 0; i < this.res.length; i++) {

          let title = this.res[i].title;

          let diaS = moment(this.res[i].start).format('ddd');
          let mesS = moment(this.res[i].start).format('MMM');
          let fechaS = moment(this.res[i].start).format('DD-YYYY');
          let horaS = moment.utc(this.res[i].start).format('h:mm:ss');
          let horaSs = moment.utc(this.res[i].start).format('H');
          let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
          let id_consultorio = this.res[i].id_consultorio;
          // d = horaS;

          let diaE = moment(this.res[i].end).format('ddd');
          let mesE = moment(this.res[i].end).format('MMM');
          let fechaE = moment(this.res[i].end).format('DD-YYYY');
          let horaE = moment.utc(this.res[i].end).format('h:mm:ss');
          let horaEe = moment.utc(this.res[i].end).format('H');

          let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;
          let id_eventos = this.res[i].id_eventos;
          let info = {};


          if (this.res[i].id_mascotas) {

          let id_usuarios = this.res[i].id_usuarios;
          // let color = this.res[i].color;
          let especie = this.res[i].especie;
          let esterilizado = this.res[i].esterilizado;
          let fecha_nacimineto = this.res[i].fecha_nacimineto;
          let nombre = this.res[i].nombre ;
          let raza = this.res[i].raza;
          let sexo = this.res[i].sexo;
          let avatar = response[i].avatar;

          info = {id : this.res[i].id_mascotas , tipo : 'mascota' , id_usuarios , especie,
             esterilizado, fecha_nacimineto, nombre, raza, sexo, avatar,
             id_eventos, color : colors.prevenir, id_consultorio};
          this.addEvent(title, Date.parse(start), Date.parse(start), horaSs, horaEe, info );
          } else {

          let apellidos = response[i].apellidos;
          let avatar = response[i].avatar;
          let cedula = response[i].cedula;
          let fecha_nacimiento = response[i].fecha_nacimiento;
          let nombre = response[i].nombre;
          let telefono = response[i].telefono;

          info = {id : this.res[i].usuarios_id, tipo : 'usuario', apellidos , avatar , cedula, id_consultorio,
                    fecha_nacimiento, nombre, telefono, id_eventos , color : colors.prevenir} ;
          this.addEvent(title, Date.parse(start), Date.parse(start), horaSs, horaEe, info );
          }
          // console.log('info',info);
        }
      }


    }, () => {
      // console.log(err);
      this.status = true;
      this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
    } );

  }


  getEventosHistorial(mes, anio) {

    this.loading = true;
    // console.log('aqui eventos historial');
    this.events = [];

    let id_servicio  = this.serviciosSelect.value.id_servicios;
    let id_categoria =  this.serviciosSelect.value.id_categoria;

    // mes,anio,id_categoria,id_servicio

    this.provedorService.getHistorialCitas(mes, anio, id_servicio, id_categoria).subscribe( (response) => {
      // console.log(response);
      this.resHistorial = response;

      if (this.resHistorial.length >= 1) {

        for (let i = 0; i < this.resHistorial.length; i++) {

          let title = this.resHistorial[i].title;

          let diaS = moment(this.resHistorial[i].start).format('ddd');
          let mesS = moment(this.resHistorial[i].start).format('MMM');
          let fechaS = moment(this.resHistorial[i].start).format('DD-YYYY');
          let horaS = moment.utc(this.resHistorial[i].start).format('h:mm:ss');
          let horaSs = moment.utc(this.resHistorial[i].start).format('H');
          let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
              // d = horaS;

          let diaE = moment(this.resHistorial[i].end).format('ddd');
          let mesE = moment(this.resHistorial[i].end).format('MMM');
          let fechaE = moment(this.resHistorial[i].end).format('DD-YYYY');
          let horaE = moment.utc(this.resHistorial[i].end).format('h:mm:ss');
          let horaEe = moment.utc(this.resHistorial[i].end).format('H');

          let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;
          let info = {};

          let apellidos = response[i].apellidos;
          let avatar = response[i].avatar;
          let cedula = response[i].cedula;
          let fecha_nacimiento = response[i].fecha_nacimiento;
          let nombre = response[i].nombre;
          let telefono = response[i].telefono;

          info = {id : this.resHistorial[i].id, tipo : 'usuario', historial : true,  apellidos , avatar, cedula,
                  fecha_nacimiento, nombre, telefono, color : colors.historial } ;
          this.addEvent(title, Date.parse(start), Date.parse(start), horaSs, horaEe, info );

        }
      }
      this.loading = false;
    }, () => {
      // console.log(err);
      this.status = true;
      this.statusText = 'Error al agregar la cita, intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
      // this.loading = false;
    });
  }

  eliminarCitaConfirmacion() {
    this.eliminar = true;
  }

  cancelarEliminarCita() {
    this.eliminar = false;
  }

  eliminarCita(bol, info) {

    // console.log(bol, info);
    this.loading = true;
    window.scroll(0, 0);

    let token = this.userService.getToken();
    let categoria;
    let id_consultorio;

    // var usuarios_id;
    if (this.tipoCuenta === 'medico') {
      id_consultorio = localStorage.getItem('calendar-medico');
      id_consultorio = JSON.parse(id_consultorio);
      id_consultorio = id_consultorio.id_consultorio;
    } else if (this.tipoCuenta === 'provedor') {
      // usuarios_id = this._userService.getIdentity().id_provedor;
      id_consultorio = info.id_consultorio;
    } else if (this.tipoCuenta === 'sucursal') {
      id_consultorio = info.id_consultorio;
      // usuarios_id = this._userService.getIdentity().id_sucursales;
    }

    if (bol === true) {
      // mascota
      categoria = 20;
    } else {
      // usuarios
      categoria = 0;
    }

    console.log(info.id_eventos, id_consultorio, categoria);

    this.provedorService.dltCitaProvedor(info.id_eventos, id_consultorio, categoria, token).subscribe( (response) => {
            console.log('eli', response);
            this.loading = false;
            if (response[0].borrado === true) {
              // this.getEventos();
                let anio = moment(new Date).format('YYYY');
                let mes =  moment(new Date).format('M');
                if (this.tipoCuenta === 'sucursal') {
                this.getEventosSucursal(mes, anio);
              }

                if (this.tipoCuenta === 'medico') {
                this.getEventos(anio, mes);
              }

                this.statusT = true;
                this.statusText = 'La cita fue elimina con exito.';
                window.scroll(0 , 0);
            } else {
              this.status = true;
              this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
              window.scroll(0 , 0);
            }
          }, (err) => {
            // console.log(err);
             this.status = true;
             this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
             window.scroll(0 , 0);
             this.loading = false;
          });


    // if (bol === true ) {
    //   // es una mascota
    //     this._provedorService.dltCitaProvedor(info.id_eventos, info.id_consultorio, 20, token).subscribe( (response) => {
    //       // console.log(response);
    //       this.loading = false;
    //       if (response[0].borrado === true) {
    //         this.getEventos();
    //         this.statusT = true;
    //         this.statusText = 'La cita fue elimina con exito.';
    //         window.scroll(0 , 0);
    //       } else {
    //         this.status = true;
    //         this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
    //         window.scroll(0 , 0);
    //       }
    //     }, (err) => {
    //       // console.log(err);
    //        this.status = true;
    //        this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
    //        window.scroll(0 , 0);
    //        this.loading = false;
    //     });
    // } else {
    //   // es un usuario
    //   this._provedorService.dltCitaProvedor(info.id_eventos,  info.id_consultorio, 0, token).subscribe( (response) => {
    //     // console.log(response);
    //     this.loading = false;
    //     if (response[0].borrado === true) {
    //       this.getEventos();
    //       this.statusT = true;
    //       this.statusText = 'La cita fue elimina con exito.';
    //       window.scroll(0 , 0);

    //     } else {
    //       this.status = true;
    //       this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
    //       window.scroll(0 , 0);
    //     }
    //   }, (err) => {
    //     // console.log(err);
    //     this.status = true;
    //     this.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
    //     window.scroll(0 , 0);
    //     this.loading = false;
    //   });

    // }
  }

  agregarBene() {

    this.formBene = true;
    // this.getParentescos();
  }

  cancelarBene(){
    this.formBene = false;
  }

  // metodo para cambiar de pestaña de agenda a historial
  // pestana(pestana) {
  //   // console.log('aqui');

  //   this.mymodel = pestana;
  //   var li = document.getElementById(this.mymodel);

  //   if (this.mymodel === 'agenda') {

  //       let l = document.getElementById('historial');
  //       l.className = 'list-group-item';
  //       li.className = 'list-group-item active';
  //       console.log('agenda');
  //       if(this.serviciosSelect.value.id_servicios){
  //         this.getEventos();
  //         this.setView(CalendarView.Month);
  //       }
  //   }

  //   if (li.id === 'historial') {
  //           let l = document.getElementById('agenda');
  //           l.className = 'list-group-item';
  //           li.className = 'list-group-item active';

  //           if(this.serviciosSelect.value.id_servicios) {
  //             let anio = moment(new Date).format('YYYY');
  //             let mes =  moment(new Date).format('M');
  //             this.getEventosHistorial(mes, anio);
  //             this.setView(CalendarView.Month);
  //           }
  //         }
  // }





}
