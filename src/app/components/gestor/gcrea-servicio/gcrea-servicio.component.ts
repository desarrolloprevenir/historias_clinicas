import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Router} from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
;

// Autocompletar
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

// Autocompletar categorias
export interface User {
  nombre: string;
  id_categoria: number;
}

// Scroll

// recorte imagenes
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AppService } from '../../../services/app.service';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';

// Sweet alert
import Swal from 'sweetalert2';

// CHIPS

import {ENTER} from '@angular/cdk/keycodes';
// import {MatChipInputEvent} from '@angular/material/chips';

export interface Chip {
  nombre: string;
}

@Component({
  selector: 'app-gcrea-servicio',
  templateUrl: './gcrea-servicio.component.html',
  styleUrls: ['./gcrea-servicio.component.css']
})
export class GCreaServicioComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  public mymodel;
  @Output() servicioCreado = new EventEmitter<any>();
  // public publicacion: Publicacion;
  // public departamentos;
  public loading = false;
  // public deptSelect;
  // public municipios;
  // public muncSelect;
  // public medicos;
  // public medcSelect;
  public categorias;
  myControl = new FormControl('', [Validators.required]);
  options: User[];
  filteredOptions: Observable<User[]>;
  public statusW: string;


  // Variable para almacenar el array de imagenes en base 64
  public imagenes = [];
  // base64textString;
  public datos: FormGroup;
  // Validacion select
  // selectMedico = new FormControl('', Validators.required);
  selectDepartamento = new FormControl('', Validators.required);
  selectMunicipio = new FormControl('', Validators.required);
  // autCategoria = new FormControl('', Validators.required);
  numeroMaxCitas = new FormControl('', Validators.required);
  // Formulario con la informacion de la publicación
  public formulario = {};
  // variable para lanzar posibles errores de horarios
  public status: boolean;
  public textoStatus: string;
  public horarios: any;
  //  variable para lanzar posibles errores de imagenes
  public statusImgs = false;
  // public terminosYCondiciones = false;
  terminosYCondiciones = false;
  ctgaIncorrecta = false;

  // Variables recorte de imagenes
  imageChangedEvent: any = '';
  croppedImage: any = '';
  mostrarRecorte = true;
  recortar = false;


  // CHIPS
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  chips: Chip[] = [];
  public chipsPrueba;
  public modalRef4: BsModalRef;

  numero;

  constructor(public userService: UserService,
              private modalService: BsModalService,
              public aplicationService: AppService,
              public provedorService: ProvedorService,
              private formBuilder: FormBuilder,
              private router: Router,
              location: PlatformLocation) {
      this.mymodel = 'informacion';
      this.status = false;

      location.onPopState(() => {
      document.getElementById('btn-cerrar-pub-exitosa').click();
      });
     }

     ngOnInit() {
      this.getCategorias();

      this.registerForm = this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
          categoria: ['',[ Validators.required]],
          duracion: ['',[ Validators.required]],
          precio: ['', [Validators.required]],
          descuento: ['', [Validators.max(100),Validators.required, Validators.min(10), Validators.pattern('[0-9]*')]],
          video : [''],
          descripcion : ['', [Validators.required, Validators.minLength(40)]],
          acceptTerms: [false, Validators.requiredTrue]
      });
  }


  keyPress(ev) {
    console.log('aqui');
        // var number = 200000000;
    console.log(this.registerForm.value.precio);
    console.log(this.registerForm.value.precio.toLocaleString('es'));
    // this.numero = this.registerForm.value.precio.toLocaleString('es');
    // console.log(number.toLocaleString('es'));
  }

  private _filter(nombre: string): User[] {
    const filterValue = nombre.toLowerCase();

    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) > -1);
  }


    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        // console.log(this.registerForm.value.nombre);
        // let cate = this.registerForm.value.categoria[0];
        // console.log(this.registerForm.value.categoria);
        // console.log(cate);

        if (this.registerForm.invalid) {
            return;
        }
        else {
          // console.log('dentro del else');
        // console.log(this.registerForm.value.categoria);
        this.loading = true;
        let token = this.userService.getToken();
        let user = this.userService.getIdentity();

        // let ch;

        // if (this.chips.length >= 1) {

        //  // tslint:disable-next-line: prefer-for-of
        // for (let i = 0; i < this.chips.length; i++) {

        //   if (!ch) {
        //     ch = this.chips[i].nombre;
        //   } else {
        //     ch = ch + ',' + ' ' + this.chips[i].nombre;
        //   }
        // }

        // }

        this.formulario = {id_usuario: user.id_provedor, token, nombre: this.registerForm.value.nombre,
            precio: this.registerForm.value.precio, imagenes: this.imagenes,
            descuento: this.registerForm.value.descuento, duracion: this.registerForm.value.duracion,
            id_ctga: this.registerForm.value.categoria, video : this.registerForm.value.video,
            descripcion: this.registerForm.value.descripcion, creador: user.nombre};
        // console.log(this.formulario);

        this.provedorService.pubService(this.formulario).subscribe( (res) => {
          this.loading = false;
          // console.log(res);

          if (res[0].agregado === true) {

            // document.getElementById('btn-publicacion-exitosa').click();
            this.servicioCreado.emit(true);
            // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
          } else {
            // this.pg.status = 'error';
            // this.pg.statusText = 'Error al agregar el servicio.';
            this.statusImgs = true;
            this.textoStatus = 'Error al agregar el servicio.';
          }
          }, () => {
            this.statusImgs = true;
            this.textoStatus = 'Error al agregar el servicio.';
            this.loading = false;
            // console.log(err);
          });

        // display form values on success
      }
    }

    getCategorias() {
      this.aplicationService.getCategorias().subscribe( (res) => {
        this.options = res;
        // console.log(this.options);

        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith<string | User>(''),
          map(value => typeof value === 'string' ? value : value.nombre),
          map(nombre => nombre ? this._filter(nombre) : this.options.slice())
        );
      }, () => {
        // console.log(err);
      });
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
    }
    recorte() {
     //  console.log(this.croppedImage);
      this.imagenes.push({base64Image: this.croppedImage});
      console.log(this.imagenes);
      this.recortar = false;
      this.mostrarRecorte = false;
    }

    borrarFoto(i) {
      this.imagenes.splice(i, 1);
     }


 validacionMaximoImagenes() {

  if (this.imagenes.length >= 6) {
    this.statusW = 'warning';
    this.textoStatus = 'Máximo 6 imagenes por servicio.';
  }

 }

 cerrarAlerta(tipo) {
  if (tipo === 'horarios') {
    this.status = false;
  } else {
    this.statusImgs = false;
  }
 }

  // metodos recorte de imagenes
  fileChangeEvent(event: any): void {


    //  console.log(event);
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
this.textoStatus = '';
this.statusImgs = undefined;
} else {
this.statusImgs = true;
this.textoStatus = 'Solo se admiten imagenes tipo png, jpg, jpeg. Por favor selecciona una';
}
}
  }
}
