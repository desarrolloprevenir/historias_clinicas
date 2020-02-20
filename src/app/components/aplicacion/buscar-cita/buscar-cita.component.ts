import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';
import { AppService } from '../../../services/app.service';
import { MedicoService } from '../../../services/medico.service';

@Component({
  selector: 'app-buscar-cita',
  templateUrl: './buscar-cita.component.html',
  styleUrls: ['./buscar-cita.component.css']
})
export class BuscarCitaComponent implements OnInit {

  cedula = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]);
  public infoCitasPaciente;
  public infoCitasMascotas;
  public confirmacionEli = false;
  public mascota;
  public infoUser;
  public loading;

  // Informacion de una cita a eliminar
  public infoCita;
  // Informacion de cita actal en curso segun servicio
  public infoSiguienteCita;
  //
  public citasAgregadas;
  public citasAgregadasMasc;
  public enCurso = [];

  // variables para citas
  medico;
  public infoRes: any;
  public infoResMasc: any;
  public citasActivas;
  public citasActivasMascotas;
  public entro;
  public res;
  public intervalo;
  public medicoId;

  constructor(private userService: UserService,
              private provedorService: ProvedorService,
              private home: HomeComponent,
              private aplicatioService: AppService,
              private router: Router,
              private medicoService: MedicoService,
              location: PlatformLocation) {
                location.onPopState(() => {
                  document.getElementById('cerrar-modal-cedula-info').click();
                  document.getElementById('btn-cerrar-modal-datos-user').click();
                  document.getElementById('btn-cerrar-moda-cita-en-curso').click();
                });

              }

  ngOnInit() {
    let identity = this.userService.getIdentity().id_provedor;
    if (identity != undefined) {
      this.medico = false;
      // console.log('es sucursal');
      this.citasUsuario();

      this.intervalo =  setInterval(() => {
      this.citasUsuario()}, 30000);
    } else {
      this.medico = true;
      // console.log('es medico');
      this.medicoId = this.userService.getIdentity().medico_id;
      this.getCitasMedico(this.userService.getIdentity().medico_id);

      this.intervalo =  setInterval(() => {
      this.getCitasMedico(this.userService.getIdentity().medico_id);
      }, 30000);
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    clearInterval(this.intervalo);
  }

  getCitasMedico(medicoId) {
    // console.log(medicoId);
    // console.log('oe ?');
    this.home.cerrarAlerta();
    this.home.loading = true;
    this.medicoService.getCitasActivas(medicoId).subscribe( (response) => {
      // console.log('1 aquiiiiii', response);

      this.citasAgregadas = response[0];
      this.citasAgregadasMasc =  response[1];
      this.home.loading = false;
    }, () => {
      // console.log(err);
      this.home.status = 'error';
      this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.home.loading = false;
      clearInterval(this.intervalo);
    });
  }

  buscarCedula() {
    // console.log(this.infoRes);
    this.infoRes = undefined;
    this.infoResMasc = undefined;
    this.home.loading = true;
    this.confirmacionEli = false;
    let identity = this.userService.getIdentity();
    this.provedorService.ordenCita(this.cedula.value, identity.id_sucursales).subscribe( (response) => {
      // console.log('orden cita', response);

      let bol = true;
      switch (bol === true) {
        case (response[0][0].activas !== undefined && response[0][0].activas === false) &&
        (response[1][0].activas !== undefined && response[1][0].activas === false) :
        this.infoRes = 'sin_citas';
        // console.log('no hay citas');
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case response[0][0].activas === undefined && response[1][0].activas === undefined :
        // console.log('hay citas mascota y paciente');
        this.infoCitasPaciente = response[0][0];
        this.infoCitasMascotas = response[1][0];
        this.infoRes = 'solo_usuario';
        this.infoResMasc = 'solo_mascota';
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[0][0].activas === undefined) && (response[1][0].activas !== undefined && response[1][0].activas === false):
        // console.log('solo citas usuario, ninguna activa');
        this.infoRes = 'solo_usuario';
        this.infoCitasPaciente = response[0][0];
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[0][0].activas !== undefined && response[0][0].activas === false) && (response[1][0].activas === undefined):
        this.infoCitasMascotas = response[1];
        this.infoResMasc = 'solo_mascota';
        // console.log('solo citas mascota');
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[0][0].activas !== undefined && response[0][0].activas === true) &&
        (response[1][0].activas !== undefined && response[1][0].activas === false) :
        // console.log('Cita activa usuario sin citas mascota');
        this.infoCitasPaciente = response[0];
        this.infoRes = 'solo_usuario';
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[0][0].activas !== undefined && response[0][0].activas === false) &&
        (response[1][0].activas !== undefined && response[1][0].activas === true) :
        // console.log('Cita activa mascotas sin citas usuario');
        this.infoCitasMascotas = response[1];
        this.infoResMasc = 'solo_mascota';
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[0][0].activas !== undefined && response[0][0].activas === true) && (response[1][0].activas === undefined) :
        // console.log('cita activa usuario con citas de mascota');
        this.infoCitasPaciente = response[0];
        this.infoCitasMascotas = response[1][0];
        this.infoRes = 'solo_usuario';
        this.infoResMasc = 'solo_mascota';
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[1][0].activas !== undefined && response[1][0].activas === true) && (response[0][0].activas === undefined) :
        // console.log('cita activa mascota con citas de usuario');
        this.infoCitasPaciente = response[0][0];
        this.infoCitasMascotas = response[1];
        this.infoRes = 'solo_usuario';
        this.infoResMasc = 'solo_mascota';
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;

        case (response[0][0].activas !== undefined && response[0][0].activas === true) &&
        (response[1][0].activas !== undefined && response[1][0].activas === true):
        // console.log('citas activas mascota y usuario');
        this.infoCitasPaciente = response[0];
        this.infoCitasMascotas = response[1];
        this.infoRes = 'solo_usuario';
        this.infoResMasc = 'solo_mascota';
        this.home.loading = false;
        document.getElementById('btn-modal-cita').click();
        break;
      }

    }, () => {
      // console.log(err);
      this.home.status = 'error';
      this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.home.loading = false;
    });
  }

  confirmacionEliminarCita(info?, usuario?) {
    this.confirmacionEli = true;

    if (usuario === 'paciente')  {
      this.infoCita = info;
      this.mascota = false;
    }

    if (usuario === 'mascota') {
      this.infoCita = info;
      this.mascota = true;
    }
  }

  cancelarDltCita() {
    this.confirmacionEli = false;
  }

  eliminarCita() {
    this.home.loading = true;
    // console.log(this.infoCita);
    var categoria;

    if (this.mascota === false) {
      categoria = 0;
    } else {
      categoria = 20;
    }

    let identity = this.userService.getIdentity();
    let token = this.userService.getToken();
 
    // es un usuario
    // tslint:disable-next-line: max-line-length
    this.provedorService.dltCitaProvedor(this.infoCita.id_eventos, this.infoCita.id_consultorio, categoria, token).subscribe( (response) => {
      // console.log(response);
      this.home.loading = false;

      if (response[0].borrado === true) {
        this.home.status = 'success';
        this.home.statusText = 'La cita fue elimina con exito.';
        window.scroll(0 , 0);

      } else {
        this.home.status = 'error';
        this.home.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
        window.scroll(0 , 0);
      }
    }, () => {
      this.home.status = 'error';
      this.home.statusText = 'La cita no se puede eliminar, por favor revisa tu conexión o intentalo más tarde.';
      window.scroll(0 , 0);
      this.home.loading = false;
    });

  }

  agregarCita(info, tipo) {

    // console.log(info);
    if (tipo === 'paciente') {
      this.activarCita(info.id_eventos, info.categoria);
    }

    if (tipo === 'mascota') {
      this.activarCita(info.id_eventos, info.categoria);
      // console.log(info);
    }
  }

  citasUsuario() {
    this.home.cerrarAlerta();
    // console.log('oe');
    this.loading = true;
    // d_sucursales
    let identity = this.userService.getIdentity();
    this.provedorService.getCitasActivas(identity.id_sucursales).subscribe( (response) => {
      // console.log('aquii');
      // console.log(response);
      this.loading = false;
      this.citasAgregadas = response[0];
      this.citasAgregadasMasc = response[1];
    }, (err) => {
      this.loading = false;
      this.home.status = 'error';
      this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      // console.log(err);
    });
  }

  verPerfilPaciente(info, tipo) {
    // this.home.loading = true;

    if (tipo === 'paciente') {
      this.mascota = false;

      this.infoUser = info;
      // console.log('usert', this.infoUser);
      document.getElementById('btn-modal-info-paciente').click();

    } else {
      this.mascota = true;

      this.aplicatioService.getMascotaInfo(info).subscribe( (response) => {
        this.infoUser = response[0];
        // console.log(this.infoUser);
        this.infoUser.dueno = this.infoUser.dueño;
        this.home.loading = false;
        document.getElementById('btn-modal-info-paciente').click();
      }, () => {
        // console.log(err);
        this.home.status = 'error';
        this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
        window.scroll(0 , 0);
        this.home.loading = false;
      });
    }
  }

  activarCita(id_eve, id_ctga) {
    this.loading = true;

    let info = {id_eve , id_ctga };
    // console.log('info ac cita', info);
    this.provedorService.postCita(info).subscribe((response) => {
      this.loading = false;
      // console.log(response);
      if(this.medico === false) {
        // console.log('aqui');
        this.citasUsuario();
      } else {
        this.getCitasMedico(this.medicoId);
      }
      // console.log(response);
    }, (err) => {
      this.loading = false;
      // console.log(err);
      this.home.status = 'error';
      this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      window.scroll(0 , 0);
      this.home.loading = false;
    });
  }

  // Metodo para rediriguir a calendario para crear una cita.
  crearCt() {
    this.router.navigate(['/calendario']);
  }



  // Metodo para cambiar de estado la cita
  cambiarEstado(info, tipo) {
    this.loading = true;
    // console.log(info);
    // console.log(info.id_citas_activas , info.id_consultorio, info.categoria);
    var idConsultorio;
    var ctActivas: boolean;

    if (tipo === 'paciente') {
      idConsultorio = info.id_consultorio;
      console.log('info', info);
      console.log('citas agregadas', this.citasAgregadas);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.citasAgregadas.length; i++ ) {
          if (idConsultorio === this.citasAgregadas[i].id_consultorio) {
              if (this.citasAgregadas[i].estado === 1) {
                // console.log('hay citas activas');
                ctActivas = true;
                break;
              }
              ctActivas = false;
          }
      }

      // console.log(ctActivas);

      if (ctActivas === false) {
        // console.log('metodo 1');
         this.provedorService.putCambiarEstadoCitas(info.id_citas_activas , info.id_consultorio, info.categoria)
                           .subscribe( (response) => {
                             this.loading = false;
                             if (response.activa === false && response.activada === true) {
                             if (this.medico === false) {
                                this.citasUsuario();
                              } else {
                                this.getCitasMedico(this.medicoId);
                              }
                            } else {
                              this.home.status = 'error';
                              this.home.statusText = 'Error al cambiar el estado de la cita.';
                            }

                           }, () => {
                            this.home.status = 'error';
                            this.home.statusText = 'Error en la conexion, por favor intenalo más tarde o revisa tu conexión.';
                            this.loading = false;
                            //  console.log(err);
                           });
 
      } else {
        this.infoSiguienteCita = info;
        document.getElementById('btn-confirmar-cita').click();
        this.loading = false;
      }
    }




    if (tipo === 'mascota') {
      idConsultorio = info.id_consultorio;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.citasAgregadasMasc.length; i++ ) {
        if (idConsultorio === this.citasAgregadasMasc[i].id_consultorio) {
            if (this.citasAgregadasMasc[i].estado === 1) {
              // console.log('hay citas activas');
              ctActivas = true;
              break;
            }
            ctActivas = false;
        }
    }

      if (ctActivas === false) {

        // console.log(info.id_citas_activas , info.id_servicios, info.categoria);
       this.provedorService.putCambiarEstadoCitas(info.id_citas_activas , info.id_consultorio, info.categoria)
                         .subscribe( (response) => {
                           this.loading = false;
                           if (response.activa === false && response.activada === true) {

                            if (this.medico === false) {
                              this.citasUsuario();
                            } else {
                              this.getCitasMedico(this.medicoId);
                            }

                          } else {
                            this.home.status = 'error';
                            this.home.statusText = 'Error al cambiar el estado de la cita.';
                          }

                         }, () => {
                          this.home.status = 'error';
                          this.home.statusText = 'Error en la conexion, por favor intenalo más tarde o revisa tu conexión.';
                          this.loading = false;
                          //  console.log(err);
                         });

    } else {

      this.infoSiguienteCita = info;
      this.infoSiguienteCita.id_citas_activas = info.id_citas_activas;
      this.infoSiguienteCita.servicios_idservicios = info.id_servicios;
      document.getElementById('btn-confirmar-cita').click();
      this.loading = false;
    }
   }

  }

  // fue 0 = la cita fue cancelada, 1 la cita fue finalizada
  finalizarCita(info, fue) {
    // console.log(info, fue);
    this.loading = true;
    this.provedorService.putFinalizarCita(info.categoria, info.id_citas_activas, fue).subscribe( (response) =>{
      // console.log(response);
      if (response.actualizado === true) {
        document.getElementById('cerrar-modal-cedula-info').click();

        if (this.medico === false) {
          this.citasUsuario();
        } else {
          this.getCitasMedico(this.medicoId);
        }

      } else {
        document.getElementById('cerrar-modal-cedula-info').click();
        this.home.status = 'error';
        this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      }
      this.loading = false;
    }, () => {
      document.getElementById('cerrar-modal-cedula-info').click();
      this.home.status = 'error';
      this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
      // console.log(err);
    });
  }

  siguienteCita() {
    this.loading = true;
    // console.log(this.infoSiguienteCita.servicios_idservicios);
    this.provedorService.putSiguienteCita(this.infoSiguienteCita.id_citas_activas , this.infoSiguienteCita.servicios_idservicios,
                        this.infoSiguienteCita.categoria).subscribe( (response) => {
                         if (this.medico === false) {
                            this.citasUsuario();
                          } else {
                            this.getCitasMedico(this.medicoId);
                          }
                         this.loading = false;
                      }, () => {
                        this.home.status = 'error';
                        this.home.statusText = 'Error en la conexion, por favor intenalo más tarde o revisa tu conexión.';
                        this.loading = false;
                      });
  }


  mouseEnter() {
    // console.log(info);
    this.entro = true;
  }

  mouseLeave() {
    // console.log('aqui');
    this.entro = false;
  }

}
