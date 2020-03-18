import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as jsPDF from 'jspdf';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ImagenesPdfServiceService } from '../../../services/imagenes-pdf-service.service';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-historia-optometria',
  templateUrl: './historia-optometria.component.html',
  styleUrls: ['./historia-optometria.component.css']
})
export class HistoriaOptometriaComponent implements OnInit {
  @Input() idUsuario: string;
  @Input() idServicio: string;
  @Input() nombres: string;
  @Input() cedula: string;
  @Input() categoria;
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('contentRemision', { static: false }) contentRemision: ElementRef;
  @ViewChild('contentDiagnostico', { static: false }) contentDiagnostico: ElementRef;
  @ViewChild('contentObservaciones', { static: false }) contentObservaciones: ElementRef;

  public datosOptometria: FormGroup;
  public infoHcFb: {};
  public loading: boolean;
  public tituloModal = 'Anamnesis';
  public tipo: any;
  public today;
  public status;
  public statusText;

  constructor(private formBuilder: FormBuilder,
              private imagenesService: ImagenesPdfServiceService,
              private medicoService: MedicoService,
              private router: Router) {
                this.tipo = 'anamnesis';
                this.today = moment(new Date().toISOString()).format('DD-MM-YYYY');
               }

  ngOnInit() {
    this.validacionesFormOptometria();

    // var number = 200000000;
    // console.log(number.toLocaleString('es'));
  }

  validacionesFormOptometria() {
    this.datosOptometria = this.formBuilder.group({

      tipoConsulta : ['', [Validators.required]],
      motivoConsulta : ['', [Validators.required]],
      antecedentes : ['', [Validators.required]],
      lensometriaOd : ['', [Validators.required]],
      lensometriaOi : ['', [Validators.required]],
      agudezaVisualOd : ['', [Validators.required]],
      agudezaVisualOi : ['', [Validators.required]],
      visionLejanaOd : ['', [Validators.required]],
      visionLejanaOi : ['', [Validators.required]],
      visionCercanaOd : ['', [Validators.required]],
      visionCercanaOi : ['', [Validators.required]],
      adicion : ['', [Validators.required]],
      tipoLente : ['', [Validators.required]],
      examenExternoOd : ['', [Validators.required]],
      examenExternoOi : ['', [Validators.required]],
      oftalmologiaOd : ['', [Validators.required]],
      oftalmologiaOi : ['', [Validators.required]],
      examenMotorOd : ['', [Validators.required]],
      examenMotorOi : ['', [Validators.required]],
      queratometriaOd : ['', [Validators.required]],
      queratometriaOi : ['', [Validators.required]],
      refracionOd : ['', [Validators.required]],
      refracionOi : ['', [Validators.required]],
      formulaFinalOd : ['', [Validators.required]],
      formulaFinalOi : ['', [Validators.required]],
      avvlOd : ['', [Validators.required]],
      avvlOi : ['', [Validators.required]],
      avvpOd : ['', [Validators.required]],
      avvpOi : ['', [Validators.required]],
      adicionOd : ['', [Validators.required]],
      adicionOi : ['', [Validators.required]],
      dnpOd : ['', [Validators.required]],
      dnpOi : ['', [Validators.required]],
      testIshihara : ['', [Validators.required]],
      testEstereopsis : ['', [Validators.required]],
      diagnosticoInicial : ['', [Validators.required]],
      conducta : ['', [Validators.required]],
      medicamentos : ['', [Validators.required]],
      remision : ['', [Validators.required]],
      observaciones : ['', [Validators.required]],
      rips : [''],


      // Datos refracion y formular fina
      // refraccion ojo derecho
      selectOdRefraccion : ['', [Validators.required]],
      esferaRefraccion : ['', [Validators.required]],
      selectRefracion1 : ['', [Validators.required]],
      cilindroRefracion : ['', [Validators.required]],
      selectRefracion2 : ['', [Validators.required]],
      ejeRefracion : ['', [Validators.required]],

      // refraccion ojo izquierdo
      selectOiRefraccion : ['', [Validators.required]],
      esferaRefraccionoi : ['', [Validators.required]],
      selectRefracion1Oi : ['', [Validators.required]],
      cilindroRefracionOi : ['', [Validators.required]],
      selectRefracion2Oi : ['', [Validators.required]],
      ejeRefracionOi : ['', [Validators.required]],


      // Formula final Ojo derecho
      selectOdFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinalOd : ['', [Validators.required]],
      selecFormulaFinal1Od : ['', [Validators.required]],
      cilindrFormulaFinalOd : ['', [Validators.required]],
      selecFormulaFinal2Od : ['', [Validators.required]],
      ejFormulaFinalOd: ['', [Validators.required]],

      // Formula final Ojo Izquierdo
      selectOiFormulaFinal : ['', [Validators.required]],
      esferaFormulaFinalOi : ['', [Validators.required]],
      selecFormulaFinal1Oi : ['', [Validators.required]],
      cilindrFormulaFinalOi : ['', [Validators.required]],
      selecFormulaFinal2Oi : ['', [Validators.required]],
      ejFormulaFinalOi: ['', [Validators.required]],

      // option adicion
      adicionOption : ['', [Validators.required]]

    });
  }

