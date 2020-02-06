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
  public identity;
  public id;

  constructor(private userService: UserService,
              private appService: AppService,
              private router: Router) { }

  ngOnInit() {
    this.identity = this.userService.getIdentity();

    if (this.identity.id_provedor) {
      // console.log('es provedor');
      this.id = this.identity.id_provedor;
    } else {
      // console.log('es medico');
      this.id = this.identity.medico_id;
    }
  }

  confirmar() {
    // console.log("Entro");
    // console.log(this.id);
    this.loading = true;
    let token = this.userService.getToken();

    // console.log(this.identity);
    let info = {salt: parseInt( this.codigo.value), id: this.id};
    // console.log(this.id);
    console.log(info);
    this.appService.confirmacionCuenta(info, token).subscribe( (response) => {

      if (response === true) {
        localStorage.removeItem('confirmar');
        localStorage.setItem('confirmar', JSON.stringify(true));
        document.getElementById('btn-modal-exitosa').click();
      } else {
        this.status = 'warning';
        this.statusText = 'Codigo incorrecto.';
      }
      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo mas tarde o revisa tu conexion.';
      this.loading = false;
    });
  }

  reenviar() {
    this.loading = true;
    // console.log('iddd', id);
    this.appService.getReenviarCodigoCorreo(this.id).subscribe( (response) => {
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
