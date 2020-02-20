import { Component, OnInit } from '@angular/core';
import { ProvedorService } from '../../../services/provedor.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment.prod';
import { OneSignalService } from '../../../services/one-signal.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public admin: string;
  public dataProvedor;
  public loading = false;
  public status: any;
  public statusText: string;
  public identity;
  public apiUrl = environment.apiUrl;

  constructor(public provedorService: ProvedorService,
              public userService: UserService,
              ) { }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
    // this.oneSignal.iniciar();
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  cambiarSesion() {
    document.getElementById('btn-cambiar-de-sesion').click();
  }


}
