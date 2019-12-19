import { AfterViewInit, Component, OnDestroy , OnInit, ViewChild, Input} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PlatformLocation } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Router} from '@angular/router';
import { AppService } from '../../../services/app.service';
import { MedicoService } from 'src/app/services/medico.service';
import { UserService } from 'src/app/services/user.service';
import { DiagnosticoService } from '../../../services/diagnostico.service';

export interface User {
  nombre: string;
  id_impresiondiag: number;
  rips: string;
}

@Component({
  selector: 'app-hst-general',
  templateUrl: './hst-general.component.html',
  styleUrls: ['./hst-general.component.css']
})
export class HstGeneralComponent implements  OnInit, AfterViewInit, OnDestroy {
  public antecedentesF;
  public listaAntecedentesF = [];
  public listaHabitos = [];
  public grupoAntecedentesF;
  protected AntecedentesF: AntecedentesF[] = ANTECEDENTESF;
  public antecedentesFMultiCtrl: FormControl = new FormControl();
  public antecedentesFMultiFilterCtrl: FormControl = new FormControl();
  public filteredAntecedentesFMulti: ReplaySubject<AntecedentesF[]> = new ReplaySubject<AntecedentesF[]>(1);
  @ViewChild('multiSelect', { static: false }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  public grupoHabitos;
  public datos: FormGroup;
  public datos2: FormGroup;
  public infoUser;
  public consulta;
  public antecedeneFCombo: string;
  public antecedenteOtro: string;
  public sistema = [];
  public antecedentesFamiliaresArray = [];
  public txtOtroAntecedente: string;
  public antecedentesPersonalesArray = [];
  public varCardio;
  public varVascular;
  public varGastro;
  public varGenito;
  public varEndo;
  public varOsteo;
  public varNeuro;
  public varPiel;
  public examen = [];
  public varCabeza;
  public varOjos;
  public varOidos;
  public varNariz;
  public varBoca;
  public varCuello;
  public varTorax;
  public varPulmones;
  public varCorazon;
  public varAbdomen;
  public varGenitoUrinario;
  public varColumna;
  public varExtremidades;
  public varNeurologico;
  public varFanereas;
  public cabeza;
  public ojos;
  public oidos;
  public nariz;
  public boca;
  public cuello;
  public torax;
  public pulmones;
  public corazon;
  public abdomen;
  public genitoUrinario;
  public columna;
  public extremidades;
  public neurologico;
  public fanereas;
  public descripcionFanereas: string;
  public listaDiagnosticos = [];
  public nuevoDiagnostico = [];
  public descripcionDiag: string;
  public codDiag: string;
  public iDiagnostico: Int16Array;
  public diagnosticos;
  public datoDiagnostico = '';

  public cajaDiagnostico = [];

  diagnosticoSeleccionado : string = '0';

  myControl = new FormControl('', [Validators.required]);
  options: User[];
  filteredOptions: Observable<User[]>;


  // Diagnostico

  public registroDiag: FormGroup;

 public idImpDiag = [];




  // Formularios

  public datosHistGeneral: FormGroup;
  public habitos = [];
  public cigarrillo = false;
  public alcohol = false;
  public estres = false;
  public humo = false;
  public polvo = false;
  public ejercicio = false;
  public antecedentes = [];
  @Input() idUsuario;
  @Input() idServicio;

  public vista;

  public identificadorDiag = [];

   public status: any;
  public statusText;
  public token;

  // prueba
  buscar = '';


  public infoHistoriaGeneral;

  constructor(private formBuilder: FormBuilder,
              private aplicationService: AppService,
              private router: Router,
              private medicoService: MedicoService,
              private userService: UserService,
              location: PlatformLocation,
              private diagnosticoService: DiagnosticoService) {
                this.vista = 'consulta';
               }

  ngOnInit() {

     // this.tpDatos();
     this.habitosFactoresDeRiesgo();
     // this.validaciones();
     this.revisionSistemas();
     this.examenMedico();
     // this.diagnostico();
     this.iniciarFormsHistGeneral();
     // this.antecedentesFMultiCtrl.setValue([this.AntecedentesF[1]]);
     this.filteredAntecedentesFMulti.next(this.AntecedentesF.slice());
     this.antecedentesFMultiFilterCtrl.valueChanges
     .pipe(takeUntil(this._onDestroy))
     .subscribe(() => {
       this.filterAntecedentesFMulti();
     });
     this.inicializarFormDiagnostico();
     this.getDiagnosticos();
  }
  displayFn(user?: User): string | undefined {
    return user ? user.nombre : undefined;
  }

  private _filter(nombre: string): User[]{
    const filterValue = nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) > -1);
  }


  getDiagnosticos(){
    this.diagnosticoService.getDiagnostico().subscribe( (res) => {

      this.options = res;
     // console.log(this.options);
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.nombre),
        map(nombre => nombre ? this._filter(nombre) : this.options.slice())

      );



    }, () => {

    });
  }

  inicializarFormDiagnostico() {
    this.registroDiag = this.formBuilder.group({
      descripDiag : [''],
      coDiag : ['']
    });
  }

  iniciarFormsHistGeneral() {

    this.datosHistGeneral = this.formBuilder.group({
      tipoConsulta: ['', [Validators.required]],
      motivoConsulta: [''],
      enfermedadPreexistente: [''],
      otroAntecedentesFamiliares: [''],
      patologicos: [''],
      quirurgicos: [''],
      traumaticos: [''],
      gine_menarquia: [''],
      gine_gravidez: [''],
      gine_partos: [''],
      gine_abortos: [''],
      gine_hijosvivos: [''],
      gine_planificacion: [''],
      toxicos_alergicos: [''],
      card_resp_desc: [''],
      vascular_desc: [''],
      gastro_int_desc: [''],
      genito_uri_desc: [''],
      endocrino_desc: [''],
      osteomuscular_desc: [''],
      neurologico_desc: [''],
      pielyfan_desc: [''],
      cigarrillo: [''],
      alcohol: [''],
      estres: [''],
      humo: [''],
      polvo: [''],
      ejercicio: [''],
      otrosHabitos: [''],
      aparienciaGeneral: [''],
      frecuencia_cardica: [''],
      frecuencia_resp: [''],
      presion_art: [''],
      temperetura: [0],
      talla: [0],
      peso: [0],
      cabeza_desc: [''],
      ojos_desc: [''],
      oidos_desc: [''],
      nariz_desc: [''],
      boca_desc: [''],
      cuello_desc: [''],
      torax_ma_desc: [''],
      pulmones_desc: [''],
      corazon_desc: [''],
      abdomen_desc: [''],
      genitourinario_desc: [''],
      columna_desc: [''],
      extremidades_desc: [''],
      neurologico_desc_fisico: [''],
      pielyfane_desc: ['']
    });

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredAntecedentesFMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.antecedentesFMultiCtrl.patchValue(val);
        } else {
          this.antecedentesFMultiCtrl.patchValue([]);
        }
      });
  }

  protected setInitialValue() {
    this.filteredAntecedentesFMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
// this.multiSelect.compareWith = (a: AntecedentesF, b: AntecedentesF) => a && b && a.id === b.id;
      });
  }

  protected filterAntecedentesFMulti() {
    if (!this.AntecedentesF) {
      return;
    }
    // get the search keyword
    let search = this.antecedentesFMultiFilterCtrl.value;
    if (!search) {
      this.filteredAntecedentesFMulti.next(this.AntecedentesF.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredAntecedentesFMulti.next(
      this.AntecedentesF.filter(AntecedentesF => AntecedentesF.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  revisionSistemas() {
    let cardioRes = {id: 1, nombre: 'Cardio-Respiratorio', variable: this.varCardio, formControl: 'card_resp_desc'};
    let vascular = {id: 2, nombre: 'Vascular', variable: this.varVascular, formControl: 'vascular_desc'};
    let gastro = {id: 3, nombre: 'Gastro Intestinal', variable: this.varGastro, formControl: 'gastro_int_desc'};
    let genito = {id: 4, nombre: 'Genito-Urinario', variable: this.varGenito, formControl: 'genito_uri_desc'};
    let endo = {id: 5, nombre: 'Endocrino', variable: this.varEndo, formControl: 'endocrino_desc'};
    let osteo = {id: 6, nombre: 'Osteomuscular', variable: this.varOsteo, formControl: 'osteomuscular_desc'};
    let neuro = {id: 7, nombre: 'Neurológico', variable: this.varNeuro, formControl: 'neurologico_desc'};
    let piel = {id: 8, nombre: 'Piel y Faneras', variable: this.varPiel, formControl: 'pielyfan_desc'};

    this.sistema.push(cardioRes, vascular, gastro, genito, endo, osteo, neuro, piel);
   }

   habitosFactoresDeRiesgo() {
    let cigarrillo = {id: 1, nombre: 'Cigarrillo', variable: this.cigarrillo, formControl: 'cigarrillo'};
    let alcohol = {id: 2, nombre: 'Alcohol', variable: this.alcohol, formControl: 'alcohol'};
    let estres = {id: 3, nombre: 'Estres', variable: this.estres, formControl: 'estres'};
    let humo = {id: 4, nombre: 'Humo', variable: this.humo, formControl: 'humo'};
    let polvo = {id: 5, nombre: 'Polvo', variable: this.polvo, formControl: 'polvo'};
    let ejercicio = {id: 5, nombre: 'Ejercicio', variable: this.ejercicio, formControl: 'ejercicio'};

    this.habitos.push(cigarrillo, alcohol, estres, humo, polvo, ejercicio);
   }

   examenMedico() {
    let cabeza = {nombre: 'Cabeza', variable: this.varCabeza, formControl: 'cabeza_desc'};
    let ojos = {nombre: 'Ojos', variable: this.varOjos, formControl: 'ojos_desc'};
    let oidos = {nombre: 'Oidos', variable: this.varOidos, formControl: 'oidos_desc'};
    let nariz = {nombre: 'Nariz', variable: this.varNariz, formControl: 'nariz_desc'};
    let boca = {nombre: 'Boca', variable: this.varBoca, formControl: 'boca_desc'};
    let cuello = {nombre: 'Cuello', variable: this.varCuello, formControl: 'cuello_desc'};
    let torax = {nombre: 'Tórax Mama', variable: this.varTorax, formControl: 'torax_ma_desc'};
    let pulmones = {nombre: 'Pulmones', variable: this.varPulmones, formControl: 'pulmones_desc'};
    let corazon = {nombre: 'Corazón', variable: this.varCorazon, formControl: 'corazon_desc'};
    let abdomen = {nombre: 'Abdomen', variable: this.abdomen, formControl: 'abdomen_desc'};
    let genitoUrinario = {nombre: 'GenitoUrinario', variable: this.varGenitoUrinario, formControl: 'genitourinario_desc'};
    let columna = {nombre: 'Columna', variable: this.varColumna, formControl: 'columna_desc'};
    let extremidades = {nombre: 'Extremidades', variable: this.varExtremidades, formControl: 'extremidades_desc'};
    let neurologico = {nombre: 'Neurológico', variable: this.varNeurologico, formControl: 'neurologico_desc_fisico'};
    let faneras = {nombre: 'Piel y Faneras', variable: this.varOsteo, formControl: 'pielyfane_desc'};

    this.examen.push(cabeza , ojos, oidos, nariz, boca, cuello, torax,
                     pulmones, corazon, abdomen, genitoUrinario, columna, extremidades, neurologico, faneras);
   }

  // habitosyRiesgos() {

  //   let Cigarrillo = { nombre: 'Cigarrillo', disponible: true };
  //   let Alcohol = { nombre: 'Alcohol', disponible: true };
  //   let Estres = { nombre: 'Estrés', disponible: true };
  //   let Humo = { nombre: 'Humo', disponible: true };
  //   let Polvo = { nombre: 'Polvo', disponible: true };
  //   let habitos = [Cigarrillo, Alcohol, Estres, Humo, Polvo];

  //   for (var i = 0; i < habitos.length; i++) {
  //     let hyfr = habitos[i];
  //     this.listaHabitos.push({hyfr});
  //   }

  // }


  // diagnostico(){
  //   let diag1 =  {id: "1", descripcion: "Fumador", codigo: "510" };
  //   let diag2 =  {id: "2", descripcion: "Sufre de presión arterial", codigo: "8220" };
  //   let diag3 =  {id: "3", descripcion: "Sufre de presión arterial", codigo: "5320" };

  //   let diagnosticos = [diag1,diag2,diag3];



  //   for(var i = 0 ; i < diagnosticos.length; i++)
  //   {

  //     let diag = diagnosticos[i];
  //     this.listaDiagnosticos.push({diag});
  //   }

  // }

// guardarDiagnostico(){

//   console.log(this.descripcionDiag);

//   let nuevo = {id: "-" ,descripcion: this.descripcionDiag, codigo:this.codDiag};
//   let diagnosticos = [nuevo];

//   for(var i = 0 ; i < diagnosticos.length; i++)
//   {
//     let diag = diagnosticos[i];
//     this.listaDiagnosticos.push({diag});

//   }
//   this.descripcionDiag = "";
//   this.codDiag = "";
// }

// editarDiagnostico(descripcionDiag,codDiag){

//   console.log(descripcionDiag.codigo);

//   this.descripcionDiag = descripcionDiag.descripcion;
//   this.codDiag = descripcionDiag.descripcion;
// }

  // validaciones() {

  //   this.datos = this.formBuilder.group({
  //     menarquia : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     gravidez : ['', [Validators.pattern('[a-z A-z ñ] * || [0-9]')]],
  //     partos : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     abortos : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     hijosVivos : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     planificacion : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],

  //     cigarrillo : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     alcohol : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     estres : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     humo : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     polvo : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     otros : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     control: ['',[Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     dias: ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],

  //     frecuenciaCardiaca : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     temperatura : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     frecuenciaRespiratoria : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     talla : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     presion : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //     peso : ['', [Validators.pattern('[a-z A-z ñ]* || [0-9]')]],
  //   });
  // }

  agruparAntecedentesF(ev) {
    this.grupoAntecedentesF = ev.value;
  }

 agruparHabitos(ev) {
    this.grupoHabitos = ev.value;
  }

  // prueba(ev) {
  //   console.log(ev);
  //   this.getDiagnosticos(ev.target.value);
  // }

  checkRevisionSistema(ev, tipo) {
    // console.log(tipo);
    let valor = true;
    let identificador = 0;

    switch (valor === true) {
      case (tipo === 'Cardio-Respiratorio') :
      this.sistema[0].variable = ev.checked;
      break;
      case (tipo === 'Vascular') :
      this.sistema[1].variable = ev.checked;
      break;
      case (tipo === 'Gastro Intestinal') :
      this.sistema[2].variable = ev.checked;
      break;
      case (tipo === 'Genito-Urinario') :
      this.sistema[3].variable = ev.checked;
      break;
      case (tipo === 'Endocrino') :
      this.sistema[4].variable = ev.checked;
      break;
      case (tipo === 'Osteomuscular') :
      this.sistema[5].variable = ev.checked;
      break;
      case (tipo === 'Neurológico') :
      this.sistema[6].variable = ev.checked;
      break;
      case (tipo === 'Piel y Faneras') :
      this.sistema[7].variable = ev.checked;
      break;
    }
  }

  checkHabitosFactores(ev, tipo) {
    // console.log(tipo);
    let valor = true;
    // let identificador = 0;

    switch (valor === true) {
      case (tipo === 'Cigarrillo') :
      this.habitos[0].variable = ev.checked;
      break;
      case (tipo === 'Alcohol') :
      this.habitos[1].variable = ev.checked;
      break;
      case (tipo === 'Estres') :
      this.habitos[2].variable = ev.checked;
      break;
      case (tipo === 'Humo') :
      this.habitos[3].variable = ev.checked;
      break;
      case (tipo === 'Polvo') :
      this.habitos[4].variable = ev.checked;
      break;
      case (tipo === 'Ejercicio') :
      this.habitos[5].variable = ev.checked;
      break;
    }
  }

  checkExamenMedico(ev, tipo) {
    // console.log(tipo);
    let valor = true;
    switch (valor === true) {
      case (tipo === 'Cabeza') :
      this.examen[0].variable = ev.checked;
      break;
      case (tipo === 'Ojos') :
      this.examen[1].variable = ev.checked;
      break;
      case (tipo === 'Oidos') :
      this.examen[2].variable = ev.checked;
      break;
      case (tipo === 'Nariz') :
      this.examen[3].variable = ev.checked;
      break;
      case (tipo === 'Boca') :
      this.examen[4].variable = ev.checked;
      break;
      case (tipo === 'Cuello') :
      this.examen[5].variable = ev.checked;
      break;
      case (tipo === 'Tórax Mama') :
      this.examen[6].variable = ev.checked;
      break;
      case (tipo === 'Pulmones') :
      this.examen[7].variable = ev.checked;
      break;
      case (tipo === 'Corazón') :
      this.examen[8].variable = ev.checked;
      break;
      case (tipo === 'Abdomen') :
      this.examen[9].variable = ev.checked;
      break;
      case (tipo === 'GenitoUrinario') :
      this.examen[10].variable = ev.checked;
      break;
      case (tipo === 'Columna') :
      this.examen[11].variable = ev.checked;
      break;
      case (tipo === 'Extremidades') :
      this.examen[12].variable = ev.checked;
      break;
      case (tipo === 'Neurológico') :
      this.examen[13].variable = ev.checked;
      break;
      case (tipo === 'Piel y Faneras') :
      this.examen[14].variable = ev.checked;
      break;
    }
  }


  guardarHistoriaClinica() {


    // ANTECEDENTES FAMILIARES

      let antecedeneFCombo = this.antecedentesFMultiCtrl.value;
      let antecedentes = [
      {nombre: 'Cardiopatías', disponible: 0, id: '1'},
      {nombre: 'Diabetes', disponible: 0, id: '2'},
      {nombre: 'Hipertensión', disponible: 0, id: '3'},
      {nombre: 'Asma', disponible: 0, id: '4'},
      {nombre: 'Enfermedad Psiquiátrica', disponible: 0, id: '5'},
      {nombre: 'Enfisema', disponible: 0, id: '6'},
      {nombre: 'Cáncer', disponible: 0, id: '7'},
      {nombre: 'Epilepsia', disponible: 0, id: '8'},
   ];

      if (antecedeneFCombo) {
      // console.log('aqui');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < antecedentes.length; i ++) {
        // console.log(antecedentes[i].nombre);
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < antecedeneFCombo.length; j ++) {
         // console.log(antecedentes,antecedeneFCombo)
          if (antecedentes[i].id === antecedeneFCombo[j]) {
            antecedentes[i].disponible = 1;

          }

        }
      }
   }

      let antecedentes_f = {cardiopatias: antecedentes[0].disponible, diabetes: antecedentes[1].disponible,
                          hipertension: antecedentes[2].disponible, asma: antecedentes[3].disponible,
                          enfermedad_psiquiatrica: antecedentes[4].disponible, efisema: antecedentes[5].disponible,
                          cancer: antecedentes[6].disponible, epilepcia: antecedentes[7].disponible,
                          otro: this.datosHistGeneral.value.otroAntecedentesFamiliares
                        };

    // ANTECEDENTES PERSONALES

      let antecedentes_p = {patologias: this.datosHistGeneral.value.patologicos, quirurgicos: this.datosHistGeneral.value.quirurgicos,
                          traumaticos: this.datosHistGeneral.value.traumaticos, gine_menarquia: this.datosHistGeneral.value.gine_menarquia,
                          gine_gravidez: this.datosHistGeneral.value.gine_gravidez, gine_partos: this.datosHistGeneral.value.gine_partos,
                          gine_abortos: this.datosHistGeneral.value.gine_abortos,
                          toxicos_alergicos: this.datosHistGeneral.value.toxicos_alergicos,
                          gine_hijosvivos: this.datosHistGeneral.value.gine_hijosvivos,
                          gine_planificacion: this.datosHistGeneral.value.gine_planificacion
                          };

      let habitosyfactores = { cigarrillo: this.datosHistGeneral.value.cigarrillo, alcohol: this.datosHistGeneral.value.alcohol,
                             estres: this.datosHistGeneral.value.estres, humo: this.datosHistGeneral.value.humo,
                             polvo: this.datosHistGeneral.value.polvo, ejercicio: this.datosHistGeneral.value.ejercicio,
                             otros: this.datosHistGeneral.value.ejercicio };

      let revisionpsistemas = { card_resp_desc: this.datosHistGeneral.value.card_resp_desc,
                              vascular_desc: this.datosHistGeneral.value.vascular_desc,
                              gastro_int_desc: this.datosHistGeneral.value.gastro_int_desc,
                              genito_uri_desc: this.datosHistGeneral.value.genito_uri_desc,
                              endocrino_desc: this.datosHistGeneral.value.endocrino_desc,
                              osteomuscular_desc: this.datosHistGeneral.value.osteomuscular_desc,
                              neurologico_desc: this.datosHistGeneral.value.neurologico_desc,
                              pielyfan_desc: this.datosHistGeneral.value.pielyfan_desc};

      let examenf = { aparienciaGeneral: this.datosHistGeneral.value.aparienciaGeneral,
                    frecuencia_cardica: this.datosHistGeneral.value.frecuencia_cardica,
                    temperetura: this.datosHistGeneral.value.temperetura, frecuencia_resp: this.datosHistGeneral.value.frecuencia_resp,
                    talla: this.datosHistGeneral.value.talla, presion_art: this.datosHistGeneral.value.presion_art,
                    peso: this.datosHistGeneral.value.peso, cabeza_desc: this.datosHistGeneral.value.cabeza_desc,
                    ojos_desc: this.datosHistGeneral.value.ojos_desc,
                    oidos_desc: this.datosHistGeneral.value.oidos_desc,
                    nariz_desc: this.datosHistGeneral.value.nariz_desc, boca_desc: this.datosHistGeneral.value.boca_desc,
                    cuello_desc: this.datosHistGeneral.value.cuello_desc,
                    torax_ma_desc: this.datosHistGeneral.value.torax_ma_desc, pulmones_desc: this.datosHistGeneral.value.pulmones_desc,
                    corazon_desc: this.datosHistGeneral.value.corazon_desc,
                    abdomen_desc: this.datosHistGeneral.value.abdomen_desc,
                    genitourinario_desc: this.datosHistGeneral.value.genitourinario_desc,
                    columna_desc: this.datosHistGeneral.value.columna_desc,
                    extremidades_desc: this.datosHistGeneral.value.extremidades_desc,
                    neurologico_desc: this.datosHistGeneral.value.neurologico_desc_fisico,
                    pielyfane_desc: this.datosHistGeneral.value.pielyfane_desc
     };

      let conDiagnostico = { descripDiag : this.registroDiag.value.descripDiag};

      var token = this.userService.getToken();

      let impresion_diag = this.idImpDiag

      let historia_opt = {};

      let info = { tipo_consulta: this.datosHistGeneral.value.tipoConsulta, motivo_consulta: this.datosHistGeneral.value.motivoConsulta,
                 enfermedades_preex: this.datosHistGeneral.value.enfermedadPreexistente, usuario_id: this.idUsuario,
                 id_servicios: this.idServicio, antecedentes_f, antecedentes_p, habitosyfactores, revisionpsistemas, examenf,
                 impresion_diag, historia_opt};

    // console.log(info);
      this.diagnosticoService.postDiagnostico(info, token).subscribe( (response) => {
      // console.log(response);
      if (response === true) {
        this.status = 'success';
        this.statusText = 'Historia clinica guardada con exito';
        document.getElementById('btn-publicacion-exitosa').click();
       // document.getElementById('cerrarModal').click();
      }
    });
  }

  pubExitosa() {
     this.router.navigate(['/home']);
  }

  siguiente(parametro: string) {

    let variable  = true;

    switch (variable === true){
      case parametro === 'consulta':
        this.vista = 'familiares';
        break;
      case parametro === 'familiares':
        this.vista = 'personales';
        break;
      case parametro === 'personales':
        this.vista = 'gineco';
        break;
      case parametro === 'gineco':
        this.vista = 'habitos';
        break;
      case parametro === 'habitos':
        this.vista = 'sistemas';
        break;
      case parametro === 'sistemas':
        this.vista = 'fisico';
        break;
      case parametro === 'fisico':
        this.vista = 'diagnosticosPanel';
        break;
    }
  }

  anterior(parametro: string){

    let variable  = true;

    switch (variable === true) {
      case parametro === 'familiares':
        // console.log(this.vista);
        this.vista = 'consulta';
        break;
      case parametro === 'personales':
        this.vista = 'familiares';
        break;
      case parametro === 'gineco':
        this.vista = 'personales';
        break;
      case parametro === 'habitos':
        this.vista = 'gineco';
        break;
      case parametro === 'sistemas':
        this.vista = 'habitos';
        break;
      case parametro === 'fisico':
        this.vista = 'sistemas';
        break;
      case parametro === 'diagnosticosPanel':
        this.vista = 'fisico';
        break;
    }
  }

  guardarClick(o) {
   // console.log(o)

     this.cajaDiagnostico.push(o);
     this.idImpDiag.push(o.id_impresiondiag);


      // if(this.cajaDiagnostico != [])
      // {
      //   //console.log("entro");


      //   for(let i = 0; i < this.cajaDiagnostico.length; i++){
      //     this.idImpDiag.push(this.cajaDiagnostico[i].id_impresiondiag);

      //   }

      //   //console.log(this.idImpDiag);
      // }
    //this.datosHistGeneral.reset();

  }

  borrarDiagnostico(i) {
    this.cajaDiagnostico.splice(i, 1);
  }

  verHistoriaGeneral(info) {
    this.infoHistoriaGeneral = info;
    // console.log(this.infoHistoriaClinica);
    document.getElementById('btn-ver-hg').click();
  }




}

export interface AntecedentesF {
  id: string;
  nombre: string;
  disponible: string;
}

export interface AntecedentesFGroup {
  nombre: string;
  disponible: string;
  antecedentesF: AntecedentesF[];
}

export const ANTECEDENTESF: AntecedentesF[] = [
  {nombre: 'Cardiopatías', disponible: 'true', id: '1'},
  {nombre: 'Diabetes', disponible: 'true', id: '2'},
  {nombre: 'Hipertensión', disponible: 'true', id: '3'},
  {nombre: 'Asma', disponible: 'true', id: '4'},
  {nombre: 'Enfermedad Psiquiátrica', disponible: 'true', id: '5'},
  {nombre: 'Enfisema', disponible: 'true', id: '6'},
  {nombre: 'Cáncer', disponible: 'true', id: '7'},
  {nombre: 'Epilepsia', disponible: 'true', id: '8'},
];
