import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-barra-lateral',
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.css']
})
export class BarraLateralComponent implements OnInit {
  @Input() img: string;
  @Input() nombres: string;
  @Input() tipoDocumento: string;
  @Input() cedula: Int32Array;
  @Input() fechaNacimiento: string;

  constructor() { }

  ngOnInit() {
  }

}
