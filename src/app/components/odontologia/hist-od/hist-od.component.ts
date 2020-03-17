import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface User {
  nombre: string;
  codigo: string;
}

@Component({
  selector: 'app-hist-od',
  templateUrl: './hist-od.component.html',
  styleUrls: ['./hist-od.component.css']
})



export class HistOdComponent implements OnInit {

  public datosOdonto: FormGroup;

  public resultadoSiTratamiento;
  public siTratamiento;

  public tomaMedicamentos;
  public medicamentos;

  public hemorragia;

  public saberOperado;
  public operado;

  public cualAlergia;
  public alergia;

  public psiquiatrico;
  public diabetes;
  public dolenciaCardiaca;
  public hemofilia;
  public neuro;
  public renal;
  public dialisis;
  public hepatitis;
  public tuber;
  public neumo;
  public sifi;
  public hiper;
  public hiv;
  public embarazo;
  public infecciones;

  public codificacionesOdontograma;
  public listaCodificaciones = [];
  public cajaCodificaciones = [];
  codificacionSeleccionada =  '0';



  myControl = new FormControl('', [Validators.required]);
  options: User[];
  filteredOptions: Observable<User[]>;

  public registroCodificacion: FormGroup;
  public idCod = [];

  buscar = '';


  constructor(private formBuilder: FormBuilder) {
    this.siTratamiento = 'si';
   }

  ngOnInit() {
    this.inicializarFormOdonto();
    this.inicializarFormCod();
    this.getCodificacion();
    this.codificacionesOdonto();
  }

  inicializarFormOdonto() {
     this.datosOdonto = this.formBuilder.group({
      tipoConsulta: ['', [Validators.required]],
      motivoConsulta: [''],
      enfermedadPreexistente: [''],
      ultimoTratamiento: [''],
      causaTratamiento: [''],
      causaOperado: [''],
      causaAlergia: [''],
      buscar: [''],
     });
  }

