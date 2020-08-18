import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { SucursalService } from '../../../services/sucursal.service';
import { ProvedorService } from '../../../services/provedor.service';

@Component({
  selector: 'app-gestionar-consultorios',
  templateUrl: './gestionar-consultorios.component.html',
  styleUrls: ['./gestionar-consultorios.component.css']
})
export class GestionarConsultoriosComponent implements OnInit {
  public consultorios;
  public status;
  public statusText;
  public loading;
  public infoEliminar;
  public idConsultorio;
  public medicos;
  public siguiente;

  constructor(private userService: UserService,
              private sucursalService: SucursalService,
              private router: Router,
              location: PlatformLocation,
              private provedorService: ProvedorService) {
                location.onPopState(() => {
                  document.getElementById('btn-modal-cerrar-eliConsul').click();
                  document.getElementById('btn-modal-cerrar-info').click();
                });
               }

  ngOnInit() {
    let identity = this.userService.getIdentity().id_sucursales;
    this.getConsultorios(identity);
  }

  getConsultorios(idSucursales) {
    // console.log('asdasd asd asd ');
    this.loading = true;
    this.sucursalService.getConsultorios(idSucursales).subscribe( (response) => {
      // console.log('consuls', response);
      this.consultorios = response;
      this.loading = false;
      // console.log(this.consultorios.length);
    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
    } );
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  editarConsultorio(info) {
    // console.log(info);
    localStorage.removeItem('consultorio');
    localStorage.setItem('consultorio', JSON.stringify(info));
    this.router.navigate(['consultorio']);
  }

  eliminarConsultorio(idConsultorio) {
  // console.log('aqui eli');
   this.loading = true;
   this.idConsultorio = idConsultorio;
   this.sucursalService.getEventsConsul(idConsultorio).subscribe( (response) => {
    //  console.log(response);
     this.loading = false;
     window.scroll(0, 0);
     if (response[0].eventsC <= 0 ) {
      // console.log('elimianr');
      this.infoEliminar = true;
      document.getElementById('btn-modal-eliminar-consultorio').click();
     } else {
      //  console.log('no se puse eliminar');
       this.infoEliminar = false;
       document.getElementById('btn-modal-eliminar-consultorio').click(); 
     }
   }, () => {
     this.loading = false;
    //  console.log(err);
     this.status = 'error';
     this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
   } );
  }

  eliConsul() {

    this.loading = true;
    this.sucursalService.dltConsultorio(this.idConsultorio).subscribe( (response) => {
      this.loading = false;
      if(response === true){
        this.status = 'success';
        this.statusText = 'Consultorio eliminado exitosamente.';
        let identity = this.userService.getIdentity().id_sucursales;
        this.getConsultorios(identity);
      }
      // console.log(response);
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
      // console.log(err);
    } );
  }

  getMedicos() {

    let identity = this.userService.getIdentity().id_provedor;
    this.provedorService.getMedicosProvedor(identity).subscribe( (response) => {
      // this.medicos = response;
      // console.log('medicos', response);
      this.medicos = response;

      if (this.medicos.length >= 1) {
        this.siguiente = true;
        // tslint:disable-next-line: prefer-for-of
        // for (let i = 0; i < this.medicos.length; i++) {

        //   if ( this.medicos[i].activo === 'false') {
        //     // console.log('aqui');
        //     this.siguiente = true;
        //     break;
        //   } else {
        //     this.siguiente = false;
        //   }
        // }
      } else {
        this.siguiente = false;
      }

      if (this.siguiente === true) {
        this.router.navigate(['consultorio']);
      } else {
        document.getElementById('btn-info-medico').click();
      }

      // console.log(this.siguiente);

    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, revisa tu conexion o intentalo mas tarde.';
    });
  }

}
