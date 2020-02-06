import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  @Input() status: string;
  @Input() statusText: string;

  constructor() { }

  ngOnInit() {
      // console.log('aqui');
  }

  cerrarAlerta() {
    this.status = undefined;
    this.statusText = undefined;
  }


}
