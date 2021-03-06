import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { PlatformLocation } from '@angular/common';

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
import { UserService } from 'src/app/services/user.service';
import { ProvedorService } from 'src/app/services/provedor.service';

// Sweet alert
import Swal from 'sweetalert2';

// CHIPS

import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Chip {
  nombre: string;
}

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent implements OnInit {
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
  public texto: string;


  // public horasDesdeHastaManana;
  // public horasDesdeHastaTarde;
  // public diasH1;
  // public diasH2;
  // public diasH3;
  // public ds = [];
  // public mananaH1 = false;
  // public mananaH2 = false;
  // public mananaH3 = false;
  // public tardeH1 = false;
  // public tardeH2 = false;
  // public tardeH3 = false;
  // public horario2 = false;
  // public horario3 = false;
  // public btnHorario = true;
  // public btnEliminarHorario = false;
  // public disableH1;
  // public disableH2;
  // public mananaDesdeH1: any;
  // public mananaHastaH1: any;
  // public tardeDesdeH1: any;
  // public tardeHastaH1: any;
  // public mananaDesdeH2: any;
  // public mananaHastaH2: any;
  // public tardeDesdeH2: any;
  // public tardeHastaH2: any;
  // public mananaDesdeH3: any;
  // public mananaHastaH3: any;
  // public tardeDesdeH3: any;
  // public tardeHastaH3: any;


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


  constructor(public userService: UserService,
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
                precio: ['0', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
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
    // console.log('aqui');

    // console.log(this.myControl.value.id_categoria);

    //  for (let i = 0; i < this.options.length ; i ++) {
    //   if(this.myControl.value)
    //  }

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

  // atrasInformacion() {
  //   // console.log(this.diasH1);

  //   let bol = true;

  //   switch (bol === true) {

  //     case this.diasH1 === undefined:
  //     this.pestana('informacion');
  //     break;

  //     case (this.diasH1 !== undefined) && (this.diasH1.length >= 1 && this.horario2 === false) :
  //     // console.log('h1');
  //     if ( this.enabledDiasH1() === true) {
  //        this.diasH1 = undefined;
  //        this.mananaDesdeH1 = undefined;
  //        this.mananaDesdeH2 = undefined;
  //        this.mananaDesdeH3 = undefined;
  //        this.tardeDesdeH1 = undefined;
  //        this.tardeDesdeH2 = undefined;
  //        this.tardeDesdeH3 = undefined;
  //        this.mananaH1 = false;
  //        this.tardeH1 = false;
  //        this.status = false;
  //        this.disableH1 = false;
  //        this.btnHorario = true;
  //      this.pestana('informacion');
  //     }
  //     break;

  //     case (this.diasH1 !== undefined) && (this.horario2 === true && this.horario3 === false):
  //     // console.log('h1 y h2');
  //     if (this.enabledDiasH1() === true) {
  //       this.diasH1 = undefined;
  //       this.mananaDesdeH1 = undefined;
  //       this.mananaDesdeH2 = undefined;
  //       this.mananaDesdeH3 = undefined;
  //       this.tardeDesdeH1 = undefined;
  //       this.tardeDesdeH2 = undefined;
  //       this.tardeDesdeH3 = undefined;
  //       this.mananaH1 = false;
  //       this.tardeH1 = false;
  //       this.status = false;
  //       this.disableH1 = false;
  //       this.btnHorario = true;

  //       this.diasH2 = undefined;
  //       this.mananaDesdeH2 = undefined;
  //       this.mananaHastaH2 = undefined;
  //       this.tardeDesdeH2 = undefined;
  //       this.tardeHastaH2 = undefined;
  //       this.horario2 = false;
  //       this.status = false;
  //       this.disableH2 = false;
  //     // console.log(this.diasH2);

  //       this.pestana('informacion');
  //     }

  //     break;

  //     case (this.diasH1 !== undefined) && (this.horario2 === true && this.horario3 === true):
  //     // console.log('h1 h2 h3');
  //       if (this.enabledDiasH1() === true && this.enabledDiasH2() === true && this.enabledDiasH3() === true) {

  //         this.diasH1 = undefined;
  //         this.mananaDesdeH1 = undefined;
  //         this.mananaDesdeH2 = undefined;
  //         this.mananaDesdeH3 = undefined;
  //         this.tardeDesdeH1 = undefined;
  //         this.tardeDesdeH2 = undefined;
  //         this.tardeDesdeH3 = undefined;
  //         this.mananaH1 = false;
  //         this.tardeH1 = false;
  //         this.status = false;
  //         this.disableH1 = false;
  //         this.btnHorario = true;
  //         this.diasH2 = undefined;
  //         this.mananaDesdeH2 = undefined;
  //         this.mananaHastaH2 = undefined;
  //         this.tardeDesdeH2 = undefined;
  //         this.tardeHastaH2 = undefined;
  //         this.horario2 = false;
  //         this.status = false;
  //         this.disableH2 = false;

  //         this.horario3 = false;
  //         this.mananaDesdeH3 = undefined;
  //         this.mananaHastaH3 = undefined;
  //         this.tardeDesdeH3 = undefined;
  //         this.tardeHastaH3 = undefined;
  //         this.mananaH3 = false;
  //         this.tardeH3 = false;

  //         // console.log(this.diasH3);
  //         this.pestana('informacion');
  //       }
  //     break;
  //   }


  // //   this.mananaDesdeH1 = undefined;
  // //   this.mananaHastaH1 = undefined;
  // //   this.tardeDesdeH1 = undefined;
  // //   this.tardeHastaH1 = undefined;
  // //   this.mananaDesdeH2 = undefined;
  // //   this.mananaHastaH2 = undefined;
  // //   this.tardeDesdeH2 = undefined;
  // //   this.tardeHastaH2 = undefined;
  // //   this.mananaDesdeH3 = undefined;
  // //   this.mananaHastaH3 = undefined;
  // //   this.tardeDesdeH3 = undefined;
  // //   this.tardeHastaH3 = undefined;
  // //   this.diasH1 = undefined;
  // //   this.diasH2 = undefined;
  // //   this.diasH3 = undefined;
  // //   this.horario2 = false;
  // //   this.horario3 = false;
  // //   this.enabledDiasH1();
  // //  this.enabledDiasH2();
  // //   this.pestana('informacion');
  // }

  // siguienteHorarios(bol) {

  //   // console.log(bol);
  //   let siguiente = true;

  //   switch (siguiente === true) {

  //     case (this.horario2 === false && this.horario3 === false):
  //     if (this.validacionesH1(bol) === true) {
  //       this.pestana('imagenes');
  //     }
  //     break;

  //     case (this.horario2 === true && this.horario3 === false):
  //     if (this.validacionesH2(bol) === true) {
  //       this.pestana('imagenes');
  //     }
  //     break;

  //     case (this.horario2 === true && this.horario3 === true):
  //     if (this.validacionesH3() === true) {
  //       this.pestana('imagenes');
  //     }
  //     break;

  //   }

  // }

  // getDepartamento() {

  //   this.loading = true;

  //   this._aplicationService.getDepartamento().subscribe( (res) => {
  //     // console.log(res);
  //     this.departamentos = res;
  //     this.loading = false;
  //   }, (err) => {
  //     this.loading = false;
  //     // console.log(err);
  //   });
  // }

  // getMunicipio(id) {

  //   this.loading = true;
  //   this._aplicationService.getMunicipio(id).subscribe( (res) => {
  //     this.municipios = res;
  //     // console.log(this.municipios);
  //     this.loading = false;
  //   }, (err) => {
  //     this.loading = false;
  //     // console.log(err);
  //   });
  // }

  // Metodo para obtener las categorias, y a travez de filterOptions hacer el autocomplete
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

  // deparSelect(event) {
  //   this.getMunicipio(event.value);
  // }

  // muniSelect(event) {
  //   this.muncSelect = event.value;
  // }

  // Metodo para obtener los medicos subscritos al provedor
  // getMedicos() {
  //   let id = this._userService.getIdentity();
  //   id = id.id_provedor;

  //   this._provedorService.getMedicosProvedor(id).subscribe( (response) => {

  //     this.medicos = response;
  //     // console.log(this.medicos);
  //   }, (err) => {
  //     // console.log(err);
  //   } );
  // }

  // medicoSelect(event) {
  //   this.medcSelect = event.value;
  // }

  // checktManana(ev, h) {

  //   if (ev.checked === true && h === 'h1') {
  //     this.mananaH1 = true;
  //   }

  //   if (ev.checked === false && h === 'h1') {
  //     this.mananaH1 = false;
  //   }

  //   if (ev.checked === true && h === 'h2') {
  //     this.mananaH2 = true;
  //   }

  //   if (ev.checked === false && h === 'h2') {
  //     this.mananaH2 = false;
  //   }

  //   if (ev.checked === true && h === 'h3') {
  //     this.mananaH3 = true;
  //   }

  //   if (ev.checked === false && h === 'h3') {
  //     this.mananaH3 = false;
  //   }
  // }

  // checktTarde(ev, h) {
  //   if (ev.checked === true && h === 'h1') {
  //     this.tardeH1 = true;
  //   }

  //   if (ev.checked === false && h === 'h1') {
  //     this.tardeH1 = false;
  //   }

  //   if (ev.checked === true && h === 'h2') {
  //     this.tardeH2 = true;
  //   }

  //   if (ev.checked === false && h === 'h2') {
  //     this.tardeH2 = false;
  //   }

  //   if (ev.checked === true && h === 'h3') {
  //     this.tardeH3 = true;
  //   }

  //   if (ev.checked === false && h === 'h3') {
  //     this.tardeH3 = false;
  //   }
  // }


  // horas() {
  //   this.horasDesdeHastaManana = [
  //     { hora : '6 a.m', value : '6:00' },
  //     { hora : '7 a.m', value : '7:00' },
  //     { hora : '8 a.m', value : '8:00' },
  //     { hora : '9 a.m', value : '9:00' },
  //     { hora : '10 a.m', value : '10:00' },
  //     { hora : '11 a.m', value : '11:00' },
  //     { hora : '12 a.m', value : '12:00' },
  //   ];

  //   this.horasDesdeHastaTarde = [
  //     { hora : '1 p.m', value : '13:00' },
  //     { hora : '2 p.m', value : '14:00' },
  //     { hora : '3 p.m', value : '15:00' },
  //     { hora : '4 p.m', value : '16:00' },
  //     { hora : '5 p.m', value : '17:00' },
  //     { hora : '6 p.m', value : '18:00' },
  //     { hora : '7 p.m', value : '19:00' },
  //   ];
  // }

  // diasSemana() {
  //   let lunes = {nombre: 'lunes',  disponible: true};
  //   let martes = {nombre: 'martes', disponible: true};
  //   let miercoles = {nombre: 'miércoles', disponible: true};
  //   let jueves = {nombre: 'jueves', disponible: true};
  //   let viernes = {nombre: 'viernes', disponible: true};
  //   let sabado = {nombre: 'sábado', disponible: true};
  //   let domingo = {nombre: 'domingo', disponible: true};

  //   let days = [lunes, martes, miercoles, jueves, viernes, sabado, domingo];

  //   for ( var i = 0; i < days.length; i++) {
  //     let dia = days[i];
  //     this.ds.push({dia});
  //   }

  // }

  // mostrarHorario(bol) {
  //   // console.log(bol);
  //   let mostrar = true;

  //   switch (mostrar === true) {
  //     case this.horario2 === false:
  //     this.validacionesH1(bol);
  //     break;

  //     case (this.horario2 === true && this.horario3 === false):
  //     this.status = false;
  //     this.validacionesH2(bol);
  //     break;
  //   }
  // }


  // eliminarHorario() {

  //   let bol = true;

  //   switch (bol === true) {

  //     case this.horario2 === true && this.horario3 === false:
  //     this.horario2 = false;
  //     this.btnEliminarHorario = false;
  //     this.enabledDiasH1();
  //     this.disableH1 = false;
  //     this.diasH2 = undefined;
  //     this.mananaDesdeH2 = undefined;
  //     this.mananaHastaH2 = undefined;
  //     this.tardeDesdeH2 = undefined;
  //     this.tardeHastaH2 = undefined;
  //     break;

  //     case this.horario2 === true && this.horario3 === true:
  //     this.horario3 = false;
  //     this.btnHorario = true;
  //     this.disableH2 = false;
  //     this.diasH3 = undefined;
  //     this.mananaDesdeH3 = undefined;
  //     this.mananaHastaH3 = undefined;
  //     this.tardeDesdeH3 = undefined;
  //     this.tardeHastaH3 = undefined;
  //     break;
  //   }

  // }

  // // desabilitar dias escogidos en el horario 1
  // disabledDiasH1 () {

  //   // console.log(this.diasH1);

  //  for (var i = 0; i < this.diasH1.length; i++) {
  //    var nombre = this.diasH1[i];

  //    for (var j = 0; j < this.ds.length; j++) {

  //     if (nombre === this.ds[j].dia.nombre) {
  //       this.ds[j].dia.disponible = false;
  //     }
  //    }

  //  }
  // }

  // // desabilitar dias escogidos en el horario 2
  // disabledDiasH2 () {

  //   // console.log(this.diasH1);

  //   for (var i = 0; i < this.diasH2.length; i++) {
  //     var nombre = this.diasH2[i];

  //     for (var j = 0; j < this.ds.length; j++) {

  //      if (nombre === this.ds[j].dia.nombre) {
  //        this.ds[j].dia.disponible = false;
  //      }
  //     }

  //   }
  //  }

  //  // habilitar dias horario 1 cuando se elimina el horario 2
  //  enabledDiasH1 () {

  //   // console.log(this.diasH1);

  //     for (var i = 0; i < this.diasH1.length; i++) {
  //       var nombre = this.diasH1[i];

  //     for (var j = 0; j < this.ds.length; j++) {

  //        if (nombre === this.ds[j].dia.nombre) {
  //          this.ds[j].dia.disponible = true;
  //        }
  //       }

  //     }
  //     return true;
  //     // console.log(this.ds);
  //  }

  //  // habilitar dias horario 2 cuando se elimina el horario 3
  //  enabledDiasH2 () {
  //   for (var i = 0; i < this.diasH3.length; i++) {
  //     var nombre = this.diasH3[i];

  //     for (var j = 0; j < this.ds.length; j++) {

  //      if (nombre === this.ds[j].dia.nombre) {
  //        this.ds[j].dia.disponible = true;
  //      }
  //     }
  //   }
  //   return true;
  //   // console.log(this.ds);

  //  }

  //  // habilitar dias seleccionados en el horario 2
  //  enabledDiasH3 () {
  //   for (var i = 0; i < this.diasH2.length; i++) {
  //     var nombre = this.diasH2[i];

  //     for (var j = 0; j < this.ds.length; j++) {

  //      if (nombre === this.ds[j].dia.nombre) {
  //        this.ds[j].dia.disponible = true;
  //      }
  //     }
  //   }

  //   return true;
  // }

  // // Dias seleccionados en el horario 1
  // diasHorario1(ev) {
  //   this.diasH1 = ev.value;
  //   // console.log(this.diasH1);
  // }

  // // Dias seleccionados en el horario 2
  // diasHorario2(ev) {
  //   this.diasH2 = ev.value;
  //   // console.log(this.diasH2);
  // }

  // // Dias seleccionados en el horario 3
  // diasHorario3(ev) {
  //   this.diasH3 = ev.value;
  //   // console.log(this.diasH3);
  // }

  // horasHorarios(ev, info) {
  //   // console.log(ev, info);

  //   // H1

  //   if (info === 'mdesde_h1') {
  //     // tslint:disable-next-line:radix
  //     this.mananaDesdeH1 = parseInt(ev.value);
  //     // console.log(this.mananaDesdeH1);
  //   }

  //   if (info === 'mhasta_h1') {
  //     // tslint:disable-next-line:radix
  //     this.mananaHastaH1 = parseInt(ev.value);
  //     // console.log(this.mananaHastaH1);
  //   }

  //   if (info === 'tdesde_h1') {
  //     // tslint:disable-next-line:radix
  //     this.tardeDesdeH1 = parseInt(ev.value);
  //     // console.log(this.tardeDesdeH1);
  //   }

  //   if (info === 'thasta_h1') {
  //     // tslint:disable-next-line:radix
  //     this.tardeHastaH1 = parseInt(ev.value);
  //     // console.log(this.tardeHastaH1);
  //   }

  //   // H2

  //   if (info === 'mdesde_h2') {
  //     // tslint:disable-next-line:radix
  //     this.mananaDesdeH2 = parseInt(ev.value);
  //   }

  //   if (info === 'mhasta_h2') {
  //     // tslint:disable-next-line:radix
  //     this.mananaHastaH2 = parseInt(ev.value);
  //   }

  //   if (info === 'tdesde_h2') {
  //     // tslint:disable-next-line:radix
  //     this.tardeDesdeH2 = parseInt(ev.value);
  //   }

  //   if (info === 'thasta_h2') {
  //     // tslint:disable-next-line:radix
  //     this.tardeHastaH2 = parseInt(ev.value);
  //   }


  //   // H3

  //   if (info === 'mdesde_h3') {
  //     // tslint:disable-next-line:radix
  //     this.mananaDesdeH3 = parseInt(ev.value);
  //   }

  //   if (info === 'mhasta_h3') {
  //     // tslint:disable-next-line:radix
  //     this.mananaHastaH3 = parseInt(ev.value);
  //   }

  //   if (info === 'tdesde_h3') {
  //     // tslint:disable-next-line:radix
  //     this.tardeDesdeH3 = parseInt(ev.value);
  //   }

  //   if (info === 'thasta_h3') {
  //     // console.log('aquiii');
  //     // tslint:disable-next-line:radix
  //     this.tardeHastaH3 = parseInt(ev.value);
  //     // console.log(this.tardeHastaH3);
  //   }
  // }


  // // Validaciones horario 1
  // validacionesH1(bol): boolean {

  //   if (this.diasH1 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa los dias de atención en el horario 1.';
  //       return false;
  //   } else {

  //     let val = true;
  //     switch (val === true) {

  //     case (this.mananaH1 === true && this.tardeH1 === false) :
  //     if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
  //       return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.mananaDesdeH1 > this.mananaHastaH1) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
  //         // console.log('<aqui>');
  //         return false;
  //       } else {

  //         if ( bol === 'false' ) {

  //           if (this.diasH1.length >= 7) {
  //             this.status = true;
  //             this.textoStatus = 'No hay dias disponibles para el horario 2.';
  //           } else {
  //            this.horario2 = true;
  //           //  console.log('aqui agregar');
  //            this.btnEliminarHorario = true;
  //            this.disabledDiasH1();
  //            this.disableH1 = true;
  //             return true;
  //           }
  //           } else {
  //           return true;
  //         }

  //       }
  //     }
  //     break;

  //     case (this.mananaH1 === false && this.tardeH1 === true) :
  //     if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
  //         this.status = true;
  //         this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 1.';
  //         return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.tardeDesdeH1 > this.tardeHastaH1) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
  //         return false;
  //       } else {

  //         if ( bol === 'false' ) {

  //          if (this.diasH1.length >= 7) {
  //             this.status = true;
  //             this.textoStatus = 'No hay dias disponibles para el horario 2.';
  //           } else {
  //            this.horario2 = true;
  //           //  console.log('aqui agregar');
  //            this.btnEliminarHorario = true;
  //            this.disabledDiasH1();
  //            this.disableH1 = true;
  //             return true;
  //           }


  //           } else {
  //           return true;
  //         }

  //       }
  //     }
  //     break;

  //     case (this.mananaH1 === true && this.tardeH1 === true) :

  //     if (this.mananaDesdeH1 === undefined || this.mananaHastaH1 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 1.';
  //       return false;
  //     } else if (this.tardeDesdeH1 === undefined || this.tardeHastaH1 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde del horario 1.';
  //       return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.mananaDesdeH1 > this.mananaHastaH1) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 1.';
  //         return false;
  //       } else if (this.tardeDesdeH1 > this.tardeHastaH1) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 1.';
  //         return false;
  //       } else {

  //         if ( bol === 'false' ) {


  //           if (this.diasH1.length >= 7) {
  //             this.status = true;
  //             this.textoStatus = 'No hay dias disponibles para el horario 2.';
  //           } else {
  //            this.horario2 = true;
  //           //  console.log('aqui agregar');
  //            this.btnEliminarHorario = true;
  //            this.disabledDiasH1();
  //            this.disableH1 = true;
  //             return true;
  //           }


  //           } else {
  //           return true;
  //         }
  //       }

  //     }
  //     break;

  //     case (this.mananaH1 === false && this.tardeH1 === false) :
  //     this.status = true;
  //     this.textoStatus = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
  //     return false;
  //     break;
  //   }

  //   }
  // }

  // validacionesH2 (bol): boolean {

  //   // console.log('aquiii');

  //   if (this.diasH2 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa los dias de atención en el horario 2.';
  //       return false;
  //   } else {

  //     let val = true;
  //   switch (val === true) {

  //     case (this.mananaH2 === true && this.tardeH2 === false) :
  //     if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
  //       return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.mananaDesdeH2 > this.mananaHastaH2) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
  //         return false;
  //       } else {

  //         if (bol === 'false') {

  //           if ( (this.diasH1.length + this.diasH2.length) >= 7) {
  //             this.status = true;
  //             this.textoStatus = 'No hay dias disponibles para el horario 3.';
  //           } else {

  //             this.horario3 = true;
  //             this.btnHorario = false;
  //             this.disabledDiasH2();
  //             this.disableH2 = true;
  //             return true;
  //           }


  //         //   this.horario3 = true;
  //         // this.btnHorario = false;
  //         // this.disabledDiasH2();
  //         // this.disableH2 = true;
  //         // return true;


  //         } else {
  //           return true;
  //         }

  //       }
  //     }
  //     break;

  //     case (this.mananaH2 === false && this.tardeH2 === true) :
  //     if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
  //         this.status = true;
  //         this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 2.';
  //         return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.tardeDesdeH2 > this.tardeHastaH2) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
  //         return false;
  //       } else {

  //         if (bol === 'false') {

  //           if ( (this.diasH1.length + this.diasH2.length) >= 7) {
  //             this.status = true;
  //             this.textoStatus = 'No hay dias disponibles para el horario 3.';
  //           } else {

  //             this.horario3 = true;
  //             this.btnHorario = false;
  //             this.disabledDiasH2();
  //             this.disableH2 = true;
  //             return true;
  //           }


  //         } else {
  //           return true;
  //         }

  //       }
  //     }
  //     break;

  //     case (this.mananaH2 === true && this.tardeH2 === true) :

  //     if (this.mananaDesdeH2 === undefined || this.mananaHastaH2 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 2.';
  //       return false;
  //     } else if (this.tardeDesdeH2 === undefined || this.tardeHastaH2 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde del horario 2.';
  //       return false;
  //     } else {
  //        // Validacion de las horas de inicio y final
  //        if (this.mananaDesdeH2 > this.mananaHastaH2) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 2.';
  //         return false;
  //       } else if (this.tardeDesdeH2 > this.tardeHastaH2) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 2.';
  //         return false;
  //       } else {

  //         if (bol === 'false') {

  //          if ( (this.diasH1.length + this.diasH2.length) >= 7) {
  //             this.status = true;
  //             this.textoStatus = 'No hay dias disponibles para el horario 3.';
  //           } else {

  //             this.horario3 = true;
  //             this.btnHorario = false;
  //             this.disabledDiasH2();
  //             this.disableH2 = true;
  //             return true;
  //           }

  //         } else {
  //           return true;
  //         }
  //       }
  //     }
  //     break;

  //     case (this.mananaH2 === false && this.tardeH2 === false) :
  //     this.status = true;
  //     this.textoStatus = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
  //     return false;
  //     break;
  //   }

  //   }
  // }

  // validacionesH3(): boolean {

  //   if (this.diasH3 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa los dias de atención en el horario 3.';
  //   } else {

  //     let val = true;
  //   switch (val === true) {

  //     case (this.mananaH3 === true && this.tardeH3 === false) :
  //     if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 3.';
  //       return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.mananaDesdeH3 > this.mananaHastaH3) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
  //         return false;
  //       } else {
  //         // console.log('mañana bn h3');
  //         return true;
  //       }
  //     }
  //     break;

  //     case (this.mananaH3 === false && this.tardeH3 === true) :
  //     if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde de el horario 3.';
  //       return false;
  //     } else {

  //       // Validacion de las horas de inicio y final
  //       if (this.tardeDesdeH3 > this.tardeHastaH3) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 3.';
  //         return false;
  //       } else {
  //         // console.log('tarde bn h3');
  //         return true;
  //       }
  //     }
  //     break;

  //     case (this.mananaH3 === true && this.tardeH3 === true) :

  //     if (this.mananaDesdeH3 === undefined || this.mananaHastaH3 === undefined) {
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la mañana del horario 3.';
  //       return false;
  //     } else if (this.tardeDesdeH3 === undefined || this.tardeHastaH3 === undefined) {
  //       // console.log(this.tardeDesdeH3, this.tardeHastaH3);
  //       this.status = true;
  //       this.textoStatus = 'Por favor completa una hora de inicio y terminación en la tarde del horario 3.';
  //       return false;
  //     } else {
  //        // Validacion de las horas de inicio y final
  //        if (this.mananaDesdeH3 > this.mananaHastaH3) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la mañana de el horario 3.';
  //         return false;
  //       } else if (this.tardeDesdeH3 > this.tardeHastaH3) {
  //         this.status = true;
  //         this.textoStatus = 'La hora final no puede ser mayor a la hora de inicio en la tarde de el horario 3.';
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //     break;

  //     case (this.mananaH3 === false && this.tardeH3 === false) :
  //     this.status = true;
  //     this.textoStatus = 'Por favor escoge el horario de atención en la mañana o en la tarde de acuerdo a la disponibilidad del servicio.';
  //     return false;
  //     break;
  //   }

  //   }
  // }


  // ---------------------------------- CARGAR IMAGENES ------------------------

//   openGalery(event): void {
//     console.log(event);
//    if (event.target.files && event.target.files[0]) {
//        const file = event.target.files[0];

//        const reader = new FileReader();
//        reader.onload = e => this.imagenes.push({base64Image: reader.result});
//        reader.readAsDataURL(file);
//    }

//    console.log(this.imagenes);
//  }

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

  // if (this.horario2 === true && this.horario3 === false && this.diasH2.length >= 1) {
  //   console.log(this.enabledDiasH1());
  //   console.log(this.diasH2);
  // }

  // let bol = true;

  // switch (bol === true) {

  //   case (this.diasH1.length >= 1 && this.horario2 === false) :
  //   if ( this.enabledDiasH1() === true) {
  //      this.diasH1 = undefined;
  //      this.mananaDesdeH1 = undefined;
  //      this.mananaDesdeH2 = undefined;
  //      this.mananaDesdeH3 = undefined;
  //      this.tardeDesdeH1 = undefined;
  //      this.tardeDesdeH2 = undefined;
  //      this.tardeDesdeH3 = undefined;
  //      this.mananaH1 = false;
  //      this.tardeH1 = false;
  //      this.status = false;
  //      this.disableH1 = false;
  //      this.btnHorario = true;

  //      this.pestana('horarios');
  //   }
  //   break;

  //   case (this.horario2 === true && this.horario3 === false):

  //   if (this.enabledDiasH1() === true) {
  //     this.diasH1 = undefined;
  //     this.mananaDesdeH1 = undefined;
  //     this.mananaDesdeH2 = undefined;
  //     this.mananaDesdeH3 = undefined;
  //     this.tardeDesdeH1 = undefined;
  //     this.tardeDesdeH2 = undefined;
  //     this.tardeDesdeH3 = undefined;
  //     this.mananaH1 = false;
  //     this.tardeH1 = false;
  //     this.mananaH2 = false;
  //     this.tardeH2 = false;
  //     this.status = false;
  //     this.disableH1 = false;
  //     this.btnHorario = true;

  //     this.diasH2 = undefined;
  //     this.mananaDesdeH2 = undefined;
  //     this.mananaHastaH2 = undefined;
  //     this.tardeDesdeH2 = undefined;
  //     this.tardeHastaH2 = undefined;
  //     this.horario2 = false;
  //     this.status = false;
  //     this.disableH2 = false;

  //     // console.log(this.diasH2);

  //     this.pestana('horarios');
  //   }

  //   break;

  //   case (this.horario2 === true && this.horario3 === true):
  //     if (this.enabledDiasH1() === true && this.enabledDiasH2() === true && this.enabledDiasH3() === true) {

  //       this.diasH1 = undefined;
  //       this.mananaDesdeH1 = undefined;
  //       this.mananaDesdeH2 = undefined;
  //       this.mananaDesdeH3 = undefined;
  //       this.tardeDesdeH1 = undefined;
  //       this.tardeDesdeH2 = undefined;
  //       this.tardeDesdeH3 = undefined;
  //       this.mananaH1 = false;
  //       this.tardeH1 = false;
  //       this.mananaH2 = false;
  //       this.tardeH2 = false;
  //       this.tardeH3 = false;
  //       this.mananaH3 = false;
  //       this.status = false;
  //       this.disableH1 = false;
  //       this.btnHorario = true;
  //       this.diasH2 = undefined;
  //       this.mananaDesdeH2 = undefined;
  //       this.mananaHastaH2 = undefined;
  //       this.tardeDesdeH2 = undefined;
  //       this.tardeHastaH2 = undefined;
  //       this.horario2 = false;
  //       this.status = false;
  //       this.disableH2 = false;

  //       this.horario3 = false;
  //       this.mananaDesdeH3 = undefined;
  //       this.mananaHastaH3 = undefined;
  //       this.tardeDesdeH3 = undefined;
  //       this.tardeHastaH3 = undefined;
  //       // console.log(this.diasH3);
  //       this.pestana('horarios');
  //     }
  //   break;
  // }

  //  this.enabledDiasH1();
  //  this.enabledDiasH2();
  //  this.diasH1 = undefined;
  //  this.diasH2 = undefined;
  //  this.diasH3 = undefined;
  //  this.mananaDesdeH1 = undefined;
  //  this.mananaDesdeH2 = undefined;
  //  this.mananaDesdeH3 = undefined;
  //  this.tardeDesdeH1 = undefined;
  //  this.tardeDesdeH2 = undefined;
  //  this.tardeDesdeH3 = undefined;
  //  this.mananaH1 = false;
  //  this.mananaH2 = false;
  //  this.mananaH3 = false;
  //  this.tardeH1 = false;
  //  this.tardeH2 = false;
  //  this.tardeH3 = false;
  //  this.horario2 = false;
  //  this.horario3 = false;
  //  this.status = false;
  //  this.disableH1 = false;
  //  this.disableH2 = false;
  //  this.btnHorario = true;

  //  this.pestana('horarios');
 }


 /////////////////////////////// PUBLICAR SERVICIO ///////////////////////////////////////

 publicarServicio() {

  if (this.terminosYCondiciones === false) {
    this.statusImgs = true;
    this.textoStatus = 'Por favor acepta términos y condiciones antes de publicar el servicio.';
  } else {

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

    this.formulario = {id_usuario: user.id_provedor, token, nombre: this.datos.value.nombre,
        precio: this.datos.value.precio, imagenes: this.imagenes,
        descuento: this.datos.value.descuento, duracion: this.datos.value.duracion,
        id_ctga: this.myControl.value.id_categoria, video : this.datos.value.video,
        max_citas: this.numeroMaxCitas.value, descripcion: this.datos.value.descripcion, creador: user.nombre, chips : this.chips };


    // asignar consultorio en la sucursal creada o crear nueva sucursal
    // console.log(this.formulario);

    this.provedorService.pubService(this.formulario).subscribe( (res) => {
      this.loading = false;
      // console.log(res);

      if (res[0].agregado === true) {
        // tslint:disable-next-line: max-line-length
        this.texto = ' La publicación ha sido creada correctamente, para que el servicio sea visible para los usuarios es necesario asociarlo a un consultorio, ¿ Desea hacerlo ahora ?.';
        document.getElementById('btn-publicacion-exitosa').click();
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

 asociarConsultorio() {

    let identity = this.userService.getIdentity().id_provedor;
    this.provedorService.getMedicosProvedor(identity).subscribe( (response: any) => {
      // this.medicos = response;
      // console.log('medicos', response);


      if (response.length >= 1) {
        this.router.navigate(['consultorio']);

        // tslint:disable-next-line: prefer-for-of
        // for (let i = 0; i < this.medicos.length; i++) {

        //   if ( this.medicos[i].activo === 'false') {
        //     // console.log('aqui');
        //     this.siguiente = true;
        //     break;
        //   } else {
        //     this.siguiente = false;
        //   }
        // }
      } else {
          this.texto = 'No tienes médicos disponibles para crear un consultorio, por favor ponte en contacto con el administrador.';
      }

      // if (this.siguiente === true) {
      //   this.router.navigate(['consultorio']);
      // } else {
      //   document.getElementById('btn-info-medico').click();
      // }

      // console.log(this.siguiente);

    }, () => {
    });
  
 }

//  publicarServicio() {

//   // console.log('oe')
//    if (this.imagenes.length <= 0) {
//     this.statusImgs = true;
//     this.textoStatus = 'Por favor selecciona al menos una imagen';
//     window.scroll(0, 0);
//    } else if (this.terminosYCondiciones === false) {
//     this.statusImgs = true;
//     this.textoStatus = 'Por favor acepta los terminos y condiciones.';
//     window.scroll(0, 0);
//    } else {

//     this.loading = true;
//     let token = this._userService.getToken();
//     let user = this._userService.getIdentity();
//     var h1;
//     var h2;
//     var h3;

//     let hor = true;
//     switch (hor === true) {
//       // horario 1
//       case (this.mananaH1 === true && this.tardeH1 === false):
//       h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: undefined,
//       t_hasta: undefined, semana : this.diasH1};
//       break;

//       case (this.mananaH1 === false && this.tardeH1 === true):
//       h1 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH1 + ':00',
//       t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1};
//       break;

//       case (this.mananaH1 === true && this.tardeH1 === true):
//       h1 = { m_de: this.mananaDesdeH1 + ':00', m_hasta: this.mananaHastaH1 + ':00', t_de: this.tardeDesdeH1 + ':00',
//       t_hasta: this.tardeHastaH1 + ':00', semana : this.diasH1};
//       break;
//     }

//         if (this.horario2 === true) {
//           if (this.mananaH2 === true && this.tardeH2 === false) {
//             // console.log('solo mañana 2');
//           h2 = { m_de: this.mananaDesdeH2 + ':00', m_hasta: this.mananaHastaH2 + ':00', t_de: undefined,
//           t_hasta: undefined, semana : this.diasH2};
//           }

//           if (this.mananaH2 === false && this.tardeH2 === true) {
//             // console.log('solo tarde 2');
//             h2 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH2 + ':00',
//           t_hasta: this.tardeHastaH2 + ':00', semana : this.diasH2};
//           }

//           if (this.mananaH2 === true && this.tardeH2 === true) {
//             // console.log('mañana tarde 2');
//             h2 = { m_de: this.mananaDesdeH2 + ':00', m_hasta: this.mananaHastaH2 + ':00', t_de: this.tardeDesdeH2 + ':00',
//           t_hasta: this.tardeHastaH2 + ':00', semana : this.diasH2};
//           }
//         } else {
//           h2 = { m_de: this.mananaDesdeH2, m_hasta: this.mananaHastaH2, t_de: this.tardeDesdeH2,
//           t_hasta: this.tardeHastaH2, semana : this.diasH2};
//         }

//         if (this.horario3 === true) {

//           if (this.mananaH3 === true && this.tardeH3 === false) {
//             h3 = { m_de: this.mananaDesdeH3 + ':00', m_hasta: this.mananaHastaH3 + ':00', t_de: undefined,
//                 t_hasta: undefined, semana : this.diasH3};
//           }

//           if (this.mananaH3 === false && this.tardeH3 === true) {
//             h3 = { m_de: undefined, m_hasta: undefined, t_de: this.tardeDesdeH3  + ':00',
//                 t_hasta: this.tardeHastaH3  + ':00', semana : this.diasH3};
//           }

//           if (this.mananaH3 === true && this.tardeH3 === true) {
//             h3 = { m_de: this.mananaDesdeH3 + ':00', m_hasta: this.mananaHastaH3 + ':00', t_de: this.tardeDesdeH3  + ':00',
//                 t_hasta: this.tardeHastaH3  + ':00', semana : this.diasH3};
//           }

//         } else {
//           h3 = { m_de: this.mananaDesdeH3 , m_hasta: this.mananaHastaH3 , t_de: this.tardeDesdeH3 ,
//                 t_hasta: this.tardeHastaH3 , semana : this.diasH3};
//         }

//       let horario = [h1, h2, h3];
//       let h4 = {horario: horario};
//       let horarios = [h4];

//     this.formulario = {id_usuario: user.id_provedor, token: token, nombre: this.datos.value.nombre,
//     precio: this.datos.value.precio, direccion: this.datos.value.direccion, imagenes: this.imagenes,
//     descuento: this.datos.value.descuento, duracion: this.datos.value.duracion,
//     id_mncp: this.selectMunicipio.value, id_ctga: this.myControl.value.id_categoria, video : this.datos.value.video,
//     max_citas: this.numeroMaxCitas.value, descripcion: this.datos.value.descripcion, medico_id: this.selectMedico.value, horarios};

//       // console.log(this.formulario);

//       this._provedorService.pubService(this.formulario).subscribe( (res) => {
//       this.loading = false;
//         // console.log(res);

//       if (res[0].agregado === true) {
//         document.getElementById('btn-publicacion-exitosa').click();
//       } else {
//         // this.pg.status = 'error';
//         // this.pg.statusText = 'Error al agregar el servicio.';
//         this.statusImgs = true;
//         this.textoStatus = 'Error al agregar el servicio.';
//       }
//       }, (err) => {
//         this.statusImgs = true;
//         this.textoStatus = 'Error al agregar el servicio.';
//         this.loading = false;
//         // console.log(err);
//       });
//    }
//  }


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

  // if (this.chips.length >= 5) {
  //   Swal.fire('', 'Puedes poner hasta cinco palabras clave', 'warning');
  //   console.log('mas de 5');
  // }

}

remove(chip: Chip): void {
  const index = this.chips.indexOf(chip);

  if (index >= 0) {
    this.chips.splice(index, 1);
  }
 }
}


