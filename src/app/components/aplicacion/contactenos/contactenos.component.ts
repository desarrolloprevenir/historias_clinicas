import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent implements OnInit {
  public datos: FormGroup;
  municipio = new FormControl('', Validators.required);
  departamento = new FormControl('', Validators.required);
  public loading;
  public status;
  public statusText;
  public departamentos;
  public municipios;
  public consultorios = [];

  // variables consultorio
  public consultorio;
  nombre = new FormControl('', Validators.required);
  medico = new FormControl('', Validators.required);
  medicoSelect = new FormControl('', Validators.required);
  public interruptor = false;
  infoConsultorio;


  // public medicos;
  public medicos = [];

  constructor(public formBuilder: FormBuilder,
              private aplicationService: AppService,
              private userService: UserService,
              private provedorService: ProvedorService) {
                this.consultorio = 0;


                this.datos = this.formBuilder.group({
               nombres : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('[a-z A-z]*')]],
               cedula : ['', [Validators.required, Validators.pattern('[0-9]*')]],
               email : ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
               telefono : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[0-9]*')]],
               mensaje : ['', [Validators.required, Validators.minLength(5)]]
                });
               }

  ngOnInit() {
    this.getDepartamentos();
    // let identity = this._userService.getIdentity().id_provedor;
    // this.getMedicos(identity);
    this.meds();
  }

  meds() {

    this.medicos = [{nombre: 'pepe perez', select: false, id: '1'},
                    {nombre: 'elvio lao', select: false, id: '2'},
                    {nombre: 'ana conda', select: false, id: '3'},
                    {nombre: 'elba sofia', select: false, id: '4'},
                    {nombre: 'rosamel fierro', select: false, id: '5'}];
  }

  getDepartamentos() {
    this.loading = true;
    this.aplicationService.getDepartamento().subscribe( (response) => {
      this.departamentos = response;
      // console.log(this.departamentos);
      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor intentalo más tarde o revisa tu conexión.';
      this.loading = false;
    });
  }

  contactenos() {
    let info = {nombres : this.datos.value.nombres, cedula: this.datos.value.cedula, email: this.datos.value.email,
    telefono: this.datos.value.telefono, mensaje: this.datos.value.mensaje, municipio : this.municipio.value};

    // console.log(info, this.municipio.value);
  }

  cerrarAlerta() {
    this.status = undefined;
  }

  departamentoSelect(ev) {
    // console.log(this.departamento.value);
    this.loading = true;
    this.aplicationService.getMunicipio(this.departamento.value).subscribe( (response) => {
      this.municipios = response;
      // console.log(response);
      this.loading = false;
    }, (err) => {
      this.status = 'error';
      this.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
      this.loading = false;
    });
  }

  crearConsultorio() {

    // document.getElementById('oe').innerHTML += '<input type="text" class="form-control" [formControl]="nombre" >';


    this.consultorio = this.consultorio +1;
    console.log('oe');

    var consultorio = document.getElementById('cs');


    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = 'input-nombre-' + this.consultorio;


    var input2 = document.createElement('input');
    input2.type = 'text';
    input2.className = 'form-control';
    input2.id = 'input-medico-' + this.consultorio;
    input.required;

    var select1 = document.createElement('select');
    select1.className = 'form-control';
    select1.id = 'select-medico-' + this.consultorio;

    var option = document.createElement('option');
    option.innerText = 'oe';

    var option2 = document.createElement('option');
    option.innerText = 'oe2';

    consultorio.appendChild(input);
    consultorio.appendChild(input2);
    consultorio.appendChild(select1);

  }

  guardarInfo() {

    var consultorios = [];

    if (this.consultorio >= 1) {
      // console.log('hay otro consultorio');


      for ( let i = 0; i < this.consultorio + 1; i++ ) {

        // console.log(i);

        let input1 = 'input-nombre-' + i;
        let input2 = 'input-medico-' + i;

        // console.log(input1);

        let nombre = (<HTMLInputElement>document.getElementById(input1)).value;
        let medico = (<HTMLInputElement>document.getElementById(input2)).value;

        consultorios.push({ nombre, medico });
      }

      // console.log(consultorios);


    } else {
      // console.log((<HTMLInputElement>document.getElementById('input-nombre-1')).value,
      // (<HTMLInputElement>document.getElementById('input-medico-1')).value);
    }
  }

  component() {
    // console.log('oe');
    // document.getElementById('oe').innerHTML += '<app-consultorio></app-consultorio>';

    if (this.interruptor === false) {

      // console.log('interruptor false');

      this.consultorio = this.consultorio + 1;
      this.consultorios.push({iteracion: this.consultorio});
    } else {
      // console.log('interruptor true', this.infoConsultorio)
    }
  }

  getMedicos(idProvedor) {

    this.provedorService.getMedicosProvedor(idProvedor).subscribe( (response) => {
      // console.log(response);
      this.medicos = response;

      // this.consultorioComponent.medicos = response;
    }, () => {

    });

  }

}
