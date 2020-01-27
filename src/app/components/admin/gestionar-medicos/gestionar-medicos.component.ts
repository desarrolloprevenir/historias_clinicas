import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';
import { MedicoService } from '../../../services/medico.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-gestionar-medicos',
  templateUrl: './gestionar-medicos.component.html',
  styleUrls: ['./gestionar-medicos.component.css']
})
export class GestionarMedicosComponent implements OnInit {
  public identity;
  public medicos;
  public status: any;
  public statusText;
  public token;
  public loading = false;
  public vacio = false;
  public datos: FormGroup;

  // Variables modal
  public medico;
  public existe: boolean;
  public formulario: boolean;
  public read;
  public nombre;
  cedula = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]);

  constructor(public userService: UserService,
              public provedorService: ProvedorService,
              private router: Router,
              private appService: AppService,
              private route: ActivatedRoute,
              public medicoService: MedicoService,
              public formBuilder: FormBuilder,
              location: PlatformLocation) {
                this.formulario = false;

                location.onPopState(() => {
                document.getElementById('cerrarModal').click();
                });
              }

  ngOnInit() {
    this.status = undefined;
    this.getIdentity();
    this.validacionesFormMedico();
  }

  // Obtener la identidad del usuario logueado
  getIdentity() {
    this.identity = this.userService.getIdentity();
    this.getMedicos(this.identity.id_provedor);
  }

  getMedicos(id) {
    this.loading = true;

    this.provedorService.getMedicosProvedor(id).subscribe((response) => {
      console.log(response);

      if (response.length <= 0) {
        this.vacio = true;
        this.loading = false;
        // console.log('vacio');
      } else {
        this.vacio = false;
        this.medicos = response;
        // console.log(this.medicos);
        this.loading = false;
      }
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalos mas tarde.';
      this.loading = false;
      // console.log(err);
    });
  }

  verMedico(id) {
    this.router.navigate( ['/vermedico', id]);
  }

  deleteMedico(medicoId) {
    this.loading = true;
    let token = this.userService.getToken();
    window.scroll(0, 0);
    this.medicoService.dltMedicoPorProvedor(medicoId, this.identity.id_provedor, token).subscribe( (response) => {

      // console.log(response);
      this.loading = false;
      if (response === true) {
        this.getMedicos(this.identity.id_provedor);
        this.status = 'success';
        this.statusText = 'El médico ha sido eliminado con exito.';
        // this.getMedicos(this.identity.id_provedor);
      } else {
        this.status = 'error';
        this.statusText = 'El médico no se puede eliminar por que tiene un consultorio asociado, elimina primero el consultorio.';
      }
    }, () => {
      // window.scroll(0,0);
      // console.log(err);
      this.status = 'error';
      this.statusText = 'Error en la conexion, por favor revisa tu conexion o intentalo mas tarde.'
      this.loading = false;
    });
  }

  // LOGICA DEL MODAL

  buscarMedico() {

    this.medico = undefined;
    this.medicoService.getMedico(this.cedula.value).subscribe( (response) => {

      if (response === false) {
        this.existe = false;
        this.formulario = true;
        this.read = false;
        // this.datos.reset();
      } else {
       this.medico = response[0];
       this.medico.id = response[0].medico_id;
       this.existe = true;
       this.formulario = true;
       this.read = true;

      }
    }, () => {
      // console.log(err);
    });

  }

  validacionesFormMedico() {

    this.datos = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                Validators.pattern('[a-z A-z]*')]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
                Validators.pattern('[a-z A-z]*')]],
      email: ['', [Validators.required,
              Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      cedula: ['', [Validators.pattern('[0-9]*')]],
      tarjetaProfesional: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
              Validators.pattern('[a-z A-z]*')]],
      pssw: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      psswConf: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]]
    });

  }

  agregarMedico(bol) {

    this.loading = true;
    this.identity = this.userService.getIdentity();
    this.nombre = this.identity.nombre;

    var token = this.userService.getToken();
    // console.log(token);

    if (bol === true) {

      // console.log(this.medico);
     let info = {cedula: this.medico.id, provedores_id: this.identity.id_provedor, existe: bol};

     this.medicoService.postAgregarMedicos(info, token).subscribe( (response) => {
      this.loading = false;
      // console.log(response);
      if (response === true) {
        this.getMedicos(this.identity.id_provedor);
        this.status = 'success';
        this.statusText = 'Médico agregado con exito.';
        document.getElementById('cerrarModal').click();
      }

      if (response === false) {
        this.status = 'error';
        this.statusText = 'Error al agregar el médico, intentalo más tarde o revisa tu conexion';
        document.getElementById('cerrarModal').click();
      }

      if (response.existe === true ) {
        this.status = 'warning';
        this.statusText = 'No se puede agregar. El médico actualmente ya se encuentra registrado en ' + this.identity.nombre;
        // console.log('No se puede agregar. El medico actualmente ya se encuentra registrado en el servicio.');
      }

     }, () => {
      // console.log(err);
        this.status = 'error';
        this.statusText = 'Error al agregar el médico, intentalo más tarde o revisa tu conexion';
        this.loading = false;
        document.getElementById('cerrarModal').click();
     });

    } else {

      if (this.datos.value.pssw === this.datos.value.psswConf) {

        let info = {nombre: this.datos.value.nombres , apellidos: this.datos.value.apellidos,
        tarj_profecional: this.datos.value.tarjetaProfesional , email: this.datos.value.email,
        pssw: this.appService.encriptar(this.datos.value.pssw), cedula: this.cedula.value, titulo: this.datos.value.titulo,
        provedores_id: this.identity.id_provedor, existe: bol };

        // console.log(info);

        // console.log(info);

        this.medicoService.postAgregarMedicos(info, token).subscribe((response) => {
          this.loading = false;
          console.log(response);

          if (response === true) {
            this.status = 'success';
            this.statusText = 'Médico agregado con exito';
            this.getMedicos(this.identity.id_provedor);
            this.formulario = false;
            this.cedula.reset();
            document.getElementById('cerrarModal').click();
          } else if (response === false) {
            this.status = 'error';
            this.statusText = 'Error al agregar el médico, intentalo más tarde o revisa tu conexion';
            document.getElementById('cerrarModal').click();
          }

          if (response.campo === 'profesional') {
              console.log('aqui prof');
              this.status = 'warning';
              this.statusText = 'La tarjeta profesional ya se encuentra registrada';
            }
          if (response.campo === 'email') {
              console.log('aqui correo');
              this.status = 'warning';
              this.statusText = 'El email ya se encuentra registrado';
            }

        }, () => {
          this.status = 'error';
          this.statusText = 'Error al agregar el médico, intentalo más tarde o revisa tu conexion';
          this.loading = false;
          document.getElementById('cerrarModal').click();
          // console.log(err);
        });

      } else {
        this.status = 'warning';
        this.statusText = 'Las contraseñas no coinciden';
        this.loading = false;
      }
    }
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  limpiarForm() {
    this.datos.reset();
    this.existe = undefined;
    this.formulario = false;
    this.cedula.reset();
    document.getElementById('btn-abriModal').click();
  }

}
