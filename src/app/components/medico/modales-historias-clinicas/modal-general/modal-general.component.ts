import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-general',
  templateUrl: './modal-general.component.html',
  styleUrls: ['./modal-general.component.css']
})
export class ModalGeneralComponent implements OnInit {
  @Input() infoHistoriaGeneral;

  constructor() { }

  ngOnInit() {
    console.log('aqio', this.infoHistoriaGeneral);
    if (this.infoHistoriaGeneral.antecedentef != null) {
        console.log('vacio');
    } else {
      console.log('con antecedentes');
    }
  }

}
