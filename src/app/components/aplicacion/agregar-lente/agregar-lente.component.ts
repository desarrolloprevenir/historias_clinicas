import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ProvedorService } from '../../../services/provedor.service';
import { AlertasComponent } from '../alertas/alertas.component';
import { PlatformLocation } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';

@Component({
  selector: 'app-agregar-lente',
  templateUrl: './agregar-lente.component.html',
  styleUrls: ['./agregar-lente.component.css']
})
export class AgregarLenteComponent implements OnInit {
  @ViewChild('alertas', {static: true}) alertas: AlertasComponent;
  public lenterTerminados = [];
  public infoUser;
  public loading;
  public sucursales;
  public posicion;
  public lentesTer = [];
  public pLenteTerminado = false;
  public mostrar: string;
  public agregarTipo = [];
  public tipos = [];
  public lentesTal: any;
  public lentesTallados = [];
  public nombreMaterial = new FormControl ('', Validators.required);
  public descripcionMaterial = new FormControl ('', Validators.required);

  constructor(public userService: UserService,
              public provedorService: ProvedorService,
              location: PlatformLocation,
              public aplicationService: AppService,
              private rutaActiva: ActivatedRoute,
              private router: Router) {
                location.onPopState(() => {
                  document.getElementById('btn-cerrar-modal-valor-unitario').click();
                  document.getElementById('btn-cerrar-valor-unitariolt').click();
                  document.getElementById('btn-cerrar-pub-exitosa').click();
            });
               }

  ngOnInit() {

    this.infoUser = this.userService.getIdentity();
    this.getSucursales(this.infoUser.id_provedor);
    if (this.lenterTerminados.length <= 0) {
      this.lenterTerminados.push({lente : 'lente terminado'});
    }
  }

  abrirModalValorUnitario(posicion) {
    this.posicion = posicion;

    if (posicion <= this.lenterTerminados.length - 1) {
        if (this.lentesTer[posicion]) {
            this.mostrar = 'existe';
        } else {
          this.mostrar = 'no_existe';
        }

        console.log(this.mostrar);
    }
    document.getElementById('btn-modal-valor-unitario').click();
  }

  getSucursales(idProvedor) {
    this.loading = true;
    this.provedorService.getSucursales(idProvedor).subscribe( (response) => {
      // console.log(response);
      this.sucursales = response;
      // this.sucursalesChecked();
      this.loading = false;
    }, () => {
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
    });
  }

