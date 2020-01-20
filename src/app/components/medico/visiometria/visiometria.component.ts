import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-visiometria',
  templateUrl: './visiometria.component.html',
  styleUrls: ['./visiometria.component.css']
})
export class VisiometriaComponent implements OnInit {

  public datosVisiomentria: FormGroup;
  public usaGafas;
  public caracGafas = [];
  public signosSintomas = [];
  public respuestaGafas;
  public examenExterno = [];
  public interpretaciones = [];
  public cromatica = [];
  public diagnostico = [];
  public recomendaciones = [];
  public variablesTipos = [];

  public frecuenciaUso = [];
  public proteccionOcularValor = [];
  public cirugiasValor = [];
  public accidentesValor = [];



  public variablesSintomas = [];
  public variableExamen = [];
  public variableInterpretaciones = [];
  public variableCromatica = [];
  public variableDiag = [];
  public variableRec  = [];

  public resultadoUsaGafas;
  public resultadoCirugias;
  public tieneCirugias;
  public cualCirugia;

  public resultadoAccidente;
  public tieneAccidente;
  public cualAccidente;



  public vista;
  public infoAgudezaVisual;
  public infoMotilidad;
  public infoRefraccion;
  public infoSubjetivo;

  public antecedentesFCombo;

  public todaLaInfo;
  public antecedentes_f;