  formOptometria() {
    this.loading = true;

    let adicion = '+' + ' ' + this.datosOptometria.value.adicion;
    // console.log('adocion' + adicion);

    // this.datosOptometria.value.selectRefracion1 this.datosOptometria.value.selectRefracion2
    let refraccionOd = this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
     'X' + ' ' + this.datosOptometria.value.ejeRefracion;

    //  this.datosOptometria.value.selectRefracion1Oi this.datosOptometria.value.selectRefracion2Oi
    let refraccionOi = this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejeRefracionOi;

    //  this.datosOptometria.value.selecFormulaFinal1Od this.datosOptometria.value.selecFormulaFinal2Od
    let ffod = this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejFormulaFinalOd;

    //  this.datosOptometria.value.selecFormulaFinal1Oi this.datosOptometria.value.selecFormulaFinal2Oi
    let ffoi = this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi + ' ' +
    'X' + ' ' + this.datosOptometria.value.ejFormulaFinalOi;

    // console.log ('refraccion od ' + refraccionOd);
    // console.log ('refraccion oi ' + refraccionOi);
    // console.log ('ff od ' + ffod);
    // console.log ('ff oi ' + ffoi);

    this.infoHcFb = {motivoConsulta: this.datosOptometria.value.motivoConsulta,
      antecedentes : this.datosOptometria.value.antecedentes, lensometriaOd : this.datosOptometria.value.lensometriaOd,
      lensometriaOi : this.datosOptometria.value.lensometriaOi, agudezaVisualOd : this.datosOptometria.value.agudezaVisualOd,
      agudezaVisualOi : this.datosOptometria.value.agudezaVisualOi, visionLejanaOd : this.datosOptometria.value.visionLejanaOd,
      visionLejanaOi : this.datosOptometria.value.visionLejanaOi, visionCercanaOd : this.datosOptometria.value.visionCercanaOd,
      visionCercanaOi : this.datosOptometria.value.visionCercanaOi, adicion, tipoLente : this.datosOptometria.value.tipoLente,
      examenExternoOd : this.datosOptometria.value.examenExternoOd, examenExternoOi : this.datosOptometria.value.examenExternoOi,
      oftalmologiaOd : this.datosOptometria.value.oftalmologiaOd, oftalmologiaOi : this.datosOptometria.value.oftalmologiaOi,
      examenMotorOd : this.datosOptometria.value.examenMotorOd, examenMotorOi : this.datosOptometria.value.examenMotorOi,
      queratometriaOd : this.datosOptometria.value.queratometriaOd, queratometriaOi : this.datosOptometria.value.queratometriaOi,
      refracionOd : refraccionOd, refraccionOi, formulaFinalOd : ffod, formulaFinalOi : ffoi,
      avvlOd : this.datosOptometria.value.avvlOd, avvlOi : this.datosOptometria.value.avvlOi,
      avvpOd : this.datosOptometria.value.avvpOd, avvpOi : this.datosOptometria.value.avvpOi,
      adicionOd : this.datosOptometria.value.adicionOd, adicionOi : this.datosOptometria.value.adicionOi,
      dnpOd : this.datosOptometria.value.dnpOd, dnpOi : this.datosOptometria.value.dnpOi,
      testIshihara : this.datosOptometria.value.testIshihara, testEstereopsis : this.datosOptometria.value.testEstereopsis,
      diagnosticoInicial : this.datosOptometria.value.diagnosticoInicial, conducta : this.datosOptometria.value.conducta,
      medicamentos : this.datosOptometria.value.medicamentos, remision : this.datosOptometria.value.remision,
      observaciones : this.datosOptometria.value.observaciones, id_usuario: this.idUsuario, id_servicio: this.idServicio,
      tipoConsulta: this.datosOptometria.value.tipoConsulta, rips : this.datosOptometria.value.rips};

    let info = { tipo_consulta: this.datosOptometria.value.tipoConsulta, motivo_consulta: this.datosOptometria.value.motivoConsulta,
        enfermedades_preex: this.datosOptometria.value.antecedentes, historia_opt: this.infoHcFb, usuario_id: this.idUsuario,
        id_servicios: this.idServicio, antecedentes_f: { }, antecedentes_p: { }, habitosyfactores: { }, revisionpsistemas: { },
        examenf: { }, impresion_diag: [ ], medicamentos: []};

    // console.log(info);

    this.medicoService.postHistoriasClinicas(info).subscribe( (response) => {

          // console.log('hc', response);

          if (response === true) {
            this.pdfCertificado();
            this.status = 'success';
            this.statusText = 'Historia clinica guarda con exito.';
            this.datosOptometria.reset();
            this.loading = false;
            document.getElementById('pub-exitosa').click();
          }
      }, () => {
          // console.log('aqui');
          this.status = 'error';
          this.statusText = 'Error al guardar la historia clinica, por favor revisa tu conexión o intentalo más tarde.';
          this.pdfCertificado();
          this.loading = false;
      } );

    // // console.log('aqui');
    // this._medicoService.putHistoriaClinica(this.infoHcFb).subscribe( (response) => {
    //   console.log('hc', response);

    //   if (response === true) {
    //     this.status = 'success';
    //     this.statusText = 'Historia clinica guarda con exito.';
    //     this.datosOptometria.reset();
    //     this.loading = false;
    //     document.getElementById('pub-exitosa').click();
    //   }

    // }, (err) => {
    //   console.log(err);
    //   this.status = 'error';
    //   this.statusText = 'Error al guardar la historia clinica, por favor revisa tu conexión o intentalo más tarde.';
    //   this.loading = false;
    // });

  }

