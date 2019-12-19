import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { FormGroup, FormBuilder} from '@angular/forms';
import { SucursalService } from 'src/app/services/sucursal.service';
import { ProvedorService } from 'src/app/services/provedor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gestionar-sucursales',
  templateUrl: './gestionar-sucursales.component.html',
  styleUrls: ['./gestionar-sucursales.component.css']
})
export class GestionarSucursalesComponent implements OnInit {
  public medicos;
  public servicios;
  public sucursales;
  public sucursalSelect;
  public sucursalEliminar;
  public statusText;
  public status;
  public datos: FormGroup;
  public ver;
  public campo;
  public loading;
  public siguiente;

  constructor(private userService: UserService,
              private provedorService: ProvedorService,
              private router: Router,
              location: PlatformLocation,
              public formBuilder: FormBuilder,
              private sucursalService: SucursalService) {
                location.onPopState(() => {
                  document.getElementById('btn-cerrar-modal-editar').click();
                  document.getElementById('btn-cerrar-modal-confirmacion').click();
            });
            }

  ngOnInit() {
    let identity = this.userService.getIdentity().id_provedor;
    this.getServicios(identity);
    this.getSucursales(identity);
  }

  getMedicos() {

    this.loading = true;
    let identity = this.userService.getIdentity().id_provedor;
    this.provedorService.getMedicosProvedor(identity).subscribe( (response) => {
      // this.medicos = response;
      // console.log('medicos', response);
      this.loading = false;
      this.medicos = response;

      if (this.medicos.length >= 1) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.medicos.length; i++) {

          if ( this.medicos[i].activo === 'false') {
            // console.log('aqui');
            this.siguiente = true;
            break;
          } else {
            this.siguiente = false;
          }
        }
      }

      if (this.siguiente === true) {
        this.router.navigate(['/crear-sucursal']);
      } else {
        document.getElementById('btn-info-medico').click();
      }

      // console.log(this.siguiente);

    }, () => {
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexion, revisa tu conexion o intentalo mas tarde.';
    });
  }

  getServicios(idProvedor) {

    this.loading = true;
    this.provedorService.getPublications(idProvedor).subscribe( (response) => {
      this.servicios = response;
      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
    });
  }

  getSucursales(idProvedor){
    this.loading = true;
    this.provedorService.getSucursales(idProvedor).subscribe( (response) => {
      // console.log(response);
      this.sucursales = response;
      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
    });
  }

  // editarSucursal(info_sucursal) {
  //   this.sucursalSelect = info_sucursal;
  //   this,this.validacionesSucursal();
  //   document.getElementById('modal-editar').click();
  //   console.log(this.sucursalSelect);
  // }

  // validacionesSucursal() {
  //   this.datos = this.formBuilder.group({
  //     nombre: [this.sucursalSelect.nombre, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
  //               Validators.pattern('[a-z A-z ñ]*')]],
  //     direccion: [this.sucursalSelect.direccion, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
  //     telefono: [this.sucursalSelect.telefono ,[Validators.pattern('[0-9]*'), Validators.minLength(7), Validators.maxLength(12)]],
  //     municipio: ['Pasto', [Validators.required]]  
  //     });

  // }

  confirmacioEliminarSucursal(infoSucursal) {
    this.sucursalEliminar = infoSucursal;
    document.getElementById('btn-modal-confirmacion').click();
  }

  eliminarSucursal() {
    // console.log('oe');
    window.scroll(0, 0);
    // console.log(this.sucursalEliminar);
    this.loading = true;
    this.sucursalService.dltSucursal(this.sucursalEliminar.id_sucursales).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      if (response === true) {
        let identity = this.userService.getIdentity().id_provedor;
        this.getSucursales(identity);
        this.status = 'success';
        this.statusText = 'Sucursal eliminada con exito.';
      }
    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde';
      this.loading = false;
    } );

  }

  cerrarAlerta() {
    this.status = undefined;
  }

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

}
