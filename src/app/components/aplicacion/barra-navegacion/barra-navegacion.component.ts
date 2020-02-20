import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';
import { MedicoService } from '../../../services/medico.service';
import { SucursalService } from '../../../services/sucursal.service';
import { AppService } from '../../../services/app.service';
import { environment } from '../../../../environments/environment.prod';


@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {
  public identity;
  username = new FormControl('', Validators.required);
  pssw = new FormControl('', Validators.required);
  loading;
  status;
  statusText;
  apiUrl = environment.apiUrl;

  constructor(public userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private provedorService: ProvedorService,
              private medicoService: MedicoService,
              private sucursalService: SucursalService,
              private aplicationService: AppService) { }

  ngOnInit() {
    this.getIdentity();
  }

  getIdentity() {
    this.identity = this.userService.getIdentity();
    // console.log('identity', this.identity);
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // iniciarSesion() {
  //   let password = CryptoJS.SHA512(this.pssw.value).toString(CryptoJS.enc.Hex);
  //   console.log(this.username.value, password);
  // }


  // Metodo para slidemenu
  // colapse(){

  //   if(document.getElementById('sidebar').className === '') {
  //     document.getElementById('sidebar').className = 'active';
  //     document.getElementById('sidebarCollapse').className = 'active';
  //   } else {
  //     document.getElementById('sidebar').className = '';
  //     document.getElementById('sidebarCollapse').className = '';
  //   }
  // }


  // Metodos para el inicio de sesion
  login() {

    this.loading = true;

    // let password = CryptoJS.SHA512(this.pssw.value).toString(CryptoJS.enc.Hex);

    this.provedorService.postLogin(this.username.value, this.aplicationService.encriptar(this.pssw.value)).subscribe((response) => {

      console.log(response);

      if (response.login === true) {

        if (response.esAdmin === 2) {
          this.status = 'warning';
          this.statusText = 'Error cuenta de usuario, para loguearse con una cuenta de usuario por favor utiliza la' ;
          this.loading = false;
        }

        if (response.esAdmin === 1) {
          localStorage.setItem('token', JSON.stringify(response.token));
          // true admin
          this.identityMember(response.id_usuario, response.id_member, 'admin');
          document.getElementById('btn-cerrar-modal').click();
        }
        if (response.esAdmin === 3) {

          localStorage.setItem('token', JSON.stringify(response.token));
          this.identityMember(response.id_usuario, response.id_member, 'med');
          document.getElementById('btn-cerrar-modal').click();
        }

        if (response.esAdmin === 4) {
          console.log('asda');
          localStorage.setItem('token', JSON.stringify(response.token));
          this.identityMember(response.id_usuario, response.id_member, 'sucu');
          document.getElementById('btn-cerrar-modal').click();
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
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
    });

    // this._router.navigate(['/home']);

  }

  identityMember(idUsuario, idMember, member) {

    // this.loading = true;

      console.log(member);

      if (member === 'admin') {

        // this.locket(id);
        this.provedorService.getIdentity(idUsuario).subscribe( (response) => {
          console.log('respuesta', response);

          localStorage.setItem('identity', JSON.stringify(response[0]));
          this.locket(idMember);

           // this._router.navigate(['/home/', response.id_usuario, response.esAdmin ]);
          //  this.loading = false;

        }, (err) => {
          // this.home.status = 'error';
          // this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
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
        }, () => {
          // this.home.status = 'error';
          // this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
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
          // location.reload();
          this.router.navigate(['']);
          this.getIdentity();
          // this._router.navigate(['home']);
        }, (err) => {
          // this.home.status = 'error';
          // this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
          console.log(err);
        } );
      }

  }

  locket(idMember) {
    console.log(idMember);
    this.aplicationService.getConfirmacionCuenta(idMember).subscribe( (response) => {
      // console.log(response);

      if (response === true) {
        // console.log('aqui home');
        localStorage.setItem('confirmar', JSON.stringify(true));
        // location.reload();
        this.router.navigate(['']);
        this.getIdentity();
      } else {
        this.router.navigate(['confirmar-cuenta']);
        localStorage.setItem('confirmar', JSON.stringify(false));
      }
      this.loading = false;

    } , () => {
      // this.home.status = 'error';
      // this.home.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
    });
  }

  cerrarAlerta() {
    this.status = undefined;
  }

}
