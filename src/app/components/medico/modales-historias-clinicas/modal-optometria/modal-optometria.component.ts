import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-optometria',
  templateUrl: './modal-optometria.component.html',
  styleUrls: ['./modal-optometria.component.css']
})
export class ModalOptometriaComponent implements OnInit {
  @Input() infoHistoriaClinica;

  constructor() { }

  ngOnInit() {
  }

}