  saberSiTratamiento(parametro) {
    this.resultadoSiTratamiento = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
        this.siTratamiento = 'causa';
        break;

      case parametro.value === 'no':
        this.siTratamiento = '';
        break;
    }
  }

  saberSiMedicamento(parametro) {
    this.tomaMedicamentos = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
      this.medicamentos = 'medicamentos';
      break;
      case parametro.value === 'no' :
        this.medicamentos = '';
        break;
    }
  }

  saberSiHemorragia(parametro) {
    this.hemorragia = parametro.value;
  }

  saberSiOperado(parametro) {
    this.saberOperado = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
        this.operado = 'operado';
        console.log('entro');
        break;
      case parametro.value === 'no' :
        this.operado = '' ;
        break;
    }
  }

  saberSiAlergias(parametro) {
    this.cualAlergia = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
        this.alergia = 'alergia';
        break;
      case parametro.value === 'no' :
        this.alergia = '';
        break;
    }
  }

  saberSiTranstornosP(parametro) {
    this.psiquiatrico = parametro.value;
  }
  saberSiDiabetes(parametro) {
    this.diabetes = parametro.value;
  }
  saberSiDolencia(parametro) {
    this.dolenciaCardiaca = parametro.value;
  }
  saberSiHemofilia(parametro) {
    this.hemofilia = parametro.value;
  }
  saberSiNeuro(parametro) {
    this.neuro = parametro.value;
  }
  saberSiRenales(parametro) {
    this.renal = parametro.value;
  }
  saberSiDialisis(parametro) {
    this.dialisis = parametro.value;
  }
  saberSiHepatitis(parametro) {
    this.hepatitis = parametro.value;
  }
  saberSiTuber(parametro) {
    this.tuber = parametro.value;
  }
  saberSiNeumo(parametro) {
    this.neumo = parametro.value;
  }
  saberSiSifi(parametro) {
    this.sifi = parametro.value;
  }
  saberSiHiper(parametro) {
    this.hiper = parametro.value;
  }
  saberSiEmbarazada(parametro) {
    this.embarazo = parametro.value;
  }
  saberSiHerpes(parametro) {
    this.infecciones = parametro.value;
  }

  enableDisableRule(elem) {
    const colorOne = 'red';
    const colorTwo = 'white';
    if (elem.className !== 'visitas') {
      elem = elem.closest('.visitas');
    }
    elem.style.backgroundColor = (elem.style.backgroundColor === colorOne) ? colorTwo : colorOne;
    console.log(elem.id);
  }

  codificacionesOdonto() {
    this.codificacionesOdontograma = [
      {codigo : 'AA' , nombre : 'Ausente Antiguo + espacio'},
      {codigo : 'AP' , nombre : 'Ausente Postmortem'},
      {codigo : 'AR' , nombre : 'Ausente Reciente'},
      {codigo : 'AB' , nombre : 'Abrasión'},
      {codigo : 'AF' , nombre : 'Adfracción'},
      {codigo : 'AT' , nombre : 'Atrición'},
      {codigo : 'AG' , nombre : 'Amalgama + Superficie'},
      {codigo : 'AP' , nombre : 'Apiñamiento'},
      {codigo : 'C' , nombre : 'Caries+sup+grado severidad'},
      {codigo : 'CA' , nombre : 'Cálculos'},
      {codigo : 'CC' , nombre : 'Corona Completa'},
      {codigo : 'CE' , nombre : 'Corona Material Estético'},
      {codigo : 'DA' , nombre : 'Diastema'},
      {codigo : 'DC' , nombre : 'Destrucción Coronal'},
      {codigo : 'DI' , nombre : 'Diente Incluido'},
      {codigo : 'DL' , nombre : 'Desgaste Leve'},
      {codigo : 'DM' , nombre : 'Desgaste Moderado Superior'},
      {codigo : 'DS' , nombre : 'Desgaste Severo Superior'},
      {codigo : 'EP' , nombre : 'Enfermedad Periodontal'},
      {codigo : 'ER' , nombre : 'Erosión'},
      {codigo : 'FA' , nombre : 'Fractura Antigua + superficie'},
      {codigo : 'FR' , nombre : 'Fractura Reciente + superficie'},
      {codigo : 'FE' , nombre : 'Férula'},
      {codigo : 'FI' , nombre : 'Fragmento Incompleto'},
      {codigo : 'HI' , nombre : 'Hipoplasia'},
      {codigo : 'IE' , nombre : 'Incrustación Estética + sup'},
      {codigo : 'IM' , nombre : 'Incrustación Metálica + sup'},
      {codigo : 'MA' , nombre : 'Macrodoncia'},
      {codigo : 'NU' , nombre : 'Núcleo'},
      {codigo : 'OE' , nombre : 'Obturación Estética + sup'},
      {codigo : 'OT' , nombre : 'Obturación Temporal + sup'},
      {codigo : 'PG' , nombre : 'Pigmentación'},
      {codigo : 'PE' , nombre : 'Parcialmente Erupcionado'},
      {codigo : 'PF' , nombre : 'Prótesis Fija'},
      {codigo : 'PI' , nombre : 'Pilar'},
      {codigo : 'PL' , nombre : 'Placa Ortopedia'},
      {codigo : 'PO' , nombre : 'Póntico'},
      {codigo : 'PR' , nombre : 'Prótesis Removible'},
      {codigo : 'PT' , nombre : 'Prótesis Total'},
      {codigo : 'RR' , nombre : 'Recto Redicular'},
      {codigo : 'RG' , nombre : 'Retracción Gingival'},
      {codigo : 'SA' , nombre : 'Sin Alteración'},
      {codigo : 'SF' , nombre : 'Sellante Fosetas y Fisuras'},
      {codigo : 'SU' , nombre : 'Supernumerario'},
      {codigo : 'TP' , nombre : 'Talla Pre-prótesis'},
      {codigo : 'EX' , nombre : 'Extruido'},
      {codigo : 'GR' , nombre : 'Gresión'},
      {codigo : 'IN' , nombre : 'Intruido'},
      {codigo : 'RL' , nombre : 'Rotación Leve'},
      {codigo : 'RM' , nombre : 'Rotación Moderada'},
      {codigo : 'RS' , nombre : 'Rotación Severa'},
      {codigo : 'I' , nombre : 'Incisal'},
      {codigo : 'RR' , nombre : 'Resto Radicular'},
      {codigo : 'C' , nombre : 'Cervical'},
      {codigo : 'D' , nombre : 'Distal'},
      {codigo : 'L' , nombre : 'Lingual'},
      {codigo : 'MA' , nombre : 'Mesial'},
      {codigo : 'O' , nombre : 'Oclusal'},
      {codigo : 'P' , nombre : 'Palatino'},
      {codigo : 'V' , nombre : 'Vestibular'},
      {codigo : 'VE' , nombre : 'Versión'},
    ];

    this.options = this.codificacionesOdontograma;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.nombre),
        map(nombre => nombre ? this._filter(nombre) : this.options.slice())
      );
  }

  displayFn(user?: User): string | undefined {
    return user ? user.nombre : undefined;
  }

  private _filter(nombre: string): User[] {
    const filterValue = nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) > -1);
  }

  inicializarFormCod() {
    this.registroCodificacion = this.formBuilder.group({
      codigo: [''],
      nombre: ['']
    });
  }

  getCodificacion() {
    let diag = this.codificacionesOdontograma;
  }

  guardarClick(o) {

    this.cajaCodificaciones.push(o);
    //this.idCod.push(o.id_impresiondiag);

  }

  borrarMedicamento(i) {
    console.log(i);
    this.cajaCodificaciones.splice(i, 1);
  }


}
