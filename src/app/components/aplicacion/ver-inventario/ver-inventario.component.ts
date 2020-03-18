import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../../services/app.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: ['./ver-inventario.component.css']
})
export class VerInventarioComponent implements OnInit {
  public loading;
  public materialLentes;
  @ViewChild('alertas', {static: true}) alertas: AlertasComponent;
  public infoMaterial;
  public infoFormulas;

  constructor(private rutaActiva: ActivatedRoute,
              private appService: AppService,
              location: PlatformLocation) {
                  location.onPopState(() => {
                    document.getElementById('btn-cerrar-modal-ver-material').click();
                    document.getElementById('btn-cerrar-confirmar-eliminar').click();
              });
               }

  ngOnInit() {
     this.getProductosCategoria(this.rutaActiva.snapshot.params.idCategoria);
  }

  getProductosCategoria(idCategoria) {

    this.loading = true;

    this.appService.getMaterialesLentes(idCategoria).subscribe( (response) => {
      this.loading = false;
      this.materialLentes = response;
      // console.log(response);
    }, () => {
      // console.log('aqui');
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );

  }

  abrirModalMaterial(info) {
    this.loading = true;
    console.log(info);
    this.infoMaterial = info;

    this.appService.getInfoMaterialLentes(info.id_material).subscribe( (response) => {
        console.log('aqui formula');
        this.infoFormulas = response;
        console.log(this.infoFormulas);
        this.loading = false;
    }, () => {
      // console.log('aqui error');
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
    document.getElementById('btn-modal-ver-material').click();
  }

  confirmarEliminarMaterial(info) {
    this.infoMaterial = info;
    document.getElementById('btn-confirmar-eliminar').click();
  }

  eliminarMaterial() {
    // console.log('por aca eliminar');
    this.loading = true;
    console.log(this.infoMaterial.id_material);

    this.appService.dltMaterialLentes(this.infoMaterial.id_material).subscribe( (response) => {
      this.loading = false;
      console.log(response);
    }, () => {
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  abrirModalEditarMaterial(info) {
    
  }

}
