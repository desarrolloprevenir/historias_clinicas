import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-general',
  templateUrl: './modal-general.component.html',
  styleUrls: ['./modal-general.component.css']
})
export class ModalGeneralComponent implements OnInit {
  @Input() infoHistoriaGeneral;
  public antecedentesF;
  public habitos;
  public revision;
  public examen;

  constructor() { }

  ngOnInit(info?) {
    console.log(info);

    if (info) {

      this.antecedentesF = false;
      this.habitos = false;
      this.revision = false;
      this.examen = false;
      // this.inicializarInfo();
      this.infoHistoriaGeneral = info;

      if (JSON.stringify(this.infoHistoriaGeneral.antecedentef) === '{}') {
        this.antecedentesF = true;
        console.log('aquiiii');
      }

      if (JSON.stringify(this.infoHistoriaGeneral.habitosyfactores) === '{}') {
        this.habitos = true;
      }

      if (JSON.stringify(this.infoHistoriaGeneral.revisionps) === '{}') {
        this.revision = true;
      }

      if (JSON.stringify(this.infoHistoriaGeneral.examenf) === '{}') {
        this.examen = true;
      }

    }
  }


}