  puExitosa() {
    document.getElementById('btn-cerrar-pub-exitosa').click();
    this.router.navigate(['/historia-clinica', this.idUsuario, this.idServicio, this.categoria]);
  }

  // Metodo para cambiar de pagina
  cambiar(tipo) {

   let bol = true;

   switch (bol === true) {

      case (tipo === 'anamnesis') :
        this.tipo = 'optometria';
        break;

      case (tipo === 'optometria'):
        this.tipo = 'optometria2';
        break;

    }

  }

  atras(tipo) {
    let bol = true;

    switch (bol === true) {
      case tipo === 'optometria' :
      this.tipo = 'anamnesis';
      break;

      case tipo === 'optometria2' :
      this.tipo = 'optometria';
      break;
    }
  }

  pdfMedicamentos() {
    var doc = new jsPDF();
    let imagen = this.imagenesService.getImagenMedicamentosRemision();

    let content = this.content.nativeElement;
    let specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    doc.addImage(imagen, 'JPEG', 0, 0, 210, 250);

    doc.setFont('courier');
    doc.setFontStyle('normal');
    doc.setFontSize(12);
    doc.text(132, 55, this.today);
    doc.text(42, 70, this.nombres);
    doc.fromHTML(content.innerHTML, 45, 85, {
      'width': 140,
      'elementHandlers': specialElementHandlers
    });


    doc.save('medicamentos_' + this.nombres + '.pdf');
  }

  pdfRemision() {

    var doc = new jsPDF();
    let imagen = this.imagenesService.getImagenMedicamentosRemision();
    let content = this.contentRemision.nativeElement;
    let specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    doc.addImage(imagen, 'JPEG', 0, 0, 210, 250);

    doc.setFont('courier');
    doc.setFontStyle('normal');
    doc.setFontSize(12);
    doc.text(132, 55, this.today);
    doc.text(42, 70, this.nombres);
    doc.fromHTML(content.innerHTML, 45, 85, {
      'width': 140,
      'elementHandlers': specialElementHandlers
    });


    doc.save('remision_' + this.nombres + '.pdf');

  }