  agregarFormula(accion, posicion) {

    // console.log(this.lenterTerminados.length, posicion);
      let length = this.lenterTerminados.length - 1;

      if (accion === 'guardar') {
      let tipo = (<HTMLInputElement>document.getElementById('tipo' + length)).value;
      let esfera = (<HTMLInputElement>document.getElementById('esfera' + length)).value;
      let cilindro = (<HTMLInputElement>document.getElementById('cilindro' + length)).value;
      let adiccion = (<HTMLInputElement>document.getElementById('adiccion' + length)).value;
      let valores = [];

      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.sucursales.length; index++) {
        let valor;
        let setValor: any;
        valor = (<HTMLInputElement>document.getElementById(this.sucursales[index].id_sucursales)).value;
        valores.push({id_sucursal: this.sucursales[index].id_sucursales, valor, nombre : this.sucursales[index].nombre});
        setValor = document.getElementById(this.sucursales[index].id_sucursales);
        setValor.value = '';
      }

      this.lentesTer.push({tipo, esfera, cilindro, adiccion, valores});

      } else {
        this.lenterTerminados.push({lente : 'lente terminado'});
      }
    }

  agregarFormulaExiste() {
    // console.log('aqui');
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.lentesTer[this.posicion].valores.length; index++) {
        // console.log(this.lentesTer[this.posicion].valores[index].valor);
        let valor = (<HTMLInputElement>document.getElementById('existe' + this.lentesTer[this.posicion].valores[index].id_sucursal)).value;
        this.lentesTer[this.posicion].valores[index].valor = valor;
    }
  }

  inputsLenteTallado(ev) {
    // console.log(ev.target.id);
    if (ev.target.value) {
        document.getElementById(ev.target.id).className = 'form-control';
    }
  }

  validacionesLenteTallado(info) {

    // console.log(info);
    let nombre = (<HTMLInputElement>document.getElementById('nombreLenteLta')).value;
    let tipo = (<HTMLInputElement>document.getElementById('tipoLta')).value;
    // let valor_u = (<HTMLInputElement>document.getElementById('valorUnitarioLta')).value;
    console.log('lneght agregar tipo', this.agregarTipo);
    if (this.agregarTipo.length <= 0) {
      console.log(info);
      if (!nombre) {
        document.getElementById('nombreLenteLta').className = 'form-control is-invalid';
      }
      if (!tipo) {
        document.getElementById('tipoLta').className = 'form-control is-invalid';
      }
      // if (!valor_u) {
      //   document.getElementById('valorUnitarioLta').className = 'form-control is-invalid';
      //   // return false;
      // }

      if (nombre && tipo ) {
        document.getElementById('nombreLenteLta').className = 'form-control';
        document.getElementById('tipoLta').className = 'form-control';
        // document.getElementById('valorUnitarioLta').className = 'form-control';
        let valores = [];
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.sucursales.length; index++) {
            let valor;
            let setValor: any;
            valor = (<HTMLInputElement>document.getElementById('lt' + this.sucursales[index].id_sucursales)).value;
            valores.push({id_sucursal: this.sucursales[index].id_sucursales, valor, nombre : this.sucursales[index].nombre});
            setValor = document.getElementById('lt' + this.sucursales[index].id_sucursales);
            setValor.value = 0;
          }


        if (info === 'guardar') {
          this.tipos.push({nombre: tipo, valores });
          this.lentesTal = {nombre, tipos: this.tipos};
        }

        console.log(this.lentesTal);
        if ( info === 'agregarTipo') {
          if (this.tipos.length <= 0) {
            this.tipos.push({nombre: tipo, valores });
            this.lentesTal = {nombre, tipos: this.tipos};
          }
          this.agregarTipo.push({tipo : 'tipo lente tallado'});
        }

        if (info === 'agregarLente') {
          this.lentesTallados.push(this.lentesTal);
          this.agregarTipo = [];
          this.tipos = [];
          let nombre = (<HTMLInputElement>document.getElementById('nombreLenteLta'));
          let tipo  = (<HTMLInputElement>document.getElementById('tipoLta'));
          // let valor = (<HTMLInputElement>document.getElementById('valorUnitarioLta'));

          nombre.value = '';
          tipo.value = '';
          // valor.value = '';
          console.log(this.lentesTallados);
        }

        console.log(this.lentesTallados);
        // this.agregarTipo.push({tipo : 'tipo lente tallado'});

      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      // console.log(this.agregarTipo);
      console.log(info);
      console.log(this.lentesTal);
      if (info === 'agregarTipo') {
        this.agregarTipo.push({tipo : 'tipo lente tallado'});
      }

      if (info === 'agregarLente') {
      this.lentesTallados.push(this.lentesTal);
      this.agregarTipo = [];
      this.tipos = [];
      let nombre = (<HTMLInputElement>document.getElementById('nombreLenteLta'));
      let tipo  = (<HTMLInputElement>document.getElementById('tipoLta'));
      let valor = (<HTMLInputElement>document.getElementById('valorUnitarioLta'));
      nombre.value = '';
      tipo.value = '';
      valor.value = '';
      console.log(this.lentesTallados);
    }

      for (let i = 0; i < this.agregarTipo.length; i ++) {
        
      //   console.log('posicion', i , 'lenght', this.agregarTipo.length);
        let tipo =  (<HTMLInputElement>document.getElementById('tipoLta' + i)).value;
        let valor_u = (<HTMLInputElement>document.getElementById('valorUnitarioLta' + i)).value;
        // console.log(tipo, valor_u);

        if (!tipo) {
          document.getElementById('tipoLta' + i).className = 'form-control is-invalid';
        }

        if (!valor_u) {
          document.getElementById('valorUnitarioLta' + i).className = 'form-control is-invalid';
        }

        if (!tipo && !valor_u) {
            break;
        }
        // console.log(tipo, valor_u);
        if (tipo) {
          document.getElementById('tipoLta' + i).className = 'form-control';
          document.getElementById('valorUnitarioLta' + i).className = 'form-control';
          if ( (i + 1) === this.agregarTipo.length) {
            console.log('aqui');
            let valores = [];
        // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < this.sucursales.length; index++) {
            let valor;
            let setValor: any;
            valor = (<HTMLInputElement>document.getElementById('lt' + this.sucursales[index].id_sucursales)).value;
            valores.push({id_sucursal: this.sucursales[index].id_sucursales, valor, nombre : this.sucursales[index].nombre});
            setValor = document.getElementById('lt' + this.sucursales[index].id_sucursales);
            setValor.value = 0;
          }

            this.tipos.push({nombre: tipo, valores });
            // console.log(this.lentesTal);
            // this.agregarTipo.push({tipo : 'tipo lente tallado'});
          }
        }
        // console.log(tipo, valor_u);
      }
    }

  }

  eliminarLenteTallado(index) {
    this.lentesTallados.splice(index, 1);
  }

  abrirModalValorUnitarioLt() {
    document.getElementById('btn-valor-unitariolt').click();
  }

  guardarLente() {
      let info = { nombre: this.nombreMaterial.value, descripcion: this.descripcionMaterial.value,
      id_cateogoriai: this.rutaActiva.snapshot.params.idCategoria, lentes_ter: this.lentesTer, lentes_tall: this.lentesTallados };

      console.log(info);
      this.aplicationService.postGuardarLentes(info).subscribe( (response) => {

        if (response === true) {
          this.alertas.status = 'success';
          document.getElementById('btn-pub-exitosa').click();
          // this.alertas.statusText = 'Lente agregados con exito.';
        }
        console.log(response);
        this.loading = false;
      }, (err) => {
      console.log(err);
      this.loading = false;
      this.alertas.status = 'error';
      this.alertas.statusText = 'Error en la conexión, por favor revisa tu conexión o intentalo más tarde.';
      } );
  }

  pubExitosa() {
    this.router.navigate(['/precios-e-inventario']);
  }

}
