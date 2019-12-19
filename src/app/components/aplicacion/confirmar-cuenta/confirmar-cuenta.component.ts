import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-confirmar-cuenta',
  templateUrl: './confirmar-cuenta.component.html',
  styleUrls: ['./confirmar-cuenta.component.css']
})
export class ConfirmarCuentaComponent implements OnInit {
  codigo = new FormControl('', Validators.required);
  public status;
  public statusText;
  public loading;

  constructor(private userService: UserService,
              private appService: AppService,
              private router: Router) { }

  ngOnInit() {
  }

  confirmar() {
    // console.log("Entro");
    this.loading = true;
    let identity = this.userService.getIdentity().id_provedor;
    let token = this.userService.getToken();
    var id;

    if (identity === undefined) {
      id = this.userService.getIdentity().medico_id;
    } else {
      id = identity;
    }

    let info = {salt: this.codigo.value, id};
    this.appService.confirmacionCuenta(info, token).subscribe( (response) => {

      if (response === true) {
        document.getElementById('btn-modal-exitosa').click();
        localStorage.removeItem('confirmar');
        localStorage.setItem('confirmar', JSON.stringify(true));
      } else {
        this.status = 'warning';
        this.statusText = 'Codigo incorrecto.';
      }
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
    });
  }

  reenviar() {
    this.loading = true;
    let identity = this.userService.getIdentity();
    var id;
    console.log(identity);

    if (identity.medico_id) {
      id = identity.medico_id;
    }

    if (identity.id_provedor) {
      id = identity.id_provedor;
    }


    console.log('iddd', id);
    this.appService.getReenviarCodigoCorreo(id).subscribe( (response) => {
      // console.log(response);
      if (response === true) {
        this.status = 'success';
        this.statusText = 'Código reenviado con exito, Por favor revisa tu correo.';
      }
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
      // console.log(err);
    });
  }

  atras() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  bienvenido() {
    this.router.navigate(['/home']);
  }

}
