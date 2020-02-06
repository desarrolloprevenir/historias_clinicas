import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AlertasComponent } from '../alertas/alertas.component';
import { AppService } from '../../../services/app.service';
import { UserService } from '../../../services/user.service';
import { EventEmitter } from 'protractor';
import { PerfilComponent } from '../perfil/perfil.component';

@Component({
  selector: 'app-modal-cambio-avatar',
  templateUrl: './modal-cambio-avatar.component.html',
  styleUrls: ['./modal-cambio-avatar.component.css']
})
export class ModalCambioAvatarComponent implements OnInit {
  public imageChangedEvent;
  public recortar;
  public mostrarRecorte;
  public croppedImage;
  public imagenes = [];
  public status;
  public statusText;
  @Input() admin;
  @Input() medico;
  @ViewChild('alertas', {static: true} ) alertasComponent: AlertasComponent;
  public loading;

  constructor(private aplicationService: AppService,
              private userService: UserService,
              private perfilComponent: PerfilComponent) { }

  ngOnInit() {
  }

   // metodos recorte de imagenes
   fileChangeEvent(event: any): void {
    //  console.log(event);
    if (this.imagenes.length <= 0) {
      if (event.target.files.length >= 1 ) {
        let cadena = event.target.value;
        let validacion = cadena.substr(-6).split('\.');

        if (validacion[1] === 'png' ||
            validacion[1] === 'jpg' ||
            validacion[1] === 'jpeg' ||
            validacion[1] === 'PNG' ||
            validacion[1] === 'JPG' ||
            validacion[1] === 'JPEG') {
           //  console.log(cadena.substr(-6));
        this.imageChangedEvent = event;
        this.recortar = true;
        this.mostrarRecorte = true;
        } else {
         console.log('aqui 2');
         this.alertasComponent.status = 'warning';
         this.alertasComponent.statusText = 'Solo se admiten imagenes tipo png, jpg, jpeg. Por favor selecciona una';
        //  this.status = 'warning';
        //  this.statusText = 'Solo se admiten imagenes tipo png, jpg, jpeg. Por favor selecciona una';
        }
       }
    } else {
        console.log('aqui');
        this.alertasComponent.status = 'warning';
        this.alertasComponent.statusText = 'Ya hay una imagen selecionada.';
        // this.status = 'warning';
        // this.statusText = 'Ya hay una imagen selecionada.';
    }
   }

   imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

   recorte() {
    //  console.log(this.croppedImage);
     this.imagenes.push({base64Image: this.croppedImage});
    //  console.log(this.imagenes);
     this.recortar = false;
     this.mostrarRecorte = false;
   }

   borrarFoto() {
     this.imagenes.splice(0, 1);
   }

   cambiarAvatar() {

    this.loading = true;
    let infoUser = this.userService.getIdentity();
    var token = this.userService.getToken();
    var id;

    if (infoUser.id_provedor) {
      id = infoUser.id_provedor;
    } else {
      id = infoUser.medico_id;
    }

    let info = {foto: this.imagenes[0].base64Image, id, admin: this.admin, medico: this.medico};
    // console.log(info);
    this.aplicationService.putEditAvatar(info, token).subscribe( (response) => {
    this.loading = false;
    // console.log(response);

    if ( response[0].cambio === true) {
      this.imagenes.splice(0, 1);
      this.perfilComponent.avatarCambiado();
    } else {
      this.alertasComponent.status = 'error';
      this.alertasComponent.statusText = 'Error al cambiar el avatar intentalo mas tarde.';
    }

  }, () => {
      this.loading = false;
      this.alertasComponent.status = 'error';
      this.alertasComponent.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo mas tarde.';
    // this.appService.presentToast('Error en la conexión, por favor revisa tu conexión o intentalo mas tarde.');
  });
   }
}
