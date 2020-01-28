import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-general',
  templateUrl: './modal-general.component.html',
  styleUrls: ['./modal-general.component.css']
})
export class ModalGeneralComponent implements OnInit {
  @Input() infoHistoriaGeneral;

  public antecedentesF = false;
  public habitos = false;
  public revision = false;
  public examen = false;

  constructor() { }

  ngOnInit() {
    if (JSON.stringify(this.infoHistoriaGeneral.antecedentef) === '{}') {
      this.antecedentesF = true;
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
