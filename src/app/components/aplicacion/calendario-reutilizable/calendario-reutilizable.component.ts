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
  }

  closeOpenMonthViewDay(ev) {
    // console.log(ev);
    this.getHistorialSucursal(moment(ev).format('M'), moment(ev).format('YYYY'));
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

  hourSegmentClicked() {

  }

  getHistorialSucursal(mes, anio) {
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
      // console.log('sucu', response);
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

}
