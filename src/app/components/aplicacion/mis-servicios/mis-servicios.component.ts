import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import { MedicoService } from 'src/app/services/medico.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.component.html',
  styleUrls: ['./mis-servicios.component.css']
})
export class MisServiciosComponent implements OnInit {
  public loading;
  public servicios;
  public servicioSelect;
  public status;
  public statusText;
  public comentarios;
  public infoServicio;
  comentarioArea = new FormControl('', [Validators.required, Validators.minLength(2)]);
  public apiUrl = environment.apiUrl;

  constructor(private medicoService: MedicoService,
              private userService: UserService,
              private router: Router,
              location: PlatformLocation) {
                location.onPopState(() => {
                  document.getElementById('cerrar-modal-comentarios').click();
                });
              }

  ngOnInit() {
    let identity = this.userService.getIdentity().medico_id;
    this.getServiciosMedico(identity);
  }

  getServiciosMedico(id) {
    this.loading = true;
    this.medicoService.getServicios(id).subscribe( (response) => {
      // console.log(response);
      this.servicios = response;
      this.loading = false;
    }, () => {
      // console.log(err);
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.'
    });
  }

  serviciosSelecionado(ev) {
    // console.log(ev);
    this.servicioSelect = ev.value;
  }

  irCalendario(info) {
    // console.log(info);
    let inf = {id_servicios : info.id_servicios, id_categoria: info.categoria_idcategoria, id_consultorio : info.id_consultorio};
    localStorage.removeItem('calendar-medico');
    localStorage.setItem('calendar-medico', JSON.stringify(inf));
    this.router.navigate(['/calendario']);
  }

  verComentarios(info) {
    let identity = this.userService.getIdentity().medico_id;
    this.status = undefined;
    // console.log(info);
    this.loading = true;
    this.infoServicio = info;

    // console.log(identity);
    this.medicoService.getComentarioMedico(info.id_servicios, info.categoria_idcategoria, identity).subscribe( (response) => {
      // console.log(response);
      this.comentarios = response;
      this.loading = false;
      document.getElementById('btn-modal-comentarios').click();
    }, () => {
      this.loading = false;
      // console.log(err);
    });
  }

  responderComent(info) {
    // console.log(info);
    this.loading = true;
    let infoComent = { cate: this.infoServicio.categoria_idcategoria , coment : this.comentarioArea.value , id : info.id_comentarios };
    // console.log(infoComent);

    this.medicoService.respuestaComentarioMedico(infoComent).subscribe( (response) => {
      if (response === true) {
        this.status = 'success_modal';
        this.statusText = 'Respuesta exitosa';
        let info = {id_servicios : this.infoServicio.id_servicios , categoria_idcategoria: this.infoServicio.categoria_idcategoria};
        this.verComentarios(info);
        this.comentarioArea.reset();
      } else {
        this.status = 'error_modal';
        this.statusText = 'Error al enviar respuesta.';
      }

      this.loading = false;
    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      document.getElementById('cerrar-modal-comentarios').click();
      this.loading = false;
    });
  }

  cerrarAlerta() {
    this.status = undefined;
  }

}
