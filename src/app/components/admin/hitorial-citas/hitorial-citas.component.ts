import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvedorService } from '../../../services/provedor.service';
import { UserService } from '../../../services/user.service';
import { SucursalService } from '../../../services/sucursal.service';

@Component({
  selector: 'app-hitorial-citas',
  templateUrl: './hitorial-citas.component.html',
  styleUrls: ['./hitorial-citas.component.css']
})
export class HitorialCitasComponent implements OnInit {
  public status;
  public statusText;
  public loading = false;
  public sucursales;
  public servicios;
  public idSucursal;
  public medicos;
  public servicioSelect;
  public idConsultorio;
  @ViewChild('calendario') calendario;
  // public info = {idConsultorio: '', idServicio: '', categoria: '', idSucursal: ''};

  // @Input() idConsultorio;
  // @Input() idServicio;
  // @Input() categoria;
  // @Input() idSucursal;

  constructor(private provedorService: ProvedorService,
              private userService: UserService,
              private sucursalService: SucursalService) {
  }

  ngOnInit() {

   let identity = this.userService.getIdentity();
  //  console.log(identity);
   this.getSucursales(identity.id_provedor);

  }

  getSucursales(idProvedor) {
    this.loading = true;
    this.provedorService.getSucursales(idProvedor).subscribe( (response) => {
      // console.log('sucu', response);
      this.sucursales = response;
      this.loading = false;
    }, () => {
      this.status = 'error';
      this.statusText = 'Error en la conexion, revisa tu conexion o intentalo mas tarde.';
      this.loading = false;
    });
  }

  sucursalSelecionada(ev) {
    // console.log(ev);
    this.medicos = undefined;
    this.idSucursal = ev.value.id_sucursales;
    // this.idSucursal.emit(ev.value.id_sucursales);
    this.getServiciosSucursal(this.idSucursal);
  }

  getServiciosSucursal(id) {
    // console.log('susc');
    this.loading = true;
    this.sucursalService.getServiciosSucursal(id).subscribe( (response) => {
      // console.log(response);
      // console.log('susc2');
      this.servicios = response;
      this.loading = false;
      // if(this.servicios.length <= 0) {
      // }
    }, () => {
      // console.log(err);
      this.status = true;
      this.statusText = 'Error en la conexión, intentalo mas tarde o revisa tu conexión.';
      this.loading = false;
    });
  }

  serviciosSelecionado(ev) {
    // console.log(ev);
    this.servicioSelect = ev.value;
    this.getConsultoriosSucursalPorServicio(ev.value.id_servicios);
    document.getElementById('btnActualizarCalendario').click();
  }

  getConsultoriosSucursalPorServicio(idServicio) {

    // let identity = this.userService.getIdentity().id_sucursales;
    this.sucursalService.getConsultoriosSegunServicio(this.idSucursal, idServicio).subscribe( (response) => {
      // console.log('consuls', response);
      this.medicos = response;
    }, () => {
      // console.log(err);
    } );
  }

  consultorioSelect(ev) {
    // console.log(ev);
    this.idConsultorio = ev.value.id_consultorio;
    document.getElementById('btnActualizarCalendario').click();
  }


}
