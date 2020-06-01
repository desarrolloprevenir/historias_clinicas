import { Component, OnInit, Input } from '@angular/core';
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
import { SucursalService } from '../../../services/sucursal.service';
import { FormControl } from '@angular/forms';
import { HitorialCitasComponent } from '../../admin/hitorial-citas/hitorial-citas.component';

const colors: any = {
   prevenir: {
    primary: '#00AEEF',
    secondary: '#75c6e6'
  } , historial: {
    primary: '#6c757d',
    secondary: '#6c757d'
  }
};

@Component({
  selector: 'app-calendario-reutilizable',
  templateUrl: './calendario-reutilizable.component.html',
  styleUrls: ['./calendario-reutilizable.component.css']
})
export class CalendarioReutilizableComponent implements OnInit {
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

  //////// Variables
  public res;
  public resHistorial;
  @Input() idConsultorio: FormControl = new FormControl();
  @Input() servicio;
  @Input() idSucursal;

  constructor(private sucursalService: SucursalService,
              private historiaCitas: HitorialCitasComponent) { }

  ngOnInit() {
    this.llamarHistorial();
  }

  llamarHistorial() {
    let anio = moment(new Date).format('YYYY');
    let mes =  moment(new Date).format('M');
    this.getHistorialSucursal(mes, anio);
    // this.getEventosSucursal(mes, anio);
  }

  closeOpenMonthViewDay(ev) {
    // console.log(ev);
    this.getHistorialSucursal(moment(ev).format('M'), moment(ev).format('YYYY'));
    // this.getEventosSucursal(moment(ev).format('M'), moment(ev).format('YYYY'));
  }

  setView(view: CalendarView) {
    // console.log(view);
    this.view = view;
  }

  handleEvent(action: string, event: CalendarEvent): void {

    // console.log(action, event);
  //   this.eliminar = false;
  //   this.info = event.id;
  //   this.status = false;
  //   this.statusT = false;


  //   if (this.info.tipo === 'mascota') {
  //     this.provedorService.getMascotaInfo(this.info.id).subscribe((response) => {
  //       // console.log('infoooo', this.info);
  //       this.mascota = response[0];
  //       this.mascota.dueno = this.mascota.dueño;
  //       this.mascota.id_eventos = this.info.id_eventos;
  //       this.mascota.id_consultorio = this.info.id_consultorio;
  //       // console.log('mascotaaa', this.mascota);
  //     }, () => {
  //       // console.log(err);
  //     });
  //     document.getElementById('btn-modal-evento').click();
  //   } else {
  //     this.mascota = false;
  //     document.getElementById('btn-modal-evento').click();
  //   }

  }

  hourSegmentClicked(ev) {

  }

  getHistorialSucursal(mes, anio) {
    console.log('aquii');
    this.historiaCitas.loading = true;
    // console.log('consultorio', this.idConsultorio, 'servicio', this.servicio, 'idSucursal', this.idSucursal);
    // console.log(this.id_consultorio);
    this.events = [];
    let consultorio;
    // console.log('hist');
    // console.log(this.consultorioSelecionado);
    if (!this.idConsultorio) {
      // console.log('1');
      consultorio = 0;
    } else {
       consultorio = this.idConsultorio;
    }

    // console.log('info his suc', mes,anio,this.serviciosSelect.value.id_servicios,this.serviciosSelect.value.id_categoria,
    // identity, this.id_consultorio)

    // tslint:disable-next-line: max-line-length
    // console.log(mes, anio, this.servicio.id_servicios, this.servicio.id_categoria , this.idSucursal, consultorio);
    // tslint:disable-next-line: max-line-length
    this.sucursalService.getHistorialSucursal(mes, anio, this.servicio.id_servicios, this.servicio.id_categoria , this.idSucursal, consultorio).subscribe( (response) => {
      this.historiaCitas.loading = false;
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

      // this.getEventosSucursal(mes, anio);
    }, () => {
      this.historiaCitas.loading = false;
      // console.log(err);
    } );

  }

  

  addEvent(title, start, end, horaInicio, horaFinal, info): void {
    // console.log(info);
    // this.loading = true;
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

    // this.loading = false;
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

  getEventosSucursal(mes, anio) {
    console.log('aqui');
    console.log(mes, anio, this.servicio.id_servicios, this.idSucursal, this.servicio.this.servicio.id_categoria);
    // console.log('aqui ev sucu', this.serviciosSelect);
    // this._sucursalService.getServiciosSucursal()
    // return this.http.get(this.url + '/eventser/' + mes + '/' + anio + '/' + id_serv + '/'+ id_sucursal+ '/' + id_cate, );
    // this.events = [];
    let consultorio;
    if (!this.idConsultorio) {
      // console.log('1');
      consultorio = 0;
    } else {
       consultorio = this.idConsultorio;
    }
    // let anio = moment(new Date).format('YYYY');
    // let mes =  moment(new Date).format('M');
    console.log(mes, anio, this.servicio.id_servicios, this.idSucursal, this.servicio.this.servicio.id_categoria, consultorio);
    // tslint:disable-next-line: max-line-length
    this.sucursalService.getEventsSucursal(mes, anio, this.servicio.id_servicios, this.idSucursal, this.servicio.this.servicio.id_categoria, consultorio).subscribe( (response) =>{
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
      this.historiaCitas.loading = false;
    } );

  }

}
