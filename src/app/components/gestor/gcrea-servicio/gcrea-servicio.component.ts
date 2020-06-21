import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router} from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
import {MatChipInputEvent} from '@angular/material/chips';

export interface Chip {
  nombre: string;
}

@Component({
  selector: 'app-gcrea-servicio',
  templateUrl: './gcrea-servicio.component.html',
  styleUrls: ['./gcrea-servicio.component.css']
})
export class GCreaServicioComponent implements OnInit {

  public mymodel;
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

  constructor(public userService: UserService,
    private modalService: BsModalService,
    public aplicationService: AppService,
    public provedorService: ProvedorService,
    private formBuilder: FormBuilder,
    private router: Router,
    location: PlatformLocation) {
      this.mymodel = 'informacion';
      this.status = false;

      this.datos = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
      duracion : ['', [Validators.required, Validators.max(60), Validators.min(15), Validators.pattern('[0-9]*')]],
      precio: ['', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
      descuento: ['', [Validators.max(100), Validators.min(10), Validators.pattern('[0-9]*')]],
      video : [''],
      // direccion : ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.minLength(40)]],
      // check: [false, [Validators.requiredTrue]],
      });

      location.onPopState(() => {
      document.getElementById('btn-cerrar-pub-exitosa').click();
      });
     }

     ngOnInit() {
      this.getCategorias();
    }

      // AUTOCOMPLETAR ---------------------------------------------


  displayFn(user?: User): string | undefined {
    return user ? user.nombre : undefined;
  }

  private _filter(nombre: string): User[] {
    const filterValue = nombre.toLowerCase();

    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) > -1);
  }

  // ---------------------------------------------------------------


  pestana(pestana) {
    this.mymodel = pestana;

    var li = document.getElementById(this.mymodel);

    if (this.mymodel === 'informacion') {

        let l2 = document.getElementById('imagenes');
        l2.className = 'list-group-item';
        li.className = 'list-group-item active';
    }


    if (this.mymodel === 'imagenes') {

        let l = document.getElementById('informacion');

        l.className = 'list-group-item';
        li.className = 'list-group-item active';
    }

  }


  // ------------------ Metodos para almacenar la información de la publciacion ------------

  siguienteInformacion() {


      if (this.myControl.value === '' || this.myControl.value.id_categoria === undefined) {
        // console.log('No hya categoria');
        this.ctgaIncorrecta = true;
        window.scroll(0, 0);
      } else if (this.numeroMaxCitas.value === '') {
        // console.log('No hya max citas');
      } else if (!this.datos.valid) {
        // console.log('falta llenar lso datos');
      } else {
        this.pestana('imagenes');
      }
  }


  // Metodo para obtener las categorias, y a travez de filterOptions hacer el autocomplete
  getCategorias() {
    this.aplicationService.getCategorias().subscribe( (res) => {
      this.options = res;
      console.log(this.options);

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


  // ---------------------------------- CARGAR IMAGENES ------------------------

openGalery(evt) {
  // console.log(evt);
  var files = evt.target.files;
  var file = files[0];

  // console.log(file.name.split('\.'));

  let validacionImagen = file.name.split('\.');
  let num = validacionImagen.length;

  for (var i = 0; i < validacionImagen.length; i++) {
      if (num = i) {
        var tipoImg = validacionImagen[i];
      }
    }

  if (tipoImg === 'png' || tipoImg === 'jpg' || tipoImg === 'jpeg') {
      // console.log('si es imagen');

      if (files && file) {
        var reader = new FileReader();

        reader.onload = this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
       }

    } else {
      this.statusImgs = true;
      this.textoStatus = 'Solo se admiten imagenes, Por favor selecciona una';
    }
}

_handleReaderLoaded(readerEvt) {
  var binaryString = readerEvt.target.result;
  // this.base64textString = btoa(binaryString);
  // console.log(btoa(binaryString));
  // console.log(this.base64textString);
  this.imagenes.push({base64Image: 'data:image/jpeg;base64,' + btoa(binaryString)});
  // console.log(this.imagenes);
 }

 borrarFoto(i) {
  this.imagenes.splice(i, 1);
 }

 atrasImagenes() {

  this.pestana('informacion');
 }


 /////////////////////////////// PUBLICAR SERVICIO ///////////////////////////////////////

 publicarServicio(templete: TemplateRef<any>) {

  if (this.terminosYCondiciones === false) {
    this.statusImgs = true;
    this.textoStatus = 'Por favor acepta términos y condiciones antes de publicar el servicio.';
  } else {

    this.loading = true;
    let token = this.userService.getToken();
    let user = this.userService.getIdentity();

    let ch;

    if (this.chips.length >= 1) {

     // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.chips.length; i++) {

      if (!ch) {
        ch = this.chips[i].nombre;
      } else {
        ch = ch + ',' + ' ' + this.chips[i].nombre;
      }
    }

    }

    this.formulario = {id_usuario: user.id_provedor, token, nombre: this.datos.value.nombre,
        precio: this.datos.value.precio, imagenes: this.imagenes,
        descuento: this.datos.value.descuento, duracion: this.datos.value.duracion,
        id_ctga: this.myControl.value.id_categoria, video : this.datos.value.video,
        max_citas: this.numeroMaxCitas.value, descripcion: this.datos.value.descripcion, creador: user.nombre, chips : ch };





    // console.log(this.formulario);

    this.provedorService.pubService(this.formulario).subscribe( (res) => {
      this.loading = false;
      // console.log(res);

      if (res[0].agregado === true) {
        this.modalRef4 = this.modalService.show(templete,{class: 'second'});
        // document.getElementById('btn-publicacion-exitosa').click();
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

  }

 }


 cerrarAlerta(tipo) {
  if (tipo === 'horarios') {
    this.status = false;
  } else {
    this.statusImgs = false;
  }
 }

 terminosCondiciones(ev) {
  // console.log(ev.checked);
  this.terminosYCondiciones = ev.checked;
 }

 pubExitosa() {
  this.router.navigate(['/publicaciones']);
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

 validacionMaximoImagenes() {

  if (this.imagenes.length >= 6) {
    this.statusW = 'warning';
    this.textoStatus = 'Máximo 6 imagenes por servicio.';
  }

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


//  CHIPS

add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  // console.log('aqui');
  if (this.chips.length < 5) {

      // Add our fruit
  if ((value || '').trim()) {
    this.chips.push({nombre: value.trim()});
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
  }

}

remove(chip: Chip): void {
  const index = this.chips.indexOf(chip);

  if (index >= 0) {
    this.chips.splice(index, 1);
  }
 }

}
