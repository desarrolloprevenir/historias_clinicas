import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  // CalendarEventAction,
  // CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthViewDay
} from 'angular-calendar';
import {
  startOfDay,
  addHours
} from 'date-fns';

import * as moment from 'moment';

const colors: any = {
  prevenir: {
    primary: '#00AEEF',
    secondary: '#75c6e6'
  },
  historial: {
    primary: '#6c757d',
    secondary: '#b3b8bd'
  }
};

// servicios
import { PlatformLocation } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { MedicoService } from 'src/app/services/medico.service';


@Component({
  selector: 'app-historial-citas-medico',
  templateUrl: './historial-citas-medico.component.html',
  styleUrls: ['./historial-citas-medico.component.css']
})
export class HistorialCitasMedicoComponent implements OnInit {
  // Variables calendario
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  selectedMonthViewDay: CalendarMonthViewDay;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  locale = 'es';

  // variables app
  public servicios;
  public loading;
  public servicioSelect;
  public servicio;
  public medicoId;
  public resEventos;
  public infoPaciente;
  public status;
  public statusText;


  constructor(private userService: UserService,
              private medicoService: MedicoService,
              location: PlatformLocation) {
                location.onPopState(() => {
                  document.getElementById('btn-cerrar-modal-info').click();
                });
              }

  ngOnInit() {
    this.medicoId = this.userService.getIdentity().medico_id;
    this.getServiciosMedico(this.medicoId);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  getServiciosMedico(idMedico) {
    this.loading = true;
    this.medicoService.getServicios(idMedico).subscribe( (response) => {
      console.log(response);
      this.servicios = response;
      this.loading = false;
    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
    });
  }

  serviciosSelecionado(ev) {
    this.servicioSelect = ev.value;
    console.log(this.servicioSelect);
  }

  servicioSelecionado(ev) {
    this.servicio = ev.value;
    console.log('sv', this.servicio);
    let anio = moment(new Date()).format('YYYY');
    let mes =  moment(new Date()).format('M');

    this.getHistorial(this.servicio.categoria_idcategoria, this.servicio.id_consultorio, anio, mes);
  }

  getHistorial(idCategoria, idConsultorio, anio, mes) {

    this.loading = true;
    this.events = [];
    // console.log(mes, anio, idCategoria, idConsultorio);

    this.medicoService.getHistorialCitasCalendar(mes, anio, this.medicoId, idCategoria, idConsultorio).subscribe( (response) => {
      console.log(response);
      this.resEventos = response;

      if (this.resEventos.length >= 1) {

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.resEventos.length; i++) {

          let title = this.resEventos[i].nombre + ' ' + this.resEventos[i].apellidos;

          let diaS = moment(this.resEventos[i].start).format('ddd');
          let mesS = moment(this.resEventos[i].start).format('MMM');
          let fechaS = moment(this.resEventos[i].start).format('DD-YYYY');
          let horaS = moment.utc(this.resEventos[i].start).format('h:mm:ss');
          let horaSs = moment.utc(this.resEventos[i].start).format('H');
          let start = diaS + ' ' + mesS + ' ' + fechaS + ' ' +  horaS;
              // d = horaS;

          let diaE = moment(this.resEventos[i].end).format('ddd');
          let mesE = moment(this.resEventos[i].end).format('MMM');
          let fechaE = moment(this.resEventos[i].end).format('DD-YYYY');
          let horaE = moment.utc(this.resEventos[i].end).format('h:mm:ss');
          let horaEe = moment.utc(this.resEventos[i].end).format('H');

          let end = diaE + ' ' + mesE + ' ' + fechaE + ' ' +  horaE;

          let info = {};

          let apellidos = this.resEventos[i].apellidos;
          let avatar = this.resEventos[i].avatar;
          let cedula = this.resEventos[i].cedula;
          let fecha_nacimiento = this.resEventos[i].fecha_nacimiento;
          let nombre = this.resEventos[i].nombre;
          let telefono = this.resEventos[i].telefono;
          let id_eventos = this.resEventos[i].id_eventos;

          info = {id : this.resEventos[i].id, tipo : 'usuario', apellidos, avatar, cedula,
                 fecha_nacimiento, nombre, telefono, id_eventos, color : colors.historial};
          this.addEvent(title, Date.parse(start), Date.parse(end), horaSs, horaEe, info);
        }
      }

      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
      // console.log(err);
    });

  }

  closeOpenMonthViewDay(ev) {
    // console.log(ev);
    // console.log(moment(ev).format('YYYY'), moment(ev).format('M'));
  this.getHistorial(this.servicio.categoria_idcategoria, this.servicio.id_consultorio, moment(ev).format('YYYY') , moment(ev).format('M'));
  }

  addEvent(title, start, end, horaInicio, horaFinal, info): void {
    this.loading = true;
    // console.log('aqui');
    this.events = [
      ...this.events,
      {
        title,
        start:  addHours(startOfDay(start), horaInicio),
        end:  addHours(startOfDay(end), horaFinal),
        color: info.color,
        id : info,
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];


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
    this.loading = false;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    document.getElementById('btn-abrir-modal-info').click();

    this.infoPaciente = event;
    // console.log(event);
  }

  cerrarAlerta(){
    this.status = undefined;
  }

  // dayClicked(info, dia) {
  //   this.viewDate = info;
  //   this.view = CalendarView.Day;
  // }

}
