import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from 'src/app/services/provedor.service';
import { MedicoService } from 'src/app/services/medico.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public identity;
  public provedor;
  public medico;
  // estu.push({nombreEstudio: this.estudios.nombreEstudio , nombreInstitucion: this.estudios.nombreInstitucion,
  //   start: this.estudios.start, end: this.estudios.end, id: this.medico.id });
  public estudios = {nombreEstudio: '', nombreInstitucion: '', start : '', end: ''};
  nombreEstudio = new FormControl('', [Validators.required, Validators.pattern('[a-z A-z ñ]*')]);
  nombreInstitucion = new FormControl('', [Validators.required, Validators.pattern('[a-z A-z ñ]*')]);
  start = new FormControl('', [Validators.required]);
  end = new FormControl('', [Validators.required]);
  public ver;
  public campo;
  public status: string;
  public statusText;
  public res;
  public mymodel;
  descuentoPrecio = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  public datos: FormGroup;
  public datosAdmin: FormGroup;
  public datosSucu: FormGroup;
  public loading;
  public today;
  public infoSucursal;
  public apiUrl = environment.apiUrl;

  constructor(public userService: UserService,
              public provedorService: ProvedorService,
              public medicoService: MedicoService,
              public formBuilder: FormBuilder,
              location: PlatformLocation,
              private sucursalService: SucursalService) { }

  ngOnInit() {
    this.getIdentity();
  }

  getIdentity() {
    // this.loading = true;
    var user = this.userService.getIdentity();
    console.log(user);

    if (user.medico_id) {
      this.estudios = null;
      this.today = moment(new Date().toISOString()).format('YYYY-MM-DD');
      this.medico = user;
      this.medico.id = user.medico_id;
      this.mymodel = 'informacion';
      // console.log(this.medico);

      // validaciones campos perfil de medico
      this.datos = this.formBuilder.group({
            nombres: [this.medico.nombres, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                      Validators.pattern('[a-z A-z ñ]*')]],
            apellidos: [this.medico.apellidos, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                      Validators.pattern('[a-z A-z ñ]*')]],
            email: [this.medico.email, [Validators.required,
                    Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            cedula: [this.medico.cedula, [Validators.required, Validators.pattern('[0-9]*')]],
            tarjetaProfecional: [this.medico.tarj_profecional, [Validators.required, Validators.pattern('[0-9]*')]],
            titulo: [this.medico.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                    Validators.pattern('[a-z A-z ñ]*')]],
            wp: [this.medico.whatsapp, [Validators.pattern('[0-9]*'), Validators.minLength(7), Validators.maxLength(12)]],
            telefono: [this.medico.telefono, [Validators.pattern('[0-9]*'), Validators.minLength(7), Validators.maxLength(12)]]
      });

      this.loading = false;

      // let info = {nombres : this.datosMedico.value.nombres,
      // apellidos:this.datosMedico.value.apellidos , titulo : this.datosMedico.value.especialidad,
      //   telefono:telefono , wp:wp , id:this.global.id_usuario, estudios:contenedor }
    }

    if (user.id_provedor && !user.id_sucursales) {
      this.provedor = user;
      this.provedor.id = user.id_provedor ;
      // console.log(this.provedor);
      // validaciones campos perfil de provedor
      this.datosAdmin = this.formBuilder.group({

        nombres: [this.provedor.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(50),
                Validators.pattern('[a-z A-z ñ]*') ]],
        nit : [this.provedor.nit, [Validators.required, Validators.pattern('[0-9]*')]],
        direccion : [this.provedor.direccion, [Validators.required]],
        telefono : [this.provedor.telefono, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(7) ,
                    Validators.maxLength(15)]],
        whats : [this.provedor.whatsapp , [Validators.pattern('[0-9]*'),  Validators.minLength(7) ,
        Validators.maxLength(15)]],
        descripcion : [this.provedor.descripcion, [Validators.required, Validators.minLength(40)]],
        web : ['', [Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')]],
        youtube : ['', [Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')]],

      });

      this.loading = false;
    }

    if (user.id_provedor && user.id_sucursales) {
      // console.log(user.avatar);
      // console.log('sucursal');
      this.loading = true;
      this.sucursalService.getInfoSucursal(user.id_sucursales).subscribe( (response) => {
        this.infoSucursal = response;
        this.infoSucursal.avatar = this.apiUrl + user.avatar;
        this.validacionesSucursal();
        this.loading = false;
      }, () => {
        // console.log(err);
        this.status = 'error';
        this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
        window.scroll(0, 0);
        this.loading = false;
      } );
    }

  }

  validacionesSucursal() {
    this.datosSucu = this.formBuilder.group({

      nombre: [this.infoSucursal[0].nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(50),
              Validators.pattern('[a-z A-z ñ]*') ]],
      direccion : [this.infoSucursal[0].direccion, [Validators.required]],
      telefono : [this.infoSucursal[0].telefono, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(7) ,
                  Validators.maxLength(15)]],

    });
  }

  mouseEnter(campo) {
    this.ver = campo;
  }

  mouseLeave() {
    this.ver = '';
  }

  editar(campo) {
    this.campo = document.getElementById(campo);
    this.campo.readOnly = false;
  }

  cambio(campo) {
    this.campo = document.getElementById(campo);
    this.campo.readOnly = true;
  }

  editarProvedor() {

    if (this.datosAdmin.valid && this.datosAdmin.dirty) {
      // console.log(this.provedor);
    this.loading = true;

    let datos = {nit: this.provedor.nit, correo: this.provedor.correo, nombre: this.datosAdmin.value.nombres,
      direccion: this.datosAdmin.value.direccion, telefono : this.datosAdmin.value.telefono, whatsapp: this.datosAdmin.value.whats,
      descripcion: this.datosAdmin.value.descripcion, link: this.datosAdmin.value.web, video: this.datosAdmin.value.youtube,
      id: this.provedor.id };

    // console.log(this.provedor);
    let token = this.userService.getToken();
    this.provedorService.editProv(datos, token).subscribe( (response) => {
      this.res = response;
      if (this.res.update === true) {
        this.getProvedor(this.provedor.id);
        // localStorage.removeItem('identity');
        // localStorage.setItem('identity', JSON.stringify(this.provedor));

      } else {
        this.status = 'error';
        this.statusText = 'No se pudo actualizar los datos.';
        window.scroll(0, 0);
      }

      this.loading = false;
    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      window.scroll(0, 0);
      this.loading = false;
    });
    }
  }

  getProvedor(id) {
    this.provedorService.getIdentity(id).subscribe( (response) => {
      // console.log(response);

      localStorage.removeItem('identity');
      localStorage.setItem('identity', JSON.stringify(response));
      this.getIdentity();
      this.status = 'success';
      this.statusText = 'Datos actualizados correctamente.';
      window.scroll(0, 0);
      this.loading = false;

    }, () => {
      this.loading = false;
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
    });
  }

  pestana(pestana) {

    this.mymodel = pestana;
    var li = document.getElementById(this.mymodel);

    if (this.mymodel === 'informacion') {

        let l = document.getElementById('estudios');
        l.className = 'list-group-item';
        li.className = 'list-group-item active';
    }

    if (li.id === 'estudios') {
            let l = document.getElementById('informacion');
            l.className = 'list-group-item';
            li.className = 'list-group-item active';
          }
  }

  datosMedic(bol?, form?) {

    // console.log(bol);

    if (bol === true) {
      let estu = [];

      estu.push({nombreEstudio: this.nombreEstudio.value , nombreInstitucion: this.nombreInstitucion.value,
        start: this.start.value, end: this.end.value, id: this.medico.id });

      let info = {nombres : this.datos.value.nombres, apellidos: this.datos.value.apellidos , titulo : this.datos.value.titulo,

        telefono: this.datos.value.telefono , wp: this.datos.value.wp , id: this.medico.id, estudios : estu };
      console.log(info);

      let token = this.userService.getToken();

      this.medicoService.editInfoMedico(info, token).subscribe( (response) => {

          // console.log('res', response);
          if (response[0].fecha === false) {
            // console.log('Por favor revisa las fechas, la fecha de inicio no puede ser mayor a la de finalización.');
            this.status = 'error';
            this.statusText = 'Por favor revisa las fechas, la fecha de inicio no puede ser mayor a la de finalización.';
          } else {
            // console.log('Datos actualizados con exito.');
            this.status = 'success';
            this.statusText = 'Datos actualizados con exito.';
            this.getIdentityMedico();
            // this.mymodel = 'estudios';
            this.pestana('informacion');
          }

        }, () => {
          // console.log(err);
          this.status = 'error';
          this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.';
        });

    } else  {

      if (this.datos.valid && this.datos.dirty) {
        this.loading = true;
        let estu = [];
        let info = {nombres : this.datos.value.nombres, apellidos: this.datos.value.apellidos , titulo : this.datos.value.titulo,
        telefono: this.datos.value.telefono , wp: this.datos.value.wp , id: this.medico.id, estudios : estu };
          // console.log(info);
        let token = this.userService.getToken();

        this.medicoService.editInfoMedico(info, token).subscribe( (response) => {
          // console.log(response);
          this.loading = false;
          if (response === true) {
            // "Datos actualizados con exito";
            this.getIdentityMedico();
          } else {
            // "Error al actualizar los datos";
            this.status = 'error';
            this.statusText = 'Error al actualizar los datos.';

          }

        }, () => {
          this.loading = false;
          // console.log(err);
          this.status = 'error';
          this.statusText = 'Error en la conexion, por favor intentalo más tarde o revisa tu conexión.';
        });
      }

    }
  }

  getIdentityMedico() {

    this.medicoService.getInfoMedico(this.medico.id).subscribe( (response) => {
      // console.log(response);
      let identity = response[0];
      localStorage.removeItem('identity');
      localStorage.setItem('identity', JSON.stringify(identity));
      this.getIdentity();
      this.status = 'success';
      this.statusText = 'Datos actualizados con exito.';
      window.scroll(0, 0);
    }, () => {
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor intentalo más tarde o revisa tu conexión.';
    });
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  editarSucu() {
    this.loading = true;
    let info = {nombre : this.datosSucu.value.nombre, direccion : this.datosSucu.value.direccion, telefono : this.datosSucu.value.telefono,
    id_sucursal : this.infoSucursal[0].id_sucursales};

    console.log(info);

    this.sucursalService.editInfoSucursal(info).subscribe( (response) => {
      // console.log(response);
      this.loading = false;
      if (response === true) {
        this.status = 'success';
        this.statusText = 'Datos actualizados con exito.';
        this.getIdentity();
        // this.getSucursal(this.infoSucursal[0].id_sucursales);
      }
    }, () => {
      // console.log(err);
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde';
    } );
  }

  // getSucursal(idSucursal) {
  //   this.loading = true;
  //   this.sucursalService.getInfoSucursal(idSucursal).subscribe( (response) => {
  //     console.log('vsv', response);
  //     this.loading = false;
  //     localStorage.removeItem('identity');
  //     localStorage.setItem('identity', JSON.stringify(response[0]));
  //     this.getIdentity();
  //     this.status = 'success';
  //     this.statusText = 'Datos actualizados correctamente.';
  //     window.scroll(0, 0);
  //   }, () => {
  //     // console.log(err);
  //     this.status = 'error';
  //     this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
  //     window.scroll(0, 0);
  //     this.loading = false;
  //   } );
  // }

}
