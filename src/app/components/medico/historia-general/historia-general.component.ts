import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historia-general',
  templateUrl: './historia-general.component.html',
  styleUrls: ['./historia-general.component.css']
})
export class HistoriaGeneralComponent implements OnInit {
  public user;
  public idCategoria;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getInfoUser();

    this.route.params.subscribe( (categoria) => {
      // console.log(categoria);
      this.idCategoria = categoria.idCategoria;
      // console.log(this.idCategoria);
    } );
  }

  getInfoUser() {
    let user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    // console.log(this.user);
  }

}
