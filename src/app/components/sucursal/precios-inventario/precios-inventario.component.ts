import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-precios-inventario',
  templateUrl: './precios-inventario.component.html',
  styleUrls: ['./precios-inventario.component.css']
})
export class PreciosInventarioComponent implements OnInit {
  public nombreCategoria = new FormControl('', Validators.required);
  public descripcionCategoria = new FormControl('', Validators.required);
  public loading;
  public infoUser;

  constructor(location: PlatformLocation,
              private userService: UserService) {
      location.onPopState(() => {
        document.getElementById('btn-cerrar-modal').click();
        document.getElementById('btn-cerrar-modal-producto').click();
      });
     }

  ngOnInit() {
      this.infoUser = this.userService.getIdentity();
      // console.log(this.infoUser);
  }

  agregarProducto() {
    // console.log('aqui');
    document.getElementById('btn-abrir-modal-producto').click();
  }

  agregarCategoria() {

    // this.loading = true;

    let info = { nombre: this.nombreCategoria.value, descripcion: this.descripcionCategoria.value,
                  id_sucursal: this.infoUser.id_sucursales };
    console.log(info);

  }

}
