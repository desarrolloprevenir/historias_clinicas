import { Component, OnInit, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AppService } from 'src/app/services/app.service';
import { AlertasComponent } from '../../aplicacion/alertas/alertas.component';

@Component({
  selector: 'app-precios-inventario',
  templateUrl: './precios-inventario.component.html',
  styleUrls: ['./precios-inventario.component.css']
})
export class PreciosInventarioComponent implements OnInit {
  @ViewChild('alertas', {static: true}) alertas: AlertasComponent;
  public nombreCategoria = new FormControl('', Validators.required);
  public descripcionCategoria = new FormControl('', Validators.required);
  public loading;
  public infoUser;
  public categoriasInventario;
  public colapse = '#multiCollapse';
  public infoCategoria;

  constructor(location: PlatformLocation,
              private userService: UserService,
              private aplicationService: AppService) {
      location.onPopState(() => {
        document.getElementById('btn-cerrar-modal-elicategoria').click();
        document.getElementById('btn-cerrar-modal').click();
        document.getElementById('btn-cerrar-modal-producto').click();
      });
     }

  ngOnInit() {
      this.infoUser = this.userService.getIdentity();
      // console.log(this.infoUser);
      this.getCategorias();
  }

  getCategorias() {

    this.loading = true;
    var id;

    if (this.infoUser.id_sucursales) {
      id = this.infoUser.id_sucursales;
    }

    this.aplicationService.getCategoriasSucursal(id).subscribe( (response) => {
        console.log(response);
        this.loading = false;
        this.categoriasInventario = response;
    }, () => {
        this.loading = false;
        this.alertas.status = 'error';
        this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  agregarProducto() {
    // console.log('aqui');
    document.getElementById('btn-abrir-modal-producto').click();
  }

  agregarCategoria() {

    this.loading = true;
    document.getElementById('cerrar-modal-agregar').click();
    let info = { nombre: this.nombreCategoria.value, descripcion: this.descripcionCategoria.value,
                  id_sucursal: this.infoUser.id_sucursales };
    // console.log(info);

    this.aplicationService.postAddCategoria(info).subscribe( (response) => {
    this.loading = false;
    // console.log(response);

    if (response === true) {
      this.alertas.status = 'success';
      this.alertas.statusText = 'Categoria agregada con exito.';
      this.nombreCategoria.reset();
      this.descripcionCategoria.reset();
      this.getCategorias();
    } else {
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error al agregar categoria.';
    }
    }, () => {
    this.loading = false;
    this.alertas.status = 'error';
    this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );

  }

  confirmacionEliminar(info) {
    this.infoCategoria = info;
    document.getElementById('btn-eliminar-categoria').click();
  }

  eliminarCategoria() {

    this.loading = true;

    this.aplicationService.dltCategoriaInventario(this.infoCategoria.id_cateogoriai).subscribe( (response) => {
      this.loading = false;
      console.log(response);
      if (response === true) {
        this.getCategorias();
        this.alertas.status = 'success';
        this.alertas.statusText = 'Categoria eliminada exitosamente.';
        this.infoCategoria = undefined;
      } else {
        this.alertas.status = 'error';
        this.alertas.statusText = 'Error al eliminar categoria.';
      }
    }, () => {
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  abrirEditarCategoria(info) {
    this.infoCategoria = info;
    this.nombreCategoria.setValue(info.nombre);
    this.descripcionCategoria.setValue(info.descripcion);
    document.getElementById('btn-agregar-editar').click();
  }

  editarCategoria() {
    
  }
}