  protected AntecedentesF: AntecedentesF[] = ANTECEDENTESF;
  protected _onDestroy = new Subject<void>();
  public antecedentesFMultiFilterCtrl: FormControl = new FormControl();
  public filteredAntecedentesFMulti: ReplaySubject<AntecedentesF[]> = new ReplaySubject<AntecedentesF[]>(1);
  public antecedentesFMultiCtrl: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder) {
    this.usaGafas = 'si';
    this.tieneCirugias = 'no';
    this.vista = 'consulta';
  }

  ngOnInit() {
    this.iniciarDatosVisiometria();
    this.getTiposGafas();
    this.getSignosySintomas();
    this.filteredAntecedentesFMulti.next(this.AntecedentesF.slice());
    this.antecedentesFMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAntecedentesFMulti();
      });
    this.getExamenExterno();
    this.getInterpretacion();
    this.getCromática();
    this.getDiagnostico();
    this.getRecomendaciones();

  }

  iniciarDatosVisiometria() {
    this.datosVisiomentria = this.formBuilder.group({
      tipoConsulta: ['', [Validators.required]],
      g: ['', [Validators.required]],
      otroAntecedentesFamiliares: ['', [Validators.required]],
      patologicos: ['', [Validators.required]],
      quirurgicos: ['', [Validators.required]],
      traumaticos: ['', [Validators.required]],
      vlod: ['', [Validators.required]],
      vloi: ['', [Validators.required]],
      vlao: ['', [Validators.required]],
      vpod: ['', [Validators.required]],
      vpoi: ['', [Validators.required]],
      vpao: ['', [Validators.required]],
      dnpOd: ['', [Validators.required]],
      dnpOi: ['', [Validators.required]],
      scod: ['', [Validators.required]],
      scoi: ['', [Validators.required]],
      scao: ['', [Validators.required]],
      esfod: ['', [Validators.required]],
      esfoi: ['', [Validators.required]],
      cilod: ['', [Validators.required]],
      ciloi: ['', [Validators.required]],
      ejeod: ['', [Validators.required]],
      ejeoi: ['', [Validators.required]],
      addod: ['', [Validators.required]],
      addoi: ['', [Validators.required]],
      vlTexto: ['', [Validators.required]],
      vpTexto: ['', [Validators.required]],
      hishberg: ['', [Validators.required]],
      ducciones: ['', [Validators.required]],
      versiones: ['', [Validators.required]],
      pcc: ['', [Validators.required]],
      reesod: ['', [Validators.required]],
      reesoi: ['', [Validators.required]],
      recilod: ['', [Validators.required]],
      reciloi: ['', [Validators.required]],
      rejeod: ['', [Validators.required]],
      rejeoi: ['', [Validators.required]],
      subesfod: ['', [Validators.required]],
      subesfoi: ['', [Validators.required]],
      subcilod: ['', [Validators.required]],
      subciloi: ['', [Validators.required]],
      subejeod: ['', [Validators.required]],
      subejeoi: ['', [Validators.required]],
      subavod: ['', [Validators.required]],
      subavoi: ['', [Validators.required]],
      subaddod: ['', [Validators.required]],
      subaddoi: ['', [Validators.required]],
      cualCirugia: [''],
      tuvoAccidente: ['']
    });


  }

  frecuencia(parametro) {
    this.frecuenciaUso = parametro.value;
    console.log(this.frecuenciaUso);
  }

  proteccionOcular(parametro) {
    this.proteccionOcularValor = parametro.value;
    console.log(this.proteccionOcularValor);
  }

  cirugias(parametro) {
    this.cirugiasValor = parametro.value;
    console.log(this.cirugiasValor);

    this.resultadoCirugias = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
        this.tieneCirugias = 'tieneCirugias';
        break;

      case parametro.value === 'no':
        this.tieneCirugias = '';
        break;

    }

  }

  accidentes(parametro) {
    this.accidentesValor = parametro.value;
    console.log(this.accidentesValor);


    this.resultadoAccidente = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
        this.tieneAccidente = 'tuvoAccidente';
        break;

      case parametro.value === 'no':
        this.tieneAccidente = '';
        break;

    }

  }

  siguiente(parametro: string) {
    const variable = true;

    switch (variable === true) {
      case parametro === 'consulta':
        this.vista = 'anteojos';
        break;
      case parametro === 'anteojos':
        this.vista = 'proteccion';
        break;
      case parametro === 'proteccion':
        this.vista = 'signos';
        break;
      case parametro === 'signos':
        this.vista = 'antecedentesF';
        break;
      case parametro === 'antecedentesF':
        this.vista = 'antecedentesP';
        break;
      case parametro === 'antecedentesP':
        this.vista = 'agudeza';
        break;
      case parametro === 'agudeza':
        this.vista = 'examenE';
        break;
      case parametro === 'examenE':
        this.vista = 'inter';
        break;
      case parametro === 'inter':
        this.vista = 'impre';
        break;
      case parametro === 'impre':
        this.vista = 'retino';
        break;
    }
  }

  anterior(parametro: string) {
    let variable = true;

    switch (variable === true) {
      case parametro === 'anteojos':
        this.vista = 'consulta';
        break;
      case parametro === 'proteccion':
        this.vista = 'anteojos';
        break;
      case parametro === 'signos':
        this.vista = 'proteccion';
        break;
      case parametro === 'antecedentesF':
        this.vista = 'signos';
        break;
      case parametro === 'antecedentesP':
        this.vista = 'antecedentesF';
        break;
      case parametro === 'agudeza':
        this.vista = 'antecedentesP';
        break;
      case parametro === 'examenE':
        this.vista = 'agudeza';
        break;
      case parametro === 'inter':
        this.vista = 'examenE';
        break;
      case parametro === 'impre':
        this.vista = 'inter';
        break;
      case parametro === 'retino':
        this.vista = 'impre';
        break;
    }
  }

  checkTipos(ev, tipo) {

    if (ev.checked === true) {
      this.variablesTipos.push(tipo);

    } else {

      for (let i = 0; i < this.variablesTipos.length; i++) {
        if (this.variablesTipos[i] === tipo) {
          this.variablesTipos.splice(i, 1);
          break;
        }
      }
    }
    console.log(this.variablesTipos);
  }

  checkExamenE(ev, tipo) {
    if (ev.checked === true) {
      this.variableExamen.push(tipo);
    } else {
      for (let i = 0; i < this.variableExamen.length; i++) {
        this.variableExamen.splice(i, 1);
        break;
      }
    }
    console.log(this.variableExamen);
  }

  checkSintomas(ev, tipo) {
    if (ev.checked === true) {
      this.variablesSintomas.push(tipo);
    } else {
      for (let i = 0; i < this.variablesSintomas.length; i++) {
        this.variablesSintomas.splice(i, 1);
        break;
      }
    }
    console.log(this.variablesSintomas);
  }

  checkInterpretacion(ev, tipo) {
    if (ev.checked === true) {
      this.variableInterpretaciones.push(tipo);
    } else {
      for (let i = 0; i < this.variableInterpretaciones.length; i++) {
        this.variableInterpretaciones.splice(i, 1);
        break;
      }
    }
    console.log(this.variableInterpretaciones);
  }

  checkCromatica(ev, tipo) {
    if (ev.checked === true) {
      this.variableCromatica.push(tipo);
    } else {
      for (let i = 0; i > this.variableCromatica.length; i++) {
        this.variableCromatica.splice(i, 1);
      }
    }
    console.log(this.variableCromatica);
  }

  checkImp(ev, tipo) {
    if (ev.checked === true) {
      this.variableDiag.push(tipo);
    } else {
      for (let i = 0; i > this.variableDiag.length; i++) {
        this.variableDiag.splice(i, 1);
      }
    }
    console.log(this.variableDiag);
  }

  checkRec(ev, tipo) {
    if (ev.checked === true) {
      this.variableRec.push(tipo);
    } else {
      for (let i = 0; i > this.variableRec.length; i++) {
        this.variableRec.splice(i, 1);
      }
    }
    console.log(this.variableRec);
  }

  getTiposGafas() {
    this.caracGafas = [{ nombre: 'VL', codigo: 1 }, { nombre: 'VP', codigo: 2 }, { nombre: 'PC', codigo: 3 },
    { nombre: 'Bifocal', codigo: 4 }, { nombre: 'Progresivo', codigo: 5 }, { nombre: 'Filtros', codigo: 6 },
    { nombre: 'LC TGP', codigo: 7 }, { nombre: 'LC BLANDO', codigo: 8 }];
  }

  getSignosySintomas() {
    this.signosSintomas = [{ nombre: 'Asintomático' }, { nombre: 'Disminución Visual de Cerca' }, { nombre: 'PC' },
    { nombre: 'Disminución visual de lejos' }, { nombre: 'Cefaleas' }, { nombre: 'Resequedad ocular' },
    { nombre: 'Ardor Ocular' }, { nombre: 'Lagrimeo' }, { nombre: 'Cansancio Ocular' }, { nombre: 'Irritación' },
    { nombre: 'Fotofobia' }, { nombre: 'Prurito Ocular' }, { nombre: 'Salto de renglon' }];
  }

  getExamenExterno() {
    this.examenExterno = [{ nombre: 'Hiperemia Conjuntival' }, { nombre: 'Pterigio N' }, { nombre: 'Pterigio T' },
    { nombre: 'Pinguécula' }, { nombre: 'Nevus' }, { nombre: 'Blefaritis' },
    { nombre: 'Blefaritis seborreica' }, { nombre: 'Secreción' }, { nombre: 'Leucoma Corneal' }, { nombre: 'Ptosis palpebral' }];
  }

  getInterpretacion() {
    this.interpretaciones = [{ nombre: 'No requiere corrección óptica' }, { nombre: 'Defecto refractivo adecuadamente corregido' },
    { nombre: 'Defecto refractivo inadecuadamente corregido' },
    { nombre: 'Defecto refractivo no corregido' }, { nombre: 'Grafas no formuladas' }];
  }

  getCromática() {
    this.cromatica = [{ nombre: 'Normal' }, { nombre: 'Discromatopsia' },
    { nombre: 'Ceguera al color' }];
  }

  getDiagnostico() {
    this.diagnostico = [{ nombre: 'Ementropía' }, { nombre: 'Amentropía' },
    { nombre: 'Disminución Visual' }];
  }

  getRecomendaciones() {
    this.recomendaciones = [{ nombre: 'Valoración por optometría clinica' }, { nombre: 'Valoración por oftalmología' },
    { nombre: 'Control Visiometría' }];
  }

  saberUsaGafas(parametro) {
    console.log(parametro.value);

    this.resultadoUsaGafas = parametro.value;
    const variable = true;
    switch (variable === true) {
      case parametro.value === 'si':
        this.usaGafas = 'tiposGafas';
        break;

      case parametro.value === 'no':
        this.usaGafas = '';
        break;

    }
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



  guardarVisiometria() {
    this.antecedentesFCombo = this.antecedentesFMultiCtrl.value;

    let antecedentes = [
      { nombre: 'Cardiopatías', disponible: 0, id: '1' },
      { nombre: 'Diabetes', disponible: 0, id: '2' },
      { nombre: 'Hipertensión', disponible: 0, id: '3' },
      { nombre: 'Asma', disponible: 0, id: '4' },
      { nombre: 'Enfermedad Psiquiátrica', disponible: 0, id: '5' },
      { nombre: 'Enfisema', disponible: 0, id: '6' },
      { nombre: 'Cáncer', disponible: 0, id: '7' },
      { nombre: 'Epilepsia', disponible: 0, id: '8' },
    ];

    if (this.antecedentesFCombo) {
      // console.log('aqui');
      for (let i = 0; i < antecedentes.length; i++) {
        // console.log(antecedentes[i].nombre);
        for (let j = 0; j < this.antecedentesFCombo.length; j++) {
          // console.log(antecedentes,antecedeneFCombo)
          if (antecedentes[i].id === this.antecedentesFCombo[j]) {
            antecedentes[i].disponible = 1;

          }

        }
      }
    }

    this.antecedentes_f = {
      cardiopatias: antecedentes[0].disponible, diabetes: antecedentes[1].disponible,
      hipertension: antecedentes[2].disponible, asma: antecedentes[3].disponible,
      enfermedad_psiquiatrica: antecedentes[4].disponible, efisema: antecedentes[5].disponible,
      cancer: antecedentes[6].disponible, epilepcia: antecedentes[7].disponible,
      otro: this.datosVisiomentria.value.otroAntecedentesFamiliares
    };

    console.log(this.antecedentes_f);
  }

  public queda() {

    this.infoAgudezaVisual = {vlod : this.datosVisiomentria.value.vlod, vloi : this.datosVisiomentria.value.vloi,
      vlao : this.datosVisiomentria.value.vlao, vpod : this.datosVisiomentria.value.vpod, vpoi : this.datosVisiomentria.value.vpoi,
      vpao : this.datosVisiomentria.value.vpao, scod : this.datosVisiomentria.value.scod, scoi : this.datosVisiomentria.value.scoi,
      scao : this.datosVisiomentria.value.scao, esfod: this.datosVisiomentria.value.esfod, esfoi : this.datosVisiomentria.value.esfoi,
      cilod : this.datosVisiomentria.value.cilod, ciloi : this.datosVisiomentria.value.ciloi, ejeod : this.datosVisiomentria.value.ejeod,
      ejeoi : this.datosVisiomentria.value.ejeoi, addod : this.datosVisiomentria.value.addod, addoi : this.datosVisiomentria.value.addoi,
     };

    this.infoMotilidad = { vlTexto : this.datosVisiomentria.value.vlTexto, vpTexto: this.datosVisiomentria.value.vpTexto,
      hishberg: this.datosVisiomentria.value.hishberg, ducciones: this.datosVisiomentria.value.ducciones,
      versiones: this.datosVisiomentria.value.versiones, pcc: this.datosVisiomentria.value.pcc
     };

    this.infoRefraccion = {reesod : this.datosVisiomentria.value.reesod, reesoi: this.datosVisiomentria.value.reesoi,
    recilod: this.datosVisiomentria.value.recilod, reciloi: this.datosVisiomentria.value.reciloi,
    rejeod: this.datosVisiomentria.value.rejeod, rejeoi: this.datosVisiomentria.value.rejeoi};

    this.infoSubjetivo = {subesfod : this.datosVisiomentria.value.subesfod, subesfoi : this.datosVisiomentria.value.subesfoi,
      subcilod : this.datosVisiomentria.value.subcilod, subciloi : this.datosVisiomentria.value.subciloi,
      subejeod: this.datosVisiomentria.value.subejeod, subejeoi: this.datosVisiomentria.value.subejeoi,
      subavod: this.datosVisiomentria.value.subavod, subavoi: this.datosVisiomentria.value.subavoi,
      subaddod: this.datosVisiomentria.value.subaddod, subaddoi: this.datosVisiomentria.value.subaddoi};

    this.todaLaInfo = {tipo_consulta: this.datosVisiomentria.value.tipoConsulta,
        resutadoUsaGafas : this.resultadoUsaGafas, variablesTipos : this.variablesTipos,
        frecuenciaUso : this.frecuenciaUso, proteccionOcular: this.proteccionOcularValor, cirugias : this.cirugiasValor,
        accidentesValor : this.accidentesValor, signosSintomas: this.variablesSintomas,
        patologias: this.datosVisiomentria.value.patologicos, quirurgicos: this.datosVisiomentria.value.quirurgicos,
        traumaticos: this.datosVisiomentria.value.traumaticos, agudezaVisual : this.infoAgudezaVisual, externo : this.variableExamen,
        motilidad : this.infoMotilidad, interpretaciones : this.variableInterpretaciones, cromatica : this.variableCromatica,
        diagnostico: this.variableDiag, recomendaciones: this.variableRec, refraccion : this.infoRefraccion, subjetivo: this.infoSubjetivo,
        antecedentes: this.antecedentes_f};

    console.log(this.todaLaInfo);
  }

  protected setInitialValue() {
    this.filteredAntecedentesFMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {

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
      // tslint:disable-next-line: no-shadowed-variable
      this.AntecedentesF.filter(AntecedentesF => {
        return AntecedentesF.nombre.toLowerCase().indexOf(search) > -1;
      })
    );
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
  { nombre: 'Cardiopatías', disponible: 'true', id: '1' },
  { nombre: 'Diabetes', disponible: 'true', id: '2' },
  { nombre: 'Hipertensión', disponible: 'true', id: '3' },
  { nombre: 'Asma', disponible: 'true', id: '4' },
  { nombre: 'Enfermedad Psiquiátrica', disponible: 'true', id: '5' },
  { nombre: 'Enfisema', disponible: 'true', id: '6' },
  { nombre: 'Cáncer', disponible: 'true', id: '7' },
  { nombre: 'Epilepsia', disponible: 'true', id: '8' },
];
