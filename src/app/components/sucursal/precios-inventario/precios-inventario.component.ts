import { Component, OnInit, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AppService } from 'src/app/services/app.service';
import { AlertasComponent } from '../../aplicacion/alertas/alertas.component';
import { ProvedorService } from '../../../services/provedor.service';

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
  public infoCategoria;
  public lenterTerminados = [];
  public agregarTipo = [];
  public lentesAgregados = [];
  public sucursales;
  public sucursalesSelect = [];
  public eliminar = [];
  public agregar = [];
  public sucursalesEdit = [];
  public datosProducto: FormGroup;

  constructor(location: PlatformLocation,
              private userService: UserService,
              private aplicationService: AppService,
              private provedorService: ProvedorService,
              private formBuilder: FormBuilder) {
      location.onPopState(() => {
        document.getElementById('btn-cerrar-modal-elicategoria').click();
        document.getElementById('btn-cerrar-modal').click();
        document.getElementById('btn-cerrar-modal-producto').click();
      });
     }

  ngOnInit() {
      this.infoUser = this.userService.getIdentity();
      // console.log(this.infoUser);
      if (this.infoUser.id_provedor) {
        this.getSucursales(this.infoUser.id_provedor);
      }
      this.peticiones();
  }

  peticiones() {
    if (this.infoUser.id_sucursales) {
      this.getCategorias(this.infoUser.id_sucursales, 0);
    } else {
      this.getCategorias(0, this.infoUser.id_provedor);
    }
  }

  getCategorias(idSucursal, idProvedor) {

    this.loading = true;
    var id;

    if (this.infoUser.id_sucursales) {
      id = this.infoUser.id_sucursales;
    }

    this.aplicationService.getCategoriasInventario(idSucursal, idProvedor).subscribe( (response) => {
        console.log(response);
        this.loading = false;
        this.categoriasInventario = response;
    }, () => {
        this.loading = false;
        this.alertas.status = 'error';
        this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  getSucursales(idProvedor) {
    this.loading = true;
    this.provedorService.getSucursales(idProvedor).subscribe( (response) => {
      console.log(response);
      this.sucursales = response;
      // this.sucursalesChecked();
      this.loading = false;
    }, () => {
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    });
  }


  agregarProducto(info) {
    // console.log(info);
    this.infoCategoria = info;

    if (info.nombre === 'Material Lentes') {
        // console.log('lentes');
        if (this.lenterTerminados.length <= 0) {
          this.lenterTerminados.push({lente : 'lente terminado'});
        }
    } else {
      this.datosProducto = this.formBuilder.group({
        nombre : [''],
        referencia : [''],
        cantidad: [''],
        categoria: [''],
        productoGrabable: [''],
        iva: [0],
        precioCompra: ['', [Validators.required]],
        precioVenta: ['', [Validators.required]]
      });
    }

    document.getElementById('btn-abrir-modal-producto').click();
  }

  agregarCategoria() {

    this.loading = true;
    document.getElementById('cerrar-modal-agregar').click();
    let info = { nombre: this.nombreCategoria.value, descripcion: this.descripcionCategoria.value,
                 id_provedor: this.infoUser.id_provedor, sucursales: this.sucursalesSelect };
    // console.log(info);

    this.aplicationService.postAddCategoria(info).subscribe( (response) => {
    this.loading = false;
    // console.log(response);

    if (response === true) {
      this.alertas.status = 'success';
      this.alertas.statusText = 'Categoria agregada con exito.';
      this.nombreCategoria.reset();
      this.descripcionCategoria.reset();
      this.peticiones();
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

    this.aplicationService.dltCategoriaInventario(this.infoCategoria.id_cateogoriai, this.infoUser.id_provedor).subscribe( (response) => {
      this.loading = false;
      console.log(response);
      if (response === true) {
        this.peticiones();
        this.alertas.status = 'success';
        this.alertas.statusText = 'Categoria eliminada exitosamente.';
        this.infoCategoria = undefined;
      } else {
        this.alertas.status = 'warning';
        this.alertas.statusText = 'Esta categoria contiene productos, por favor eliminalos antes de eliminar la categoria.';
      }
    }, () => {
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  abrirEditarCategoria(info) {
    console.log(info);
    this.sucursalesEdit = [];
    this.infoCategoria = info;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.sucursales.length; i++) {
        let nombre = this.sucursales[i].nombre;
        let id_sucursales = this.sucursales[i].id_sucursales;
        this.sucursalesEdit.push({nombre, id_sucursales,  checked: false});

        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.infoCategoria.sucursales.length; j++) {
              if (id_sucursales === this.infoCategoria.sucursales[j].id_sucursales) {
                  this.sucursalesEdit[i].checked = true;
                  continue;
              }
        }
    }
    // console.log(this.sucursalesEdit);

    this.nombreCategoria.setValue(info.nombre);
    this.descripcionCategoria.setValue(info.descripcion);
    document.getElementById('btn-agregar-editar').click();
  }

  editarCategoria() {

    this.loading = true;
    document.getElementById('cerrar-modal-agregar').click();
    let sucursales =  [ this.agregar, this.eliminar ];
    let info = { nombre: this.nombreCategoria.value, desc: this.descripcionCategoria.value, id_cate: this.infoCategoria.id_cateogoriai,
                 sucursales  };
    console.log(info);

    this.aplicationService.putEditCategoriaInventario(info).subscribe( (response) => {
      this.loading = false;
      // console.log(response);
      if (response === true) {
        this.alertas.status = 'success';
        this.alertas.statusText = 'Categoria editada exitosamente.';
        this.eliminar = [];
        this.agregar = [];
        this.sucursalesEdit = [];
        this.infoCategoria = undefined;
        this.nombreCategoria.reset();
        this.descripcionCategoria.reset();
        this.peticiones();
      } else {
        this.alertas.status = 'error';
        this.alertas.statusText = 'Error al editar categoría.';
      }

    }, () => {
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  agregarCategoriaModal() {
    this.infoCategoria = undefined;
    this.nombreCategoria.reset();
    this.descripcionCategoria.reset();
    this.sucursalesSelect = [];
    document.getElementById('btn-agregar-editar').click();
  }

  // <!-- ----------------------------------------------------------------------------------------------------- -->
  // <!-- --------------------------------------------- METODOS MODAL ----------------------------------------- -->
  // <!-- ----------------------------------------------------------------------------------------------------- -->


  eliminarLenteTerminado() {
    // console.log(this.lenterTerminados.length);

    if (this.lenterTerminados.length >= 2) {
      let posicion = this.lenterTerminados.length - 1;
      // console.log(posicion);
      this.lenterTerminados.splice(posicion, 1);
    }
  }

  guardarProducto() {

    if (this.infoCategoria.nombre === 'Material Lentes') {
      var lentesTer = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.lenterTerminados.length; i++) {
        let tipo = (<HTMLInputElement>document.getElementById('tipo' + i)).value;
        let esfera = (<HTMLInputElement>document.getElementById('esfera' + i)).value;
        let cilindro = (<HTMLInputElement>document.getElementById('cilindro' + i)).value;
        let valor_u = (<HTMLInputElement>document.getElementById('valorUnitario' + i)).value;

        lentesTer.push({tipo, esfera, cilindro, valor_u});
      }

      console.log(lentesTer);
    } else {

      // nombre : [''],
      // referencia : [''],
      // cantidad: [''],
      // categoria: [''],
      // productoGrabable: [''],
      // iva: [0],
      // precioCompra: ['', [Validators.required]],
      // precioVenta: ['', [Validators.required]]
      let info = { nombre: this.datosProducto.value.nombre, referencia: this.datosProducto.value.referencia,
                   cantidad: this.datosProducto.value.cantidad, categoria: this.datosProducto.value.categoria,
                   productoGrabable: this.datosProducto.value.productoGrabable, iva: this.datosProducto.value.iva,
                   precioCompra: this.datosProducto.value.precioCompra, precioVenta: this.datosProducto.value.precioVenta };

      console.log(info);

    }
  }

  eliminarTipo() {
    if (this.agregarTipo.length >= 1) {
      let posicion = this.agregarTipo.length - 1;
      // console.log(posicion);
      this.agregarTipo.splice(posicion, 1);
    }
  }

  agregarLente() {
    let nombre = (<HTMLInputElement>document.getElementById('nombreLenteLta')).value;
    let tipo = (<HTMLInputElement>document.getElementById('tipoLta')).value;
    let valor_u = (<HTMLInputElement>document.getElementById('valorUnitarioLta')).value;

    if (!nombre || !tipo || !valor_u) {
      console.log('vacios');
    }

    // let info = [{nombre: tipo, valor_u}];

    // this.lentesAgregados.push({ nombre, tipos: info });
    // console.log(this.lentesAgregados);
  }

  validacionesLenteTallado() {


    let nombre = (<HTMLInputElement>document.getElementById('nombreLenteLta')).value;
    let tipo = (<HTMLInputElement>document.getElementById('tipoLta')).value;
    let valor_u = (<HTMLInputElement>document.getElementById('valorUnitarioLta')).value;

    if (this.agregarTipo.length <= 0) {

      if (!nombre) {
        document.getElementById('nombreLenteLta').className = 'invalid-feedback';
      }

      if (!tipo) {

      }

      if (!valor_u) {

      }

    }

  }

  selectSucursal(id, ev) {
    // console.log(ev.target.checked);
    if (ev.target.checked === true) {
        this.sucursalesSelect.push({id});
        console.log(this.sucursalesSelect);
    } else {
      // this.sucursalesSelect.splice()
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.sucursalesSelect.length; i ++) {
          if (id === this.sucursalesSelect[i].id) {
            this.sucursalesSelect.splice(i, 1);
          }
      }

      console.log(this.sucursalesSelect);
    }

  }


  swithInput(ev, id) {

    // console.log(ev, id);
    if (!ev.target.checked) {

      // this.eliminar.push({idSucu: 2});
      // console.log();

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.infoCategoria.sucursales.length; i ++) {
            if (this.infoCategoria.sucursales[i].id_sucursales === id) {
              // tslint:disable-next-line: prefer-for-of
              if (this.eliminar.length >= 1) {
                 // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < this.eliminar.length; j ++ ) {
                    if ( this.eliminar[j].idsuc  !== id) {
                      this.eliminar.push({idsuc: id, idcat: this.infoCategoria.id_cateogoriai});
                    }
                }
              } else {
                this.eliminar.push({idsuc: id, idcat: this.infoCategoria.id_cateogoriai});
              }
           }
      }

      // console.log(this.eliminar);
    } else {

      if (this.infoCategoria.sucursales.length >= 1) {

         // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.infoCategoria.sucursales.length; i ++) {

        if (this.infoCategoria.sucursales[i].id_sucursales === id) {
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < this.eliminar.length; j ++ ) {
              if (this.eliminar[j].idsuc  === id) {
                  this.eliminar.splice(j, 1);
              }
            }
        } else {

          if (this.agregar.length >= 1) {
            // tslint:disable-next-line: prefer-for-of
            for (let k = 0; k < this.agregar.length; k ++) {
              if (this.agregar[k].idsuc  !== id) {
                this.agregar.push({idsuc: id, idcat: this.infoCategoria.id_cateogoriai});
              }
            }
          } else {
            this.agregar.push({idsuc: id, idcat: this.infoCategoria.id_cateogoriai});
          }
        }
      }

      } else {
        this.agregar.push({idsuc: id, idcat: this.infoCategoria.id_cateogoriai});
      }

      // console.log(this.agregar);

    }
  }


}
