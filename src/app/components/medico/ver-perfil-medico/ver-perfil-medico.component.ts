import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-ver-perfil-medico',
  templateUrl: './ver-perfil-medico.component.html',
  styleUrls: ['./ver-perfil-medico.component.css']
})
export class VerPerfilMedicoComponent implements OnInit {
  public infoMedico;
  public titulos: any;

  constructor(public medicoService: MedicoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.titulos = true;
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.getInfoMedico(id);
    });
  }
 
  getInfoMedico(id) {

    this.medicoService.getInfoMedico(id).subscribe( (response) => {
      this.infoMedico = response[0];
      // console.log(this.infoMedico);
      if (this.infoMedico.titulos.length <= 0) {
        // console.log('no hya titulos');
        this.titulos = false;
      }
    }, (err) => {
      // console.log(err);
    });
  }


}
