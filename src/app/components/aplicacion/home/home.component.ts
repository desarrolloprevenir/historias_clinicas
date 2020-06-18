import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProvedorService } from '../../../services/provedor.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment.prod';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
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
  public modalRef: BsModalRef;

  constructor(public provedorService: ProvedorService,
              private modalService: BsModalService,
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

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }


}
