import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProvedorService } from '../../../services/provedor.service';
import { SucursalService } from '../../../services/sucursal.service';
import { MedicoService } from '../../../services/medico.service';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public status: string;
  public loading = false;
  public statusText;
  pssw = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', Validators.required);

  constructor(private router: Router,
              private provedorService: ProvedorService,
              private  sucursalService: SucursalService,
              private medicoService: MedicoService,
              public userService: UserService,
              private aplicationService: AppService) { }

  ngOnInit() {
    this.getIdentity();
  }

  getIdentity() {
    let identity = this.userService.getIdentity();
    let token = this.userService.getToken();

    // console.log(identity, token);

    if (identity && token) {
      this.router.navigate(['/home']);
    }
  }

  login() {

    this.loading = true;

    this.provedorService.postLogin(this.email.value, this.aplicationService.encriptar(this.pssw.value)).subscribe((response) => {

      // console.log(response);

      if (response.login === true) {

        if (response.esAdmin === 2) {
          this.status = 'warning';
          this.statusText = 'Error cuenta de usuario, para loguearse con una cuenta de usuario por favor utiliza la' ;
          this.loading = false;
        }

        if (response.esAdmin === 1) {

          localStorage.setItem('token', JSON.stringify(response.token));

          // true admin
          this.identity(response.id_usuario, response.id_member, 'admin');
        }
        if (response.esAdmin === 3) {
          console.log('medico');
          localStorage.setItem('token', JSON.stringify(response.token));
          this.identity(response.id_usuario, response.id_member, 'med');
        }

        if (response.esAdmin === 4) {

          localStorage.setItem('token', JSON.stringify(response.token));
          this.identity(response.id_usuario, response.id_member, 'sucu');
        }

      } else {
        this.status = 'error';
        this.statusText = 'Usuario o contraseña incorrectos.';
        this.loading = false;
      }

      // this.loading = false;

    }, (err) => {
      console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, intentalo más tarde o revisa tu conexión.'
      this.loading = false;
    });

    // this._router.navigate(['/home']);

  }

  identity(idUsuario, idMember, member) {
    console.log('aqui');

    // this.loading = true;

      // console.log(member);

    if (member === 'admin') {

        // this.locket(id);
        this.provedorService.getIdentity(idUsuario).subscribe( (response) => {
          // console.log('respuesta', response);

         localStorage.setItem('identity', JSON.stringify(response[0]));
         this.locket(idMember);

           // this._router.navigate(['/home/', response.id_usuario, response.esAdmin ]);
          //  this.loading = false;

        }, () => {
          this.status = 'error';
          this.statusText = 'Error en la conexión, intentalo más tarde o revisa tu conexión.'
          this.loading = false;
        });

      }

    if (member === 'med') {

        // this.locket(id);
        this.medicoService.getInfoMedico(idUsuario).subscribe( (response) => {
          console.log(response);

          let identity = response[0];
          localStorage.setItem('identity', JSON.stringify(identity));
          this.locket(idMember);
          this.loading = false;
        }, (err) => {
          this.status = 'error';
          this.statusText = 'Error en la conexión, intentalo más tarde o revisa tu conexión.'
          this.loading = false;
        });

      }

    if (member === 'sucu') {

        this.sucursalService.getIdentitySucursal(idMember).subscribe( (response) => {
          console.log(response);
          let identity = response[0];
          localStorage.setItem('identity', JSON.stringify(identity));
          localStorage.setItem('confirmar', JSON.stringify(true));
          this.loading = false;
          this.router.navigate(['home']);
        }, (err) => {
          // console.log(err);
        } );
      }
  }

  locket(idMember) {
    // console.log(id);
    this.aplicationService.getConfirmacionCuenta(idMember).subscribe( (response) => {
      console.log('locket', response);

      if (response === true) {
        console.log('aqui home');
        this.router.navigate(['home']);
        localStorage.setItem('confirmar', JSON.stringify(true));
      } else {
        this.router.navigate(['confirmar-cuenta']);
        localStorage.setItem('confirmar', JSON.stringify(false));
      }
      this.loading = false;

    } , (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, intentalo más tarde o revisa tu conexión.'
      this.loading = false;
    });
  }

  goToRegister() {
    this.router.navigate(['/registro']);
   }

   cerrarAlerta() {
     this.status = undefined;
   }

}