  pdfCertificado() {
    // console.log('aqui');
    var doc = new jsPDF();
    let imagen = this.imagenesService.getImagenCertificado();
    let content = this.contentDiagnostico.nativeElement;
    let specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    let content2 = this.contentObservaciones.nativeElement;
    let specialElementHandlers2 = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    doc.addImage(imagen, 'JPEG', 0, 0, 210, 250);

    doc.setFont('courier');
    doc.setFontStyle('normal');
    doc.setFontSize(12);
    doc.text(43, 40, this.today);
    doc.text(43, 48, this.nombres);
    doc.text(43, 56, this.cedula.toString());
    // doc.text(1, 1, identificacion);


    //  // this.datosOptometria.value.selectRefracion1 this.datosOptometria.value.selectRefracion2
    //  let refraccionOd = this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
    //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
    //   'X' + ' ' + this.datosOptometria.value.ejeRefracion;

    //  //  this.datosOptometria.value.selectRefracion1Oi this.datosOptometria.value.selectRefracion2Oi
    //  let refraccionOi = this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
    //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
    //   + ' ' + this.datosOptometria.value.ejeRefracionOi;

    //  //  this.datosOptometria.value.selecFormulaFinal1Od this.datosOptometria.value.selecFormulaFinal2Od
    //  let ffod = this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd +
    //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd + ' ' + 'X'
    //   + ' ' + this.datosOptometria.value.ejFormulaFinalOd;

    //  //  this.datosOptometria.value.selecFormulaFinal1Oi this.datosOptometria.value.selecFormulaFinal2Oi
    //  let ffoi = this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi +
    //  ' ' + '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi + ' ' +
    //  'X' + ' ' + this.datosOptometria.value.ejFormulaFinalOi;


    // esfera
    doc.text(53, 86, this.datosOptometria.value.selectOdFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOd); // OD
    doc.text(53, 95, this.datosOptometria.value.selectOiFormulaFinal + ' ' + this.datosOptometria.value.esferaFormulaFinalOi); // OI

    // cilindro
    doc.text(81, 86,  '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOd); // OD
    doc.text(81, 95, '-' + ' ' + this.datosOptometria.value.cilindrFormulaFinalOi); // OI

    // eje
    doc.text(109, 86, this.datosOptometria.value.ejFormulaFinalOd); // OD
    doc.text(109, 95, this.datosOptometria.value.ejFormulaFinalOi); // OI

    // Add
    doc.text(136, 86, this.datosOptometria.value.adicionOd); // OD
    doc.text(136, 95, this.datosOptometria.value.adicionOi); // OI

    // Dp
    doc.text(164, 86, this.datosOptometria.value.dnpOd); // OD
    doc.text(164, 95, this.datosOptometria.value.dnpOi); // OI

    // Oftalmologia
    doc.text(73, 120, this.datosOptometria.value.oftalmologiaOd); // OD
    doc.text(73, 125, this.datosOptometria.value.oftalmologiaOi); // OI

    // Examen motor
    doc.text(73, 130, this.datosOptometria.value.examenMotorOd); // OD
    doc.text(73, 135, this.datosOptometria.value.examenMotorOi); // OI


    // //Refraccion
    doc.text(73, 139, this.datosOptometria.value.selectOdRefraccion + ' ' + this.datosOptometria.value.esferaRefraccion +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracion + ' ' +
     'X' + ' ' + this.datosOptometria.value.ejeRefracion); // OD

    doc.text(73, 144, this.datosOptometria.value.selectOiRefraccion + ' ' + this.datosOptometria.value.esferaRefraccionoi +
    ' ' + '-' + ' ' + this.datosOptometria.value.cilindroRefracionOi + ' ' + 'X'
     + ' ' + this.datosOptometria.value.ejeRefracionOi); // OI

    // //Test ishihara
    doc.text(73, 148, this.datosOptometria.value.testIshihara);

    // //test de estereopsis
    doc.text(73, 153, this.datosOptometria.value.testEstereopsis);

    // //Diagnostico
    // doc.text(73, 180, '43/43/43');

    doc.fromHTML(content.innerHTML, 73, 149, {
      'width': 118,
      'elementHandlers': specialElementHandlers
    });

    doc.fromHTML(content2.innerHTML, 73, 176, {
      'width': 118,
      'elementHandlers': specialElementHandlers2
    });

    doc.save('certificado_' + this.nombres + '.pdf');

  }

  cerrarAlerta() {
    this.status = undefined;
  }

}
