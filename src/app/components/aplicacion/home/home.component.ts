import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProvedorService } from '../../../services/provedor.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment.prod';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { OneSignalService } from '../../../services/one-signal.service';

const configs: ModalOptions = {
  backdrop: true,
  keyboard: false,
  animated: true,
  ignoreBackdropClick: true,
  class: 'modal-lg'
};

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
  medico = true;
  sucursal = false;
  servicio = false;
  cambio = 0;
  mensaje = 'Para Crear una Publicacion y sea visible para todos los clientes, se debe seguir una serie de pasos lo primero es crear un servicio';
  public config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };


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
    this.cambio = 0;
    this.modalRef = this.modalService.show(template,Object.assign({}, this.config, {class: 'modal-lg'}));

  }

  next()
  {
    console.log(this.cambio);

    if(this.cambio<=1)
    {
      console.log('mas');
      this.cambio++;
      this.updateMensaje();
    }
  }

  prev()
  {
    console.log(this.cambio);

    if(this.cambio>=1)
    {
      console.log('menos');
      this.cambio--;
      this.updateMensaje();
    }
  }

  updateMensaje()
  {
    switch (this.cambio) {
      case 0:
            this.mensaje = 'Para Crear una Publicacion y sea visible para todos los clientes, se debe seguir una serie de pasos lo primero es crear un servicio';
        break;
        case 1:
            this.mensaje = 'Ahora se debe agregar un medico que sera el en cargado de atender el servicio';
        break;
        case 2:
          this.mensaje = 'Por ultimo debemos administrar nuestras oficinas y crear un consultorio en el cual se atendera el servicio, y asignar el medico al servicio';
      break;

      default:
        break;
    }
  }

}
