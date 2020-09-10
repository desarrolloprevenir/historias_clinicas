import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';
import { ProvedorService } from '../../../services/provedor.service';
import { MedicoService } from '../../../services/medico.service';

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
  public numeroCelular;
  public cambiarNumero = false;
  public valido = false;

  constructor(private userService: UserService,
              private appService: AppService,
              private router: Router,
              private provedorService: ProvedorService,
              private medicoService: MedicoService) { }

  ngOnInit() {
    this.identity = this.userService.getIdentity();

    // console.log(this.identity);

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
    let info = {salt: parseInt(this.codigo.value), id: this.id};
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
        this.statusText = 'Código reenviado con exito.';
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


    // Admin

    if (this.identity.id_provedor) {

    this.provedorService.getIdentity(this.identity.id_provedor).subscribe( (response) => {
     localStorage.setItem('identity', JSON.stringify(response[0]));
    });

    } else {

      this.medicoService.getInfoMedico(this.identity.medico_id).subscribe( (response) => {
        localStorage.setItem('identity', JSON.stringify(response[0]));
      });
    }

    this.router.navigate(['/home']);
  }

  reenviarCelular() {

    if (this.identity.telefono) {
      if (this.cambiarNumero) {
        // console.log(this.valido, this.cambiarNumero);
        if (this.valido) {
          // console.log('en valido');
          document.getElementById('cerrar-modal-confirm').click();
          this.smsConfirm(this.numeroCelular);
        } else {
          console.log('en noooo valido');
          this.status = 'warning_modal';
          this.statusText = 'El número de celular es invalido';
        }
      } else {
        // console.log('por acaaaa');
        this.smsConfirm(this.identity.telefono);
      }

    } else {

      if (this.valido) {
        // console.log('enviar codigo');
        this.smsConfirm(this.numeroCelular);
      } else {
        this.status = 'warning_modal';
        this.statusText = 'El número de celular es invalido';
      }
    }
  }


  smsConfirm(celular: number) {

    // console.log('aquii');
    var info = {};
    if (this.identity.id_provedor) {
      info = {celular, id: this.identity.id_provedor, usuario: 'proveedor', membersId: this.identity.members_id};
    } else {
      info = {celular, id: this.identity.medico_id, usuario: 'medico', membersId: this.identity.members_id};
    }

    // console.log(info);
    this.appService.postSmsConfirmar(info).subscribe( (res) => {
      console.log(res);
      document.getElementById('cerrar-modal-confirm').click();
      this.status = 'success';
      this.statusText = 'Código reenviado con exito.';
    });
  }

  validarNumero() {

    let num = this.numeroCelular.toString();

    if (num.length == 10) {
        this.valido = true;
        return;
    }

    this.valido = false;
  }

  reiniciar() {
    this.numeroCelular = null;
    this.cambiarNumero = false;
    this.valido = false;
  }

}
